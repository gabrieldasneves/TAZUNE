import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { ArrowRight } from "lucide-react";

export function CreateRoom() {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    // const theme = data.get("theme")?.toString();
    // console.log(theme);
    navigate("/room/123");
  };

  return (
    <main className="h-screen flex items-center justify-center px-4">
      <div className="max-w-[450px] flex flex-col gap-6">
        <img src={logo} alt="TAZUNE" className="h-50" />
        <p className="leading-relaxed text-zinc-300 text-center">
          フォーラムを作って、最も重要な質問に優先順位をつけます。
        </p>
        <form
          onSubmit={handleCreateRoom}
          className="flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800 ring-orange-400 ring-offset-2 ring-offset-zinc-950 focus-within:ring-1"
        >
          <input
            className="flex-1 text-sm bg-transparent mx-2 text-zinc-100 outline-none placeholder:text-zinc-500 "
            type="text"
            name="theme"
            placeholder="部屋名"
            autoComplete="off"
          />
          <button
            className="bg-orange-400 text-orange-950 px-3 py-1.5 gap-1.5 flex items-center rounded-lg  font-medium text-sm transition-colors hover:bg-orange-500"
            type="submit"
          >
            部屋を作る <ArrowRight className="size-4" />
          </button>
        </form>
      </div>
    </main>
  );
}
