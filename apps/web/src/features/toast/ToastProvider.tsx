import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type ToastVariant = "info" | "success" | "warning" | "error";
type Toast = {
  id: string;
  message: string | React.ReactNode;
  variant?: ToastVariant;
  duration?: number;     // ms (기본 3000)
  actionLabel?: string;  // 스낵바 액션 버튼 라벨 (옵션)
  onAction?: () => void; // 액션 클릭 핸들러 (옵션)
};

type ToastContextValue = {
  /** 간단 토스트 */
  toast: (message: Toast["message"], opts?: Omit<Toast, "id" | "message">) => string;
  /** 스낵바(액션 버튼 포함 가능) */
  snackbar: (message: Toast["message"], opts?: Omit<Toast, "id" | "message">) => string;
  /** 수동 닫기 */
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/** 외부에서 쓰는 훅: const { toast, snackbar, dismiss } = useToast() */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("ToastProvider가 트리에 필요합니다.");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    const t = timers.current.get(id);
    if (t) {
      window.clearTimeout(t);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback((message: Toast["message"], opts?: Omit<Toast, "id" | "message">) => {
    const id = crypto.randomUUID();
    const toast: Toast = {
      id,
      message,
      variant: opts?.variant ?? "info",
      duration: opts?.duration ?? 3000,
      actionLabel: opts?.actionLabel,
      onAction: opts?.onAction,
    };
    setItems((prev) => [...prev, toast]);

    // 자동 닫기 타이머 (액션 존재해도 자동 닫기 적용)
    const timerId = window.setTimeout(() => dismiss(id), toast.duration);
    timers.current.set(id, timerId);

    return id;
  }, [dismiss]);

  const api = useMemo<ToastContextValue>(() => ({
    toast: (message, opts) => push(message, opts),
    snackbar: (message, opts) => push(message, opts),
    dismiss,
  }), [push, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Viewport */}
      <div className="fixed z-[1000] bottom-4 left-1/2 -translate-x-1/2 w-[min(640px,92vw)] space-y-2">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={[
              "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-md",
              "backdrop-blur bg-white/95",
              t.variant === "success" && "border-emerald-200",
              t.variant === "warning" && "border-amber-200",
              t.variant === "error"   && "border-rose-200",
              t.variant === "info"    && "border-gray-200",
            ].filter(Boolean).join(" ")}
          >
            <div className="text-sm text-gray-800">
              {t.message}
            </div>
            <div className="flex items-center gap-2">
              {t.actionLabel && (
                <button
                  onClick={() => { t.onAction?.(); dismiss(t.id); }}
                  className="text-sm px-2 py-1 rounded-lg border hover:bg-gray-50"
                >
                  {t.actionLabel}
                </button>
              )}
              <button
                aria-label="닫기"
                onClick={() => dismiss(t.id)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
