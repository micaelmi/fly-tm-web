<<<<<<< HEAD
import {
  FormControl,
=======
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
>>>>>>> 0a72e522bfa0c5554eb5e39564a0baa3993c7b88
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
<<<<<<< HEAD
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";

interface DefaultTextareaProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  rows?: number;
=======
} from "../ui/form";
import { Textarea } from "../ui/textarea";

interface TextareaDefaultProps {
  control: any;
  name: string;
  label?: string;
  description?: string;
  placeholder: string;
  className?: string;
>>>>>>> 0a72e522bfa0c5554eb5e39564a0baa3993c7b88
}

export default function TextareaDefault({
  control,
  name,
  label,
<<<<<<< HEAD
  placeholder,
  rows,
}: DefaultTextareaProps) {
=======
  description,
  placeholder,
  className,
}: TextareaDefaultProps) {
>>>>>>> 0a72e522bfa0c5554eb5e39564a0baa3993c7b88
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
<<<<<<< HEAD
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} rows={rows} {...field} />
          </FormControl>
=======
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              className={cn(className)}
            />
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
>>>>>>> 0a72e522bfa0c5554eb5e39564a0baa3993c7b88
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
