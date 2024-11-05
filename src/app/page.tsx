"use client";

import BackButton from "@/components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link, User } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <>
      <nav className="flex items-center gap-5 border-white bg-navbar px-6 border-b-[1px] h-20">
        <BackButton />
        <div className="flex flex-1 justify-between">
          <div className="flex items-center gap-3 font-semibold text-3xl">
            <Image src={"/logo.svg"} alt="Logo Fly TM" width={40} height={40} />
            Fly TM
          </div>
          <div className="flex items-center gap-5">
            <Link href={"/login"}>
              <div className="flex gap-2 hover:opacity-80 font-semibold transition-all">
                <User className="text-primary" />
                FAZER LOGIN
              </div>
            </Link>
            <Link href={"/register"}>
              <div className="border-primary hover:opacity-80 p-2 border rounded font-semibold transition-all">
                CADASTRE-SE
              </div>
            </Link>
          </div>
        </div>
      </nav>
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
