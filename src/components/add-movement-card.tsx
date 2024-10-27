import { Question } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { FormEvent, useState } from "react";
import AddMovementModal from "./add-movement-modal";

interface AddMovementCardProps {
  name: string;
  imageUrl: string;
  addNewMovement: (event: FormEvent<HTMLFormElement>) => void;
}

export default function AddMovementCard({
  name,
  imageUrl,
  addNewMovement,
}: AddMovementCardProps) {
  const [isMovementModalOpen, setIsMovementModalOpen] =
    useState<boolean>(false);

  function openAddMovementModal() {
    setIsMovementModalOpen(true);
  }

  function closeAddMovementModal() {
    setIsMovementModalOpen(false);
  }

  return (
    <div className="flex flex-col justify-center items-center gap-3 border-primary p-3 border rounded">
      <div className="flex items-center gap-5">
        <h1 className="w-32 truncate">{name}</h1>
        <Question size={20} />
      </div>
      <Image
        src={imageUrl}
        alt="imagem do movimento"
        width={80}
        height={80}
        className="aspect-square"
      />
      <button
        type="button"
        className="flex items-center gap-2 text-primary"
        onClick={openAddMovementModal}
      >
        <p className="text-sm">Adicionar</p>
      </button>

      {isMovementModalOpen && (
        <AddMovementModal
          closeAddMovementModal={closeAddMovementModal}
          addNewMovement={addNewMovement}
        />
      )}
    </div>
  );
}
