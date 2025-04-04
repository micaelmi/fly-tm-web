import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SwitchScoreboardLayout({
  onChange,
}: {
  onChange: () => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="scoreboard-layout" onCheckedChange={onChange} />
      <Label htmlFor="scoreboard-layout">Mudar Layout</Label>
    </div>
  );
}
