import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import { signOutFx } from "../../features/auth/signOut";
import { ROUTES } from "../../constants/routes";

export default function Header() {
  const { user } = useAuth();
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link to={ROUTES.HOME} className="font-bold">jjminigames</Link>
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm">Hi, {user.displayName || user.email}</span>
              <button className="px-3 py-1 rounded border" onClick={signOutFx}>Logout</button>
            </>
          ) : (
            <Link to={ROUTES.LOGIN} className="px-3 py-1 rounded border">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
