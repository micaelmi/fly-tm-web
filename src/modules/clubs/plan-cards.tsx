import { Coin, Coins, SmileyWink } from "@phosphor-icons/react/dist/ssr";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetUserCredits } from "@/hooks/use-users";
import { plans } from "./club-plans";

interface PlanCardProps {
  control: any;
  name: string;
  label: string;
}
export function PlanCards({ control, name, label }: PlanCardProps) {
  const credits = useGetUserCredits() || 0;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel className="mt-8 text-lg">{label}</FormLabel>
            <p className="bg-gray-800 p-2 rounded-lg text-white">
              Você tem {credits} créditos
            </p>
          </div>
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex flex-col space-y-1"
          >
            <FormItem className="flex flex-row-reverse justify-between items-center space-x-3 space-y-0 border-white hover:border-green-400 hover:bg-blue-900/10 p-4 border rounded-lg transition-colors">
              <FormControl>
                <RadioGroupItem
                  value="1"
                  className="mr-8 accent-green-400 scale-150"
                />
              </FormControl>
              <FormLabel className="flex gap-2 font-normal">
                <SmileyWink size={48} className="text-yellow-500" />
                <div>
                  <h2 className="text-lg">Grátis</h2>
                  <p className="text-gray-300 text-sm">Até 5 membros</p>
                </div>
              </FormLabel>
            </FormItem>

            <FormItem className="flex flex-row-reverse justify-between items-center space-x-3 space-y-0 border-white hover:border-green-400 hover:bg-blue-900/10 p-4 border rounded-lg transition-colors">
              <FormControl>
                <RadioGroupItem
                  value="2"
                  className="mr-8 accent-green-400 scale-150"
                  disabled={plans[1].price > credits}
                />
              </FormControl>
              <FormLabel className="flex gap-2 font-normal">
                <Coin size={48} className="text-yellow-500" />
                <div>
                  <h2 className="text-lg">Básico</h2>
                  <p className="text-gray-300 text-sm">
                    Até 35 membros | {plans[1].price} créditos
                  </p>
                </div>
              </FormLabel>
            </FormItem>

            <FormItem className="flex flex-row-reverse justify-between items-center space-x-3 space-y-0 border-white hover:border-green-400 hover:bg-blue-900/10 p-4 border rounded-lg transition-colors accent-green-400">
              <FormControl>
                <RadioGroupItem
                  value="3"
                  className="mr-8 accent-green-400 scale-150"
                  disabled={plans[2].price > credits}
                />
              </FormControl>
              <FormLabel className="flex gap-2 font-normal">
                <Coins size={48} className="text-yellow-500" />
                <div>
                  <h2 className="text-lg">Super</h2>
                  <p className="text-gray-300 text-sm">
                    Até 150 membros | {plans[2].price} créditos
                  </p>
                </div>
              </FormLabel>
            </FormItem>
          </RadioGroup>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
