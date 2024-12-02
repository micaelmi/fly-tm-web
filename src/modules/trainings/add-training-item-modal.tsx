import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import AddMovementCard from "./add-movement-card";
import { FormEvent, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { convertToSeconds, createUniqueIdGenerator } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Movement, TrainingItem } from "@/interfaces/training";
import MovementsForChoose from "@/components/movements-for-choose";

interface AddTrainingItemModalProps {
  addNewTrainingItem: (data: TrainingItem) => void;
}

export default function AddTrainingItemModal({
  addNewTrainingItem,
}: AddTrainingItemModalProps) {
  const [modalOpenState, setModalOpenState] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState("");
  const [addTrainingItemForm, setTrainingItemForm] = useState({
    movement: {
      id: 0,
      average_time: 0,
      description: "",
      image_url: "",
      name: "",
      video_url: "",
    },
    is_open: false,
  });

  const openAddTrainingItemForm = (movement: Movement) => {
    setTrainingItemForm({
      movement: movement,
      is_open: true,
    });
  };

  const closeAddTrainingItemModal = () => {
    setTrainingItemForm({
      movement: {
        id: 0,
        average_time: 0,
        description: "",
        image_url: "",
        name: "",
        video_url: "",
      },
      is_open: false,
    });
    setSelectedOption("");
    setModalOpenState(false);
  };

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
      movement: addTrainingItemForm.movement,
    };

    closeAddTrainingItemModal();
    addNewTrainingItem(item);
  };

  return (
    <Dialog open={modalOpenState}>
      <DialogTrigger asChild onClick={() => setModalOpenState(true)}>
        <button
          type="button"
          className="bg-primary hover:bg-primary/90 shadow px-2 rounded-lg text-primary-foreground cursor-pointer"
        >
          + Adicionar
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {addTrainingItemForm.is_open
              ? "Movimento selecionado"
              : "Escolha um movimento"}
          </DialogTitle>
          <DialogDescription>
            {addTrainingItemForm.is_open ? (
              <span>
                Você selecionou a opção{" "}
                <span className="font-bold">
                  {addTrainingItemForm.movement.name}
                </span>
                <br />
                <br />
                Abaixo defina como será contabilizada a execução do movimento
                (tempo ou repetições).
              </span>
            ) : (
              "Adicione um novo movimento ao seu treino e deixe-o ainda mais massa!"
            )}
          </DialogDescription>
        </DialogHeader>
        {addTrainingItemForm.is_open ? (
          <form onSubmit={onSubmit} className="space-y-2">
            <div>
              <Label>Contabilizar movimento por:</Label>
              <Select name="counting_mode" onValueChange={setSelectedOption}>
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
              <Label className="truncate">Executar durante (hh:mm:ss):</Label>
              <div className="flex items-center">
                <Input name="timeHH" type="number" min={0} />
                :
                <Input name="timeMM" type="number" min={0} />
                :
                <Input name="timeSS" type="number" min={0} />
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

            <Button type="submit" className="w-full">
              Adicionar
            </Button>
            {error ? (
              <span className="text-destructive text-sm">{error}</span>
            ) : null}
          </form>
        ) : (
          <MovementsForChoose
            h1Classname="text-xl font-bold"
            scrollAreaClassname="h-[300px]"
            parentClassname="flex flex-col items-center gap-3"
            movement_card={(move) => {
              return (
                <AddMovementCard
                  key={move.id}
                  movement={move}
                  openAddItemModal={openAddTrainingItemForm}
                  parentClassname="w-min"
                />
              );
            }}
          />
        )}
        <DialogFooter className="block">
          <p
            onClick={closeAddTrainingItemModal}
            className="hover:border-destructive border border-red-400 rounded-lg text-center text-red-400 hover:text-destructive transition-all duration-200 cursor-pointer"
          >
            Cancelar
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
