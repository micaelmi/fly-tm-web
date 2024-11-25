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
import { useDeleteEvent } from "@/hooks/use-events";
import { useRouter } from "next/navigation";

export function DeleteEvent({ eventId }: { eventId: string }) {
  const { mutate: deleteEvent } = useDeleteEvent();
  const router = useRouter();
  function handleDeleteEvent() {
    deleteEvent(eventId);
    router.refresh();
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Excluir Evento</Button>
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
          <AlertDialogAction onClick={handleDeleteEvent}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
