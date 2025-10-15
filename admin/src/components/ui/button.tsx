import * as React from "react";

export function Button({ children, onClick, className, type }:{ children:React.ReactNode; onClick?:()=>void; className?:string; type?:"button"|"submit"|"reset" }){
  return <button type={type??"button"} onClick={onClick} className={`px-4 py-2 rounded bg-black text-white hover:opacity-90 ${className??""}`}>{children}</button>;
}
