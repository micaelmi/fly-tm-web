"use client";

import { useQuery } from "@tanstack/react-query";
import Search from "./search";
import { ScrollArea } from "./ui/scroll-area";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { Movement } from "@/interfaces/training";
import AddMovementCard from "@/modules/trainings/add-movement-card";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Input } from "./ui/input";
import { MovementsResponse } from "@/interfaces/movement";

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
  const [searchTerm, setSearchTerm] = useState("");

  const movementsData = useQuery({
    queryKey: ["movementsData"],
    queryFn: async () => {
      return await api.get<MovementsResponse>("/movements", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    enabled: !!token,
  });

  const movementsForChoose = movementsData.data?.data.movements;

  const filteredMovements = movementsForChoose?.filter((movement) =>
    movement.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn(parentClassname)}>
      <h1 className={cn(h1Classname)}>Movimentos</h1>
      <div className="flex items-center gap-2">
        <MagnifyingGlass size={35} />
        <Input
          type="search"
          placeholder="Buscar movimento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>
      <ScrollArea
        className={cn("flex justify-center w-full", scrollAreaClassname)}
      >
        <div className="space-y-3 mx-auto w-4/5">
          {filteredMovements?.length ? (
            filteredMovements.map((movement: Movement) =>
              movement_card(movement)
            )
          ) : (
            <p className="text-center">Nenhum movimento encontrado</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
