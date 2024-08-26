import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "../ui/checkbox";
import clsx from "clsx";
import { ReactNode } from "react";

interface CheckboxCustomizableProps {
  control: any;
  name: string;
  title?: string;
  children: ReactNode;
}

export default function CheckboxCustomizable({
  control,
  name,
  title = "",
  children,
}: CheckboxCustomizableProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col">
          <FormLabel className={clsx("mb-4", { hidden: title === "" })}>
            {title}
          </FormLabel>
          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="font-normal">{children}</FormLabel>
            <FormMessage />
          </FormItem>
        </div>
      )}
    />
  );
}
