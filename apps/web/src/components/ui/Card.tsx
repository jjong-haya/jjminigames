import React from "react";

export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <article className={`rounded-2xl border bg-white p-5 shadow-sm ${className}`}>{children}</article>;
}
