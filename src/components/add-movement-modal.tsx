import { Plus, X } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { FormEvent, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";

interface AddMovementModalProps {
  closeAddMovementModal: () => void;
  addNewMovement: (event: FormEvent<HTMLFormElement>) => void;
  //   emailsToInvite: string[];
  //   removeEmailFromInvites: (email: string) => void;
}

export default function AddMovementModal({
  closeAddMovementModal,
  addNewMovement,
}: AddMovementModalProps) {
  const [selectedOption, setSelectedOption] = useState("");

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
        Drive de Forehand
        <div className="flex items-center gap-3">
          <Image
            src={"/mascot-hitting.svg"}
            alt="Imagem do movimento"
            width={90}
            height={90}
            className="aspect-square"
          />
          <form
            className="flex flex-col flex-1 gap-3"
            onSubmit={addNewMovement}
          >
            <div className="flex gap-3">
              <div className="flex-1">
                <Label>Contabilizar movimento por:</Label>
                <Select onValueChange={setSelectedOption}>
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
                    <Input type="number" />
                  </div>
                ) : (
                  <div>
                    <Label>Execurar durante:</Label>
                    <Input type="text" />
                  </div>
                )
              ) : null}
            </div>
            <Button>Adicionar</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
