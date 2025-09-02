import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Search, Send, Bot, Mic, Globe, Eye, Box } from 'lucide-react';

type Item = {
  id: string;
  name: string;
  color: string;
  slug?: string;
  sizeCm?: { widthCm?: number; heightCm?: number };
  src?: string;
};

const COLOR_MAP: Record<string, "grey"|"dark grey"|"cream"|"red"|"green"> = {
  // TK
  "çal":"grey","garaçal":"dark grey","krem":"cream","gyzyl":"red","ýaşyl":"green",
  // RU
  "серый":"grey","тёмно-серый":"dark grey","кремовый":"cream","красный":"red","зелёный":"green",
  // EN
  "grey":"grey","dark grey":"dark grey","cream":"cream","red":"red","green":"green",
  // DE
  "grau":"grey","dunkelgrau":"dark grey","creme":"cream","rot":"red","grün":"green"
};

function normalizeColor(text: string){
  const t = text.toLowerCase();
  // try multi-word first
  if (t.includes("dark grey") || t.includes("тёмно") || t.includes("garaçal") || t.includes("dunkelgrau")) return "dark grey";
  // scan tokens
  const tokens = t.split(/[^a-zA-Z\u0400-\u04FF\u00C0-\u024FäöüÄÖÜßýňçşöğ]+/).filter(Boolean);
  for (const w of tokens){
    const m = COLOR_MAP[w];
    if (m) return m;
  }
  return null;
}

function parseSize(text: string){
  const m = text.match(/(\d{2,4})\s*[x×]\s*(\d{2,4})/i);
  if (!m) return null;
  const w = parseInt(m[1], 10), h = parseInt(m[2], 10);
  if (!Number.isFinite(w) || !Number.isFinite(h)) return null;
  return { widthCm: w, heightCm: h };
}

function score(item: Item, color: string|null, size: {widthCm:number;heightCm:number}|null){
  let s = 0;
  if (color && item.color.toLowerCase() === color) s += 5;
  if (size) {
    const iw = item.sizeCm?.widthCm, ih = item.sizeCm?.heightCm;
    if (iw && ih){
      const ds = Math.abs(iw*ih - size.widthCm*size.heightCm);
      s += Math.max(0, 4 - Math.min(4, ds/20000)); // rough closeness
    } else {
      s += 1; // unknown item size, small credit
    }
  }
  return s;
}

async function search(query: string){
  try {
    const response = await fetch('/data/carpets.json');
    const manifest = await response.json();
    const items = manifest as Item[];
    
    const color = normalizeColor(query);
    const size  = parseSize(query);
    
    const scored = items
      .map(it => ({ it, s: score(it, color, size) }))
      .sort((a,b)=> b.s - a.s);
    const top = scored.filter(x => x.s > 0).slice(0, 12).map(x => x.it);
    if (top.length >= 1) return { results: top, color, size };
    // fallback: 3 from same color family if detected, else any 3
    const pool = color ? items.filter(i => i.color.toLowerCase() === color) : items;
    const fallback = pool.slice(0,3);
    return { results: fallback, color, size, fallback: true };
  } catch (error) {
    console.error('Error loading carpet data:', error);
    return { results: [], color: null, size: null, fallback: true };
  }
}

export default function AbadanAI(){
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const { results, color, size } = await search(query);
      setSearchResults(results.slice(0, 3)); // Show top 3 results
      
      const payload = {
        query: query, 
        color, 
        size,
        ids: results.map(r=>r.id)
      };
      
      // share results with Gallery
      sessionStorage.setItem("abadan_ai_results", JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent("abadan-ai", { detail: payload }));
      
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleExampleClick = async (example: string) => {
    setQuery(example);
    inputRef.current?.focus();
    
    // Auto-search after a short delay
    setTimeout(() => {
      const formEvent = new Event('submit', { bubbles: true, cancelable: true });
      const form = document.querySelector('.ai-search-form') as HTMLFormElement;
      if (form) {
        form.dispatchEvent(formEvent);
      }
    }, 500);
  };

  return (
    <section className="ai-gallery-section">
      <div className="ai-gallery-container">
        
        {/* Main Content */}
        <div className="ai-gallery-content">
          
          {/* Hero Text */}
          <div className="ai-gallery-text">
            <h1 className="ai-gallery-title">
              <span className="ai-gradient-text">Abadan AI</span>
            </h1>
            <p className="ai-subtitle">
              Smarter, Faster, Simpler way to find your best fit Carpet
            </p>
          </div>

          {/* Search Bar */}
          <div className="ai-search-container">
            <form onSubmit={handleSubmit} className="ai-search-form">
              <div className={`ai-search-bar ${isFocused ? 'ai-search-focused' : ''}`}>
                
                {/* Center Input */}
                <div className="ai-search-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Abadan AI anything..."
                    className="ai-search-input"
                    aria-label="Abadan AI search"
                    disabled={isSearching}
                  />
                </div>

                {/* Right Side Submit */}
                <div className="ai-search-right">
                  <button
                    type="submit"
                    disabled={!query.trim() || isSearching}
                    className="ai-submit-btn"
                  >
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Search Results */}
          {hasSearched && searchResults.length > 0 && (
            <div className="ai-results">
              <h3 className="ai-results-title">AI Found These Carpets:</h3>
              <div className="ai-results-grid">
                                 {searchResults.map((item, index) => (
                   <div key={item.id} className="ai-result-card group">
                     <div className="ai-result-image relative">
                       <img 
                         src={item.srcset?.jpg?.[0]?.src || `/cdn/Halylar/${item.color}/${item.name.replace(/\s+/g, '-').toLowerCase()}.jpg`} 
                         alt={item.name}
                         className="w-full h-32 object-cover rounded-lg"
                         onError={(e) => {
                           console.log('Image failed to load:', e.currentTarget.src);
                           e.currentTarget.src = '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2004- carpet.jpg';
                         }}
                       />
                       
                       {/* Action Buttons Overlay */}
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                         <button
                           onClick={() => {
                             // Find the product in the gallery and open lightbox
                             const event = new CustomEvent('open-gallery-lightbox', { 
                               detail: { productId: item.id, productName: item.name }
                             });
                             window.dispatchEvent(event);
                           }}
                           className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white transition-all duration-200 flex items-center gap-1"
                         >
                           <Eye className="w-3 h-3" />
                           View
                         </button>
                         <button
                           onClick={() => {
                             // Trigger 3D viewer
                             window.dispatchEvent(new CustomEvent('open-3d-viewer', { 
                               detail: { productId: item.id, productName: item.name }
                             }));
                           }}
                           className="bg-emerald-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-600 transition-all duration-200 flex items-center gap-1"
                         >
                           <Box className="w-3 h-3" />
                           3D
                         </button>
                       </div>
                     </div>
                     <div className="ai-result-info">
                       <h4 className="ai-result-name">{item.name}</h4>
                       <p className="ai-result-details">
                         {item.color} • {item.sizeCm?.widthCm}×{item.sizeCm?.heightCm}cm
                       </p>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {/* Quick Examples */}
          <div className="ai-examples">
            <div className="ai-examples-chips">
              {["200×300 cream living room", "krem 160×230", "дизайн красный 200×300", "grün 300×400"].map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="ai-example-chip"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
