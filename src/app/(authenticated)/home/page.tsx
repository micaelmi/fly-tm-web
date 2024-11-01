import ClubCard from "@/components/cards/club-card";
import EventCard from "@/components/cards/event-card";
import FeatureCard from "@/components/cards/feature-card";
import Search from "@/components/search";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-semibold text-3xl">Olá, Micael</h1>
        <h3 className="font-semibold text-primary text-xl">
          Qual é o plano de hoje?
        </h3>
      </div>
      <div className="flex justify-between">
        <FeatureCard
          alt="Patola sacando"
          imageUrl="mascot-serve.svg"
          text="Treinos"
          linkToFeaturePage="trainings"
        />
        <FeatureCard
          alt="Patola criando estratégia"
          imageUrl="mascot-strategy.svg"
          text="Estratégias"
          linkToFeaturePage="#"
        />
        <FeatureCard
          alt="Patola atacando"
          imageUrl="mascot-hitting.svg"
          text="Meu perfil"
          linkToFeaturePage="#"
        />
        <FeatureCard
          alt="Logo de clube"
          imageUrl="club-logo.svg"
          text="Clubes"
          linkToFeaturePage="#"
        />
        <FeatureCard
          alt="Placar"
          imageUrl="scoreboard.svg"
          text="Placar"
          linkToFeaturePage="#"
        />
      </div>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-xl whitespace-nowrap">
          Confira os próximos eventos
        </h3>
        <Search
          placeholder="Buscar evento"
          pagination={false}
          className="max-w-60"
        />
      </div>
      <div className="flex gap-4 overflow-x-scroll">
        <EventCard
          date="04/02/2024"
          level="Avançado"
          title="Campeonato avançado"
          local="Piracaia-SP"
        />
        <EventCard
          date="04/02/2024"
          level="Avançado"
          title="Campeonato avançado"
          local="Piracaia-SP"
        />
        <EventCard
          date="04/02/2024"
          level="Avançado"
          title="Campeonato avançado"
          local="Piracaia-SP"
        />
        <EventCard
          date="04/02/2024"
          level="Avançado"
          title="Campeonato avançado"
          local="Piracaia-SP"
        />
        <EventCard
          date="04/02/2024"
          level="Avançado"
          title="Campeonato avançado"
          local="Piracaia-SP"
        />
        <EventCard
          date="04/02/2024"
          level="Avançado"
          title="Campeonato avançado"
          local="Piracaia-SP"
        />
        <EventCard
          date="04/02/2024"
          level="Avançado"
          title="Campeonato avançado"
          local="Piracaia-SP"
        />
      </div>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-xl whitespace-nowrap">
          Encontre clubes
        </h3>
        <Search
          placeholder="Buscar clube"
          pagination={false}
          className="max-w-60"
        />
      </div>
      <div className="flex gap-4 overflow-x-scroll">
        <ClubCard
          buttonContent="Conhecer"
          imageUrl="club-logo.svg"
          local="Piracaia - SP"
          members={30}
          name="Centro de Treinamento F. Oliveira"
        />
        <ClubCard
          buttonContent="Conhecer"
          imageUrl="club-logo.svg"
          local="Piracaia - SP"
          members={30}
          name="Centro de Treinamento F. Oliveira"
        />
        <ClubCard
          buttonContent="Conhecer"
          imageUrl="club-logo.svg"
          local="Piracaia - SP"
          members={30}
          name="Centro de Treinamento F. Oliveira"
        />
        <ClubCard
          buttonContent="Conhecer"
          imageUrl="club-logo.svg"
          local="Piracaia - SP"
          members={30}
          name="Centro de Treinamento F. Oliveira"
        />
        <ClubCard
          buttonContent="Conhecer"
          imageUrl="club-logo.svg"
          local="Piracaia - SP"
          members={30}
          name="Centro de Treinamento F. Oliveira"
        />
        <ClubCard
          buttonContent="Conhecer"
          imageUrl="club-logo.svg"
          local="Piracaia - SP"
          members={30}
          name="Centro de Treinamento F. Oliveira"
        />
        <ClubCard
          buttonContent="Conhecer"
          imageUrl="club-logo.svg"
          local="Piracaia - SP"
          members={30}
          name="Centro de Treinamento F. Oliveira"
        />
      </div>
    </div>
  );
}
