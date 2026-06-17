import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Headset, X, Send, User, Bot, Trash2, Database, Search, FileText } from 'lucide-react';

const INITIAL_MESSAGE = { sender: 'bot' as const, text: '¡Hola! Soy el asistente inteligente de SIGHOS. Puedo ayudarte con información sobre pacientes, citas, servicios, especialidades, personal médico y más.\n\n🔍 También puedo buscar personas por DNI en RENIEC.\n\n¿En qué puedo ayudarte?' };

// ── Simple Markdown-like renderer ────────────────────────────────
function renderFormattedText(text: string) {
  // Split by lines and process each
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listKey = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="list-disc list-inside my-1 space-y-0.5">
          {listItems.map((item, i) => (
            <li key={i}>{processInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // List items (- or * or •)
    const listMatch = line.match(/^[\s]*[-*•]\s+(.+)/);
    if (listMatch) {
      listItems.push(listMatch[1]);
      continue;
    }

    // Numbered list items
    const numListMatch = line.match(/^[\s]*\d+[.)]\s+(.+)/);
    if (numListMatch) {
      listItems.push(numListMatch[1]);
      continue;
    }

    flushList();

    // Headers
    if (line.startsWith('### ')) {
      elements.push(<h4 key={i} className="font-bold text-xs mt-2 mb-0.5 text-sky-700">{processInline(line.slice(4))}</h4>);
    } else if (line.startsWith('## ')) {
      elements.push(<h3 key={i} className="font-bold text-sm mt-2 mb-0.5 text-sky-700">{processInline(line.slice(3))}</h3>);
    } else if (line.startsWith('# ')) {
      elements.push(<h2 key={i} className="font-bold text-sm mt-2 mb-1 text-sky-700">{processInline(line.slice(2))}</h2>);
    } else if (line.trim() === '') {
      elements.push(<br key={i} />);
    } else {
      elements.push(<span key={i} className="block">{processInline(line)}</span>);
    }
  }

  flushList();
  return elements;
}

function processInline(text: string): React.ReactNode {
  // Process bold (**text** or __text__)
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*|__)(.*?)\1/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<strong key={match.index} className="font-semibold">{match[2]}</strong>);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

// ── Tool status label mapping ────────────────────────────────────
const TOOL_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  explore_tables: { label: 'Explorando esquema de BD', icon: <FileText size={12} /> },
  execute_query: { label: 'Consultando base de datos', icon: <Database size={12} /> },
  search_identity: { label: 'Buscando en RENIEC', icon: <Search size={12} /> },
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{sender: 'bot' | 'user', text: string, toolsUsed?: string[]}[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, activeTools]);

  // Trap wheel events inside the messages container so the page doesn't scroll
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const atTop = scrollTop <= 0 && e.deltaY < 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;

    // Only stop propagation when there's room to scroll, or clamp at edges
    if (!atTop && !atBottom) {
      e.stopPropagation();
    } else {
      // At the edge — prevent the page from scrolling too
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  const clearHistory = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message;
    
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setMessage('');
    setIsLoading(true);
    setActiveTools([]);

    try {
      // Build conversation history (exclude initial bot greeting)
      const history = messages
        .filter(msg => msg !== INITIAL_MESSAGE)
        .map(msg => ({
          sender: msg.sender,
          text: msg.text
        }));

      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor');
      }

      const data = await response.json();
      const botReply = data.reply || 'Lo siento, no pude procesar la respuesta.';
      const toolsUsed = data.toolsUsed || [];

      setMessages(prev => [...prev, { sender: 'bot', text: botReply, toolsUsed }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Lo siento, hubo un problema de conexión con el servidor. Por favor, intenta de nuevo.' }]);
    } finally {
      setIsLoading(false);
      setActiveTools([]);
    }
  };

  return (
    <>
      {/* Scrollbar styles for the chatbot */}
      <style>{`
        .chatbot-messages::-webkit-scrollbar {
          width: 6px;
        }
        .chatbot-messages::-webkit-scrollbar-track {
          background: transparent;
          margin: 4px 0;
        }
        .chatbot-messages::-webkit-scrollbar-thumb {
          background-color: rgba(56, 189, 248, 0.4);
          border-radius: 20px;
        }
        .chatbot-messages::-webkit-scrollbar-thumb:hover {
          background-color: rgba(56, 189, 248, 0.7);
        }
        .chatbot-messages {
          scrollbar-width: thin;
          scrollbar-color: rgba(56, 189, 248, 0.4) transparent;
        }
        @keyframes toolPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}
      </style>

      <div className="fixed top-24 right-6 z-[9999] flex flex-col items-end">
        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 group"
        >
          {isOpen ? (
            <X size={28} className="transition-transform group-hover:rotate-90" />
          ) : (
            <Headset size={28} className="transition-transform group-hover:-rotate-12" />
          )}
        </button>

        {/* Floating Chat Window */}
        {isOpen && (
          <div
            className="mt-4 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 origin-top-right"
            style={{ maxHeight: 'calc(100vh - 160px)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-4 text-white flex items-center justify-between shadow-md z-10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                  <Bot size={24} className="text-sky-50" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg leading-tight">Asistente IA</h3>
                  <p className="text-xs text-sky-100 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    MCP Agent · En línea
                  </p>
                </div>
              </div>
              
              <button 
                onClick={clearHistory}
                title="Limpiar historial"
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <Trash2 size={18} className="text-sky-100 hover:text-white" />
              </button>
            </div>

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              onWheel={handleWheel}
              className="chatbot-messages p-4 bg-slate-50 flex flex-col gap-4"
              style={{
                flex: '1 1 0%',
                minHeight: 0,
                height: '400px',
                overflowY: 'auto',
                overscrollBehaviorY: 'contain',
              }}
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0 mt-auto">
                      <Bot size={18} />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.sender === 'user' ? '' : ''}`}>
                    <div className={`p-3 rounded-2xl shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-sky-500 text-white rounded-br-none' 
                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      <div className="text-sm leading-relaxed">
                        {msg.sender === 'bot' ? renderFormattedText(msg.text) : msg.text}
                      </div>
                    </div>

                    {/* Tools used badge */}
                    {msg.sender === 'bot' && msg.toolsUsed && msg.toolsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 ml-1">
                        {[...new Set(msg.toolsUsed)].map((tool, i) => {
                          const toolInfo = TOOL_LABELS[tool];
                          return (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-sky-50 border border-sky-100 text-sky-600 rounded-full text-[10px] font-medium"
                            >
                              {toolInfo?.icon}
                              {toolInfo?.label || tool}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white flex-shrink-0 mt-auto">
                      <User size={18} />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0 mt-auto">
                    <Bot size={18} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm flex items-center gap-1">
                      <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    {/* Tool activity indicators */}
                    <div className="flex flex-wrap gap-1 ml-1" style={{ animation: 'toolPulse 2s ease-in-out infinite' }}>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-[10px] font-medium">
                        <Bot size={10} />
                        Procesando con IA...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm bg-gray-50 transition-all disabled:opacity-70"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
                className="w-10 h-10 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Send size={18} className={message.trim() ? "translate-x-0.5" : ""} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
