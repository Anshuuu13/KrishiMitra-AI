import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ message = "Loading...", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center py-10 gap-3 text-slate-500 ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-krishi-600" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
