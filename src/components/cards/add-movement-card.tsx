import { Question } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

interface AddMovementCardProps {
  movement_id: number;
  movement_name: string;
  movement_image_url: string;
  movement_average_time: number;
  openAddItemModal: (
    movement_id: number,
    movement_name: string,
    movement_image_url: string,
    movement_average_time: number
  ) => void;
}

export default function AddMovementCard({
  movement_id,
  movement_name,
  movement_image_url,
  movement_average_time,
  openAddItemModal,
}: AddMovementCardProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-3 border-primary p-3 border rounded">
      <div className="flex items-center gap-5">
        <h1 className="w-32 truncate">{movement_name}</h1>
        <Question size={20} />
      </div>
      <Image
        src={movement_image_url}
        alt="imagem do movimento"
        width={80}
        height={80}
        className="aspect-square"
        priority
        unoptimized={true}
      />
      <button
        type="button"
        className="flex items-center gap-2 text-primary"
        onClick={() =>
          openAddItemModal(
            movement_id,
            movement_name,
            movement_image_url,
            movement_average_time
          )
        }
      >
        <p className="text-sm">Adicionar</p>
      </button>
    </div>
  );
}
