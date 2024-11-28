import { cn } from "@/lib/utils";
import { Question } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

interface AddMovementCardProps {
  movement_id: number;
  movement_name: string;
  movement_image_url: string;
  movement_average_time: number;
  parentClassname?: string;
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
  parentClassname,
  openAddItemModal,
}: AddMovementCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-3 border-primary p-3 border rounded",
        parentClassname
      )}
    >
      <div className="flex justify-between items-center w-full">
        <h1 className="w-32 truncate">{movement_name}</h1>
        <Question size={20} />
      </div>
      <Image
        src={movement_image_url}
        alt="imagem do movimento"
        width={0}
        height={0}
        className="w-full h-full aspect-square"
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
