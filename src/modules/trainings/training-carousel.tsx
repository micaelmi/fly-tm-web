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
import { useTrainingsDataByUser } from "@/hooks/use-trainings";
import Loading from "@/app/loading";
import Link from "next/link";
import { Training, TrainingsResponse } from "@/interfaces/training";
import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ReactNode } from "react";

interface TrainingsCarouselProps {
  trainings: UseQueryResult<AxiosResponse<TrainingsResponse, any>, Error>;
  noTrainingsMessage: ReactNode;
}

export default function TrainingsCarousel({
  trainings,
  noTrainingsMessage,
}: TrainingsCarouselProps) {
  const { isLoading, error, data } = trainings;

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

  return (
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
        {trainingsData
          ? trainingsData.map((training: Training) => {
              return (
                <CarouselItem
                  key={training.id}
                  className="md:basis-1/2 lg:basis-1/3 py-2"
                >
                  <TrainingCard
                    by={training.user.username}
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
  );
}
