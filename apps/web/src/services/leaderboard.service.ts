import {collection, getDocs, limit, orderBy, query} from 'firebase/firestore';

import {db} from '../lib/firebase';

export type LeaderboardRow = {
  id: string;  // 문서 ID (public_results)
  userId: string;
  username: string;
  ms: number;
  createdAt?: Date | null;
};

/** 올타임 TOP 10 (동일 유저 여러 기록 포함) */
export async function fetchTop10(): Promise<LeaderboardRow[]> {
  const q =
      query(collection(db, 'public_results'), orderBy('ms', 'asc'), limit(10));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      userId: data.userId ?? '',
      username: data.username ?? '',
      ms: data.ms ?? 0,
      createdAt: data.createdAt?.toDate?.() ?? null,
    };
  });
}
