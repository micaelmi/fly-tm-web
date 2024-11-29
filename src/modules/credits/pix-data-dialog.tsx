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
import { PixResponse } from "@/interfaces/credit";
import { toast } from "react-toastify";

export function PixData({ data }: { data: PixResponse }) {
  function copyCode() {
    navigator.clipboard.writeText(data.pix.qrCode);
    toast.success("Código do Pix copiado para a área de transferência.");
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
