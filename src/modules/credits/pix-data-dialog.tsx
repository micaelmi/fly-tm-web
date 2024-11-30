import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useManageCredits } from "@/hooks/use-credits";
import { PixResponse } from "@/interfaces/credit";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { priceTable } from "./price-table";

export function PixData({ data }: { data: PixResponse }) {
  function copyCode() {
    navigator.clipboard.writeText(data.pix.qrCode);
    toast.success("Código do Pix copiado para a área de transferência.");
  }
  const { mutate } = useManageCredits();
  const userId = useSession().data?.payload.sub;
  const router = useRouter();

  function handlePaymentCompleted() {
    if (userId) {
      const exchanged = priceTable.find(
        (price) => price.reais === Number(data.pix.amount)
      );
      mutate(
        {
          action: "buy",
          amount: exchanged?.credits || 0,
          description: "Compra de créditos",
          user_id: userId,
        },
        {
          onSuccess() {
            toast.success("Pagamento efetuado com sucesso!");
            router.refresh();
          },
        }
      );
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Ver QR Code</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Seu QR Code</AlertDialogTitle>
          <AlertDialogDescription>
            Aponte a câmera para este código para realizar o pix.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col justify-center items-center gap-2">
          <img
            src={`data:image/png;base64,${data.pix.qrCodeBase64}`}
            alt="QR Code"
            className="h-w-60 w-60 object-contain"
          />
          <Button variant={"outline"} onClick={copyCode}>
            Copiar código
          </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
          <Button onClick={handlePaymentCompleted}>
            Efetuei meu pagamento
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
