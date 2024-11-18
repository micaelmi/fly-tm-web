import { Button } from "@/components/ui/button";
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

interface ItemDetailsModalProps {
  movement_name: string;
  movement_description: string;
  movement_video_url: string;
}

export default function ItemDetailsModal({
  movement_name,
  movement_description,
  movement_video_url,
}: ItemDetailsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="text-primary underline hover:cursor-pointer">
          Ver detalhes
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{movement_name} - Detalhes do movimento</DialogTitle>
          <DialogDescription>
            <span className="font-semibold">Descrição:</span>{" "}
            {movement_description}
          </DialogDescription>
        </DialogHeader>
        <iframe
          className="w-full aspect-video"
          src="https://www.youtube.com/embed/EBoCkd3kP6U?si=GZ27aG-joqrZRwIs"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
        <DialogFooter>
          <DialogClose>
            <Button type="button">Ok!</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
