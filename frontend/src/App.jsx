import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, FileText, AlertCircle, CheckCircle2, Newspaper } from 'lucide-react';

const API_BASE = "http://localhost:8000";

export default function App() {
  // Chat State
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Accountant. Ask me about the **Income Tax Act 2025** or the latest tax news.' }
  ]);
  const [input, setInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  // Admin State
  const [pdfUrl, setPdfUrl] = useState("https://incometaxindia.gov.in/Documents/income-tax-act-1961-as-amended-by-finance-act-2025.pdf");
  const [ingestStatus, setIngestStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [newsStatus, setNewsStatus] = useState(null); // null, 'loading', 'success', 'error'
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userMessage.content }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error processing your request." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}. Is the backend running?` }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleIngestPdf = async () => {
    setIngestStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/ingest-pdf-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: pdfUrl }),
      });
      if (res.ok) setIngestStatus('success');
      else setIngestStatus('error');
    } catch (e) {
      setIngestStatus('error');
    }
    // Reset status after 3 seconds
    setTimeout(() => setIngestStatus(null), 3000);
  };

  const handleRefreshNews = async () => {
    setNewsStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/update-news`, { method: 'POST' });
      if (res.ok) setNewsStatus('success');
      else setNewsStatus('error');
    } catch (e) {
      setNewsStatus('error');
    }
    setTimeout(() => setNewsStatus(null), 3000);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Bot className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight">Accountant Bot</span>
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Admin Console</p>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto flex-1">
          
          {/* Legal Docs Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-700 mb-2">
              <FileText className="w-4 h-4" />
              <h3 className="font-semibold text-sm">Legal Knowledge Base</h3>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-medium">PDF Source URL</label>
              <input 
                type="text" 
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-slate-50 text-slate-600"
              />
              <button 
                onClick={handleIngestPdf}
                disabled={ingestStatus === 'loading'}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-xs font-medium transition-colors
                  ${ingestStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
                    ingestStatus === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
                    'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                {ingestStatus === 'loading' ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : ingestStatus === 'success' ? (
                  <> <CheckCircle2 className="w-3 h-3" /> Started </>
                ) : ingestStatus === 'error' ? (
                  <> <AlertCircle className="w-3 h-3" /> Failed </>
                ) : (
                  "Ingest PDF from Web"
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Triggers background downloading and vectorization of the legal document.
            </p>
          </div>

          <div className="h-px bg-slate-100" />

          {/* News Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-700 mb-2">
              <Newspaper className="w-4 h-4" />
              <h3 className="font-semibold text-sm">Live News Feed</h3>
            </div>
            <button 
              onClick={handleRefreshNews}
              disabled={newsStatus === 'loading'}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-xs font-medium transition-colors
                ${newsStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
                  newsStatus === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
                  'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'}`}
            >
               {newsStatus === 'loading' ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : newsStatus === 'success' ? (
                  <> <CheckCircle2 className="w-3 h-3" /> Updating </>
                ) : (
                  "Refresh Latest News"
                )}
            </button>
            <p className="text-[10px] text-slate-400 leading-tight">
              Scrapes top 10 Google News results for "Income Tax India 2025" and updates the vector store.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 text-center">
          <span className="text-[10px] text-slate-400">Powered by FastAPI & LangChain</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {/* Header */}
        <header className="bg-white h-16 border-b border-slate-200 flex items-center px-8 justify-between">
          <h1 className="font-semibold text-slate-800">Assistant Session</h1>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            System Online
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className={`flex flex-col max-w-2xl ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-6 py-4 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                    {/* Simple Markdown-like rendering for bold text */}
                    {msg.content.split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                </div>
              </div>
            </div>
          ))}
          
          {isChatLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white px-6 py-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-200">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Section 115BAC or recent tax changes..."
              className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isChatLoading}
              className="absolute right-3 top-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-3">
            AI can make mistakes. Please verify important tax information with official sources.
          </p>
        </div>
      </div>
    </div>
  );
}