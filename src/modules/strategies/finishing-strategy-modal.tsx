import DefaultCombobox from "@/components/form/combobox-default";
import InputDefault from "@/components/form/input-default";
import InputImage from "@/components/form/input-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Flag, X } from "@phosphor-icons/react/dist/ssr";
import { Dispatch, SetStateAction, useState } from "react";
import { useFormContext } from "react-hook-form";

interface FinishingStrategyModalProps {
  isOpen: boolean;
  closeFinishingStrategyModal: (open: boolean) => void;
}

export default function FinishingStrategyModal({
  isOpen,
  closeFinishingStrategyModal,
}: FinishingStrategyModalProps) {
  const [levels, setLevels] = useState([
    {
      value: 1,
      label: "Iniciante",
    },
    {
      value: 2,
      label: "Intermediário",
    },
    {
      value: 3,
      label: "Avançado",
    },
  ]);
  const [visibilityTypes, setVisibilityTypes] = useState([
    {
      value: 1,
      label: "Público",
    },
    {
      value: 2,
      label: "Privado",
    },
  ]);

  const form = useFormContext();

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center bg-background/60">
        <div className="flex flex-col border-white bg-modal p-2 border rounded-md">
          <X
            onClick={() => closeFinishingStrategyModal(false)}
            className="text-white hover:cursor-pointer self-end"
          />

          <div className="flex items-center gap-2">
            <Flag className="text-primary" />
            <DefaultCombobox
              control={form.control}
              name="level_id"
              object={levels}
              searchLabel="Buscar nível..."
              selectLabel="Selecione o nível de complexidade"
              onSelect={(value: number) => {
                form.setValue("level_id", value);
              }}
            />
          </div>
          <DefaultCombobox
            control={form.control}
            name="visibility_type_id"
            object={visibilityTypes}
            searchLabel="Buscar..."
            selectLabel="Visibilidade da estratégia"
            onSelect={(value: number) => {
              form.setValue("visibility_type_id", value);
            }}
          />
          <InputImage name="icon_file" />
          <Button type="submit">Criar</Button>
        </div>
      </div>
    )
    // <Dialog open={isOpen} onOpenChange={closeFinishingStrategyModal}>
    //   <DialogContent className="sm:max-w-[425px]">
    //     <DialogHeader className="hidden">
    //       <DialogTitle>Edit profile</DialogTitle>
    //       <DialogDescription>
    //         Make changes to your profile here. Click save when you're done.
    //       </DialogDescription>
    //     </DialogHeader>
    //     <div>
    //       <div className="flex items-center gap-2">
    //         <Flag className="text-primary" />
    //         <DefaultCombobox
    //           control={form.control}
    //           name={name}
    //           object={levels}
    //           searchLabel="Buscar nível..."
    //           selectLabel="Selecione o nível de complexidade"
    //           onSelect={(value: number) => {
    //             form.setValue(name, value);
    //           }}
    //         />
    //       </div>
    //     </div>
    //     <DialogFooter>
    //       <Button type="submit">Save changes</Button>
    //     </DialogFooter>
    //   </DialogContent>
    // </Dialog>
  );
}
