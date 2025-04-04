"use client";
import Navbar from "@/components/navbar";
import Score from "@/modules/scoreboard/score";
import Score2 from "@/modules/scoreboard/score-layout-2";
import SwitchScoreboardLayout from "@/modules/scoreboard/switch-scoreboard-layout";
import { useState } from "react";

export default function Match() {
  const [changeLayout, setChangeLayout] = useState(false);
  return (
    <>
      <Navbar />
      <section className="py-6 container">
        {!changeLayout ? <Score /> : <Score2 />}
        <SwitchScoreboardLayout
          onChange={() => setChangeLayout(!changeLayout)}
        />
      </section>
    </>
  );
}
