import { ComponentProps } from "react";
import { ButtonContainer } from "./styles";

interface ButtonProps extends ComponentProps<typeof ButtonContainer> {};

export function Button({ ...rest }: ButtonProps) {
  return (
    <ButtonContainer {...rest}/>
  );
};