"use client";

import AddItemModal from "@/components/add-item-modal";
import MovementsForChoose from "@/components/movements-for-choose";
import Navbar from "@/components/navbar";
import PageTitleWithIcon from "@/components/page-title-with-icon";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Movement, TrainingItem } from "@/interfaces/training";
import AddMovementCard from "@/modules/trainings/add-movement-card";
import FinishingTrainingModal from "@/modules/trainings/finishing-training-modal";
import TrainingsSession from "@/modules/trainings/page-session";
import TrainingItemCard from "@/modules/trainings/training-item-card";
import { Barbell } from "@phosphor-icons/react/dist/ssr";
import { Reorder } from "motion/react";
import Image from "next/image";
import { useState } from "react";

export default function TrainingRegisterForm() {
  const [trainingItems, setTrainingItems] = useState<TrainingItem[]>([]);
  const [description, setDescription] = useState<string>("");
  const [addItemModal, setAddItemModal] = useState({
    movement: {
      id: 0,
      name: "",
      description: "",
      average_time: 0,
      video_url: "",
      image_url: "",
    },
    is_open: false,
  });
  const [finishingTrainingModal, setFinishinTrainingModal] = useState({
    is_open: false,
  });

  function openAddItemModal(movement: Movement) {
    setAddItemModal({
      movement: movement,
      is_open: true,
    });
  }

  function closeAddItemModal() {
    setAddItemModal({
      movement: {
        id: 0,
        name: "",
        description: "",
        average_time: 0,
        video_url: "",
        image_url: "",
      },
      is_open: false,
    });
  }

  const addNewTrainingItem = (data: TrainingItem) => {
    const newItem = {
      ...data,
      queue: trainingItems.length + 1,
    };

    setTrainingItems([...trainingItems, newItem]);
  };

  const removeTrainingItem = (queue: number) => {
    if (trainingItems.length === 1) {
      alert("Um treino precisa ter ao menos um movimento!");
      return;
    }

    let updatedTrainingItems = trainingItems.filter((trainingItem) => {
      return trainingItem.queue !== queue;
    });

    updatedTrainingItems = changeQueue(updatedTrainingItems);

    if (updatedTrainingItems) setTrainingItems(updatedTrainingItems);
  };

  function openFinishinTrainingModal() {
    if (trainingItems.length === 0) {
      alert("É necessário adicionar ao menos um item de treino.");
      return;
    }
    setFinishinTrainingModal({
      is_open: true,
    });
  }

  function closeFinishinTrainingModal() {
    setFinishinTrainingModal({
      is_open: false,
    });
  }

  const onReorder = (newTrainingItemsList: TrainingItem[]) => {
    const updatedTrainingItems = changeQueue(newTrainingItemsList);

    setTrainingItems(updatedTrainingItems);
  };

  const changeQueue = (items: TrainingItem[]) => {
    return items.map((item, index) => ({
      ...item,
      queue: index + 1,
    }));
  };

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-12 mt-5 mb-5 container">
        <div className="flex flex-col gap-3 col-span-7">
          <PageTitleWithIcon icon={Barbell} title="Monte seu treino" />
          <p>
            Ao lado, selecione o movimento desejado e o adicione em seu conjunto
            de movimentos.{" "}
            <span className="text-primary">
              Sinta-se a vontade para alterar a ordem dos movimentos.
            </span>
          </p>
          <TrainingsSession sessionTitle="Seu conjunto de movimentos" />
          {trainingItems.length > 0 ? (
            <ScrollArea className="border-input p-4 border rounded-sm">
              <Reorder.Group
                values={trainingItems}
                onReorder={(newList) => onReorder(newList)}
                className="flex flex-col gap-3 h-max"
              >
                {trainingItems.map((trainingItem) => (
                  <Reorder.Item
                    key={trainingItem.id}
                    value={trainingItem}
                    className="cursor-grab"
                  >
                    <TrainingItemCard
                      image_url={trainingItem.movement.image_url}
                      reps={trainingItem.reps}
                      time={trainingItem.time}
                      name={trainingItem.movement.name}
                      removeItem={() => removeTrainingItem(trainingItem.queue)}
                    />
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </ScrollArea>
          ) : (
            <div className="flex justify-around items-center gap-2 p-3 border border-border rounded">
              <Image
                src="/mascot-sad.svg"
                alt="Sem treinos"
                width={80}
                height={80}
                className="opacity-60 aspect-square"
                unoptimized={true}
              />
              <p className="text-muted-foreground">
                Nenhum
                <br /> movimento
                <br /> adicionado
              </p>
            </div>
          )}
          <Label>Descrição</Label>
          <Textarea
            name="description"
            rows={10}
            placeholder="Descreva sua ideia de treino..."
            onChange={(event) => setDescription(event.target.value)}
          />
          <div className="flex justify-between">
            <Button variant={"outline"}>Cancelar</Button>
            <Button onClick={openFinishinTrainingModal}>Continuar</Button>
          </div>
        </div>

        <Separator
          orientation="vertical"
          className="col-span-1 bg-primary shadow shadow-primary m-auto"
        />

        <MovementsForChoose
          h1Classname="text-3xl font-bold"
          scrollAreaClassname="h-[500px]"
          parentClassname="col-span-4 flex flex-col items-center gap-3"
          movement_card={(move) => {
            return (
              <AddMovementCard
                key={move.id}
                movement={move}
                openAddItemModal={openAddItemModal}
                parentClassname="w-min"
              />
            );
          }}
        />

        {addItemModal.is_open && (
          <AddItemModal
            movement={addItemModal.movement}
            closeAddItemModal={closeAddItemModal}
            addNewItem={addNewTrainingItem}
          />
        )}

        {finishingTrainingModal.is_open && (
          <FinishingTrainingModal
            trainingItems={trainingItems}
            description={description}
            closeFinishinTrainingModal={closeFinishinTrainingModal}
          />
        )}
      </div>
    </>
  );
}
