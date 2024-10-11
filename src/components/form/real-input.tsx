import * as React from "react";

import { cn } from "@/lib/utils";
import { NumericFormat } from "react-number-format";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import NumericFormatWrapper from "../numeric-format-wrapper";

interface RealInputProps {
  name: string;
  control: any;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">,
    RealInputProps {}

const RealInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      control,
      name,
      label,
      description,
      disabled,
      placeholder,
    },
    ref
  ) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn(className)}>
            {label ? <FormLabel>{label}</FormLabel> : null}
            <FormControl>
              <NumericFormatWrapper
                {...field}
                placeholder={placeholder}
                disabled={disabled}
                prefix="R$"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator="."
                decimalSeparator=","
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  className
                )}
              />
            </FormControl>
            <FormMessage />
            {description ? (
              <FormDescription>{description}</FormDescription>
            ) : null}
          </FormItem>
        )}
      />
    );
  }
);
RealInput.displayName = "RealInput";

export { RealInput };
