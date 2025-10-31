import {auth} from '../lib/firebase';
import {createRecord} from '../services/reaction.service';

/**
 * 게임 로직에서 ms 측정 후 바로 호출하기 위한 간단 훅
 * 사용법:
 *   const save = useSaveReaction();
 *   await save(ms);
 */
export function useSaveReaction() {
  return async(ms: number): Promise<string> => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('로그인이 필요합니다.');
    return createRecord(uid, ms);
  };
}
