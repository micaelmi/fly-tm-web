import { IconProps } from "@phosphor-icons/react/dist/lib/types";
import { ElementType } from "react";

interface PageTitleWithIconProps {
  icon: ElementType<IconProps>;
  title: string;
}

export default function PageTitleWithIcon({
  icon: IconComponent,
  title,
}: PageTitleWithIconProps) {
  return (
    <div className="flex items-center gap-3">
      <IconComponent size={50} />
      <h1 className="font-bold text-3xl">{title}</h1>
    </div>
  );
}
