import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  useGetTransactionsByUser,
  useVerifyPixPayment,
} from "@/hooks/use-credits";
import { Coins, MinusCircle, PlusCircle } from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function CreditTransactions({ userId }: { userId: string }) {
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const router = useRouter();
  const { data: pix } = useVerifyPixPayment(paymentId ?? undefined);

  const [verifyingId, setVerifyingId] = useState<string | null>("1");

  const verifyPaymentStatus = (id: string) => {
    setVerifyingId(id); // Define o botão atual como "verificando"
    setPaymentId(id);
    setTimeout(() => {
      setVerifyingId("1"); // Reseta o botão após o processo
      router.refresh();
    }, 3000);
  };

  const { data, isLoading, isError, error } = useGetTransactionsByUser(userId);
  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <p className="text-2xl text-red-200">
          Ocorreu um erro: {error.message}
        </p>
      </div>
    );
  if (!data?.creditTransactions.length)
    return (
      <div className="flex justify-center items-center w-full text-center text-xl">
        Você ainda não realizou nenhuma movimentação
      </div>
    );
  return (
    <div className="mb-12">
      <h1 className="mt-2 font-semibold text-2xl text-primary">Histórico</h1>
      <div className="max-h-[40vh]---------overflow-x-auto">
        <Table>
          <TableBody>
            {data?.creditTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="border-secondary p-4">
                <TableCell>
                  <div className="flex justify-center items-center border-primary m-2 p-1 border rounded-full w-10 h-10 text-2xl">
                    {transaction.action === "spend" ? (
                      <MinusCircle weight="fill" className="text-red-500" />
                    ) : (
                      <PlusCircle weight="fill" className="text-green-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="flex flex-col gap-2 font-bold">
                  <div className="text-2xl">{transaction.description}</div>
                  <div className="flex items-center gap-2 text-gray-400 text-xl">
                    <Coins />
                    {transaction.amount}
                  </div>
                </TableCell>
                {transaction.action === "buy" && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant={"outline"}
                        onClick={() =>
                          verifyPaymentStatus(transaction.payment_id)
                        }
                        disabled={verifyingId === transaction.id} // Desativa apenas o botão atual
                      >
                        {verifyingId === transaction.payment_id ? (
                          <p className="flex items-center gap-2">
                            <FaSpinner className="animate-spin" /> Verificando
                          </p>
                        ) : (
                          "Verificar status"
                        )}
                      </Button>
                      <div
                        className={`${transaction.payment_status === "pending" ? "bg-yellow-500 py-2 px-4" : transaction.payment_status === "approved" ? "bg-green-500 py-2 px-4" : "bg-red-500"} rounded-full`}
                      >
                        {transaction.payment_status === "pending"
                          ? "pendente"
                          : transaction.payment_status === "approved"
                            ? "aprovado"
                            : null}
                      </div>
                    </div>
                  </TableCell>
                )}
                <TableCell className="font-semibold text-gray-400 text-xl">
                  {format(transaction.created_at, "dd MMM yyyy", {
                    locale: ptBR,
                  }).toUpperCase()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
