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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContactsData } from "@/hooks/use-contacts";
import { format } from "date-fns";
import { DeleteContact } from "../contact/delete-contact";
import { ReplyContact } from "./reply-contact";

export default function ContactList() {
  const { data, isLoading, isError, error } = useContactsData();
  if (isLoading) return <Loading />;
  return (
    <div>
      <h1 className="font-semibold text-2xl text-primary">Contatos</h1>
      <div className="max-h-[60vh] overflow-x-auto">
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
                <TableCell className="flex justify-center items-center gap-2 h-full">
                  <ReplyContact contactId={contact.id} data={contact} />
                  <DeleteContact contactId={contact.id} />
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
