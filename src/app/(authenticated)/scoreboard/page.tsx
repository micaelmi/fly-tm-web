import Navbar from "@/components/navbar";
import CreateMatch from "@/modules/scoreboard/create-match";
import History from "@/modules/scoreboard/history";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Placar | Fly TM",
};

export default function scoreboard() {
  return (
    <>
      <Navbar />
      <div className="space-y-4 py-4 container">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-4xl text-primary">Placar</h1>
          <CreateMatch />
        </div>
        <div className="flex justify-between items-center">
          <History />
          <Image
            src={"/mascot-default.svg"}
            alt="Mascot"
            width={676}
            height={870}
            className="max-w-[30%]"
          />
        </div>
      </div>
    </>
  );
}
