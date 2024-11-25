"use client";
import Loading from "@/app/loading";
import { useGetEventsByUser } from "@/hooks/use-events";
import { useParams, useRouter } from "next/navigation";
import EventCard from "./event-card";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserEventList() {
  const userId = useParams().userId;
  const ownerId = useSession().data?.payload.sub;
  const router = useRouter();
  const { data, isLoading, isError } = useGetEventsByUser(userId as string);

  if (userId !== ownerId)
    return (
      <div className="flex flex-col justify-center items-center gap-4 mt-8 w-full">
        <p className="text-2xl">Você não tem acesso a esta página</p>
        <Button onClick={() => router.push("/home")}>Voltar</Button>
      </div>
    );

  if (isLoading) return <Loading />;
  if (isError) return <p>Ocorreu um erro ao carregar seus eventos</p>;
  return (
    <div className="container">
      <div className="flex justify-between items-center">
        <h1 className="mt-4 font-semibold text-3xl text-primary">
          Meus eventos
        </h1>
        <Link
          href="/events/register"
          className="text-lg text-primary underline"
        >
          Criar evento
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-4 mt-4">
        {data?.events.map((event) => (
          <div className="w-[32%]" key={event.id}>
            <EventCard
              data={event}
              date={format(event.start_date, "dd/MM/yyyy")}
              level={event.level.title}
              title={event.name}
              local={event.city + " - " + event.state}
              adminView={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
