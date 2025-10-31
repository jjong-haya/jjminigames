import {initializeApp} from 'firebase-admin/app';
import {FieldValue, getFirestore, Timestamp} from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import {type FirestoreEvent, onDocumentCreated, type QueryDocumentSnapshot} from 'firebase-functions/v2/firestore';

initializeApp();

type ReactionResult = {
  userId: string; ms: number;
  createdAt?: Timestamp;
};

// reaction_results 에 새 기록이 생기면, user_bests/{userId} 를 갱신한다.
export const updateUserBestOnCreate = onDocumentCreated(
    'reaction_results/{docId}',
    async (
        event: FirestoreEvent<
            QueryDocumentSnapshot|undefined, {docId: string}>) => {
      const snap = event.data;
      if (!snap) return;  // 타입 시그니처상 undefined 가능 → 가드

      const data = snap.data() as ReactionResult;
      const {userId, ms} = data;
      if (!userId || typeof ms !== 'number') {
        logger.warn('Invalid payload on reaction_results create', {userId, ms});
        return;
      }

      const db = getFirestore();

      // 닉네임 가져오기 (없으면 빈 문자열)
      let username = '';
      try {
        const profileSnap = await db.collection('profiles').doc(userId).get();
        if (profileSnap.exists) {
          username = (profileSnap.get('username') as string) || '';
        }
      } catch (e) {
        logger.error(
            'Failed to read profile', {userId, error: (e as Error).message});
      }

      const bestRef = db.collection('user_bests').doc(userId);
      const bestSnap = await bestRef.get();

      if (!bestSnap.exists) {
        await bestRef.set({
          userId,
          best_ms: ms,
          username,
          updatedAt: FieldValue.serverTimestamp(),
        });
        logger.info('Created user_bests', {userId, best_ms: ms, username});
        return;
      }

      const currentBest = bestSnap.get('best_ms');
      if (typeof currentBest !== 'number' || ms < currentBest) {
        await bestRef.update({
          best_ms: ms,
          username,
          updatedAt: FieldValue.serverTimestamp(),
        });
        logger.info(
            'Updated user_bests(best_ms improved)',
            {userId, best_ms: ms, username});
      } else if (username && bestSnap.get('username') !== username) {
        await bestRef.update({
          username,
          updatedAt: FieldValue.serverTimestamp(),
        });
        logger.info('Synced username in user_bests', {userId, username});
      }
    });
