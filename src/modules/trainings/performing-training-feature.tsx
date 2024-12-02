"use client";

import Loading from "@/app/loading";
import Navbar from "@/components/navbar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  useIncrementTrainingDays,
  useTrainingById,
} from "@/hooks/use-trainings";
import { TrainingItem } from "@/interfaces/training";
import { formatTime } from "@/lib/utils";
import {
  ArrowCircleLeft,
  ArrowCircleRight,
  Clock,
  Flag,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import TrainingComplete from "./training-complete";

export default function PerformingTrainingFeature() {
  const [trainingSlapsedTime, setTrainingSlapsedTime] = useState<number>(0);
  const [itemSlapsedTime, setItemSlapsedTime] = useState<number>(0);

  const training_id = useParams().training_id.toLocaleString();

  const { data, isLoading, isError } = useTrainingById(training_id);

  isLoading && <Loading />;
  isError && <p>Ocorreu um erro ao carregar os dados do treino</p>;

  const training = data?.training;

  const [isTrainingFinished, setIsTrainingFinished] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<TrainingItem>({
    id: 0,
    comments: "",
    counting_mode: "reps",
    movement: {
      id: 0,
      average_time: 0,
      description: "",
      image_url: "",
      name: "",
      video_url: "",
    },
    queue: 0,
    reps: 0,
    time: 0,
  });

  const changeCurrentItem = (direction: "previous" | "next") => {
    const total = training?.training_items.length;
    const currentQueue = currentItem.queue;

    if (currentQueue === total && direction === "next") {
      updateTrainingDays();
      return;
    }

    if (currentQueue === 1 && direction === "previous") {
      return;
    }

    if (training) {
      if (direction === "previous") {
        setCurrentItem(training.training_items[currentQueue - 1 - 1]);
      } else {
        setCurrentItem(training.training_items[currentQueue - 1 + 1]);
      }
    }
  };

  const {
    mutate,
    data: trainingDays,
    isPending,
    isError: isIncrementError,
  } = useIncrementTrainingDays();
  const user_id = useSession().data?.payload.sub;

  const updateTrainingDays = () => {
    if (!user_id) return;
    mutate(
      {
        userId: user_id,
      },
      {
        onSuccess: () => {
          setIsTrainingFinished(true);
        },
      }
    );
  };

  useEffect(() => {
    if (training?.training_items[0]) {
      setCurrentItem(training.training_items[0]);
    }
  }, [training?.training_items]);

  useEffect(() => {
    if (isTrainingFinished) return;

    const intervalId = setInterval(() => {
      setTrainingSlapsedTime((prevValue) => prevValue + 1);
      setItemSlapsedTime((prevValue) => prevValue + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isTrainingFinished]);

  useEffect(() => {
    setItemSlapsedTime(0);
  }, [currentItem]);

  if (!training) return;

  return (
    <>
      <Navbar />
      {isTrainingFinished && trainingDays ? (
        <TrainingComplete trainingDays={trainingDays} />
      ) : (
        <div className="space-y-5 mt-5 mb-5 container">
          {/* header */}
          <div className="flex justify-between">
            <div>
              <h1 className="font-semibold text-2xl">Treinando agora:</h1>
              <p className="text-primary text-xl">{training.title}</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-3 border-primary shadow shadow-primary px-3 border rounded-lg text-primary text-xl">
                <Flag />
                <p>{training.level.title}</p>
              </div>
              <div className="flex items-center gap-4 border-primary shadow shadow-primary px-3 border rounded-lg">
                <Clock className="text-2xl" />
                <Separator
                  orientation="vertical"
                  className="bg-primary shadow shadow-primary"
                />
                <div className="flex flex-col items-center">
                  <p>Estimado</p>
                  <p>{formatTime(training.time)}</p>
                </div>
                <Separator
                  orientation="vertical"
                  className="bg-primary shadow shadow-primary"
                />
                <div className="flex flex-col items-center">
                  <p>Decorrido</p>
                  <p>{formatTime(trainingSlapsedTime)}</p>
                </div>
              </div>
            </div>
          </div>
          {/* itemDetails */}
          <div className="flex flex-col justify-center items-center gap-4 leading-4">
            {currentItem ? (
              <>
                <h1 className="text-4xl text-primary">
                  {currentItem?.movement.name} -{" "}
                  {currentItem?.time
                    ? formatTime(currentItem.time)
                    : currentItem.reps + " x"}
                </h1>
                {currentItem.comments ? (
                  <p>Comentário: {currentItem.comments}</p>
                ) : null}
                <div className="flex gap-2">
                  <p>Tempo estimado para finalizar:</p>
                  <p>
                    {currentItem.time
                      ? formatTime(currentItem.time)
                      : formatTime(
                          currentItem.reps * currentItem.movement.average_time
                        )}
                  </p>
                </div>
                <div className="gap-4 grid grid-cols-2 mb-5">
                  <Image
                    src={"/mascot-serve.svg"}
                    alt="Patola treinando"
                    height={100}
                    width={100}
                    className="aspect-square"
                    priority
                  />
                  <h2 className="font-bold text-xl self-center">
                    {formatTime(itemSlapsedTime)}
                  </h2>
                </div>
                <div className="gap-5 grid grid-cols-11">
                  <ArrowCircleLeft
                    onClick={() => {
                      changeCurrentItem("previous");
                    }}
                    className={`col-span-1 text-4xl text-primary self-center ${currentItem.queue == 1 ? "opacity-50 hover:cursor-not-allowed" : "hover:cursor-pointer"}`}
                  />
                  <div className="flex flex-col gap-2 col-span-4">
                    <Label>Descrição</Label>
                    <p className="text-justify leading-relaxed">
                      {currentItem.movement.description}
                    </p>
                  </div>
                  <Separator
                    orientation="vertical"
                    className="col-span-1 bg-primary shadow shadow-primary mx-auto"
                  />
                  <div className="flex flex-col gap-2 col-span-4">
                    <Label>Vídeo explicativo</Label>
                    <iframe
                      className="aspect-video"
                      src={currentItem.movement.video_url}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <ArrowCircleRight
                    onClick={() => {
                      changeCurrentItem("next");
                    }}
                    className="col-span-1 text-4xl text-primary hover:cursor-pointer self-center"
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
