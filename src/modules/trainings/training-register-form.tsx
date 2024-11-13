"use client";

import AddItemModal from "@/components/add-item-modal";
import AddMovementCard from "@/components/cards/add-movement-card";
import TrainingItemCard from "@/components/cards/training-item-card";
import ItemCard from "@/components/cards/training-item-card";
import MovementCard from "@/components/cards/training-item-card";
import FinishingTrainingModal from "@/modules/trainings/finishing-training-modal";
import Navbar from "@/components/navbar";
import PageTitleWithIcon from "@/components/page-title-with-icon";
import Search from "@/components/search";
import TrainingsSession from "@/modules/trainings/trainings-session";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";
import { Barbell } from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import { UUID } from "crypto";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FormEvent, useState } from "react";

export interface Item {
  counting_mode: "reps" | "time";
  reps: number;
  time: number;
  queue: number;
  comments: string;
  movement_id: number;
  image_url: string;
}

interface Movement {
  id: number;
  name: string;
  description: string;
  average_time: number;
  video_url: string;
  image_url: string;
}

export default function TrainingRegisterForm() {
  const session = useSession();
  const token = session.data?.token.user.token;

  const [items, setItems] = useState<Item[]>([]);
  const [addItemModal, setAddItemModal] = useState({
    movement_id: 0,
    movement_name: "",
    movement_image_url: "",
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
    movement_image_url: string
  ) {
    setAddItemModal({
      movement_id: movement_id,
      movement_name: movement_name,
      movement_image_url: movement_image_url,
      is_open: true,
    });
  }

  function closeAddItemModal() {
    setAddItemModal({
      movement_id: 0,
      movement_name: "",
      movement_image_url: "",
      is_open: false,
    });
  }

  function removeItem(idToRemove: number) {
    const newItemsList = items.filter((item) => item.movement_id != idToRemove);
    setItems(newItemsList);
  }

  function addNewItem(data: Item) {
    const newItem = {
      ...data,
      queue: items.length + 1,
    };

    setItems([...items, newItem]);
    setAddItemModal({ ...addItemModal, is_open: false });
  }

  function openFinishinTrainingModal() {
    setFinishinTrainingModal({
      is_open: true,
    });
  }

  function closeFinishinTrainingModal() {
    setFinishinTrainingModal({
      is_open: false,
    });
  }

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
          <div className="flex flex-col gap-3 overflow-y-auto">
            {items.length > 0 ? (
              items.map((item) => {
                return (
                  <TrainingItemCard
                    key={item.movement_id + crypto.randomUUID()}
                    movement_id={item.movement_id}
                    image_url={item.image_url}
                    reps={item.reps}
                    time={item.time}
                    counting_mode={item.counting_mode}
                    comments={item.comments}
                    queue={item.queue}
                    removeItem={() => removeItem(item.movement_id)}
                  />
                );
              })
            ) : (
              <div className="flex justify-around items-center gap-2 p-3 border border-border rounded">
                <Image
                  src="/mascot-sad.svg"
                  alt="Sem treinos"
                  width={80}
                  height={80}
                  className="opacity-60 aspect-square"
                />
                <p className="text-muted-foreground">
                  Nenhum
                  <br /> movimento
                  <br /> adicionado
                </p>
              </div>
            )}
          </div>
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
                    openAddItemModal={openAddItemModal}
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
            closeAddItemModal={closeAddItemModal}
            addNewItem={addNewItem}
          />
        )}

        {finishingTrainingModal.is_open && (
          <FinishingTrainingModal
            items={items}
            closeFinishinTrainingModal={closeFinishinTrainingModal}
          />
        )}
      </div>
    </>
  );
}
