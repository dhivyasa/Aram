import React from "react";

import Game from "./Game";
import { data } from "../api/data";

export default function LangPage() {
  if (!data) return <h1>Loading...</h1>;

  return (
    console.log(data),
    (
      <main>
        <h1>Would you dare you pair?</h1>
        <Game pairs={data.pairs} langA={data.langA} langB={data.langB} />
      </main>
    )
  );
}
