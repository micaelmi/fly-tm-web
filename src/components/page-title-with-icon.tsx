import { cn } from "@/lib/utils";
import { IconProps } from "@phosphor-icons/react/dist/lib/types";
import { ElementType } from "react";

interface PageTitleWithIconProps {
  icon: ElementType<IconProps>;
  title: string;
  parentClassname?: string;
}

export default function PageTitleWithIcon({
  icon: IconComponent,
  title,
  parentClassname,
}: PageTitleWithIconProps) {
  return (
    <div className={cn("flex items-center gap-3", parentClassname)}>
      <IconComponent size={50} />
      <h1 className="font-bold text-3xl">{title}</h1>
    </div>
  );
}
