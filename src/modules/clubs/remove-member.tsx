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
import { SignOut, Trash } from "@phosphor-icons/react/dist/ssr";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function RemoveMember({
  clubId,
  userId,
  isOwner,
}: {
  clubId: string;
  userId: string;
  isOwner: boolean;
}) {
  const { mutate: removeMember } = useRemoveMemberFromClub();
  const queryClient = useQueryClient();
  const router = useRouter();
  function handleRemoveMember() {
    removeMember({ clubId, userId });
    queryClient.invalidateQueries({
      queryKey: ["club", clubId], // Defina explicitamente como uma QueryKey
    });
    if (!isOwner) {
      router.push("/home");
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{isOwner ? <Trash /> : <SignOut />}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isOwner ? "Remover usuário do clube?" : "Sair do clube?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isOwner
              ? "Ao remover este usuário, ele não terá mais acesso aos benefícios do seu clube."
              : "Apenas o proprietário poderá te adicionar novamente"}
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
