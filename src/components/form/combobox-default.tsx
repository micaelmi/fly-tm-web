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
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { FaSpinner } from "react-icons/fa";

interface DefaultComboboxProps {
  control: any;
  name: string;
  label?: string;
  selectLabel: string | React.JSX.Element;
  searchLabel: string;
  object: any[] | undefined;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  onSelect: (value: string) => void;
}

export default function DefaultCombobox({
  control,
  name,
  label,
  selectLabel,
  searchLabel,
  object,
  isLoading = false,
  disabled = isLoading ? true : false,
  className,
  onSelect,
}: DefaultComboboxProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground",
                    className
                  )}
                  disabled={disabled}
                >
                  {field.value ? (
                    object?.find((item) => item.value === field.value)?.label
                  ) : isLoading ? (
                    <FaSpinner className="mr-2 animate-spin" />
                  ) : (
                    selectLabel
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder={searchLabel} />
                <CommandList>
                  <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                  <CommandGroup>
                    {object?.map((item) => (
                      <CommandItem
                        value={item.label}
                        key={item.value}
                        onSelect={() => {
                          onSelect(item.value);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            item.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
