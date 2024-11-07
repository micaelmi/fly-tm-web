import { Coin, Coins, SmileyWink } from "@phosphor-icons/react/dist/ssr";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PlanCardProps {
  control: any;
  name: string;
  label: string;
}
export function PlanCards({ control, name, label }: PlanCardProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex flex-col space-y-1"
          >
            <FormItem className="flex items-center justify-between flex-row-reverse space-x-3 space-y-0 border border-white rounded-lg p-4 hover:bg-blue-900/10 hover:border-green-400 transition-colors">
              <FormControl>
                <RadioGroupItem
                  value="1"
                  className="scale-150 mr-8 accent-green-400"
                />
              </FormControl>
              <FormLabel className="font-normal flex gap-2">
                <SmileyWink size={48} className="text-yellow-500" />
                <div>
                  <h2 className="text-lg">Grátis</h2>
                  <p className="text-sm text-gray-300">Até 5 membros</p>
                </div>
              </FormLabel>
            </FormItem>

            <FormItem className="flex items-center justify-between flex-row-reverse space-x-3 space-y-0 border border-white rounded-lg p-4 hover:bg-blue-900/10 hover:border-green-400 transition-colors">
              <FormControl>
                <RadioGroupItem
                  value="2"
                  className="scale-150 mr-8 accent-green-400"
                />
              </FormControl>
              <FormLabel className="font-normal flex gap-2">
                <Coin size={48} className="text-yellow-500" />
                <div>
                  <h2 className="text-lg">Básico</h2>
                  <p className="text-sm text-gray-300">
                    Até 35 membros | 250 créditos/mês
                  </p>
                </div>
              </FormLabel>
            </FormItem>

            <FormItem className="flex items-center justify-between flex-row-reverse space-x-3 space-y-0 border border-white rounded-lg p-4 hover:bg-blue-900/10 hover:border-green-400 transition-colors accent-green-400">
              <FormControl>
                <RadioGroupItem
                  value="3"
                  className="scale-150 mr-8 accent-green-400"
                />
              </FormControl>
              <FormLabel className="font-normal flex gap-2">
                <Coins size={48} className="text-yellow-500" />
                <div>
                  <h2 className="text-lg">Super</h2>
                  <p className="text-sm text-gray-300">
                    Até 150 membros | 600 créditos/mês
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
  // return (
  //   <div className="">
  //     <div className="">
  //       <div className="">
  //         <SmileyWink />
  //       </div>
  //       <div className="">
  //         <div>
  //           <h2 className="text-xl font-semibold">Grátis</h2>
  //           <p className="text-gray-400 text-lg">Até 5 membros</p>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="">
  //       {type === 2 && (
  //         <div>
  //           <h2 className="text-xl font-semibold">Standard Plan</h2>
  //           <p className="text-gray-400 text-lg">
  //             Até 35 membros | 250 créditos/mês
  //           </p>
  //         </div>
  //       )}
  //       {type === 3 && (
  //         <div>
  //           <h2 className="text-xl font-semibold">Super</h2>
  //           <p className="text-gray-400 text-lg">
  //             Até 150 membros | 600 créditos/mês
  //           </p>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
}
