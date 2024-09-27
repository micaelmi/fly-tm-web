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

interface InputDefaultProps {
  control: any;
  name: string;
  label?: string;
  placeholder: string;
  type?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export default function InputDefault({
  control,
  name,
  label,
  placeholder,
  type = "text",
  description,
  className,
  disabled = false,
}: InputDefaultProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              autoComplete="off"
              {...field}
              className={cn(className)}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
          <FormDescription>{description}</FormDescription>
        </FormItem>
      )}
    />
  );
}
