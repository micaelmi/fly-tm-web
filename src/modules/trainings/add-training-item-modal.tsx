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
import { TrainingItem } from "@/interfaces/training";

interface Movement {
  id: number;
  name: string;
  description: string;
  average_time: number;
  video_url: string;
  image_url: string;
}

interface AddTrainingItemModalProps {
  movementsForChoose: Movement[];
  addNewTrainingItem: (data: TrainingItem) => void;
}

export default function AddTrainingItemModal({
  movementsForChoose,
  addNewTrainingItem,
}: AddTrainingItemModalProps) {
  const [modalOpenState, setModalOpenState] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState("");
  const [addTrainingItemForm, setTrainingItemForm] = useState({
    movement_id: 0,
    movement_name: "",
    movement_image_url: "",
    movement_average_time: 0,
    is_open: false,
  });

  const openAddTrainingItemForm = (
    movement_id: number,
    movement_name: string,
    movement_image_url: string,
    movement_average_time: number
  ) => {
    setTrainingItemForm({
      movement_id: movement_id,
      movement_name: movement_name,
      movement_image_url: movement_image_url,
      movement_average_time: movement_average_time,
      is_open: true,
    });
  };

  const closeAddTrainingItemModal = () => {
    setTrainingItemForm({
      movement_id: 0,
      movement_name: "",
      movement_image_url: "",
      movement_average_time: 0,
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
      id: generateId(),
      counting_mode: data.get("counting_mode")?.toString() as "reps" | "time",
      reps: Number(data.get("reps")),
      time: time,
      queue: 0,
      comments: data.get("comments")?.toString() ?? "",
      movement: {
        id: addTrainingItemForm.movement_id,
        average_time: addTrainingItemForm.movement_average_time,
        image_url: addTrainingItemForm.movement_image_url ?? "",
        name: addTrainingItemForm.movement_name,
      },
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
                  {addTrainingItemForm.movement_name}
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
                <Input name="timeHH" type="number" />
                :
                <Input name="timeMM" type="number" />
                :
                <Input name="timeSS" type="number" />
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
          <div className="flex flex-col gap-3">
            <h1 className="font-semibold text-lg">Movimentos</h1>
            <Search pagination={false} placeholder="Procurar..." />
            <ScrollArea className="border-muted p-3 border rounded-lg w-full max-h-52">
              <div className="flex flex-col items-center gap-3">
                {movementsForChoose?.length ? (
                  movementsForChoose.map((movement: Movement) => {
                    return (
                      <AddMovementCard
                        key={movement.id}
                        movement_id={movement.id}
                        movement_image_url={movement.image_url}
                        movement_name={movement.name}
                        movement_average_time={movement.average_time}
                        parentClassname="w-48"
                        openAddItemModal={openAddTrainingItemForm}
                      />
                    );
                  })
                ) : (
                  <p>Nenhum movimento cadastrado</p>
                )}
              </div>
            </ScrollArea>
          </div>
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
