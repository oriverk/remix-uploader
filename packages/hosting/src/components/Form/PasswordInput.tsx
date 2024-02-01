import { FC, useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import type { InputProps } from "./Input";

export const PasswordInput: FC<InputProps> = (props) => {
  const { label, placeholder = "", helperText = "", id, disabled, readOnly, validation, ...rest } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  let stateClass;
  if (readOnly || disabled) {
    stateClass = "bg-gray-100 focus:ring-0 cursor-not-allowed border-gray-300 focus:border-gray-300";
  } else if (errors[id]) {
    stateClass = "focus:ring-red-500 border-red-500 focus:border-red-500";
  } else {
    stateClass = "focus:ring-primary-500 border-gray-300 focus:border-primary-500";
  }
  const className = twMerge("block w-full rounded-md shadow-sm", stateClass);
  const isError = !!Object.entries(errors).length && !!errors[id]

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-normal text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          {...register(id, validation)}
          {...rest}
          type={showPassword ? "text" : "password"}
          name={id}
          id={id}
          readOnly={readOnly}
          disabled={disabled}
          className={className}
          placeholder={placeholder}
          aria-describedby={id}
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            togglePassword();
          }}
          type="button"
          className="focus:ring-primary-500 absolute inset-y-0 right-0 mr-3 flex items-center rounded-lg p-1 focus:outline-none focus:ring"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-600" />
          ) : (
            <EyeIcon className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-600" />
          )}
        </button>
      </div>
      <div className="mt-1">
        {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
        {isError && <span className="text-sm text-red-500">{JSON.stringify(errors[id]?.message, null, 2)}</span>}
      </div>
    </div>
  );
};
