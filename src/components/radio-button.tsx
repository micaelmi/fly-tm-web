import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "@/lib/utils";

interface RadioButtonProps {
  optionValue: string;
  firstLabel: string;
  secondLabel: string;
  firstValue: string;
  secondValue: string;
  className?: string;
  onValueChange: (value: string) => void;
}

export default function RadioButton({
  optionValue,
  firstLabel,
  secondLabel,
  firstValue,
  secondValue,
  className,
  onValueChange,
}: RadioButtonProps) {
  return (
    <RadioGroup
      className={cn("flex gap-5", className)}
      value={optionValue}
      onValueChange={(value) => onValueChange(value)}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={firstValue} id="first" />
        <Label htmlFor="first">{firstLabel}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={secondValue} id="second" />
        <Label htmlFor="second">{secondLabel}</Label>
      </div>
    </RadioGroup>
  );
}
