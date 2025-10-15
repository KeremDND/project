import * as React from "react";

type TabsListProps = { children: React.ReactNode; value?: string; setValue?: (v: string) => void; className?: string };
type TabsTriggerProps = { value: string; children: React.ReactNode; current?: string; setValue?: (v: string) => void };
type TabsContentProps = { children: React.ReactNode; value?: string };

export function Tabs({ value, defaultValue, onValueChange, children, className }:{ value?:string; defaultValue?:string; onValueChange?:(v:string)=>void; children:React.ReactNode; className?:string }){
  const [v, setV] = React.useState(value ?? defaultValue ?? "");
  React.useEffect(()=>{ if(value!==undefined) setV(value); },[value]);
  return (
    <div className={className}>
      {React.Children.map(children, (child)=>{
        if(!React.isValidElement(child)) return child;
        const anyChild = child as React.ReactElement<any>;
        if(anyChild.type===TabsList) return React.cloneElement<any>(anyChild, { value:v, setValue:(nv:string)=>{ setV(nv); onValueChange?.(nv);} } as TabsListProps);
        if(anyChild.type===TabsContent) return v===anyChild.props.value ? anyChild : null;
        return child;
      })}
    </div>
  );
}
export function TabsList({ children, value, setValue, className }: TabsListProps){
  return <div className={`inline-flex gap-2 ${className??""}`}>{React.Children.map(children,(child)=>{
    if(!React.isValidElement(child)) return child;
    const anyChild = child as React.ReactElement<any>;
    return React.cloneElement<any>(anyChild,{ current:value, setValue } as TabsTriggerProps);
  })}</div>;
}
export function TabsTrigger({ value, children, current, setValue }: TabsTriggerProps){
  const active = current===value;
  return <button className={`px-3 py-1 rounded border ${active?"bg-black text-white":"bg-white"}`} onClick={()=>setValue?.(value)}>{children}</button>;
}
export function TabsContent({ children }: TabsContentProps){ return <div className="mt-4">{children}</div>; }
