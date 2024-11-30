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
import { initMercadoPago } from "@mercadopago/sdk-react";
import { PlusCircle } from "@phosphor-icons/react/dist/ssr";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { priceTable } from "./price-table";
import { useCreatePixPayment } from "@/hooks/use-credits";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { PixResponse } from "@/interfaces/credit";
import { FaSpinner } from "react-icons/fa";
import { PixData } from "./pix-data-dialog";

export function BuyCredits({ userId }: { userId: string }) {
  const [credits, setCredits] = useState("250");
  const [reais, setReais] = useState("");

  const [pix, setPix] = useState<PixResponse>();

  useEffect(() => {
    const exchanged = priceTable.find(
      (price) => price.credits === Number(credits)
    );
    setReais(exchanged ? exchanged.reais.toString() : "0");
  }, [credits]);

  const key = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || "";
  initMercadoPago(key);

  const { mutate, isPending } = useCreatePixPayment();

  function handleCreatePixPayment() {
    mutate(
      {
        amount: Number(reais),
        description: "Compra de créditos",
        user_id: userId,
      },
      {
        onSuccess: async (pix) => {
          console.log(pix.data);
          setPix(pix.data);
          toast.success("Código gerado com sucesso!");
          setCredits("250");
        },
        onError: () => {
          toast.error(
            "Não foi possível gerar seu código de pagamento, tente novamente ou contate o suporte."
          );
        },
      }
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="flex justify-center items-center gap-2 border-primary hover:bg-blue-950 p-4 border rounded-full font-semibold text-2xl transition-colors">
          <PlusCircle weight="fill" size={48} className="text-primary" />
          Comprar Créditos
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Quantos créditos você quer comprar?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Selecione uma das opções abaixo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-between items-center">
          <RadioGroup
            defaultValue="option-one"
            value={credits}
            onValueChange={setCredits}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="250" id="option-one" />
              <Label htmlFor="option-one">250</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="500" id="option-two" />
              <Label htmlFor="option-two">500</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1000" id="option-three" />
              <Label htmlFor="option-three">1000</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2000" id="option-four" />
              <Label htmlFor="option-four">2000</Label>
            </div>
          </RadioGroup>
          <div className="flex flex-col">
            <p className="text-gray-400 text-lg">Valor a pagar:</p>
            <span className="font-bold text-5xl text-green-400">R${reais}</span>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button onClick={handleCreatePixPayment} disabled={isPending}>
            {isPending ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                Gerando código...
              </>
            ) : (
              "Gerar código pix"
            )}
          </Button>
          {pix && <PixData data={pix} />}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
