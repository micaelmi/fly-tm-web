import { X } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { FormEvent, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Item } from "@/modules/trainings/training-register-form";
import { convertToSeconds } from "@/lib/utils";

interface AddItemModalProps {
  movement_id: number;
  movement_name: string;
  movement_image_url: string;
  movement_average_time: number;
  closeAddItemModal: () => void;
  addNewItem: (data: Item) => void;
}

export default function AddItemModal({
  movement_id,
  movement_name,
  movement_image_url,
  movement_average_time,
  closeAddItemModal,
  addNewItem,
}: AddItemModalProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedOption === "") {
      setError("Selecione uma opção.");
      return;
    }

    const data = new FormData(event.currentTarget);

    if (data.get("counting_mode") === "reps") {
      if (data.get("reps") === "") {
        setError("Defina o número de repetições.");
        return;
      }
    }

    if (data.get("counting_mode") === "time") {
      if (data.get("timeHH") === "") {
        setError("Defina o campo de horas.");
        return;
      } else if (data.get("timeMM") === "") {
        setError("Defina o campo de minutos.");
        return;
      } else if (data.get("timeSS") === "") {
        setError("Defina o campo de segundos.");
        return;
      }
    }

    setError("");

    const time = convertToSeconds(
      Number(data.get("timeHH")),
      Number(data.get("timeMM")),
      Number(data.get("timeSS"))
    );

    const item = {
      counting_mode: data.get("counting_mode")?.toString() as "reps" | "time",
      reps: Number(data.get("reps")),
      time: time,
      queue: 0,
      comments: data.get("comments")?.toString() ?? "",
      movement_id: movement_id,
      movement_average_time: movement_average_time,
      image_url: movement_image_url ?? "",
      name: movement_name,
    };

    addNewItem(item);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/60">
      <div className="flex flex-col gap-2 bg-zinc-900 px-6 py-5 rounded w-[640px]">
        <div className="flex justify-between items-center">
          <h2 className="font-lg font-semibold">Adicionar movimento</h2>
          <button>
            <X className="text-zinc-400 size-5" onClick={closeAddItemModal} />
          </button>
        </div>
        <div className="bg-zinc-800 w-full h-px" />
        {movement_name}
        <div className="flex items-center gap-3">
          <Image
            src={movement_image_url}
            alt="Imagem do movimento"
            width={120}
            height={120}
            className="border-white p-3 border rounded aspect-square"
            unoptimized={true}
          />
          <form className="flex flex-col flex-1 gap-3" onSubmit={onSubmit}>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label>Contabilizar movimento por:</Label>
                  <Select
                    name="counting_mode"
                    onValueChange={setSelectedOption}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="reps">Repetições</SelectItem>
                        <SelectItem value="time">Tempo</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className={selectedOption !== "reps" ? "hidden" : ""}>
                  <Label>Número de repetições</Label>
                  <Input name="reps" type="number" />
                </div>
                <div className={selectedOption !== "time" ? "hidden" : "w-min"}>
                  <Label className="truncate">
                    Executar durante (hh:mm:ss):
                  </Label>
                  <div className="flex items-center">
                    <Input name="timeHH" type="number" />
                    :
                    <Input name="timeMM" type="number" />
                    :
                    <Input name="timeSS" type="number" />
                  </div>
                </div>
              </div>

              {selectedOption ? (
                <div className="">
                  <Label>Algum comentário? (Opcional)</Label>
                  <Input
                    name="comments"
                    type="text"
                    placeholder="Para observações que considerar importante sobre o movimento"
                  ></Input>
                </div>
              ) : null}
            </div>
            <Button type="submit">Adicionar</Button>
            {error ? (
              <span className="text-destructive text-sm">{error}</span>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
