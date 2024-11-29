import Loading from "@/app/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetTransactionsByUser } from "@/hooks/use-credits";
import { format } from "date-fns";
import { ReplyContact } from "../admin/reply-contact";
import { DeleteContact } from "../contact/delete-contact";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { Coins, MinusCircle, PlusCircle } from "@phosphor-icons/react/dist/ssr";
import { ptBR } from "date-fns/locale";

export default function CreditTransactions({ userId }: { userId: string }) {
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
