"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Loading from "@/app/loading";
import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ReactNode, useState } from "react";
import { Strategy, StrategyResponse } from "@/interfaces/strategy";
import StrategyCard from "./strategy-card";
import { Separator } from "@radix-ui/react-separator";
import { Input } from "@/components/ui/input";

interface StrategyCarouselProps {
  strategies: UseQueryResult<AxiosResponse<StrategyResponse, any>, Error>;
  noStrategiesMessage: ReactNode;
  sessionTitle: string;
}

export default function StrategyCarousel({
  strategies,
  noStrategiesMessage,
  sessionTitle,
}: StrategyCarouselProps) {
  const { isLoading, error, data } = strategies;
  const [searchTerm, setSearchTerm] = useState("");

  let strategiesData: Strategy[] = [];
  if (data?.data.strategies) strategiesData = data.data.strategies;

  if (isLoading) return <Loading />;
  if (error) return <p>Erro ao carregar estratégias: {error.message}</p>;

  if (strategiesData.length < 1) {
    return (
      <p className="w-full font-medium text-center text-lg text-muted-foreground">
        {noStrategiesMessage}
      </p>
    );
  }

  const filteredStrategies = strategiesData.filter((strategy) =>
    strategy.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center gap-3">
        <h2 className="font-semibold text-lg whitespace-nowrap">
          {sessionTitle}
        </h2>
        <Separator className="flex-1 bg-secondary h-px text-secondary" />
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-60"
          />
        </div>
      </div>
      {filteredStrategies && filteredStrategies.length < 1 ? (
        <p className="w-full font-medium text-center text-lg text-primary">
          Nenhuma estratégia encontrada para "{searchTerm}".
        </p>
      ) : (
        <Carousel
          className="px-4 w-full"
          opts={{
            loop: true,
            align: "center",
          }}
          plugins={[
            Autoplay({
              delay: 4500,
            }),
          ]}
        >
          <CarouselContent>
            {filteredStrategies
              ? filteredStrategies.map((strategy: Strategy) => {
                  return (
                    <CarouselItem
                      key={strategy.id}
                      className="md:basis-1/2 lg:basis-1/3 py-2"
                    >
                      <StrategyCard
                        by={strategy.user.username}
                        level={strategy.level.title}
                        title={strategy.title}
                        urlToStrategy={`/strategies/${strategy.id}`}
                      />
                    </CarouselItem>
                  );
                })
              : null}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </>
  );
}
