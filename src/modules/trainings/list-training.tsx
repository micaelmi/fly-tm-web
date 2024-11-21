"use client";

import Loading from "@/app/loading";
import Navbar from "@/components/navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Level } from "@/interfaces/level";
import { Training } from "@/interfaces/training";
import api from "@/lib/axios";
import { Clock, Flag } from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import ItemDetailsModal from "./item-details-modal";
import { Button } from "@/components/ui/button";
import ShareButton from "@/components/share-button";
import Link from "next/link";
import { formatTime } from "@/lib/utils";

interface TrainingResponse {
  training: Training;
}

export default function ListTraining() {
  const token = useSession().data?.token.user.token;
  const training_id = useParams().training_id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["trainingData", training_id],
    queryFn: async () => {
      return await api.get<TrainingResponse>(`/trainings/${training_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });

  isLoading && <Loading />;
  isError && <p>Ocorreu um erro ao carregar os dados do treino</p>;

  const training = data?.data.training;

  if (!training) return;

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-10 mt-5 mb-5 container">
        {/* level, title, time, by */}
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex items-center gap-2 text-lg text-primary leading-4">
            <Flag />
            {training.level.title}
          </div>
          <h1 className="text-3xl">{training.title}</h1>
          <div className="flex items-center gap-2">
            <Clock />
            {formatTime(training.time)}
          </div>
          <p className="text-primary">Por: {training.user.name}</p>
        </div>
        <div className="gap-10 grid grid-cols-11">
          {/* movements */}
          <div className="col-span-5 w-96">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Movimentos</p>
              <p className="font-semibold text-primary">
                Total: {training.training_items.length}
              </p>
            </div>
            <ScrollArea>
              <div className="space-y-3">
                {training.training_items.map((training) => {
                  return (
                    <div
                      key={training.queue}
                      className="flex gap-3 border-primary shadow shadow-primary p-2 border rounded-lg"
                    >
                      <Image
                        src={training.movement.image_url}
                        alt="Imagem do movimento"
                        width={100}
                        height={100}
                        className="rounded-lg aspect-square"
                        unoptimized
                      />
                      <div className="flex flex-col justify-between">
                        <div>
                          <p className="font-semibold">
                            {training.movement.name}
                          </p>
                          <p className="text-muted-foreground">
                            {training.time
                              ? training.time + " segundos"
                              : training.reps + " repetições"}
                          </p>
                        </div>
                        <ItemDetailsModal
                          movement_name={training.movement.name}
                          movement_description={training.movement.description}
                          movement_video_url={training.movement.video_url}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
          <Separator
            orientation="vertical"
            className="col-span-1 bg-primary shadow-md shadow-primary"
          />
          {/* description, start, options: {share, report} */}
          <div className="flex flex-col gap-5 col-span-5">
            <div>
              <h2 className="font-semibold">Descrição:</h2>
              <p>{training.description}</p>
            </div>
            <div>
              <Link href={`./${training_id}/performing`}>
                <Button className="w-full">Iniciar</Button>
              </Link>
              <div className="flex flex-col gap-3 mt-5">
                <p className="font-semibold">Opções</p>
                <ShareButton
                  link={
                    process.env.NEXT_PUBLIC_FRONTEND_BASE_URL +
                    "/trainings/" +
                    training.id
                  }
                />
                <Button variant={"destructive"}>Denunciar</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
