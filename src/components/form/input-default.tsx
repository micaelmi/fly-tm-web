import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FocusEvent } from "react";

interface InputDefaultProps {
  control: any;
  name: string;
  label?: string;
  placeholder: string;
  type?: string;
  description?: string;
  className?: string;
  inputClassname?: string;
  readOnly?: boolean;
  disabled?: boolean;
  maxLength?: number | undefined;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

export default function InputDefault({
  control,
  name,
  label,
  placeholder,
  type = "text",
  description,
  className,
  inputClassname,
  readOnly = false,
  disabled = false,
  maxLength = undefined,
  onBlur,
}: InputDefaultProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              className={cn(inputClassname)}
              type={type}
              placeholder={placeholder}
              autoComplete="off"
              {...field}
              readOnly={readOnly}
              disabled={disabled}
              maxLength={maxLength}
              onBlur={(event) => onBlur && onBlur(event)}
            />
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}
