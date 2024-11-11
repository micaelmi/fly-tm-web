import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

interface TextareaDefaultProps {
  control: any;
  name: string;
  label?: string;
  description?: string;
  placeholder: string;
  className?: string;
  rows?: number;
}

export default function TextareaDefault({
  control,
  name,
  label,
  description,
  placeholder,
  className,
  rows = 5,
}: TextareaDefaultProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              className={cn(className)}
              rows={rows}
            />
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
