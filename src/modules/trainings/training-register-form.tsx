"use client";

import AddItemModal from "@/components/add-item-modal";
import AddMovementCard from "@/modules/trainings/add-movement-card";
import TrainingItemCard from "@/modules/trainings/training-item-card";
import Navbar from "@/components/navbar";
import PageTitleWithIcon from "@/components/page-title-with-icon";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import FinishingTrainingModal from "@/modules/trainings/finishing-training-modal";
import TrainingsSession from "@/modules/trainings/page-session";
import { Barbell } from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import update from "immutability-helper";
import { motion, Reorder } from "motion/react";
import { Movement, TrainingItem } from "@/interfaces/training";

export default function TrainingRegisterForm() {
  const session = useSession();
  const token = session.data?.token.user.token;

  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [trainingItems, setTrainingItems] = useState<TrainingItem[]>([]);
  const [description, setDescription] = useState<string>("");
  const [addItemModal, setAddItemModal] = useState({
    movement_id: 0,
    movement_name: "",
    movement_image_url: "",
    movement_average_time: 0,
    is_open: false,
  });
  const [finishingTrainingModal, setFinishinTrainingModal] = useState({
    is_open: false,
  });

  const movementsData = useQuery({
    queryKey: ["movementsData"],
    queryFn: async () => {
      return await api.get("/movements", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    enabled: !!token,
  });

  const movementsForChoose = movementsData.data?.data.movements;

  function openAddItemModal(
    movement_id: number,
    movement_name: string,
    movement_image_url: string,
    movement_average_time: number
  ) {
    setAddItemModal({
      movement_id: movement_id,
      movement_name: movement_name,
      movement_image_url: movement_image_url,
      movement_average_time: movement_average_time,
      is_open: true,
    });
  }

  function closeAddItemModal() {
    setAddItemModal({
      movement_id: 0,
      movement_name: "",
      movement_image_url: "",
      movement_average_time: 0,
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

  const changeTime = (items: TrainingItem[]) => {
    let time = 0;

    items.forEach((item) => {
      if (item.movement.average_time) {
        if (item.reps) {
          time += item.reps * item.movement.average_time;
        } else if (item.time) {
          time += item.time;
        }
      }
    });

    setEstimatedTime(time);
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
      <div className="flex gap-20 mt-5 mb-5 h-screen container">
        <div className="flex flex-col gap-3">
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

        <Separator orientation="vertical" className="bg-primary" />

        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-3xl">Movimentos</h1>
          <Search pagination={false} placeholder="Procurar..." />
          <div className="flex flex-col gap-3 overflow-y-auto">
            {movementsForChoose?.length ? (
              movementsForChoose.map((movement: Movement) => {
                return (
                  <AddMovementCard
                    key={movement.id}
                    movement_id={movement.id}
                    movement_image_url={movement.image_url}
                    movement_name={movement.name}
                    movement_average_time={movement.average_time}
                    openAddItemModal={openAddItemModal}
                    parentClassname="w-min"
                  />
                );
              })
            ) : (
              <p>Nenhum movimento cadastrado</p>
            )}
          </div>
        </div>

        {addItemModal.is_open && (
          <AddItemModal
            movement_id={addItemModal.movement_id}
            movement_name={addItemModal.movement_name}
            movement_image_url={addItemModal.movement_image_url}
            movement_average_time={addItemModal.movement_average_time}
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
