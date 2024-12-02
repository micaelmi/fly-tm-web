import { Dispatch, SetStateAction, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { useFormContext } from "react-hook-form";

interface BaseColorPickerProps {
  name: string;
  defaultValue?: string;
  valueControlBy: "state" | "form";
}

interface StateControlledColorPickerProps extends BaseColorPickerProps {
  valueControlBy: "state";
  setRepresentationColor: Dispatch<SetStateAction<string>>;
}

interface FormControlledColorPickerProps extends BaseColorPickerProps {
  valueControlBy: "form";
  setRepresentationColor?: never;
}

type ColorPickerProps =
  | StateControlledColorPickerProps
  | FormControlledColorPickerProps;

export default function ColorPicker({
  name = "defaultName",
  defaultValue = "#ffffff",
  valueControlBy,
  setRepresentationColor,
}: ColorPickerProps) {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [color, setColor] = useState<string>(defaultValue);
  const [colorInput, setColorInput] = useState<string>(defaultValue);

  const { control, setValue } = useFormContext();

  return (
    <>
      <div className="relative flex md:flex-row flex-col flex-1 md:items-center gap-2 border-input text-sm">
        (hexadecimal):
        <div className="flex-1 rounded" style={{ backgroundColor: color }}>
          <span
            onClick={() => setShowColorPicker(!showColorPicker)}
            className={`flex flex-1 justify-center bg-accent ${showColorPicker ? "opacity-40" : "opacity-0"} hover:opacity-40 rounded transition-all duration-200 cursor-pointer`}
          >
            <p>{showColorPicker ? "Fechar" : "Alterar cor"}</p>
          </span>
        </div>
        {showColorPicker ? (
          <div className="-top-44 md:-top-52 left-5 md:left-11 z-50 absolute">
            <HexColorPicker
              color={color}
              onChange={setColor}
              onMouseUp={() => {
                setColorInput(color);
                if (valueControlBy === "form") {
                  setValue(name, color);
                } else {
                  setRepresentationColor(color);
                }
              }}
              onTouchEnd={() => {
                setColorInput(color);
                if (valueControlBy === "form") {
                  setValue(name, color);
                } else {
                  setRepresentationColor(color);
                }
              }}
            />
          </div>
        ) : null}
        {valueControlBy === "form" ? (
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
                    min={3}
                    placeholder="Código"
                    className="flex items-center border-input bg-transparent disabled:opacity-50 shadow-sm px-3 py-1 pr-3 border rounded-md focus-within:ring-1 focus-within:outline-none focus-within:ring-ring w-full h-9 text-sm placeholder:text-muted-foreground transition-colors disabled:cursor-not-allowed"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <HexColorInput
            color={colorInput}
            onChange={(value) => {
              setColor(value);
              setRepresentationColor(value);
            }}
            min={6}
            placeholder="Código"
            className="flex items-center border-input bg-transparent disabled:opacity-50 shadow-sm px-3 py-1 pr-3 border rounded-md focus-within:ring-1 focus-within:outline-none focus-within:ring-ring w-full h-9 text-sm placeholder:text-muted-foreground transition-colors disabled:cursor-not-allowed"
          />
        )}
      </div>
    </>
  );
}
