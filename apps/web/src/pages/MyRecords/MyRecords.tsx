import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { fetchMyRecent5, type MyRecord } from '../../services/reaction.service';

export default function MyRecords() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [rows, setRows] = useState<MyRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unSub();
  }, []);

  useEffect(() => {
    let alive = true;

    async function load(uid: string) {
      setLoading(true);
      setErr(null);
      try {
        const data = await fetchMyRecent5(uid);
        if (alive) setRows(data);
      } catch (e) {
        if (alive) setErr((e as Error).message);
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (user?.uid) {
      load(user.uid);
    } else {
      // 로그인 안 된 상태
      setRows([]);
      setLoading(false);
    }

    return () => {
      alive = false;
    };
  }, [user?.uid]);

  if (!user) {
    return <section style={{ maxWidth: 640, margin: '24px auto', padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>내 최근 기록</h1>
      <div>로그인이 필요합니다.</div>
    </section>;
  }

  if (loading) return <div style={{ padding: 16 }}>로딩 중…</div>;
  if (err) return <div style={{ padding: 16, color: 'crimson' }}>에러: {err}</div>;

  return (
    <section style={{ maxWidth: 640, margin: '24px auto', padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>내 최근 기록 (5개)</h1>
      {rows.length === 0 ? (
        <div>아직 기록이 없습니다.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '1px solid #e5e7eb' }}>#</th>
              <th style={{ textAlign: 'right', padding: '8px 6px', borderBottom: '1px solid #e5e7eb' }}>기록(ms)</th>
              <th style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '1px solid #e5e7eb' }}>날짜</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td style={{ padding: '8px 6px' }}>{i + 1}</td>
                <td style={{ padding: '8px 6px', textAlign: 'right' }}>{r.ms} ms</td>
                <td style={{ padding: '8px 6px' }}>
                  {r.createdAt ? r.createdAt.toLocaleString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
