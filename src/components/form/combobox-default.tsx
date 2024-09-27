import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, CaretUpDown } from "@phosphor-icons/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useState } from "react";

interface DefaultComboboxProps<T> {
  control: any;
  name: string;
  label?: string;
  selectLabel: string;
  searchLabel: string;
  object: any[];
  onSelect: (value: T) => void;
}

export default function DefaultCombobox<T>({
  control,
  name,
  label,
  selectLabel,
  searchLabel,
  object,
  onSelect,
}: DefaultComboboxProps<T>) {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value
            ? object.find((item) => item.value === value)?.label
            : selectLabel}
          <CaretUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[200px]">
        <Command>
          <CommandInput placeholder={searchLabel} className="h-9" />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {object.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    onSelect(item.value);
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    // <FormField
    //   control={control}
    //   name={name}
    //   render={({ field }) => (
    //     <FormItem className="flex flex-col">
    //       <FormLabel>{label}</FormLabel>
    //       <FormControl>
    //         <Popover>
    //           <PopoverTrigger asChild>
    //             <FormControl>
    //               <Button
    //                 variant="outline"
    //                 role="combobox"
    //                 className={cn(
    //                   "justify-between p-3",
    //                   !field.value && "text-muted-foreground"
    //                 )}
    //               >
    //                 {field.value
    //                   ? object.find((item) => item.value === field.value)?.label
    //                   : selectLabel}
    //                 <CaretUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
    //               </Button>
    //             </FormControl>
    //           </PopoverTrigger>
    //           <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
    //             <Command className="w-full">
    //               <CommandInput placeholder={searchLabel} />
    //               <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
    //               <CommandGroup>
    //                 {object?.map((item) => (
    //                   <CommandItem
    //                     value={item.label}
    //                     key={item.value}
    //                     onSelect={() => {
    //                       onSelect(item.value);
    //                     }}
    //                     className={cn(
    //                       item.comments && item.comments.length > 0
    //                         ? "text-yellow-400 font-semibold"
    //                         : ""
    //                     )}
    //                   >
    //                     <Check
    //                       className={cn(
    //                         "mr-2 h-4 w-4",
    //                         item.value === field.value
    //                           ? "opacity-100"
    //                           : "opacity-0"
    //                       )}
    //                     />
    //                     {item.label}
    //                   </CommandItem>
    //                 ))}
    //               </CommandGroup>
    //             </Command>
    //           </PopoverContent>
    //         </Popover>
    //       </FormControl>
    //       <FormMessage />
    //     </FormItem>
    //   )}
    // />
  );
}
