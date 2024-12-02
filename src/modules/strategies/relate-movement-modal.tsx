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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Movement } from "@/interfaces/training";
import { useState } from "react";

interface RelateMovementModalProps {
  movement: Movement;
  addNewStrategyItem: (movement: Movement, description: string) => void;
}

export default function RelateMovementModal({
  movement,
  addNewStrategyItem,
}: RelateMovementModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [description, setDescription] = useState<string>("");

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(true)}
          className="text-primary"
        >
          Relacionar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{movement.name}</DialogTitle>
          <p className="line-clamp-3 text-justify text-muted-foreground text-sm">
            {movement.description}
          </p>
          <br />
          <DialogDescription>
            Abaixo, descreva como o movimento selecionado se relaciona com sua
            estratégia.
          </DialogDescription>
        </DialogHeader>
        <Label>Descrição</Label>
        <Textarea
          value={description}
          rows={5}
          className="resize-none"
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          onKeyUp={() => {
            if (description.length > 500) {
              setError("Máximo de 500 caracteres para a descrição.");
              return;
            }
            if (description === "") {
              setError("Descreva a relação do seu movimento com a estraégia.");
              return;
            }
            setError("");
          }}
        />
        <DialogFooter>
          <div className="space-y-2 w-full">
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={() => {
                  setDescription("");
                  setIsOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (description === "") {
                    setError(
                      "Descreva a relação do seu movimento com a estraégia."
                    );
                    return;
                  }
                  if (description.length > 500) {
                    setError("Máximo de 500 caracteres para a descrição.");
                    return;
                  }
                  setError("");
                  addNewStrategyItem(movement, description);
                  setIsOpen(false);
                }}
              >
                Relacionar
              </Button>
            </div>
            {error ? (
              <p className="border-destructive p-1 border rounded-lg text-destructive text-sm">
                {error}
              </p>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
