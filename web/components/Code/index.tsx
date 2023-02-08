import { ComponentProps } from "react";
import { CodeContainer } from "./styles";

interface CodeProps extends ComponentProps<typeof CodeContainer> {};

export function Code({ ...rest }: CodeProps) {
  return (
    <CodeContainer {...rest}/>
  );
};