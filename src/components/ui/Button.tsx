import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import clsx from "clsx";

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  color?: "default" | "secondary";
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
      className={clsx("rounded-lg flex gap-2 items-center", className, {
        "bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50":
          color === "default",
        "bg-gray-200 text-gray-800 hover:bg-gray-100 disabled:opacity-50":
          color === "secondary",
        "p-4": !className.includes("p-"),
      })}
    >
      {children}
    </button>
  );
};
