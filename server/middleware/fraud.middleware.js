const FraudLog = require('../models/FraudLog');
const User = require('../models/User');

const fraudDetect = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const userId = req.user?._id;
    let score = 0;
    const reasons = [];

    // Check rapid requests from same IP in last 60 seconds
    const recentLogs = await FraudLog.countDocuments({
      ip,
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) }
    });
    if (recentLogs > 20) { score += 30; reasons.push('High request rate'); }

    // Check if user is flagged or has high cumulative score
    if (userId) {
      const user = await User.findById(userId).select('fraudScore isFlagged');
      if (user?.isFlagged)     { score += 50; reasons.push('Previously flagged account'); }
      if (user?.fraudScore > 80) { score += 20; reasons.push('High cumulative fraud score'); }
    }

    if (score > 70) {
      await FraudLog.create({ user: userId, ip, action: req.method + ' ' + req.path, reason: reasons.join(', '), score });
      if (userId) {
        await User.findByIdAndUpdate(userId, {
          $inc: { fraudScore: score },
          isFlagged: score > 80
        });
      }
      return res.status(429).json({ error: 'Suspicious activity detected. Contact admin.' });
    }

    next();
  } catch (err) {
    next(); // Don't block legitimate users on errors
  }
};

// Call this periodically or on admin resolve to decay fraud scores
const decayFraudScores = async () => {
  try {
    // Reduce fraud score by 10 points per day for all flagged users (capped at 0)
    const flaggedUsers = await User.find({ fraudScore: { $gt: 0 } }).select('_id fraudScore');
    await Promise.all(flaggedUsers.map(u => {
      const newScore = Math.max(0, u.fraudScore - 10);
      return User.findByIdAndUpdate(u._id, {
        fraudScore: newScore,
        isFlagged: newScore > 80
      });
    }));
    console.log(`🛡️ Fraud score decay: ${flaggedUsers.length} users updated`);
  } catch (err) {
    console.error('Fraud decay error:', err.message);
  }
};

module.exports = { fraudDetect, decayFraudScores };
