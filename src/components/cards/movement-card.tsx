import { Question, TrashSimple } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useState } from "react";
import AddMovementModal from "../add-movement-modal";

interface MovementCardProps {
  id: string;
  imageUrl: string;
  name: string;
  duration: string;
  removeMovement: () => void;
}

export default function MovementCard({
  id,
  duration,
  imageUrl,
  name,
  removeMovement,
}: MovementCardProps) {
  return (
    <div className="flex gap-3 border-primary p-3 border rounded">
      <Image
        src={imageUrl}
        alt="imagem do movimento"
        width={80}
        height={80}
        className="aspect-square"
      />
      <div className="flex flex-col justify-between">
        <h1 className="text-ellipsis whitespace-nowrap">{name}</h1>
        <p>{duration}</p>
        <button
          onClick={removeMovement}
          type="button"
          className="flex items-center gap-2 text-primary"
        >
          <TrashSimple />
          <p className="text-sm">Remover</p>
        </button>
      </div>
    </div>
  );
}
