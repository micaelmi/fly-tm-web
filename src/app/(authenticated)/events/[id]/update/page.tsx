"use client";
import Loading from "@/app/loading";
import { useGetEvent } from "@/hooks/use-events";
import EventUpdateForm from "@/modules/events/event-update-form";
import { useParams } from "next/navigation";

export default function UpdateEvent() {
  const eventId = useParams().id;
  const { data, isLoading, error } = useGetEvent(eventId as string);

  if (isLoading || !data) return <Loading />;
  if (error) return <p>Erro ao carregar dados do evento: {error.message}</p>;

  return <EventUpdateForm eventData={data.event} />;
}
