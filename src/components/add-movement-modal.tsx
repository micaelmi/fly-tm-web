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

interface AddMovementModalProps {
  movementName: string;
  movementImageUrl: string;
  closeAddMovementModal: () => void;
  addNewMovement: (data: FormData) => void;
}

export default function AddMovementModal({
  movementName,
  movementImageUrl,
  closeAddMovementModal,
  addNewMovement,
}: AddMovementModalProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/60">
      <div className="flex flex-col gap-2 bg-zinc-900 px-6 py-5 rounded w-[640px]">
        <div className="flex justify-between items-center">
          <h2 className="font-lg font-semibold">Adicionar movimento</h2>
          <button>
            <X
              className="text-zinc-400 size-5"
              onClick={closeAddMovementModal}
            />
          </button>
        </div>
        <div className="bg-zinc-800 w-full h-px" />
        {movementName}
        <div className="flex items-center gap-3">
          <Image
            src={movementImageUrl}
            alt="Imagem do movimento"
            width={120}
            height={120}
            className="border-white p-3 border rounded aspect-square"
          />
          <form
            className="flex flex-col flex-1 gap-3"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              if (selectedOption === "") {
                setError("Selecione uma opção.");
                return;
              }

              const data = new FormData(event.currentTarget);

              if (data.get("countOption") === "reps") {
                if (data.get("reps") === "") {
                  setError("Defina o número de repetições.");
                  return;
                }
              }

              if (data.get("time") === "") {
                setError("Defina a duração do movimento.");
                return;
              }

              setError("");
              data.append("movementName", movementName);
              data.append("movementImageUrl", movementImageUrl);
              addNewMovement(data);
            }}
          >
            <div className="flex gap-3">
              <div className="flex-1">
                <Label>Contabilizar movimento por:</Label>
                <Select name="countOption" onValueChange={setSelectedOption}>
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
              {selectedOption ? (
                selectedOption === "reps" ? (
                  <div>
                    <Label>Número de repetições</Label>
                    <Input name="reps" type="number" />
                  </div>
                ) : (
                  <div>
                    <Label>Execurar durante (segundos):</Label>
                    <Input name="time" type="number" />
                  </div>
                )
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
