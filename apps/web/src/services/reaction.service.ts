import {collection, getDocs, limit, orderBy, query, where} from 'firebase/firestore';

import {db} from '../lib/firebase';

export type MyRecord = {
  id: string; ms: number; createdAt: Date | null;
};

/**
 * 내 최신 5개 기록 가져오기
 * @param userId 현재 로그인한 사용자 uid
 */
export async function fetchMyRecent5(userId: string): Promise<MyRecord[]> {
  const q = query(
      collection(db, 'reaction_results'), where('userId', '==', userId),
      orderBy('createdAt', 'desc'), limit(5));

  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      ms: data.ms ?? 0,
      createdAt: data.createdAt?.toDate?.() ?? null,
    };
  });
}

/**
 * 반응속도 기록 1건 저장
 * - createdAt은 클라이언트 시간(Date)로 저장 (Firestore에서 Timestamp로 변환됨)
 * - 반환값: 생성된 문서 ID
 */
export async function createRecord(
    userId: string, ms: number): Promise<string> {
  if (!userId) throw new Error('userId is required');
  if (typeof ms !== 'number' || Number.isNaN(ms))
    throw new Error('ms must be a number');

  // addDoc를 동적 import로 가져와 상단 import 수정 없이 사용
  const {addDoc} = await import('firebase/firestore');

  const ref = await addDoc(
      collection(db, 'reaction_results'), {userId, ms, createdAt: new Date()});
  return ref.id;
}

/**
 * 기록 저장 + user_bests 갱신(클라이언트 사이드)
 * - reaction_results에 새 문서를 추가한 뒤
 * - user_bests/{userId}를 "더 좋은 기록일 때만" 업데이트
 */
export async function saveRecordAndBest(
    userId: string, ms: number): Promise<string> {
  // 1) 기록 저장 (reaction_results)
  const id = await createRecord(userId, ms);

  // 2) username 읽기 (profiles/{uid}.username) — 없으면 빈 문자열
  let username = '';
  try {
    const {doc, getDoc} = await import('firebase/firestore');
    const profileRef = doc(db, 'profiles', userId);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      const val = profileSnap.get('username');
      if (typeof val === 'string') username = val.trim();
    }
  } catch (e) {
    console.warn('profiles/read failed:', (e as Error)?.message || e);
  }

  // 3) 공개 리더보드용 public_results 에도 1건 적재
  try {
    const {addDoc, collection, serverTimestamp} =
        await import('firebase/firestore');
    await addDoc(collection(db, 'public_results'), {
      userId,
      username: username || '',  // 없으면 빈 문자열
      ms,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    const msg = (e as Error)?.message || String(e);
    // 공개판 기록 실패해도 앱은 계속 진행 가능하게 — 필요시 throw로 바꿔도 됨
    console.warn('public_results/create failed:', msg);
  }

  // 4) user_bests upsert (작아질 때만)
  try {
    const {doc, getDoc, setDoc, serverTimestamp} =
        await import('firebase/firestore');
    const bestRef = doc(db, 'user_bests', userId);
    const bestSnap = await getDoc(bestRef);
    const shouldUpdate = !bestSnap.exists() ||
        typeof bestSnap.get('best_ms') !== 'number' ||
        ms < (bestSnap.get('best_ms') as number);

    if (shouldUpdate) {
      await setDoc(
          bestRef,
          {userId, best_ms: ms, username, updatedAt: serverTimestamp()},
          {merge: true});
    }
  } catch (e) {
    const msg = (e as Error)?.message || String(e);
    throw new Error(`user_bests/upsert failed: ${msg}`);
  }

  return id;
}
