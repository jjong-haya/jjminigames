import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import { signOutFx } from "../../features/auth/signOut";
import { ROUTES } from "../../constants/routes";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="w-full bg-[#f0f2f5] shadow-sm sticky top-0 z-40">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link to={ROUTES.HOME} className="font-bold text-lg tracking-tight">
          jjminigames
        </Link>

        {/* navbar */}
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link to="/Games" className="text-gray-600 hover:text-gray-900">
            Games
          </Link>
          <Link to="/leaderboard" className="text-gray-600 hover:text-gray-900">
            Leaderboard
          </Link>
          <Link to="/me/records" className="text-gray-600 hover:text-gray-900">
            My Records
          </Link>
          {/* 로그인 시에만 Profile 노출 */}
          {user && (
            <Link to="/me/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
          )}
          <a
            href="https://github.com/jjong-haya/jjminigames"
            className="text-gray-600 hover:text-gray-900"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>

        {/* auth */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden md:inline text-sm text-gray-500">
                {user.displayName || user.email}
              </span>
              <button
                className="px-3 py-1.5 rounded-xl border hover:bg-gray-50 text-sm"
                onClick={signOutFx}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
