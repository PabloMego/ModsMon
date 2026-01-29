
import React, { useState, useRef, useEffect } from 'react';
import { getSurvivalAdvice } from '../services/geminiService';

interface ChatOverlayProps {
  onClose: () => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: "La supervivencia no está garantizada. ¿Qué necesitas saber sobre el pack GitanoMongoloMon?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    const aiResponse = await getSurvivalAdvice(userText);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || "Error en la transmisión." }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white dark:bg-stone-gray/95 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[80vh] border border-white/10">
        
        <div className="px-8 py-6 bg-primary flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-icons-outlined text-black text-3xl">smart_toy</span>
            <h2 className="font-display font-black text-black uppercase text-xl tracking-tight">Guía Mon AI</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
            <span className="material-icons-outlined text-black">close</span>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-6 py-4 rounded-3xl text-lg leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-black text-white dark:bg-white dark:text-black rounded-tr-none' 
                : 'bg-black/5 dark:bg-white/5 text-black dark:text-white rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-black/5 dark:bg-white/5 px-6 py-4 rounded-3xl rounded-tl-none animate-pulse flex gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="w-2 h-2 bg-primary rounded-full delay-75"></div>
                <div className="w-2 h-2 bg-primary rounded-full delay-150"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/20">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregunta sobre mods, instalación o supervivencia..."
              className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 pr-16 focus:ring-2 focus:ring-primary text-black dark:text-white"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 p-3 bg-primary text-black rounded-xl hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-icons-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatOverlay;
