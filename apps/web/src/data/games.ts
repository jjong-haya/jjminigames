export type GameMeta = {
  id: string; title: string; desc: string; status: 'ready' | 'soon';
  href?: string;  // ready일 때 라우트
};

export const GAMES: GameMeta[] = [
  {
    id: 'dice',
    title: '🎲 Dice Rush',
    desc: '주사위 굴리고 점수 쌓기.',
    status: 'soon'
  },
  {
    id: 'flip',
    title: '🃏 Card Flip',
    desc: '기억력 테스트(예정).',
    status: 'soon'
  },
  {
    id: 'tap',
    title: '⚡ Tap Reflex',
    desc: '반응속도 측정(예정).',
    status: 'soon'
  },
];
