import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTraining } from "@/hooks/use-trainings";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { UseMutationResult } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteTrainingOrStrategy({
  type,
  id,
  useFunction,
}: {
  type: "trainings" | "strategies" | "home";
  id: string;
  useFunction: () => UseMutationResult<any, Error, string, unknown>;
}) {
  const { mutate } = useFunction();
  const router = useRouter();
  function handleDelete() {
    mutate(id);
    router.push(`/${type}`);
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex items-center gap-2 border-muted hover:border-destructive p-2 border rounded-full text-muted hover:text-destructive transition-all hover:cursor-pointer">
          <Trash />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza disso?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
