import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
// ⬇️ 여기만 교체
import { saveRecordAndBest } from '../../services/reaction.service';

export default function SaveTest() {
  const [uid, setUid] = useState<string | null>(auth.currentUser?.uid ?? null);
  const [lastId, setLastId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useState(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null));
    return () => unsub();
  });

  const handleSave = async () => {
    if (!uid) {
      setErr('로그인이 필요합니다.');
      return;
    }
    setErr(null);
    setSaving(true);
    try {
      const ms = Math.floor(100 + Math.random() * 500);
      // ⬇️ 여기 교체
      const id = await saveRecordAndBest(uid, ms);
      setLastId(id);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section style={{ maxWidth: 640, margin: '24px auto', padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>저장 테스트</h1>
      <p style={{ marginBottom: 12 }}>
        현재 상태: {uid ? '✅ 로그인됨' : '❌ 미로그인'}
      </p>
      <button
        onClick={handleSave}
        disabled={saving || !uid}
        style={{
          padding: '10px 14px',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          cursor: saving || !uid ? 'not-allowed' : 'pointer'
        }}
      >
        {saving ? '저장 중…' : '랜덤 기록 1건 저장'}
      </button>

      {lastId && (
        <p style={{ marginTop: 12 }}>✅ 저장 완료. 문서 ID: <code>{lastId}</code></p>
      )}
      {err && (
        <p style={{ marginTop: 12, color: 'crimson' }}>에러: {err}</p>
      )}
    </section>
  );
}
