import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { GAMES } from "../../data/games";

export default function Games() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Games</h1>
        <p className="text-sm text-gray-500">준비된 게임들을 모아봤어요.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((g) => (
          <Card key={g.id} className="flex flex-col">
            <div className="flex-1 space-y-2">
              <h3 className="text-base font-semibold">{g.title}</h3>
              <p className="text-sm text-gray-500">{g.desc}</p>
            </div>

            {g.status === "ready" && g.href ? (
              <Link
                to={g.href}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 text-sm font-medium"
              >
                Play
              </Link>
            ) : (
              <Button disabled className="mt-4 text-gray-400 cursor-not-allowed">
                곧 공개
              </Button>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
