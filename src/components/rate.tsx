"use client";

import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { type SyntheticEvent, useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
} from "fumadocs-ui/components/ui/collapsible";
import { cva } from "class-variance-authority";
import { usePathname } from "next/navigation";
import { cn } from "fumadocs-ui/components/api";
import { Github } from "lucide-react";
import Link from "next/link";

const rateButtonVariants = cva(
  "inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium border text-sm [&_svg]:size-4 disabled:cursor-not-allowed cursor-pointer hover:bg-fd-muted hover:text-fd-muted-foreground",
  {
    variants: {
      active: {
        true: "bg-fd-accent text-fd-accent-foreground [&_svg]:fill-current",
        false: "text-fd-muted-foreground",
      },
    },
  }
);

export interface Feedback {
  opinion: "good" | "bad";
  message: string;
}

function get(url: string): Feedback | null {
  const item = localStorage.getItem(`docs-feedback-${url}`);

  if (item === null) return null;
  return JSON.parse(item) as Feedback;
}

function set(url: string, feedback: Feedback | null) {
  const key = `docs-feedback-${url}`;

  if (feedback) localStorage.setItem(key, JSON.stringify(feedback));
  else localStorage.removeItem(key);
}

export function Rate({
  onRateAction,
}: {
  onRateAction: (url: string, feedback: Feedback) => Promise<void>;
}) {
  const url = usePathname();
  const [previous, setPrevious] = useState<Feedback | null>(null);
  const [opinion, setOpinion] = useState<"good" | "bad" | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setPrevious(get(url));
  }, [url]);

  function submit(e?: SyntheticEvent) {
    e?.preventDefault();
    if (opinion == null) return;

    const feedback: Feedback = {
      opinion,
      message,
    };

    void onRateAction(url, feedback);

    set(url, feedback);
    setPrevious(feedback);
    setMessage("");
    setOpinion(null);
  }

  return (
    <Collapsible
      open={opinion !== null || previous !== null}
      onOpenChange={(v) => {
        if (!v) setOpinion(null);
      }}
      className="border-y py-3"
    >
      <div className="flex flex-row items-center gap-2">
        <p className="text-sm font-medium pe-2">How is this guide?</p>

        <button
          disabled={previous !== null}
          className={cn(
            rateButtonVariants({
              active: (previous?.opinion ?? opinion) === "good",
            })
          )}
          onClick={() => {
            setOpinion("good");
          }}
        >
          <ThumbsUp />
          Good
        </button>
        <button
          disabled={previous !== null}
          className={cn(
            rateButtonVariants({
              active: (previous?.opinion ?? opinion) === "bad",
            })
          )}
          onClick={() => {
            setOpinion("bad");
          }}
        >
          <ThumbsDown />
          Bad
        </button>

        <Link
          href={`https://github.com/list-jonas/zen-docs/edit/main/content/docs${url}.mdx`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            rateButtonVariants({
              active: false,
            }),
            "ml-auto"
          )}
        >
          <Github className="size-4" />
          Edit on GitHub
        </Link>
      </div>
      <CollapsibleContent className="mt-3">
        {previous ? (
          <div className="px-3 py-6 flex flex-col items-center gap-3 bg-card text-card-foreground text-sm text-center rounded-xl">
            <p>Thank you for your feedback!</p>
            <button
              className={cn(
                buttonVariants({
                  color: "outline",
                }),
                "text-xs"
              )}
              onClick={() => {
                setOpinion(previous?.opinion);
                set(url, null);
                setPrevious(null);
              }}
            >
              Submit Again?
            </button>
          </div>
        ) : (
          <form className="flex flex-col gap-3" onSubmit={submit}>
            <textarea
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border rounded-lg p-3 resize-none focus-visible:outline-none"
              placeholder="Leave your feedback..."
              onKeyDown={(e) => {
                if (!e.shiftKey && e.key === "Enter") {
                  submit(e);
                }
              }}
            />
            <button
              type="submit"
              className={cn(buttonVariants({ color: "outline" }), "w-fit px-3")}
            >
              Submit
            </button>
          </form>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
