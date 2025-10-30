import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { User } from "firebase/auth";

export async function upsertUser(u: User) {
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  const base = {
    uid: u.uid,
    displayName: u.displayName || null,
    email: u.email || null,
    photoURL: u.photoURL || null,
    updatedAt: serverTimestamp(),
  };
  if (!snap.exists()) {
    await setDoc(ref, { ...base, createdAt: serverTimestamp() });
  } else {
    await setDoc(ref, base, { merge: true });
  }
}
