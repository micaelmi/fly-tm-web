import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { HexColorPicker, HexColorInput } from "react-colorful";

interface ColorPickerProps {
  control: any;
  name: string;
}

export default function ColorPicker({
  control = null,
  name = "defaultName",
}: ColorPickerProps) {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#ffff");

  return (
    <>
      {showColorPicker && (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="-top-52 left-20 absolute">
              <FormLabel></FormLabel>
              <FormControl>
                <HexColorPicker
                  color={color}
                  onChange={(e) => {
                    field.onChange(e);
                    setColor(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <div className="flex flex-1 items-center gap-3 border-input text-sm">
        Cor (hexadecimal):
        <div className="flex-1 rounded" style={{ backgroundColor: color }}>
          {showColorPicker ? (
            <span
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex flex-1 justify-center bg-accent opacity-40 rounded cursor-pointer"
            >
              <p>Fechar</p>
            </span>
          ) : (
            <span
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex flex-1 justify-center bg-accent opacity-0 hover:opacity-40 rounded transition-all duration-200 cursor-pointer"
            >
              <p>Alterar cor</p>
            </span>
          )}
        </div>
        <HexColorInput
          color={color}
          onChange={setColor}
          placeholder="Código"
          className="flex items-center focus-within:outline-none border-input bg-transparent disabled:opacity-50 shadow-sm px-3 py-1 pr-3 border rounded-md focus-within:ring-ring focus-within:ring-1 w-20 h-9 text-sm placeholder:text-muted-foreground transition-colors disabled:cursor-not-allowed"
        />
      </div>
    </>
  );
}
