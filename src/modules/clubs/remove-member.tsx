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
import { useRemoveMemberFromClub } from "@/hooks/use-clubs";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { useQueryClient } from "@tanstack/react-query";

export function RemoveMember({
  clubId,
  userId,
}: {
  clubId: string;
  userId: string;
}) {
  const { mutate: removeMember } = useRemoveMemberFromClub();
  const queryClient = useQueryClient();
  function handleRemoveMember() {
    removeMember({ clubId, userId });
    queryClient.invalidateQueries({
      queryKey: ["club", clubId], // Defina explicitamente como uma QueryKey
    });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover usuário do clube?</AlertDialogTitle>
          <AlertDialogDescription>
            Ao remover este usuário, ele não terá mais acesso aos benefícios do
            seu clube.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemoveMember}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
