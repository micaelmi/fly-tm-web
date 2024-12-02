"use client";
import Loading from "@/app/loading";
import { useGetEvent } from "@/hooks/use-events";
import EventUpdateForm from "@/modules/events/event-update-form";
import { useParams } from "next/navigation";

export default function UpdateEvent() {
  return <EventUpdateForm />;
}
