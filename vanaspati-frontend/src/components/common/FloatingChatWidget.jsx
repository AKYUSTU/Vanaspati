import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { sendChatMessage } from '../../api/chat';
import styles from './FloatingChatWidget.module.css';

const suggestions = [
  'Best remedies for digestion',
  'Plants for stress and sleep',
  'Show ailments for cough',
];

export default function FloatingChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('vanaspati_chat_history') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem('vanaspati_chat_history', JSON.stringify(messages));
  }, [messages]);

  const canSend = input.trim().length > 0;

  const quickSuggestions = useMemo(() => suggestions, []);

  const handleSend = async (text) => {
    const message = text || input;
    if (!message.trim()) return;
    const next = [...messages, { role: 'user', content: message }];
    setMessages(next);
    setInput('');
    try {
      const response = await sendChatMessage(message, next);
      setMessages([...next, { role: 'assistant', content: response.reply || 'I can help with AYUSH plant guidance.' }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Chat service unavailable right now.' }]);
    }
  };

  return (
    <>
      <button className={styles.fab} aria-label="Open AI chat" onClick={() => setOpen((v) => !v)}>
        <MessageCircle />
      </button>
      <AnimatePresence>
        {open && (
          <motion.aside
            className={styles.panel}
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <header className={styles.header}>
              <div>
                <h3>Vanaspati Guide</h3>
                <p>Ask about AYUSH plants</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button>
            </header>
            <div className={styles.messages} aria-live="polite">
              {messages.map((msg, index) => (
                <div key={`${msg.role}-${index}`} className={`${styles.msg} ${styles[msg.role]}`}>
                  {msg.content}
                </div>
              ))}
            </div>
            <div className={styles.suggestions}>
              {quickSuggestions.map((item) => (
                <button key={item} type="button" onClick={() => handleSend(item)}>{item}</button>
              ))}
            </div>
            <div className={styles.inputRow}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canSend) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask Vanaspati..."
              />
              <button type="button" onClick={() => handleSend()} disabled={!canSend}><Send size={16} /></button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
