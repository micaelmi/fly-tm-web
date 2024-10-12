import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { useFormContext } from "react-hook-form";

interface ColorPickerProps {
  name: string;
}

export default function ColorPicker({
  name = "defaultName",
}: ColorPickerProps) {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#ffff");
  const [colorInput, setColorInput] = useState<string>("#ffff");

  const { control } = useFormContext();

  return (
    <>
      <div className="relative flex md:flex-row flex-col flex-1 md:items-center gap-2 border-input text-sm">
        (hexadecimal):
        <div className="flex-1 rounded" style={{ backgroundColor: color }}>
          <span
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex flex-1 justify-center bg-accent opacity-0 hover:opacity-40 rounded transition-all duration-200 cursor-pointer"
          >
            <p>{showColorPicker ? "Fechar" : "Alterar cor"}</p>
          </span>
        </div>
        {showColorPicker ? (
          <div className="-top-44 md:-top-52 left-5 md:left-11 z-50 absolute">
            <HexColorPicker
              color={color}
              onChange={setColor}
              onMouseUp={() => setColorInput(color)}
              onTouchEnd={() => setColorInput(color)}
            />
          </div>
        ) : null}
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <HexColorInput
                  color={colorInput}
                  onChange={(value) => {
                    setColor(value);
                    field.onChange(value);
                  }}
                  placeholder="Código"
                  className="flex items-center border-input bg-transparent disabled:opacity-50 shadow-sm px-3 py-1 pr-3 border rounded-md focus-within:ring-1 focus-within:outline-none focus-within:ring-ring w-full h-9 text-sm placeholder:text-muted-foreground transition-colors disabled:cursor-not-allowed"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
