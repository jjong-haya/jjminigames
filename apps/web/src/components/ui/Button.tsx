import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean; // 필요시 <Link> 감쌀 때
};

export default function Button({ className = "", ...p }: Props) {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium";
  return <button className={`${base} ${className}`} {...p} />;
}
