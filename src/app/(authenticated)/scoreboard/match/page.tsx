import Navbar from "@/components/navbar";
import Score from "@/modules/scoreboard/score";

export default function Match() {
  return (
    <>
      <Navbar />
      <section className="py-6 container">
        <Score />
      </section>
    </>
  );
}
