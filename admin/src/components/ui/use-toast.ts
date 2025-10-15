import { useCallback } from "react";

export function useToast(){
  return {
    toast: useCallback((opts: { title: string; description?: string; variant?: "default"|"destructive" }) => {
      const msg = `${opts.variant==="destructive"?"Error: ":""}${opts.title}${opts.description?" - "+opts.description:""}`;
      // Basic fallback: log to console; replace with shadcn toaster if desired
      if (opts.variant === "destructive") console.error(msg);
      else console.log(msg);
      if (typeof window !== 'undefined') {
        // naive toast fallback
        window.alert(msg);
      }
    }, [])
  };
}
