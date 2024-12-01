"use client";

import FeaturesCarousel from "@/components/features-carousel";
import Navbar from "@/components/navbar";
import ClubsCarousel from "@/modules/clubs/clubs-carousel";
import ContactButton from "@/modules/contact/contact-button";
import EventsCarousel from "@/modules/events/event-carousel";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const user_name = useSession().data?.payload.name;
  return (
    <>
      <Navbar back={false} />
      <div className="flex flex-col gap-4 my-8 px-2 container">
        <div>
          <h1 className="font-semibold text-3xl">Olá, {user_name}</h1>
          <h3 className="font-semibold text-primary text-xl">
            Qual é o plano de hoje?
          </h3>
        </div>
        <FeaturesCarousel />
        {/* events */}
        <EventsCarousel />
        <div className="flex justify-end mb-4">
          <Link
            href="events/register"
            className="text-lg text-primary underline"
          >
            Criar evento
          </Link>
        </div>
        <ClubsCarousel />
        <div className="flex justify-end mb-4">
          <Link
            href="clubs/register"
            className="text-lg text-primary underline"
          >
            Criar clube
          </Link>
        </div>
        <ContactButton />
      </div>
    </>
  );
}
