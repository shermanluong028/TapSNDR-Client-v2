import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import clsx from "clsx";

type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label: React.FC<FormLabelProps> = ({ className, ...props }) => {
  const { isDarkMode } = useTheme();

  return (
    <label
      {...props}
      className={clsx(
        "block text-sm font-medium mb-1",
        isDarkMode ? "text-gray-400" : "text-gray-600",
        className
      )}
    />
  );
};

type FormControlProps = React.InputHTMLAttributes<HTMLInputElement>;

const Control = React.forwardRef<HTMLInputElement, FormControlProps>(({ className, ...props }, ref) => {
  const { isDarkMode } = useTheme();

  return (
    <input
      {...props}
      ref={ref}
      className={clsx(
        "appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none sm:text-sm",
        isDarkMode
          ? "border-gray-600 placeholder-gray-500 text-gray-200 bg-transparent focus:ring-primary-400 focus:border-primary-400"
          : "border-gray-300 placeholder-gray-400 text-gray-900 bg-white focus:ring-primary-400 focus:border-primary-400",
        className
      )}
    />
  );
});

Control.displayName = "Form.Control";

export const Form = {
  Label,
  Control,
} as const;

export default Form;
