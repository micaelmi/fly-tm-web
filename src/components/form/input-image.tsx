"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "@phosphor-icons/react/dist/ssr";
import { FolderCheck, Upload } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

interface BaseInputImageProps {
  name: string;
  valueControlBy: "state" | "form";
}

interface StateControlledInputImageProps extends BaseInputImageProps {
  valueControlBy: "state";
  setRepresentationFile: Dispatch<SetStateAction<File>>;
}

interface FormControlledInputImageProps extends BaseInputImageProps {
  valueControlBy: "form";
  setRepresentationFile?: never;
}

type InputImageProps =
  | StateControlledInputImageProps
  | FormControlledInputImageProps;

export default function InputImage({
  name,
  valueControlBy,
  setRepresentationFile,
}: InputImageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);

      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (valueControlBy === "form") {
      setValue(name, new File([], ""));
    } else {
      setRepresentationFile(new File([], ""));
    }
  };
  return (
    <div>
      <div className="flex items-center gap-3">
        {valueControlBy === "form" ? (
          <FormField
            control={control}
            name={name}
            render={({ field }) => (
              <FormItem className="flex flex-1 border-input border rounded h-9">
                <FormLabel className="flex flex-1 justify-center items-center gap-3 hover:bg-accent px-3 text-muted-foreground hover:text-white transition-colors cursor-pointer">
                  {selectedImage ? (
                    <>
                      <FolderCheck className="size-5" />
                      <p>
                        Imagem selecionada <span>({fileName})</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="size-5" />
                      <p>Sem imagem. Clique para adicionar.</p>
                    </>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    ref={fileInputRef}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleImageChange(e);
                      if (e.target.files && e.target.files[0]) {
                        field.onChange(e.target.files[0]);
                      } else {
                        field.onChange(new File([], ""));
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ) : (
          <label
            htmlFor="representation"
            className="flex flex-1 border-input border rounded h-9"
          >
            <div className="flex flex-1 justify-center items-center gap-3 hover:bg-accent px-3 text-muted-foreground hover:text-white transition-colors cursor-pointer">
              {selectedImage ? (
                <>
                  <FolderCheck className="size-5" />
                  <p>
                    Imagem selecionada <span>({fileName})</span>
                  </p>
                </>
              ) : (
                <>
                  <Upload className="size-5" />
                  <p>Sem imagem. Clique para adicionar.</p>
                </>
              )}
            </div>
            <Input
              id="representation"
              ref={fileInputRef}
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleImageChange(e);
                if (e.target.files && e.target.files[0]) {
                  setRepresentationFile(e.target.files[0]);
                } else {
                  setRepresentationFile(new File([], ""));
                }
              }}
            />
          </label>
        )}

        {selectedImage && (
          <div
            onClick={removeImage}
            className="flex items-center border-input hover:bg-accent px-3 border rounded h-9 text-muted-foreground hover:text-white cursor-pointer"
          >
            <X size={14} />
          </div>
        )}
      </div>
      {errors[name] ? (
        <span className="text-destructive text-sm">
          {String(errors[name]?.message)}
        </span>
      ) : null}
    </div>
  );
}
