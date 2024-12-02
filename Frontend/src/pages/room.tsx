import { useParams } from "react-router-dom";
import logo from "../assets/logo.svg";
import { Share, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Message } from "../components/message";

export function Room() {
  const { roomId } = useParams();

  const handleShareRoom = () => {
    const url = window.location.href.toString();
    if (navigator.share !== undefined && navigator.canShare()) {
      navigator.share({ url });
    } else {
      navigator.clipboard.writeText(url);
      toast.info("Room URL copied");
    }
  };

  return (
    <div className="mx-auto max-w-[640px] flex flex-col gap-6 py-10 px-5">
      <div className="flex items-center gap-3 px-3">
        <img src={logo} alt="TAZUNE" className="h-5" />
        <span className="tex-sm text-zinc-500 truncate">
          コード: <span className="text-zinc-300">{roomId}</span>
        </span>
        <button
          onClick={handleShareRoom}
          className="ml-auto bg-zinc-800 text-zinc-300 px-3 py-1.5 gap-1.5 flex items-center rounded-lg  font-medium text-sm transition-colors hover:bg-zinc-700"
          type="submit"
        >
          共有 <Share className="size-4" />
        </button>
      </div>
      <div className="h-px w-full bg-zinc-900 " />
      <form className="flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800 ring-orange-400 ring-offset-2 ring-offset-zinc-950 focus-within:ring-1">
        <input
          className="flex-1 text-sm bg-transparent mx-2 text-zinc-100 outline-none placeholder:text-zinc-500 "
          type="text"
          name="theme"
          placeholder="What's your question?"
          autoComplete="off"
        />
        <button
          className="bg-orange-400 text-orange-950 px-3 py-1.5 gap-1.5 flex items-center rounded-lg  font-medium text-sm transition-colors hover:bg-orange-500"
          type="submit"
        >
          質問を作成する <ArrowRight className="size-4" />
        </button>
      </form>
      <ol className="list-decimal list-outside px-3 space-y-8">
        <Message
          answered
          text="bhjdsbvhabvjhasbvjasbvlsdfavbjdslvbsd"
          amountOfReactions={10}
        />
        <Message
          text="bhjdsbvhabvjhasbvjasbvlsdfavbjdslvbsd"
          amountOfReactions={10}
        />
        <Message
          text="bhjdsbvhabvjhasbvjasbvlsdfavbjdslvbsd"
          amountOfReactions={10}
        />
        <Message
          text="bhjdsbvhabvjhasbvjasbvlsdfavbjdslvbsd"
          amountOfReactions={10}
        />
      </ol>
    </div>
  );
}
