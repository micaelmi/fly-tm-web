import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ItemDetailsModalProps {
  movement_name: string;
  movement_description: string;
  movement_video_url: string;
  strategy_description?: string;
}

export default function ItemDetailsModal({
  movement_name,
  movement_description,
  movement_video_url,
  strategy_description,
}: ItemDetailsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="text-primary underline hover:cursor-pointer">
          Ver detalhes
        </p>
      </DialogTrigger>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>{movement_name} - Detalhes do movimento</DialogTitle>
          <DialogDescription>
            <span className="font-semibold">Descrição do movimento:</span>{" "}
            {movement_description}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="account" className="mx-auto w-full h-72">
          <TabsList className="w-full">
            <TabsTrigger value="video">Vídeo explicativo</TabsTrigger>
            {strategy_description ? (
              <TabsTrigger value="strategy">
                Estratégia do movimento
              </TabsTrigger>
            ) : null}
          </TabsList>
          <TabsContent value="video">
            <iframe
              className="w-full aspect-video"
              src={movement_video_url}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </TabsContent>
          {strategy_description ? (
            <TabsContent value="strategy">
              <ScrollArea className="bg-modal p-2 pr-6 rounded-lg w-[450px] h-64 text-justify break-words">
                {strategy_description}
              </ScrollArea>
            </TabsContent>
          ) : null}
        </Tabs>
        <DialogFooter>
          <DialogClose>
            <p className="text-primary underline hover:cursor-pointer">Ok!</p>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
