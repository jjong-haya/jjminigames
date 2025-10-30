import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

export default function Home() {
  return (
    <section className=" flex items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-semibold leading-tight tracking-tight">Play tiny. Have fun fast.</h1>
        <p className="text-gray-500">
          짧고 빠른 미니게임을 모아둔 jjminigames. 로그인하면 기록 저장/랭킹(예정).
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/games">
            <Button className="bg-[#A9907E] hover:bg-[#4338ca] text-[#F5F5F5]">게임 하러 가기</Button>
          </Link>
          <Link to="/login">
            <Button className="bg-[#A9907E]">로그인</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
