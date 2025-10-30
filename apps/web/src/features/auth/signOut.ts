import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
export async function signOutFx() {
  await signOut(auth);
}
