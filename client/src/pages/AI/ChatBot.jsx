import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import api from '../../api/axiosInstance';
import useAuthStore from '../../store/authStore';

function Message({ msg }) {
  const isBot = msg.role === 'assistant';
  return (
    <div className={`flex gap-2.5 ${isBot ? '' : 'flex-row-reverse'} animate-fade-in`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
        isBot
          ? 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-100 rounded-tl-sm border border-slate-200/80 dark:border-white/10'
          : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-tr-sm shadow-sm'}`}>
        {msg.content}
      </div>
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm AlumiBot 🤖\n\nI can help you with career advice, finding mentors, and navigating AlumiNet. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: userMsg.content, history: messages.slice(-6) });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again!" }]);
    } finally { setLoading(false); }
  };

  const quickPrompts = ['How to find a mentor?', 'Interview preparation tips', 'How to improve my resume?', 'Career switch advice'];
  if (!user) return null;

  return (
    <>
      {!open && (
        <button type="button" onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-full shadow-lg shadow-violet-500/30 flex items-center justify-center z-50 transition-all hover:scale-105 group">
          <Bot className="w-7 h-7 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        </button>
      )}

      {open && (
        <div className={`fixed bottom-6 right-6 z-50 w-[min(340px,calc(100vw-2rem))] card-glass border border-slate-200 dark:border-white/15 flex flex-col transition-all duration-200 shadow-float ${minimized ? 'h-14' : 'h-[min(500px,calc(100vh-6rem))]'}`}>

          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/10 flex-shrink-0 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  AlumiBot <Sparkles className="w-3 h-3 text-violet-500 dark:text-violet-300" />
                </p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI Assistant</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setMinimized(v => !v)} className="btn-icon">
                {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="btn-icon">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {messages.map((m, i) => <Message key={i} msg={m} />)}
                {loading && (
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-slate-100 dark:bg-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center border border-slate-200/80 dark:border-white/10">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {messages.length === 1 && (
                <div className="px-3 pb-2 flex gap-1.5 flex-wrap border-t border-slate-200 dark:border-white/10 pt-2">
                  {quickPrompts.map(p => (
                    <button key={p} type="button" onClick={() => setInput(p)}
                      className="text-xs bg-slate-100 dark:bg-white/5 hover:bg-violet-50 dark:hover:bg-violet-500/20 text-slate-600 dark:text-slate-300 hover:text-violet-700 dark:hover:text-violet-200 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 transition-all font-semibold">
                      {p}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2 p-3 border-t border-slate-200 dark:border-white/10 flex-shrink-0">
                <input className="input flex-1 py-2.5"
                  placeholder="Ask AlumiBot anything..."
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} />
                <button type="button" onClick={send} disabled={!input.trim() || loading}
                  className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-40 rounded-xl flex items-center justify-center transition-all shadow-sm flex-shrink-0">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
