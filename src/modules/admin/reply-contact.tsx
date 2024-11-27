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
import { Button, buttonVariants } from "@/components/ui/button";
import { useReplyContact } from "@/hooks/use-contacts";
import {
  ArrowBendDoubleUpLeft,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import * as z from "zod";
import TextareaDefault from "@/components/form/textarea-default";
import { Contact } from "@/interfaces/contact";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

const FormSchema = z.object({
  answer: z.string().min(4, { message: "Mínimo 3 letras." }),
});
export function ReplyContact({
  contactId,
  data,
  userView = false,
}: {
  contactId: string;
  data: Contact;
  userView?: boolean;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      answer: "",
    },
  });

  const router = useRouter();

  const { mutate, isPending, isError, error } = useReplyContact();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    mutate(
      {
        contactId,
        data: { answer: data.answer },
      },
      {
        onSuccess: () => {
          toast.success("Sua resposta foi enviada!");
          setTimeout(() => {
            router.refresh();
          }, 3000);
        },
      }
    );
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="p-1 text-2xl aspect-square"
          title={
            data.status === "active" && !userView ? "Responder" : "Detalhes"
          }
        >
          {data.status === "active" && !userView ? (
            <ArrowBendDoubleUpLeft />
          ) : (
            <MagnifyingGlass />
          )}
        </Button>
      </AlertDialogTrigger>
      {data.status === "active" && !userView ? (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Responder ao contato de{" "}
              <i className="text-primary">{data.user.name}</i>
            </AlertDialogTitle>
            <AlertDialogDescription>
              A responsta será enviada por e-mail para o usuário.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-3 w-full"
            >
              <div>
                <p>Mensagem:</p>
                <p className="max-h-25 text-justify text-white/50 overflow-y-auto">
                  {data.description}
                </p>
              </div>
              <TextareaDefault
                control={form.control}
                label="Resposta"
                placeholder="Digite sua resposta ao contato"
                name="answer"
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <FaSpinner className="mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar"
                  )}
                </Button>
              </AlertDialogFooter>
              {isError && (
                <div className="p-2 border border-red-500 rounded-md w-full text-center text-red-500 text-sm">
                  {error.message}
                </div>
              )}
            </form>
          </Form>
        </AlertDialogContent>
      ) : (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userView ? "Detalhes do contato" : "Contato já respondido"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Veja os detalhes do contato.
            </AlertDialogDescription>
            <div className="flex flex-col gap-2 text-justify">
              <p className="font-semibold text-primary">
                {format(data.created_at, "dd/MM/yyyy")} -{" "}
                {data.contact_type.description}
              </p>
              <h3>
                <span className="font-semibold text-primary">Título:</span>{" "}
                {data.title}
              </h3>
              <p>
                <span className="font-semibold text-primary">Mensagem:</span>{" "}
                {data.description}
              </p>
              <Separator />
              <p className="font-semibold text-primary">
                {format(data.updated_at, "dd/MM/yyyy")}
              </p>
              <p>
                <span className="font-semibold text-primary">Resposta:</span>{" "}
                {data.answer ? data.answer : "A ser respondido"}
              </p>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className={buttonVariants({ variant: "default" })}
            >
              OK
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
