"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "@phosphor-icons/react/dist/ssr";
import { FolderCheck, Upload } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

interface InputImageProps {
  name: string;
  formItemClassname?: string;
  parentClassname?: string;
  labelClassname?: string;
}

export default function InputImageWithPreview({
  name,
  formItemClassname,
  parentClassname,
  labelClassname,
}: InputImageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, setValue } = useFormContext();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);

      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setValue(name, new File([], ""));
  };
  return (
    <div className={cn("flex items-center gap-2 w-full", parentClassname)}>
      {selectedImage ? (
        <label
          htmlFor="image"
          className={cn("relative hover:cursor-pointer", labelClassname)}
        >
          <button
            onClick={removeImage}
            className="top-0 right-0 absolute bg-red-500 hover:bg-red-700 p-1 rounded-full text-white"
          >
            <X weight="bold" />
          </button>
          <img
            src={selectedImage}
            alt="Preview"
            className="rounded-md object-cover"
          />
        </label>
      ) : (
        <label
          htmlFor="image"
          className={cn(
            "flex justify-center items-center bg-stone-800 p-2 rounded-md w-16 h-16 text-center hover:cursor-pointer",
            labelClassname
          )}
        >
          <p className="text-xs">Sem imagem</p>
        </label>
      )}
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn("w-full", formItemClassname)}>
            <FormLabel className="flex justify-center items-center gap-4 hover:border-card hover:bg-card-foreground/10 py-4 border border-dashed rounded-lg w-full transition-colors cursor-pointer">
              {selectedImage ? (
                <>
                  <FolderCheck />
                  <p>
                    Imagem selecionada{" "}
                    <span className="text-xs">({fileName})</span>
                  </p>
                </>
              ) : (
                <>
                  <Upload />
                  <p>Selecione uma imagem</p>
                </>
              )}
            </FormLabel>
            <FormControl>
              <Input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept="image/*"
                id="image"
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
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
