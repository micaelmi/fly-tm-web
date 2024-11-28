import DefaultCombobox from "@/components/form/combobox-default";
import InputDefault from "@/components/form/input-default";
import InputImage from "@/components/form/input-image";
import InputImageWithPreview from "@/components/form/input-image-with-preview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLevelsData, useVisibilityTypesData } from "@/hooks/use-auxiliaries";
import { ComboboxItem, ComboboxOption } from "@/interfaces/level";
import { Flag, X } from "@phosphor-icons/react/dist/ssr";
import { Dispatch, SetStateAction, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";

interface FinishingStrategyModalProps {
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isOpen: boolean;
  closeFinishingStrategyModal: () => void;
}

export default function FinishingStrategyModal({
  isPending,
  isError,
  error,
  isOpen,
  closeFinishingStrategyModal,
}: FinishingStrategyModalProps) {
  const levelsData = useLevelsData().data?.levels ?? [];

  const visibilityTypesData =
    useVisibilityTypesData().data?.visibilityTypes ?? [];

  const levels: ComboboxItem[] = levelsData
    .map((level: ComboboxOption) => ({
      value: level.id,
      label: level.title,
    }))
    .filter((level: ComboboxItem) => level.label !== "Livre");

  const visibilityTypes: ComboboxItem[] = visibilityTypesData.map(
    (visibilityType: Partial<ComboboxOption>) => ({
      value: visibilityType.id,
      label: visibilityType.description,
    })
  );

  const form = useFormContext();

  return (
    isOpen && (
      <>
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-background/60">
          <div className="space-y-2 border-white bg-modal px-8 py-4 border rounded-lg">
            <div className="flex justify-center items-start gap-3">
              <div>
                {/* level */}
                <div className="flex items-center gap-2 w-full text-primary">
                  <Flag />
                  <DefaultCombobox
                    control={form.control}
                    name="level_id"
                    object={levels}
                    searchLabel="Buscar nível..."
                    selectLabel="Selecione o nível da estratégia"
                    buttonVariant="ghost"
                    onSelect={(value: number) => {
                      form.setValue("level_id", value);
                    }}
                    className="flex gap-2 p-0"
                  />
                </div>

                {/* title */}
                <InputDefault
                  control={form.control}
                  name="title"
                  placeholder="Título do estratégia"
                  inputClassname="border-none text-xl font-semibold p-0"
                  className="mb-5"
                />
              </div>

              <InputImageWithPreview
                name="icon_file"
                formItemClassname="hidden"
                parentClassname="w-32 h-32"
                labelClassname="w-32 h-32"
              />
            </div>

            {/* visibility */}
            <DefaultCombobox
              control={form.control}
              name="visibility_type_id"
              object={visibilityTypes}
              label="Visibilidade da estratégia"
              searchLabel="Buscar..."
              selectLabel="Visibilidade"
              onSelect={(value: number) => {
                form.setValue("visibility_type_id", value);
              }}
            />

            {/* error message */}
            {isError ? (
              <p className="border-destructive border text-destructive">
                {error?.message}
              </p>
            ) : null}

            {/* buttons */}
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={closeFinishingStrategyModal}
                className="bg-transparent hover:bg-transparent p-0 text-primary hover:text-primary/60 underline"
              >
                Voltar
              </Button>
              <Button type="submit">
                {isPending ? (
                  <>
                    <FaSpinner className="mr-2 animate-spin" />
                    Criando
                  </>
                ) : (
                  "Criar"
                )}
              </Button>
            </div>
          </div>
        </div>
      </>
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
