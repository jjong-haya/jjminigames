import { useEffect, useRef, useState } from 'react';
import { auth } from '../../lib/firebase';
import { saveRecordAndBest } from '../../services/reaction.service';
import { useToast } from '../../features/toast/ToastProvider';

type Phase = 'idle' | 'ready' | 'go' | 'clicked' | 'too-early';

export default function ReactionGame() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [ms, setMs] = useState<number | null>(null);

  const startRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const { toast, snackbar } = useToast();

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const start = () => {
    setPhase('ready');
    setMs(null);
    startRef.current = null;

    // 1.5~3.5초 랜덤 후 'go'
    const delay = 1500 + Math.random() * 2000;
    timerRef.current = window.setTimeout(() => {
      setPhase('go');
      startRef.current = performance.now();
    }, delay);
  };

  const handlePanel = async () => {
    if (phase === 'idle') {
      start();
      return;
    }
    if (phase === 'ready') {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      setPhase('too-early');
      toast('너무 빨랐어요! 다시 시도하세요.', { variant: 'warning', duration: 2000 });
      return;
    }
    if (phase === 'go' && startRef.current != null) {
      const end = performance.now();
      const diff = Math.round(end - startRef.current);
      setMs(diff);
      setPhase('clicked');

      // 저장 (reaction_results + user_bests + public_results)
      const uid = auth.currentUser?.uid;
      try {
        if (!uid) throw new Error('로그인이 필요합니다.');
        await saveRecordAndBest(uid, diff);
        toast(`저장 완료! 기록 ${diff} ms`, { variant: 'success' });
      } catch (e) {
        const msg = (e as Error).message || '저장 실패';
        snackbar(`저장 실패: ${msg}`, {
          variant: 'error',
          actionLabel: '다시 시도',
          onAction: async () => {
            try {
              if (!uid) throw new Error('로그인이 필요합니다.');
              await saveRecordAndBest(uid, diff);
              toast(`다시 저장 완료! ${diff} ms`, { variant: 'success' });
            } catch (e2) {
              toast(`재시도 실패: ${(e2 as Error).message}`, { variant: 'error' });
            }
          },
        });
      }
      return;
    }
    if (phase === 'clicked' || phase === 'too-early') {
      setPhase('idle');
      setMs(null);
      return;
    }
  };

  const color = phase === 'go' ? '#22c55e'
              : phase === 'ready' ? '#fbbf24'
              : phase === 'too-early' ? '#ef4444'
              : '#e5e7eb';

  const hint =
    phase === 'idle' ? '클릭하여 시작'
    : phase === 'ready' ? '기다리세요… (초록색 되면 클릭)'
    : phase === 'go' ? '지금 클릭!'
    : (phase === 'clicked' ? `기록: ${ms} ms — 클릭해서 다시 시작`
    : '너무 빨랐어요! 클릭해서 다시 시작');

  return (
    <section style={{ maxWidth: 720, margin: '24px auto', padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>반응속도 게임</h1>

      <div
        onClick={handlePanel}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.code === 'Space' || e.code === 'Enter') handlePanel(); }}
        style={{
          height: 260,
          borderRadius: 12,
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          fontSize: 20,
          fontWeight: 600,
          boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.04)'
        }}
      >
        {hint}
      </div>
    </section>
  );
}
