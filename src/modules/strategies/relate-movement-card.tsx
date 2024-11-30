import { StrategyItem } from "@/interfaces/strategy";
import { Movement } from "@/interfaces/training";
import { Question, X } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import RelateMovementModal from "./relate-movement-modal";

interface RelateMovementCardProps {
  strategyItems: StrategyItem[];
  movement: Movement;
  addNewStrategyItem: (movement: Movement, description: string) => void;
}

export default function RelateMovementCard({
  strategyItems,
  movement,
  addNewStrategyItem,
}: RelateMovementCardProps) {
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const choosed = strategyItems.some((strategyItem) => {
    return strategyItem.movement.id === movement.id;
  });

  return (
    <div className="flex flex-col gap-2 border-primary p-2 border rounded-lg">
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
      {choosed ? (
        <p className="bg-secondary text-center">Já relacionado</p>
      ) : (
        <RelateMovementModal
          movement={movement}
          addNewStrategyItem={addNewStrategyItem}
        />
      )}
    </div>
  );
}
