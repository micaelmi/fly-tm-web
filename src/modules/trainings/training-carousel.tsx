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
import { Training } from "@/interfaces/training";

export default function TrainingsCarousel() {
  const { data, isLoading, error } = useTrainingsDataByUser();
  const trainingsByUser = data?.data.trainings;

  if (isLoading) return <Loading />;
  if (error) return <p>Erro ao carregar seus treinos: {error.message}</p>;
  if (data && trainingsByUser && trainingsByUser?.length < 1)
    return (
      <p className="w-full font-medium text-center text-lg text-muted-foreground">
        Nenhum treino cadastrado, crie seu primeiro treino{" "}
        <Link
          href={"/trainings/register"}
          className="text-primary hover:underline"
        >
          aqui
        </Link>
        !
      </p>
    );

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
        {trainingsByUser
          ? trainingsByUser.map((training: Training) => {
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
  );
}
