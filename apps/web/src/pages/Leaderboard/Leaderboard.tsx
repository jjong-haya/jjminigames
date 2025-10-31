import { useEffect, useState } from 'react';
import { fetchTop10, type LeaderboardRow } from '../../services/leaderboard.service';

export default function Leaderboard() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchTop10();
        if (alive) setRows(data);
      } catch (e) {
        if (alive) setErr((e as Error).message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <div style={{ padding: 16 }}>로딩 중…</div>;
  if (err) return <div style={{ padding: 16, color: 'crimson' }}>에러: {err}</div>;

  return (
    <section style={{ maxWidth: 640, margin: '24px auto', padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>통합 리더보드 (TOP 10)</h1>
      {rows.length === 0 ? (
        <div>아직 기록이 없습니다.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '1px solid #e5e7eb' }}>순위</th>
              <th style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '1px solid #e5e7eb' }}>닉네임</th>
              <th style={{ textAlign: 'right', padding: '8px 6px', borderBottom: '1px solid #e5e7eb' }}>기록(ms)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
             <tr key={`${r.id}-${i}`}>
                <td style={{ padding: '8px 6px' }}>{i + 1}</td>
                <td style={{ padding: '8px 6px' }}>{r.username || '(무명)'}</td>
                <td style={{ padding: '8px 6px', textAlign: 'right' }}>{r.ms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
