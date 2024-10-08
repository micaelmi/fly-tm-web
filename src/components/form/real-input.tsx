import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { NumericFormat } from "react-number-format";
import { ForwardedRef, useRef } from "react";

interface RealInputProps {
  control: any;
  name: string;
  label?: string;
  placeholder: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export default function RealInput({
  control,
  name,
  label,
  placeholder,
  description,
  className,
  disabled,
}: RealInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <NumericFormat
              {...field}
              placeholder="Valor (R$)"
              disabled={disabled}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
