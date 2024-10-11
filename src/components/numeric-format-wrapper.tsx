import React from "react";
import { NumericFormat } from "react-number-format";

const NumericFormatWrapper = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<typeof NumericFormat>, "getInputRef">
>(({ id, ...rest }, ref) => {
  return (
    <NumericFormat
      id={id}
      getInputRef={ref}
      {...rest}
      className="flex border-input file:border-0 bg-transparent file:bg-transparent disabled:opacity-50 shadow-sm px-3 py-1 border rounded-md focus-visible:ring-1 focus-visible:ring-ring w-full h-9 file:font-medium text-sm file:text-sm placeholder:text-muted-foreground transition-colors focus-visible:outline-none disabled:cursor-not-allowed"
    />
  );
});
NumericFormatWrapper.displayName = "NumericFormatWrapper";

export default NumericFormatWrapper;
