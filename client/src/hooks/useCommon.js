import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useFetch - Generic data fetching hook with loading/error states
 * @param {Function} fetchFn - async function that returns data
 * @param {Array} deps - dependency array (re-fetches when these change)
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/**
 * useDebounce - Debounces a value by the given delay
 * @param {any} value
 * @param {number} delay - ms
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/**
 * usePagination - Manages page state with convenient helpers
 * @param {number} initialPage
 * @param {number} totalPages
 */
export function usePagination(initialPage = 1, totalPages = 1) {
  const [page, setPage] = useState(initialPage);
  const goNext = () => setPage(p => Math.min(p + 1, totalPages));
  const goPrev = () => setPage(p => Math.max(p - 1, 1));
  const goTo   = (n) => setPage(Math.max(1, Math.min(n, totalPages)));
  const reset  = () => setPage(1);
  return { page, goNext, goPrev, goTo, reset, isFirst: page === 1, isLast: page === totalPages };
}

/**
 * useLocalStorage - Synced localStorage state
 * @param {string} key
 * @param {any} initialValue
 */
export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  const setValue = (value) => {
    try {
      const val = typeof value === 'function' ? value(stored) : value;
      setStored(val);
      localStorage.setItem(key, JSON.stringify(val));
    } catch (err) { console.error(err); }
  };

  return [stored, setValue];
}

/**
 * useClickOutside - Calls callback when clicking outside ref element
 * @param {Function} callback
 */
export function useClickOutside(callback) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) callback();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [callback]);
  return ref;
}

/**
 * useOnlineStatus - Tracks browser online/offline state
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on  = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return isOnline;
}
