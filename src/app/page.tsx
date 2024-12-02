"use client";
import { LandingNavbar } from "@/components/landing-navbar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import ContactButton from "@/modules/contact/contact-button";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function LandingPage() {
  const tableTennisImages = [
    "./unsplash-1.jpg",
    "./unsplash-2.jpg",
    "./pexels-3.jpg",
  ];

  const clubsAndEventsImages = ["./landing-clubs.png", "./landing-events.png"];

  return (
    <>
      <LandingNavbar />
      <section className="relative mt-5 mb-5 container">
        {/* blue balls */}
        <div className="absolute inset-0 bg-primary/50 mt-72 rounded-full w-28 h-28 animate-pulse" />
        <div className="top-64 right-10 absolute bg-primary/50 rounded-full w-44 h-44 animate-pulse" />
        <div className="top-40 right-0 absolute bg-primary/50 mr-0 rounded-full w-36 h-36 animate-pulse" />

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 h-[250px]">
            <div className="bg-gradient-to-l from-carousel-shadow rounded-lg w-28 h-4/5">
              &nbsp;
            </div>
            <Carousel
              className="w-[400px]"
              opts={{
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
            >
              <CarouselContent className="rounded-lg">
                {tableTennisImages.map((src) => (
                  <CarouselItem key={src}>
                    <Image
                      src={src}
                      alt="imagem do carrosel"
                      width={0}
                      height={0}
                      className="rounded-lg w-full aspect-video"
                      priority
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="bg-gradient-to-r from-carousel-shadow rounded-lg w-28 h-4/5">
              &nbsp;
            </div>
          </div>
          <h1 className="font-semibold text-4xl">
            Decole no tênis de mesa com o{" "}
            <span className="text-primary">Fly TM</span>
          </h1>
        </div>
        <Separator className="relative z-50 bg-white mx-auto mt-20 w-11/12" />
        <div className="flex gap-20 mt-16">
          <div className="flex flex-col gap-4 mt-5">
            <h2 className="font-semibold text-3xl">
              Encontre aqui as ferramentas
              <br /> perfeitas para turbinar o seu jogo.
            </h2>
            <div className="flex gap-3">
              <div className="flex flex-col items-center hover:opacity-80 font-semibold text-lg text-primary transition-all">
                <Image
                  className="bg-primary p-4 rounded-xl w-44 aspect-square"
                  src="./mascot-serve.svg"
                  width={135}
                  height={135}
                  alt={"Treinamentos"}
                  priority
                />
                Treinamentos
              </div>
              <div className="flex flex-col items-center hover:opacity-80 font-semibold text-lg text-primary transition-all">
                <Image
                  className="bg-primary p-4 rounded-xl w-44 aspect-square"
                  src="./mascot-strategy.svg"
                  width={135}
                  height={135}
                  alt={"Treinamentos"}
                  priority
                />
                Estratégias
              </div>
              <div className="flex flex-col items-center hover:opacity-80 font-semibold text-lg text-primary transition-all">
                <Image
                  className="bg-primary p-4 rounded-xl w-44 aspect-square"
                  src="./mascot-scoreboard.svg"
                  width={135}
                  height={135}
                  alt={"Treinamentos"}
                  priority
                />
                Placar
              </div>
            </div>
          </div>
          <Image
            src="./mascot-landing-page.svg"
            alt="Mascote com bolinhas"
            width={0}
            height={0}
            className="relative z-50 w-72"
          />
        </div>

        <Carousel
          className="border-primary shadow shadow-primary mt-20 border rounded-lg"
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
        >
          <CarouselContent className="rounded-lg">
            {clubsAndEventsImages.map((src) => (
              <CarouselItem key={src} className="rounded-lg">
                <Image
                  src={src}
                  alt="imagem do carrosel"
                  width={0}
                  height={0}
                  className="rounded-lg w-full"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <ContactButton />
      </section>
    </>
  );
}
