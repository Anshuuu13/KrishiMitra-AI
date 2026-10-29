import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ErrorMessage({ title = "Error", message, className = "" }) {
  if (!message) return null;
  return (
    <div className={`p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm ${className}`}>
      <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
      <div>
        {title && <h4 className="font-semibold text-rose-900 mb-0.5">{title}</h4>}
        <p className="text-rose-700 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
