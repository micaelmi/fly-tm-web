import { Question } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

interface AddMovementCardProps {
  movementName: string;
  movementImageUrl: string;
  openAddMovementModal: (
    movementName: string,
    movementImageUrl: string
  ) => void;
}

export default function AddMovementCard({
  movementName,
  movementImageUrl,
  openAddMovementModal,
}: AddMovementCardProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-3 border-primary p-3 border rounded">
      <div className="flex items-center gap-5">
        <h1 className="w-32 truncate">{movementName}</h1>
        <Question size={20} />
      </div>
      <Image
        src={movementImageUrl}
        alt="imagem do movimento"
        width={80}
        height={80}
        className="aspect-square"
      />
      <button
        type="button"
        className="flex items-center gap-2 text-primary"
        onClick={() => openAddMovementModal(movementName, movementImageUrl)}
      >
        <p className="text-sm">Adicionar</p>
      </button>
    </div>
  );
}
