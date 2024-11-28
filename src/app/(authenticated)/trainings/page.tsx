"use client";

import PageTitleWithIcon from "@/components/page-title-with-icon";
import Search from "@/components/search";
import TrainingsSession from "@/modules/trainings/page-session";
import { Button } from "@/components/ui/button";
import { Barbell } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import Navbar from "@/components/navbar";
import TrainingsCarousel from "@/modules/trainings/training-carousel";
import {
  useTrainingsData,
  useTrainingsDataByClub,
  useTrainingsDataByUser,
} from "@/hooks/use-trainings";

export default function Trainings() {
  const trainings = useTrainingsData();
  const trainingsByUser = useTrainingsDataByUser();
  const trainingsByClub = useTrainingsDataByClub();

  return (
    <>
      <Navbar />
      <div className="mt-5 mb-5 container">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <PageTitleWithIcon icon={Barbell} title="Treinamentos" />
            <div className="flex items-center gap-3">
              <Search placeholder="Procurar" pagination={false} />
              <Link href={"trainings/register"}>
                <Button>+ Criar treino</Button>
              </Link>
            </div>
          </div>
          <TrainingsSession sessionTitle="Treinos recomendados" />
          <TrainingsCarousel
            trainings={trainings}
            noTrainingsMessage={
              <span>Nenhum treino cadastrado na plataforma.</span>
            }
          />
          <TrainingsSession sessionTitle="Seus treinos" />
          <TrainingsCarousel
            trainings={trainingsByUser}
            noTrainingsMessage={
              <span>
                Você ainda não criou nenhum treino. Comece agora clicando{" "}
                <Link href={"./trainings/register"} className="text-primary">
                  aqui
                </Link>
                .
              </span>
            }
          />
          <TrainingsSession sessionTitle="Treinos do seu clube" />
          <TrainingsCarousel
            trainings={trainingsByClub}
            noTrainingsMessage={
              <span>Seu clube ainda não publicou nenhum treino.</span>
            }
          />
        </div>
      </div>
    </>
  );
}
