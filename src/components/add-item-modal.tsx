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
import { convertToSeconds, createUniqueIdGenerator } from "@/lib/utils";
import { Movement, TrainingItem } from "@/interfaces/training";

interface AddItemModalProps {
  movement: Movement;
  closeAddItemModal: () => void;
  addNewItem: (data: TrainingItem) => void;
}

export default function AddItemModal({
  movement,
  closeAddItemModal,
  addNewItem,
}: AddItemModalProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState("");

  const generateId = createUniqueIdGenerator(1, 100000);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
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
      if (
        (data.get("timeHH") === "" || data.get("timeHH") === "0") &&
        (data.get("timeMM") === "" || data.get("timeMM") === "0") &&
        (data.get("timeSS") === "" || data.get("timeSS") === "0")
      ) {
        setError("Defina uma duração");
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
      id: generateId(),
      counting_mode: data.get("counting_mode")?.toString() as "reps" | "time",
      reps: Number(data.get("reps")),
      time: time,
      queue: 0,
      comments: data.get("comments")?.toString() ?? "",
      movement: movement,
    };

    addNewItem(item);
    closeAddItemModal();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/60">
      <div className="flex flex-col gap-2 border-white bg-zinc-900 px-6 py-5 border rounded w-[640px]">
        <div className="flex justify-between items-center">
          <h2 className="font-lg font-semibold">Adicionar movimento</h2>
          <button>
            <X className="text-zinc-400 size-5" onClick={closeAddItemModal} />
          </button>
        </div>
        <div className="bg-zinc-800 w-full h-px" />
        {movement.name}
        <div className="flex items-center gap-3">
          <Image
            src={movement.image_url}
            alt="Imagem do movimento"
            width={120}
            height={120}
            className="rounded aspect-square"
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
                  <Input name="reps" type="number" min={1} />
                </div>
                <div className={selectedOption !== "time" ? "hidden" : "w-min"}>
                  <Label className="truncate">
                    Executar durante (hh:mm:ss):
                  </Label>
                  <div className="flex items-center">
                    <Input name="timeHH" type="number" min={0} />
                    :
                    <Input name="timeMM" type="number" min={0} />
                    :
                    <Input name="timeSS" type="number" min={0} />
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
