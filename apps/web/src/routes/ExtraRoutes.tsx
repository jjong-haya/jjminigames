import { Routes, Route } from 'react-router-dom';
import Leaderboard from '../pages/Leaderboard/Leaderboard';
import MyRecords from '../pages/MyRecords/MyRecords';
import SaveTest from '../pages/Dev/SaveTest';
import ReactionGame from '../pages/Games/ReactionGame';

/**
 * 추가 라우트 묶음:
 * - /leaderboard      : 통합 리더보드 TOP10
 * - /me/records       : 내 최근 기록 5개
 * - /dev/save-test    : 저장 파이프라인 점검용 (개발용)
 * - /game/reaction    : 반응속도 게임
 */
export default function ExtraRoutes() {
  return (
    <Routes>
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/me/records" element={<MyRecords />} />
      <Route path="/dev/save-test" element={<SaveTest />} />
      <Route path="/game/reaction" element={<ReactionGame />} />
    </Routes>
  );
}
