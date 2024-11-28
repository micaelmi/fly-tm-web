import { Button } from "@/components/ui/button";
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
    <>
      <div
        key={movement_id}
        className="flex flex-col gap-2 border-primary p-2 border rounded-lg"
      >
        <div className="flex justify-between items-center font-semibold">
          {movement_name}
          <Question size={21} />
        </div>
        <Image
          src={movement_image_url}
          className="w-full"
          width={100}
          height={100}
          alt="Imagem do movimento"
          priority
        />
        <Button
          variant="ghost"
          type="button"
          onClick={() =>
            openAddItemModal(
              movement_id,
              movement_name,
              movement_image_url,
              movement_average_time
            )
          }
          className="text-primary"
        >
          Adicionar
        </Button>
      </div>
    </>
  );
}
