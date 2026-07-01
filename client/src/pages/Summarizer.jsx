import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { PlaySquare, AlertCircle, Check, Copy, RefreshCw, Zap, ChevronDown, ChevronRight } from 'lucide-react';

export default function Summarizer() {
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const { token } = useContext(AuthContext);

  const parseResponse = (text) => {
    let tldr = '';
    let summary = '';
    let takeaways = [];

    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    let currentSection = 'summary'; 

    const hasTldr = lines.some(l => /tl;?dr/i.test(l));
    if (hasTldr) currentSection = 'tldr';

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      
      if (/^#*\s*\**tl;?dr\**\s*[:-]?/i.test(lowerLine)) {
        currentSection = 'tldr';
        const content = line.replace(/^#*\s*\**tl;?dr\**\s*[:-]?\s*/i, '').trim();
        if (content) tldr += content + ' ';
        return;
      }
      if (/^#*\s*\**summary\**\s*[:-]?/i.test(lowerLine)) {
        currentSection = 'summary';
        const content = line.replace(/^#*\s*\**summary\**\s*[:-]?\s*/i, '').trim();
        if (content) summary += content + ' ';
        return;
      }
      if (/^#*\s*\**key takeaways\**\s*[:-]?/i.test(lowerLine) || /^#*\s*\**takeaways\**\s*[:-]?/i.test(lowerLine)) {
        currentSection = 'takeaways';
        const content = line.replace(/^#*\s*\**key takeaways\**\s*[:-]?\s*/i, '').replace(/^#*\s*\**takeaways\**\s*[:-]?\s*/i, '').trim();
        if (content) takeaways.push(content);
        return;
      }

      if (currentSection === 'tldr') {
        tldr += line + ' ';
      } else if (currentSection === 'summary') {
        summary += line + ' ';
      } else if (currentSection === 'takeaways') {
        if (/^[-*\d.]+\s/.test(line)) {
          takeaways.push(line.replace(/^[-*\d.]+\s*/, '').replace(/\*/g, '').trim());
        } else {
          if (takeaways.length > 0) {
            takeaways[takeaways.length - 1] += ' ' + line.replace(/\*/g, '').trim();
          } else {
            takeaways.push(line.replace(/\*/g, '').trim());
          }
        }
      }
    });

    tldr = tldr.replace(/\*/g, '').trim();
    summary = summary.replace(/\*/g, '').trim();

    if (!tldr && takeaways.length === 0) {
      summary = text;
    }

    return { tldr, summary, takeaways, raw: text };
  };

  const handleSummarize = async (e) => {
    e?.preventDefault();
    if (!url.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/summarize`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          url: url.trim(),
          transcript: transcript.trim() || undefined
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to summarize video');
      }

      if (data.tldr || data.takeaways) {
        setResult({
          tldr: data.tldr || '',
          summary: data.summary || '',
          takeaways: Array.isArray(data.takeaways) ? data.takeaways : [],
          raw: data.raw || ''
        });
      } else {
        setResult(parseResponse(data.summary || ''));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setUrl('');
    setTranscript('');
    setShowManual(false);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
            <PlaySquare className="w-10 h-10 text-indigo-500" />
            <span>YT Summarizer</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Paste any YouTube video link and get an instant AI summary
          </p>
        </div>

        {/* Input Section */}
        <form onSubmit={handleSummarize} className="mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube URL here..."
                disabled={loading}
                className="w-full px-5 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-sm min-w-[160px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </>
              ) : (
                'Summarize'
              )}
            </button>
          </div>

          {/* Collapsible Transcript Section */}
          <div className="mt-4 text-left">
            <button
              type="button"
              onClick={() => setShowManual(!showManual)}
              className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              {showManual ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              Or paste transcript manually (optional)
            </button>
            
            {showManual && (
              <div className="mt-3 transition-all duration-300">
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste the video transcript here if auto-fetch fails or if the video is private..."
                  disabled={loading}
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow disabled:opacity-50 disabled:cursor-not-allowed text-base resize-y"
                />
              </div>
            )}
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="p-5 mb-8 bg-red-950/30 border border-red-900/30 rounded-xl flex items-start gap-4">
            <AlertCircle className="text-red-500 w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-500 font-semibold mb-1">Oops! Something went wrong.</h3>
              <p className="text-red-400/90 text-sm leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mb-6">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                {copied ? <><Check className="w-4 h-4 text-emerald-400" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Text</>}
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
              >
                <RefreshCw className="w-4 h-4" /> Clear
              </button>
            </div>

            <div className="space-y-10">
              {/* TLDR */}
              {result.tldr && (
                <div className="bg-gradient-to-r from-amber-500/5 to-transparent border-l-4 border-amber-500/70 rounded-r-xl p-6 shadow-sm">
                  <h3 className="text-amber-500/90 font-bold text-xs tracking-widest uppercase mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> TL;DR
                  </h3>
                  <p className="text-amber-50 text-xl leading-relaxed font-semibold italic">
                    "{result.tldr}"
                  </p>
                </div>
              )}

              {/* Summary */}
              {result.summary && (
                <div className="pt-6 border-t border-slate-800/80">
                  <h3 className="text-slate-400 font-bold text-sm tracking-wider uppercase mb-6 flex items-center gap-3">
                    <span className="w-10 h-[1px] bg-slate-700"></span>
                    Summary
                    <span className="flex-1 h-[1px] bg-slate-800"></span>
                  </h3>
                  <div className="text-slate-300 leading-8 text-[1.05rem] space-y-5">
                    {result.summary.split('\n').filter(p => p.trim() !== '').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Takeaways */}
              {result.takeaways?.length > 0 && (
                <div className="pt-6 border-t border-slate-800/80">
                  <h3 className="text-slate-400 font-bold text-sm tracking-wider uppercase mb-6 flex items-center gap-3">
                    <span className="w-10 h-[1px] bg-slate-700"></span>
                    Key Takeaways
                    <span className="flex-1 h-[1px] bg-slate-800"></span>
                  </h3>
                  <ul className="grid gap-4">
                    {result.takeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-4 p-5 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 font-bold shadow-sm">
                          {idx + 1}
                        </div>
                        <span className="leading-relaxed text-slate-200 pt-1 flex-1">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
