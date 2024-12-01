"use client";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ClubCard from "./club-card";
import { useClubsData } from "@/hooks/use-clubs";
import { Input } from "@/components/ui/input";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

export default function ClubsCarousel() {
  const { data, isLoading, error } = useClubsData();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading)
    return (
      <p className="w-full text-center animate-pulse">Carregando clubes...</p>
    );
  if (error) return <p>Erro ao carregar clubes: {error.message}</p>;
  if (data && data.clubs.length < 1)
    return (
      <p className="w-full font-medium text-center text-lg text-primary">
        Nenhum clube cadastrado, seja o primeiro a criar seu clube aqui!
      </p>
    );

  // Filtrar os clubes com base no termo digitado
  const filteredClubs = data?.clubs.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-xl whitespace-nowrap">
          Encontre clubes
        </h3>
        <div className="flex items-center gap-2">
          <MagnifyingGlass size={35} />
          <Input
            type="search"
            placeholder="Buscar clube..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-60"
          />
        </div>
      </div>
      <div className="w-full">
        {/* Verificar se há clubes após o filtro */}
        {filteredClubs && filteredClubs.length < 1 ? (
          <p className="w-full font-medium text-center text-lg text-primary">
            Nenhum clube encontrado para "{searchTerm}".
          </p>
        ) : (
          <Carousel
            id="clubs"
            className="px-4 w-full"
            opts={{
              loop: true,
              align: "center",
            }}
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
          >
            <CarouselContent>
              {filteredClubs &&
                filteredClubs.map((club) => (
                  <CarouselItem
                    key={club.id}
                    className="md:basis-1/2 lg:basis-1/3 py-2"
                  >
                    <ClubCard
                      clubId={club.id}
                      name={club.name}
                      imageUrl={club.logo_url}
                      members={club._count.users}
                      local={club.city + " - " + club.state}
                    />
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>
    </>
  );
}
