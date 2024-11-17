"use client";

import Loading from "@/app/loading";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Training } from "@/interfaces/training";
import api from "@/lib/axios";
import { formatTime, Timer } from "@/lib/utils";
import {
  ArrowCircleLeft,
  ArrowCircleRight,
  Clock,
  Flag,
  Star,
} from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

interface TrainingResponse {
  training: Training;
}

interface Item {
  comments: string;
  counting_mode: string;
  movement: {
    average_time: number;
    description: String;
    image_url: string;
    name: string;
    video_url: string;
  };
  queue: number;
  reps: number;
  time: number;
}

export default function PerformingTrainingFeature() {
  const training_slapsed_time = Timer();
  const [itemSlapsedTime, setItemSlapsedTime] = useState<number>(0);

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

  const [isTrainingFinished, setIsTrainingFinished] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Item>({
    comments: "",
    counting_mode: "",
    movement: {
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
      setIsTrainingFinished(true);
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

  useEffect(() => {
    if (training?.training_items[0]) {
      setCurrentItem(training.training_items[0]);
    }
  }, [training?.training_items]);

  useEffect(() => {
    // Define o intervalo para atualizar o valor a cada 1 segundo
    const intervalId = setInterval(() => {
      setItemSlapsedTime((prevValue) => prevValue + 1); // Atualiza o valor
    }, 1000);

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setItemSlapsedTime(0);
  }, [currentItem]);

  if (!training) return;

  return (
    <>
      <Navbar />
      {isTrainingFinished ? (
        <div className="flex flex-col justify-center items-center gap-10 mt-10">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={500}
            gravity={0.1}
            colors={["#3B82F6", "#FFFFFF", "#C1272D", "#2CADC5", "#E0D4CA"]}
            recycle={false}
          />
          <h1 className="font-bold text-4xl">Parabéns, mandou ver!</h1>
          <div className="flex items-center gap-4 text-xl">
            <Star weight="fill" className="text-primary animate-pulse" />
            <p>Treino finalizado!</p>
            <Star weight="fill" className="text-primary animate-pulse" />
          </div>
          <Link href={"/trainings"}>
            <Button>Voltar para a lista de treinos</Button>
          </Link>
        </div>
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
                  <p>{formatTime(training_slapsed_time)}</p>
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
                    ? currentItem.time + " s"
                    : currentItem.reps + " x"}
                </h1>
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
                      src="https://www.youtube.com/embed/EBoCkd3kP6U?si=zwH2dMvm93npetIf&amp;controls=0&amp;start=37;end=47"
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
