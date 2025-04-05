import React from "react";
import { Rate } from "./rate";
import { onRateAction } from "@/lib/github";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <Rate
        onRateAction={async (url, feedback) => {
          "use server";

          await onRateAction(url, feedback);
        }}
      />
      <div className="mx-auto text-sm text-fd-muted-foreground">
        This site is powered by{" "}
        <Link className="underline" href="https://www.netlify.com/">
          Netlify
        </Link>
      </div>
    </>
  );
};

export default Footer;
