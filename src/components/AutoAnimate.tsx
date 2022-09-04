import { ElementType, HTMLAttributes } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface AutoAnimateProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  animOptions?: Parameters<typeof useAutoAnimate>[0];
}

export const AutoAnimate: React.FC<AutoAnimateProps> = ({
  as: Tag = "div",
  children,
  animOptions = undefined,
  ...rest
}) => {
  const [ref] = useAutoAnimate<HTMLElement>(animOptions);
  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
};
