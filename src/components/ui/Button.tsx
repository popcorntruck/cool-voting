import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import clsx from "clsx";

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  color?: "default" | "secondary" | "transparent";
};

export const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  className = "",
  color = "default",
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-lg flex gap-2 items-center disabled:opacity-50",
        className,
        {
          "bg-zinc-800 hover:bg-zinc-700": color === "default",
          "bg-gray-200 text-gray-800 hover:bg-gray-100": color === "secondary",
          "p-4": !className.includes("p-"),
        }
      )}
    >
      {children}
    </button>
  );
};
