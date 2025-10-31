import React, { useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { upsertUser } from "../../services/user.service";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState(auth.currentUser);
  const didUpsertRef = useRef<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      // 로그인 직후 1회만 프로필 업서트
      if (u && didUpsertRef.current !== u.uid) {
        didUpsertRef.current = u.uid;

        const fallbackName =
          (u.displayName?.trim() ||
            u.email?.split("@")[0] ||
            "") // 비어있으면 ''로 저장
            .toString();

        try {
          await upsertUser(u.uid, {
            username: fallbackName,     // 리더보드에서 사용
            email: u.email ?? null,
            photoURL: u.photoURL ?? null,
          });
        } catch (e) {
          // 조용히 무시(UX 깨지지 않게)
          console.warn("profile upsert failed:", (e as Error).message);
        }
      }
    });
    return () => unsub();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
