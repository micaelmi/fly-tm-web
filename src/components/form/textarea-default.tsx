import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";

interface DefaultTextareaProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  rows?: number;
}

export default function TextareaDefault({
  control,
  name,
  label,
  placeholder,
  rows,
}: DefaultTextareaProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} rows={rows} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
