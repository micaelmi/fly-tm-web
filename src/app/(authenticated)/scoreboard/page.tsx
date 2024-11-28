import Navbar from "@/components/navbar";
import CreateMatch from "@/modules/scoreboard/create-match";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Placar | Fly TM",
};

export default function scoreboard() {
  return (
    <>
      <Navbar />
      <div className="space-y-4 py-4 container">
        <h1 className="font-bold text-4xl text-primary">Placar</h1>
        <CreateMatch />
      </div>
    </>
  );
}
