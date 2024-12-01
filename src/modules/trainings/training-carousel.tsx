"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import TrainingCard from "./training-card";
import Loading from "@/app/loading";
import { Training, TrainingsResponse } from "@/interfaces/training";
import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";

interface TrainingsCarouselProps {
  trainings: UseQueryResult<AxiosResponse<TrainingsResponse, any>, Error>;
  noTrainingsMessage: ReactNode;
  sessionTitle: string;
}

export default function TrainingsCarousel({
  trainings,
  noTrainingsMessage,
  sessionTitle,
}: TrainingsCarouselProps) {
  const { isLoading, error, data } = trainings;
  const [searchTerm, setSearchTerm] = useState("");

  let trainingsData: Training[] = [];
  if (data?.data.trainings) trainingsData = data.data.trainings;

  if (isLoading) return <Loading />;
  if (error) return <p>Erro ao carregar treinos: {error.message}</p>;

  if (trainingsData.length < 1) {
    return (
      <p className="w-full font-medium text-center text-lg text-muted-foreground">
        {noTrainingsMessage}
      </p>
    );
  }

  const filteredTrainings = trainingsData.filter((training) =>
    training.title.toLowerCase().includes(searchTerm.toLowerCase())
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
      {filteredTrainings && filteredTrainings.length < 1 ? (
        <p className="w-full font-medium text-center text-lg text-primary">
          Nenhum clube encontrado para "{searchTerm}".
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
            {filteredTrainings
              ? filteredTrainings.map((training: Training) => {
                  return (
                    <CarouselItem
                      key={training.id}
                      className="md:basis-1/2 lg:basis-1/3 py-2"
                    >
                      <TrainingCard
                        by={training.user.name}
                        duration={training.time}
                        level={training.level.title}
                        title={training.title}
                        urlToTraining={`/trainings/${training.id}`}
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
