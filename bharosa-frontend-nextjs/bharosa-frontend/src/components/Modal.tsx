"use client";
import { ReactNode } from "react";

export default function Modal({ open, onClose, children }:{ open:boolean; onClose:()=>void; children:ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-[95%] max-w-md">
        {children}
      </div>
    </div>
  );
}
