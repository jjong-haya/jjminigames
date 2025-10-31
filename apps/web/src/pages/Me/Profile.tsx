import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../features/auth/useAuth";
import { setMyUsername, propagateUsername } from "../../services/user.service";
// ⬇️ 추가: Auth displayName도 동기화
import { updateProfile } from "firebase/auth";
import { useToast } from "../../features/toast/ToastProvider";

export default function Profile() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const { toast } = useToast();

  // 현재 닉네임 불러오기
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "profiles", user.uid));
        const name = (snap.exists() ? (snap.get("username") as string) : "") || "";
        if (alive) setUsername(name);
      } catch (e) {
        if (alive) setErr((e as Error).message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [user?.uid]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) {
      setErr("로그인이 필요합니다.");
      return;
    }
    const name = username.trim();
    if (name.length === 0) {
      setErr("닉네임을 입력하세요.");
      return;
    }
    if (name.length > 20) {
      setErr("닉네임은 20자 이내여야 합니다.");
      return;
    }

    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      // 1) Firebase Auth displayName 업데이트 (폴백 덮어쓰기 방지)
      await updateProfile(user, { displayName: name });

      // 2) Firestore profiles/{uid} 업데이트
      await setMyUsername(user.uid, name);

      // 3) 기존 기록 반영 (user_bests + public_results 일부)
      await propagateUsername(user.uid, name, 50);

      // 4) 저장 후 즉시 재조회하여 UI 동기화
      const snap = await getDoc(doc(db, "profiles", user.uid));
      const fresh = (snap.exists() ? (snap.get("username") as string) : "") || "";
      setUsername(fresh);

      setMsg("✅ 닉네임이 저장되었고 기존 기록에도 반영되었습니다.");
      toast("닉네임이 저장되었습니다.", { variant: "success" });
    } catch (e) {
      const m = (e as Error).message;
      setErr(m);
      toast(`저장 실패: ${m}`, { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <section className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-3">마이페이지</h1>
        <p>로그인이 필요합니다.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-3">마이페이지</h1>
        <p>불러오는 중…</p>
      </section>
    );
  }

  return (
    <section className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">마이페이지</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">닉네임</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="닉네임을 입력하세요"
            maxLength={20}
          />
          <p className="text-xs text-gray-400 mt-1">최대 20자. 리더보드에 표시됩니다.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? "저장 중…" : "저장"}
        </button>

        {msg && <p className="text-green-600">{msg}</p>}
        {err && <p className="text-red-600">{err}</p>}
      </form>

      <hr className="my-6" />

      <div className="text-sm text-gray-500 space-y-1">
        <p><b>이메일</b>: {user.email ?? "(없음)"}</p>
        <p><b>UID</b>: {user.uid}</p>
      </div>
    </section>
  );
}
