import { useNavigate } from "react-router-dom";
import { googleSignIn } from "../../features/auth/googleSignIn";

export default function Login() {
  const nav = useNavigate();

  async function onClick() {
    try {
      await googleSignIn();
      nav("/");
    } catch (e) {
      console.error(e);
      alert("로그인 실패. 콘솔을 확인하세요.");
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <button onClick={onClick} className="px-4 py-2 rounded border bg-white">
        Sign in with Google
      </button>
    </section>
  );
}
