import { ChangeEvent, forwardRef, useState } from "react";
import { Eye, EyeClosed } from "@phosphor-icons/react/dist/ssr";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface InputPasswordProps {
  control: any;
  name: string;
  label: string;
  description?: string;
  placeholder: string;
}

const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ control, name, label, description, placeholder }, ref) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
      <>
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <div className="flex items-center focus-within:outline-none border-input bg-transparent disabled:opacity-50 shadow-sm py-1 pr-3 border rounded-md focus-within:ring-ring focus-within:ring-1 w-full h-9 text-sm placeholder:text-muted-foreground transition-colors disabled:cursor-not-allowed">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    ref={ref}
                    placeholder={placeholder}
                    className="flex-1 border-none focus-visible:outline-none focus-visible:border-transparent focus-visible:ring-0"
                  />
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    className="bg-transparent hover:bg-transparent shadow-none p-0 h-[20px] text-muted-foreground hover:text-white"
                  >
                    {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription>{description}</FormDescription>
            </FormItem>
          )}
        />
      </>
    );
  }
);

InputPassword.displayName = "InputPassword";

export default InputPassword;
