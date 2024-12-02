import { Button } from "@/components/ui/button";
import { Movement } from "@/interfaces/training";
import { Question, X } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

interface AddMovementCardProps {
  movement: Movement;
  parentClassname?: string;
  openAddItemModal: (movement: Movement) => void;
}

export default function AddMovementCard({
  movement,
  parentClassname,
  openAddItemModal,
}: AddMovementCardProps) {
  const [showHelp, setShowHelp] = useState<boolean>(false);

  return (
    <>
      <div
        key={movement.id}
        className="flex flex-col gap-2 border-primary p-2 border rounded-lg"
      >
        <div className="flex justify-between items-center font-semibold">
          {movement.name}
          {showHelp ? (
            <X
              size={21}
              onClick={() => setShowHelp(false)}
              className="hover:text-zinc-400 transition-all hover:cursor-pointer"
            />
          ) : (
            <Question
              size={21}
              onClick={() => setShowHelp(true)}
              className="hover:text-zinc-400 transition-all hover:cursor-pointer"
            />
          )}
        </div>
        <div className="relative">
          <AnimatePresence mode="wait">
            {showHelp ? (
              <motion.p
                key="description"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-justify"
              >
                {movement.description}
              </motion.p>
            ) : (
              <motion.div
                key="image"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <Image
                  src={movement.image_url}
                  className="w-full"
                  width={100}
                  height={100}
                  alt="Imagem do movimento"
                  priority
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button
          variant="ghost"
          type="button"
          onClick={() => openAddItemModal(movement)}
          className="text-primary"
        >
          Adicionar
        </Button>
      </div>
    </>
  );
}
