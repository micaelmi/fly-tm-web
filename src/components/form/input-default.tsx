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
import { ChangeEvent, FocusEvent } from "react";

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
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
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
  onChange,
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
              onChange={(event) => {
                field.onChange(event);
                onChange && onChange(event);
              }}
            />
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}
