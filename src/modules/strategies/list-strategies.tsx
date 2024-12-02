"use client";

import Navbar from "@/components/navbar";
import PageTitleWithIcon from "@/components/page-title-with-icon";
import { Button } from "@/components/ui/button";
import {
  useStrategiesData,
  useStrategiesDataByClub,
  useStrategiesDataByUser,
} from "@/hooks/use-strategies";
import { Strategy } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import StrategyCarousel from "./strategy-carousel";

export default function ListStrategies() {
  const strategies = useStrategiesData();
  const strategiesByUser = useStrategiesDataByUser();
  const strategiesByClub = useStrategiesDataByClub();

  return (
    <>
      <Navbar />
      <div className="mt-5 mb-5 container">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <PageTitleWithIcon icon={Strategy} title="Estratégias" />
            <div className="flex items-center gap-3">
              <Link href={"strategies/register"}>
                <Button>+ Criar estratégia</Button>
              </Link>
            </div>
          </div>
          <StrategyCarousel
            strategies={strategies}
            noStrategiesMessage={
              <span>Nenhuma estratégia cadastrada na plataforma.</span>
            }
            sessionTitle="Estratégias recomendadas"
          />
          <StrategyCarousel
            strategies={strategiesByUser}
            noStrategiesMessage={
              <span>
                Você ainda não criou nenhuma estratégia. Comece agora clicando{" "}
                <Link href={"./strategies/register"} className="text-primary">
                  aqui
                </Link>
                .
              </span>
            }
            sessionTitle="Suas estratégias"
          />
          <StrategyCarousel
            strategies={strategiesByClub}
            noStrategiesMessage={
              <span>Seu clube ainda não publicou nenhuma estratégia.</span>
            }
            sessionTitle="Estratégias do seu clube"
          />
        </div>
      </div>
    </>
  );
}
