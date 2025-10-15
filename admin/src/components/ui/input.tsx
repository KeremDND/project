import * as React from "react";

export function Input({ value, onChange, placeholder, className, type }:{ value?:string; onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void; placeholder?:string; className?:string; type?:string }){
  return <input type={type??"text"} value={value??""} onChange={onChange} placeholder={placeholder} className={`border rounded px-3 py-2 w-full ${className??""}`} />;
}
