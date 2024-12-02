import { ArrowUp } from "lucide-react";
import React from "react";
import { useState } from "react";

interface MessageProps {
  text: string;
  amountOfReactions: number;
  answered?: boolean;
}

export function Message({
  text,
  answered = false,
  amountOfReactions,
}: MessageProps) {
  const [hasReacted, setHasReacted] = useState(false);

  function handleReactToMessage() {
    setHasReacted(true);
  }
  return (
    <li
      data-answered={answered}
      className="ml4 leading relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none"
    >
      {text}
      {hasReacted ? (
        <button
          className="mt-3 flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-500"
          type="button"
        >
          <ArrowUp />
          質問のように (123)
        </button>
      ) : (
        <button
          onClick={handleReactToMessage}
          className="mt-3 flex items-center gap-2 text-zinc-400 text-sm font-medium hover:text-zinc-300"
          type="button"
        >
          <ArrowUp />
          質問のように ({amountOfReactions})
        </button>
      )}
    </li>
  );
}
