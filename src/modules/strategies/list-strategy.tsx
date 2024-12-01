"use client";

import Loading from "@/app/loading";
import Navbar from "@/components/navbar";
import { useDeleteStrategy, useStrategyById } from "@/hooks/use-strategies";
import { Flag, Pencil } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DeleteTrainingOrStrategy } from "../trainings/delete-training-or-strategy";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import ItemDetailsModal from "../trainings/item-details-modal";
import { Separator } from "@/components/ui/separator";
import ShareButton from "@/components/share-button";
import { Button } from "@/components/ui/button";

export default function ListStrategy() {
  const session = useSession();

  const username = session.data?.payload.username;

  const params = useParams();
  const strategy_id = params.strategy_id.toLocaleString();

  const { data, isLoading, isError } = useStrategyById(strategy_id);

  isLoading && <Loading />;
  isError && <p>Ocorreu um erro ao carregar os dados da estratégia</p>;

  const strategy = data?.strategy;

  if (!strategy) return;

  const own_strategy = username === strategy.user.username;

  return (
    <>
      <Navbar />
      <div className={`w-full h-40`}>
        <img
          src={strategy.icon_url}
          alt="Ícone da estratégia"
          className="w-full max-h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-10 mt-5 mb-5 container">
        {/* level, title, time, by */}
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-lg text-primary leading-4">
              <Flag />
              {strategy.level.title}
            </div>
            {own_strategy ? (
              <div className="flex gap-2">
                <Link
                  href={`/strategies/${strategy.id}/edit`}
                  className="border-muted hover:border-muted-foreground p-2 border rounded-full text-muted hover:text-muted-foreground transition-all hover:cursor-pointer"
                >
                  <Pencil />
                </Link>
                <DeleteTrainingOrStrategy
                  type="strategies"
                  id={strategy_id}
                  useFunction={useDeleteStrategy}
                />
              </div>
            ) : null}
          </div>
          <h1 className="text-3xl">{strategy.title}</h1>
          <p className="text-primary">
            Por:{" "}
            <Link
              href={`/users/${strategy.user.username}`}
              target="_blank"
              className="hover:underline"
            >
              {strategy.user.username}
            </Link>
          </p>
        </div>
        <div className="gap-10 grid grid-cols-11">
          {/* movements */}
          <div className="col-span-5 w-96">
            {strategy.strategy_items.length > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Movimentos relacionados</p>
                  <p className="font-semibold text-primary">
                    Total: {strategy.strategy_items.length}
                  </p>
                </div>
                <ScrollArea>
                  <div className="space-y-3">
                    {strategy.strategy_items.map((strategyItem) => {
                      return (
                        <div
                          key={strategyItem.movement.name}
                          className="flex gap-3 border-primary shadow shadow-primary p-2 border rounded-lg"
                        >
                          <Image
                            src={strategyItem.movement.image_url}
                            alt="Imagem do movimento"
                            width={100}
                            height={100}
                            className="rounded-lg aspect-square"
                            unoptimized
                            priority
                          />
                          <div className="flex flex-col justify-between">
                            <p className="font-semibold">
                              {strategyItem.movement.name}
                            </p>
                            <ItemDetailsModal
                              strategy_description={strategyItem.description}
                              movement_name={strategyItem.movement.name}
                              movement_description={
                                strategyItem.movement.description
                              }
                              movement_video_url={
                                strategyItem.movement.video_url
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex justify-around items-center gap-2 p-3 border border-border rounded-lg">
                <Image
                  src="/mascot-sad.svg"
                  alt="Sem treinos"
                  width={80}
                  height={80}
                  className="opacity-60 aspect-square"
                  unoptimized={true}
                />
                <p className="text-muted-foreground">
                  Nenhum
                  <br /> movimento
                  <br /> relacionado
                </p>
              </div>
            )}
          </div>
          <Separator
            orientation="vertical"
            className="col-span-1 bg-primary shadow-md shadow-primary"
          />
          {/* description, start, options: {share, report} */}
          <div className="flex flex-col gap-5 col-span-5">
            <div>
              <h2 className="font-semibold">Contra quem?</h2>
              <p>{strategy.against_whom}</p>
            </div>
            <div>
              <h2 className="font-semibold">Como funciona?</h2>
              <p>{strategy.how_it_works}</p>
            </div>
            <div>
              <div className="flex flex-col gap-3 mt-5">
                <p className="font-semibold">Opções</p>
                <ShareButton
                  link={
                    process.env.NEXT_PUBLIC_FRONTEND_BASE_URL +
                    "/strategies/" +
                    strategy.id
                  }
                />
                <Button variant={"destructive"}>Denunciar</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
