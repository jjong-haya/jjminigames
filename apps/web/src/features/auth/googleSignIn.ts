import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";
// 최초 로그인 시 사용자 저장 등은 Login 페이지 onAuthStateChanged 이후 처리(또는 여기서 처리해도 됨)
export async function googleSignIn() {
  await signInWithPopup(auth, googleProvider);
}
