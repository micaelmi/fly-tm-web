import { Question, TrashSimple } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useState } from "react";
import AddMovementModal from "../add-item-modal";
import { Item } from "@/modules/trainings/training-register-form";

interface TrainingItemCardProps extends Item {
  removeItem: () => void;
}

export default function TrainingItemCard({
  movement_id,
  image_url,
  comments,
  counting_mode,
  queue,
  reps,
  time,
  removeItem,
}: TrainingItemCardProps) {
  return (
    <div className="flex gap-3 border-primary p-3 border rounded">
      <Image
        src={image_url}
        alt="imagem do movimento"
        width={80}
        height={80}
        className="aspect-square"
      />
      <div className="flex flex-col justify-between">
        <h1 className="text-ellipsis whitespace-nowrap">{movement_id}</h1>
        <p>Comentários: {comments}</p>
        <p>Contagem por: {counting_mode}</p>
        <p>Lugar na fila: {queue}</p>
        <p>Repetições: {reps}</p>
        <p>Tempo: {time}</p>
        <button
          onClick={removeItem}
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
