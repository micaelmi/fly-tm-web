"use client";

import { useQuery } from "@tanstack/react-query";
import Search from "./search";
import { ScrollArea } from "./ui/scroll-area";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { Movement } from "@/interfaces/training";
import AddMovementCard from "@/modules/trainings/add-movement-card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MovementsForChooseProps {
  parentClassname?: string;
  h1Classname?: string;
  scrollAreaClassname?: string;
  movement_card: (movement: Movement) => ReactNode;
}

export default function MovementsForChoose({
  parentClassname,
  h1Classname,
  scrollAreaClassname,
  movement_card,
}: MovementsForChooseProps) {
  const session = useSession().data;
  const token = session?.token.user.token;

  const movementsData = useQuery({
    queryKey: ["movementsData"],
    queryFn: async () => {
      return await api.get("/movements", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    enabled: !!token,
  });

  const movementsForChoose = movementsData.data?.data.movements;

  return (
    <div className={cn(parentClassname)}>
      <h1 className={cn(h1Classname)}>Movimentos</h1>
      <Search pagination={false} placeholder="Procurar..." className="" />
      <ScrollArea
        className={cn("flex justify-center w-full", scrollAreaClassname)}
      >
        <div className="space-y-3 mx-auto w-4/5">
          {movementsForChoose?.length ? (
            movementsForChoose.map((movement: Movement) =>
              movement_card(movement)
            )
          ) : (
            <p>Nenhum movimento cadastrado</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
