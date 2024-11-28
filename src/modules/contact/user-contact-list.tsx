"use client";
import Loading from "@/app/loading";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetContactsByUser } from "@/hooks/use-contacts";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteContact } from "./delete-contact";
import { ReplyContact } from "../admin/reply-contact";

export default function UserContactList() {
  const userId = useParams().userId;
  const ownerId = useSession().data?.payload.sub;
  const router = useRouter();
  const { data, isLoading, isError } = useGetContactsByUser(userId as string);

  if (userId !== ownerId)
    return (
      <div className="flex flex-col justify-center items-center gap-4 mt-8 w-full">
        <p className="text-2xl">Você não tem acesso a esta página</p>
        <Button onClick={() => router.push("/home")}>Voltar</Button>
      </div>
    );

  if (isLoading) return <Loading />;
  if (isError) return <p>Ocorreu um erro ao carregar seus contatos</p>;
  return (
    <div className="container">
      <div className="flex justify-between items-end">
        <h1 className="mt-4 font-semibold text-3xl text-primary">
          Meus contatos
        </h1>
        <Link
          href="/contacts/register"
          className="text-lg text-primary underline"
        >
          Criar contato
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-4 mt-4">
        <Table className="border-secondary mt-2 border">
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  {format(contact.created_at, "dd/MM/yyyy")}
                </TableCell>
                <TableCell>{contact.contact_type.description}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="max-w-[20ch] text-ellipsis whitespace-nowrap overflow-hidden">
                          {contact.title}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="border-primary p-4 max-w-[300px] font-semibold text-base break-words">
                        <p>{contact.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="max-w-[30ch] text-ellipsis whitespace-nowrap overflow-hidden">
                          {contact.description}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="border-primary p-4 max-w-[300px] font-semibold text-base break-words">
                        <p>{contact.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  {contact.status === "active" ? (
                    <p className="text-red-500">Não respondido</p>
                  ) : (
                    <p className="text-green-500">Respondido</p>
                  )}
                </TableCell>
                <TableCell>{contact.user.username}</TableCell>
                <TableCell className="flex gap-2 h-full">
                  <ReplyContact
                    contactId={contact.id}
                    data={contact}
                    userView={true}
                  />
                  {contact.status === "active" && (
                    <DeleteContact contactId={contact.id} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>Total: {data?.contacts.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
