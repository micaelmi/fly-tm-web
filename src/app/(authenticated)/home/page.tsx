import FeaturesCarousel from "@/components/features-carousel";
import Navbar from "@/components/navbar";
import Search from "@/components/search";
import ClubsCarousel from "@/modules/clubs/clubs-carousel";
import EventsCarousel from "@/modules/events/event-carousel";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar back={false} />
      <div className="flex flex-col gap-4 my-8 px-2 container">
        <div>
          <h1 className="font-semibold text-3xl">Olá, Micael</h1>
          <h3 className="font-semibold text-primary text-xl">
            Qual é o plano de hoje?
          </h3>
        </div>
        <FeaturesCarousel />
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-xl whitespace-nowrap">
            Confira os próximos eventos
          </h3>
          <Search
            placeholder="Buscar evento"
            pagination={false}
            className="max-w-60"
          />
        </div>
        {/* events */}
        <EventsCarousel />
        <div className="flex justify-end mb-4">
          <Link
            href="events/register"
            className="text-lg text-primary underline"
          >
            Criar evento
          </Link>
        </div>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-xl whitespace-nowrap">
            Encontre clubes
          </h3>
          <Search
            placeholder="Buscar clube"
            pagination={false}
            className="max-w-60"
          />
        </div>
        <ClubsCarousel />
        <div className="flex justify-end mb-4">
          <Link
            href="clubs/register"
            className="text-lg text-primary underline"
          >
            Criar clube
          </Link>
        </div>
      </div>
    </>
  );
}
