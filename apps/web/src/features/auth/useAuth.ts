import type {User} from 'firebase/auth';
import {createContext, useContext} from 'react';

export type AuthValue = {
  user: User|null;
};

/** 앱 전역 인증 컨텍스트 (기본값은 null 사용자) */
export const AuthContext = createContext<AuthValue>({user: null});

/** 어디서든 현재 사용자 정보를 가져오는 훅 */
export function useAuth(): AuthValue {
  return useContext(AuthContext);
}
