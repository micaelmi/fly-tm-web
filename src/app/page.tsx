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
import Image from "next/image";

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <section className="py-10 container">
        <div className="flex justify-between items-center">
          <Carousel
            opts={{
              loop: true,
            }}
            className="flex items-center w-96 h-64"
          >
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="flex justify-center items-center w-full">
                    <Card className="w-5/6 h-full">
                      <CardContent className="flex-1 p-0">
                        <Image
                          src={"landing.svg"}
                          alt="Imagem jogador"
                          width={0}
                          height={0}
                          className="w-full"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-gradient-to-l from-primary to-transparent opacity-70 border-none rounded-sm w-14 h-3/4" />
            <CarouselNext className="bg-gradient-to-r from-primary to-transparent opacity-70 border-none rounded-sm w-14 h-3/4" />
          </Carousel>
          <h1 className="font-semibold text-4xl">
            Decole no tênis
            <br />
            de mesa com o<br />
            <span className="text-primary">Fly TM</span>
          </h1>
        </div>
      </section>
    </>
  );
}
