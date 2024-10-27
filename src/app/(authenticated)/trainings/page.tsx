import PageTitleWithIcon from "@/components/page-title-with-icon";
import Search from "@/components/search";
import TrainingCard from "@/components/training-card";
import TrainingsSession from "@/components/trainings-session";
import { Button } from "@/components/ui/button";
import { Barbell } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function Trainings() {
  return (
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
      <div className="flex gap-4 overflow-x-auto">
        <TrainingCard
          by="Micael Inácio"
          duration="1h 10min"
          level="Avançado"
          title="Movimentação"
          urlToTraining="#"
        />
        <TrainingCard
          by="Micael Inácio"
          duration="1h 10min"
          level="Avançado"
          title="Movimentação"
          urlToTraining="#"
        />
        <TrainingCard
          by="Micael Inácio"
          duration="1h 10min"
          level="Avançado"
          title="Movimentação"
          urlToTraining="#"
        />
        <TrainingCard
          by="Micael Inácio"
          duration="1h 10min"
          level="Avançado"
          title="Movimentação"
          urlToTraining="#"
        />
        <TrainingCard
          by="Micael Inácio"
          duration="1h 10min"
          level="Avançado"
          title="Movimentação"
          urlToTraining="#"
        />
      </div>
      <TrainingsSession sessionTitle="Treinos populares" />
      <div className="overflow-x-auto">
        <TrainingCard
          by="Micael Inácio"
          duration="1h 10min"
          level="Avançado"
          title="Movimentação"
          urlToTraining="#"
        />
      </div>
      <TrainingsSession sessionTitle="Treinos recentes" />
      <div className="overflow-x-auto">
        <TrainingCard
          by="Micael Inácio"
          duration="1h 10min"
          level="Avançado"
          title="Movimentação"
          urlToTraining="#"
        />
      </div>
    </div>
  );
}
