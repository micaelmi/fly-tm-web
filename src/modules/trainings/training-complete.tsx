import { Button } from "@/components/ui/button";
import { Fire, Star } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

interface TrainingCompleteProps {
  trainingDays: number;
}

const TrainingComplete: React.FC<TrainingCompleteProps> = ({
  trainingDays,
}) => {
  const [displayedDays, setDisplayedDays] = useState<number>(trainingDays - 1);

  useEffect(() => {
    // Atualiza o número exibido após um atraso
    const timeout = setTimeout(() => {
      setDisplayedDays(trainingDays);
    }, 1000); // 1 segundo de atraso para a transição

    return () => clearTimeout(timeout); // Limpa o timeout para evitar problemas de memória
  }, [trainingDays]);

  return (
    <div className="flex flex-col justify-center items-center gap-10 mt-10">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={500}
        gravity={0.1}
        colors={["#3B82F6", "#FFFFFF", "#C1272D", "#2CADC5", "#E0D4CA"]}
        recycle={false}
      />
      <h1 className="font-bold text-4xl">Parabéns, mandou ver!</h1>
      <div className="flex items-center gap-4 text-xl">
        <Star weight="fill" className="text-primary animate-pulse" />
        <p>Treino finalizado!</p>
        <Star weight="fill" className="text-primary animate-pulse" />
      </div>
      <div className="flex flex-col items-center gap-2 text-yellow-400">
        <div className="flex items-center gap-3 text-7xl">
          <Fire weight="fill" />
          <AnimatePresence mode="wait">
            <motion.div
              key={displayedDays} // Garante uma nova animação quando `displayedDays` muda
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="font-semibold"
            >
              {displayedDays}
            </motion.div>
          </AnimatePresence>
        </div>
        <h1>Total de treinos</h1>
      </div>
      <Link href={"/trainings"}>
        <Button>Voltar para a lista de treinos</Button>
      </Link>
    </div>
  );
};

export default TrainingComplete;
