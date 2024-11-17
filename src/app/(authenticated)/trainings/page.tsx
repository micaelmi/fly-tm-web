"use client";

import PageTitleWithIcon from "@/components/page-title-with-icon";
import Search from "@/components/search";
import TrainingsSession from "@/modules/trainings/trainings-session";
import { Button } from "@/components/ui/button";
import { Barbell } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import Navbar from "@/components/navbar";
import TrainingCard from "@/modules/trainings/training-card";
import TrainingsCarousel from "@/modules/trainings/training-carousel";

export default function Trainings() {
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
          <TrainingsCarousel />
          <TrainingsSession sessionTitle="Seus treinos" />
          <TrainingsCarousel />
          <TrainingsSession sessionTitle="Treinos do seu clube" />
          <TrainingsCarousel />
        </div>
      </div>
    </>
  );
}
