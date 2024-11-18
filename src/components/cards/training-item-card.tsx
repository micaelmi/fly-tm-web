import { TrashSimple } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Item } from "@/modules/trainings/training-register-form";
import { formatTime } from "@/lib/utils";

interface TrainingItemCardProps extends Partial<Item> {
  removeItem: () => void;
}

export default function TrainingItemCard({
  image_url = "",
  reps,
  time,
  name,
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
        <h1 className="font-semibold text-ellipsis whitespace-nowrap">
          {name}
        </h1>
        <p>{reps ? reps + "x" : time && formatTime(time)}</p>
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
