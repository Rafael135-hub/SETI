"use client";

import React from "react";

interface ButtonProps{
  label: string;
  onClick?: () => void;
  variant?: "filled" | "stroked";
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

export default function Button({
  label,
  onClick,
  variant = "filled",
  type = "button",
  className = "",
  disabled = false,
}: ButtonProps) {
  const baseStyle =
    "cursor-pointer px-[clamp(0.875rem,2.5vw,2rem)] py-[clamp(0.55rem,1.4vw,0.75rem)] font-outfit-sans text-[clamp(0.72rem,1.65vw,0.875rem)] leading-tight transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seti-purple-75 disabled:cursor-not-allowed disabled:opacity-60";

  const filledStyle =
    "bg-linear-to-r from-seti-purple-80 to-white text-seti-purple-05 hover:brightness-105";

  const strokedStyle =
    "border border-seti-purple-80/70 bg-transparent text-white hover:border-seti-purple-80 hover:text-white";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variant === "filled" ? filledStyle : strokedStyle} ${className}`}
    >
      {label}
    </button>
  );
}
