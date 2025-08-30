import React, { useMemo, useState } from 'react';
import { OptimizedCarpetPicture } from './OptimizedCarpetPicture';

// Import the manifest data
import manifestData from '../../data/carpets.json';

export default function ColorFilterGrid(){
  const items: any[] = manifestData as any[];
  const colors = useMemo(()=>Array.from(new Set(items.map(i=>i.color))).sort(),[]);
  const [active, setActive] = useState<string | null>(null);
  const list = active ? items.filter(i=>i.color===active) : items;
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button 
          onClick={()=>setActive(null)} 
          className={`chip ${!active?'chip--active':''}`}
        >
          All
        </button>
        {colors.map(c => (
          <button 
            key={c} 
            onClick={()=>setActive(c)} 
            className={`chip ${active===c?'chip--active':''}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map(item => (
          <article key={item.id} className="group">
            <OptimizedCarpetPicture item={item} />
            <div className="mt-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-xs text-neutral-500 capitalize">{item.color}</p>
              </div>
              <div className="flex gap-2">
                <a className="btn btn--sm" href={`/3d/${item.slug}`}>View in 3D</a>
                <a className="btn btn--sm btn--ghost" href={`/product/${item.slug}`}>Details</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

