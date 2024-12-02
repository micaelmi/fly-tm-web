"use client";

import Loading from "@/app/loading";
import Navbar from "@/components/navbar";
import ShareButton from "@/components/share-button";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDeleteTraining, useTrainingById } from "@/hooks/use-trainings";
import { formatTime } from "@/lib/utils";
import { Clock, Flag, Pencil } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DeleteTrainingOrStrategy } from "./delete-training-or-strategy";
import ItemDetailsModal from "./item-details-modal";
import ContactReportForm from "../contact/contact-report-form";

export default function ListTraining() {
  const session = useSession();

  const username = session.data?.payload.username;

  const training_id = useParams().training_id.toLocaleString();

  const { data, isLoading, isError } = useTrainingById(training_id);

  isLoading && <Loading />;
  isError && <p>Ocorreu um erro ao carregar os dados do treino</p>;

  const training = data?.training;

  if (!training) return;

  const own_training = username === training.user.username;

  return (
    <>
      <Navbar />
      <div className={`w-full h-40`}>
        <img
          src={training.icon_url}
          alt="Ícone do treino"
          className="w-full max-h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-10 mt-5 mb-5 container">
        {/* level, title, time, by */}
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-lg text-primary leading-4">
              <Flag />
              {training.level.title}
            </div>
            {own_training ? (
              <div className="flex gap-2">
                <Link
                  href={`/trainings/${training.id}/edit`}
                  className="border-muted hover:border-muted-foreground p-2 border rounded-full text-muted hover:text-muted-foreground transition-all hover:cursor-pointer"
                >
                  <Pencil />
                </Link>
                <DeleteTrainingOrStrategy
                  type="trainings"
                  id={training.id}
                  useFunction={useDeleteTraining}
                />
              </div>
            ) : null}
          </div>
          <h1 className="text-3xl">{training.title}</h1>
          <div className="flex items-center gap-2">
            <Clock />
            {formatTime(training.time)}
          </div>
          <p className="text-primary">
            Por:{" "}
            <Link
              href={`/users/${training.user.username}`}
              target="_blank"
              className="hover:underline"
            >
              {training.user.username}
            </Link>
          </p>
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
                {training.training_items.map((trainingItem) => {
                  return (
                    <div
                      key={trainingItem.queue}
                      className="flex gap-3 border-primary shadow shadow-primary p-2 border rounded-lg"
                    >
                      <Image
                        src={trainingItem.movement.image_url}
                        alt="Imagem do movimento"
                        width={100}
                        height={100}
                        className="rounded-lg aspect-square"
                        unoptimized
                      />
                      <div className="flex flex-col justify-between">
                        <div>
                          <p className="font-semibold">
                            {trainingItem.movement.name}
                          </p>
                          <p className="text-muted-foreground">
                            {trainingItem.time
                              ? formatTime(trainingItem.time)
                              : trainingItem.reps + " repetições"}
                          </p>
                        </div>
                        <ItemDetailsModal
                          movement_name={trainingItem.movement.name}
                          movement_description={
                            trainingItem.movement.description
                          }
                          movement_video_url={trainingItem.movement.video_url}
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
                {!own_training ? (
                  <ContactReportForm type="treino" id={training.id} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
