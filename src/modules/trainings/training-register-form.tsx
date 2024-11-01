"use client";

import AddMovementModal from "@/components/add-movement-modal";
import AddMovementCard from "@/components/cards/add-movement-card";
import MovementCard from "@/components/cards/movement-card";
import PageTitleWithIcon from "@/components/page-title-with-icon";
import Search from "@/components/search";
import TrainingsSession from "@/components/trainings-session";
import { Button } from "@/components/ui/button";
import { Barbell } from "@phosphor-icons/react/dist/ssr";
import { UUID } from "crypto";
import Image from "next/image";
import { FormEvent, useState } from "react";

interface Move {
  id: string;
  url: string;
  name: string;
  duration: string;
}

export default function TrainingRegisterForm() {
  const [moves, setMoves] = useState<Move[]>([]);
  const [addMovementModal, setAddMovementModal] = useState({
    movementName: "",
    movementImageUrl: "",
    isOpen: false,
  });

  const movesForChoose = [
    {
      id: "1",
      url: "/mascot-hitting.svg",
      name: "Drive de forehandssssssssssssssss",
      duration: "12x",
    },
    {
      id: "2",
      url: "/mascot-hitting.svg",
      name: "Drive de forehand",
      duration: "12x",
    },
    {
      id: "3",
      url: "/mascot-hitting.svg",
      name: "Drive de forehand",
      duration: "12x",
    },
    {
      id: "4",
      url: "/mascot-hitting.svg",
      name: "Drive de forehand",
      duration: "12x",
    },
    {
      id: "5",
      url: "/mascot-hitting.svg",
      name: "Drive de forehand",
      duration: "12x",
    },
    {
      id: "6",
      url: "/mascot-hitting.svg",
      name: "Drive de forehand",
      duration: "12x",
    },
  ];

  function openAddMovementModal(
    movementName: string,
    movementImageUrl: string
  ) {
    setAddMovementModal({
      movementName: movementName,
      movementImageUrl: movementImageUrl,
      isOpen: true,
    });
  }

  function closeAddMovementModal() {
    setAddMovementModal({
      movementName: "",
      movementImageUrl: "",
      isOpen: false,
    });
  }

  function removeMovement(idToRemove: string) {
    const newMovesList = moves.filter((move) => move.id != idToRemove);
    setMoves(newMovesList);
  }

  function addNewMovement(data: FormData) {
    const isMovementAlreadyOnList = moves.some(
      (move) => move.name === data.get("movementName")
    );

    if (isMovementAlreadyOnList) {
      alert(
        "O movimento escolhido já está incluido na lista de movimentos do treino!"
      );
      return;
    }

    const newMovement = {
      id: crypto.randomUUID(),
      url: data.get("movementImageUrl")?.toString() ?? "",
      name: data.get("movementName")?.toString() ?? "",
      duration: data.get("reps")
        ? `${data.get("reps")}x`
        : `${data.get("time")}s`,
    };

    setMoves([...moves, newMovement]);
    setAddMovementModal({ ...addMovementModal, isOpen: false });
  }

  return (
    <div className="flex gap-20 h-screen">
      <div className="flex flex-col gap-3">
        <PageTitleWithIcon icon={Barbell} title="Monte seu treino" />
        <p>
          Ao lado, selecione o movimento desejado e o adicione em seu conjunto
          de movimentos.{" "}
          <span className="text-primary">
            Sinta-se a vontade para alterar a ordem dos movimentos.
          </span>
        </p>
        <TrainingsSession sessionTitle="Seu conjunto de movimentos" />
        <div className="flex flex-col gap-3 overflow-y-auto">
          {moves.length > 0 ? (
            moves.map((move) => {
              return (
                <MovementCard
                  key={move.id}
                  id={move.id}
                  imageUrl={move.url}
                  duration={move.duration}
                  name={move.name}
                  removeMovement={() => removeMovement(move.id)}
                />
              );
            })
          ) : (
            <div className="flex justify-around items-center gap-2 p-3 border border-border rounded">
              <Image
                src="/mascot-sad.svg"
                alt="Sem treinos"
                width={80}
                height={80}
                className="opacity-60 aspect-square"
              />
              <p className="text-muted-foreground">
                Nenhum
                <br /> movimento
                <br /> adicionado
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <Button variant={"outline"}>Cancelar</Button>
          <Button>Continuar</Button>
        </div>
      </div>

      <div className="bg-primary w-px h-screen" />

      <div className="flex flex-col gap-3">
        <h1 className="font-bold text-3xl">Movimentos</h1>
        <Search pagination={false} placeholder="Procurar..." />
        <div className="flex flex-col gap-3 overflow-y-auto">
          {movesForChoose.map((move) => {
            return (
              <AddMovementCard
                key={move.id}
                movementImageUrl={move.url}
                movementName={move.name}
                openAddMovementModal={openAddMovementModal}
              />
            );
          })}
        </div>
      </div>

      {addMovementModal.isOpen && (
        <AddMovementModal
          movementName={addMovementModal.movementName}
          movementImageUrl={addMovementModal.movementImageUrl}
          closeAddMovementModal={closeAddMovementModal}
          addNewMovement={addNewMovement}
        />
      )}
    </div>
  );
}
