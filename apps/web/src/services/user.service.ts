import {collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, where, writeBatch} from 'firebase/firestore';

import {db} from '../lib/firebase';

export type UserProfile = {
  username?: string;  // 표시명 (없으면 '' 가능)
  email?: string | null;
  photoURL?: string | null;
};

/**
 * 프로필 upsert
 * - 문서 ID = uid
 * - 기존 문서는 유지하면서 변경 필드만 갱신(merge)
 * - createdAt은 최초 생성시에만 세팅, updatedAt은 매번 갱신
 */
export async function upsertUser(uid: string, profile: UserProfile) {
  if (!uid) throw new Error('uid is required');

  const ref = doc(db, 'profiles', uid);
  const snap = await getDoc(ref);
  const base = snap.exists() ? {}  // 이미 존재하면 createdAt 덮지 않음
                               :
                               {createdAt: serverTimestamp()};

  await setDoc(
      ref, {
        ...base,
        username: (profile.username ?? '').trim(),
        email: profile.email ?? null,
        photoURL: profile.photoURL ?? null,
        updatedAt: serverTimestamp(),
      },
      {merge: true});
}

/** (옵션) 닉네임만 저장하는 헬퍼 */
export async function setMyUsername(uid: string, username: string) {
  const ref = doc(db, 'profiles', uid);
  await setDoc(
      ref, {username: (username ?? '').trim(), updatedAt: serverTimestamp()},
      {merge: true});
}

/**
 * 닉네임 변경을 기존 데이터에 반영
 * - user_bests/{uid}.username 업데이트
 * - public_results 에서 내 문서 최대 N개 username 일괄 업데이트
 */
export async function propagateUsername(
    uid: string, username: string, maxDocs = 50) {
  const name = (username ?? '').trim();

  // 1) user_bests/{uid}
  const bestRef = doc(db, 'user_bests', uid);

  // 2) public_results (내 문서 일부만)
  const prQ = query(
      collection(db, 'public_results'), where('userId', '==', uid),
      limit(maxDocs));
  const prSnap = await getDocs(prQ);

  const batch = writeBatch(db);

  // best username만 갱신 (다른 필드는 건드리지 않음)
  batch.set(bestRef, {username: name}, {merge: true});

  prSnap.docs.forEach((d) => {
    batch.update(d.ref, {username: name});
  });

  await batch.commit();
}