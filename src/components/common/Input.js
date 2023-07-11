"use client";
import { classNames } from "@/utils/classNames";

export default function Input({
  register,
  name,
  type,
  label,
  placeholder,
  className,
  errors,
  isPriceField , 
  ...rest
}) {
  return (
    <div>
      <div
        className={classNames(
          errors[name]
            ? "border-red-300 focus-within:border-red-500 focus-within:outline-none focus-within:ring-red-500"
            : "focus-within:border-indigo-600 focus-within:ring-indigo-600 focus-within:ring-1 ",
          "relative rounded-md border border-gray-300 px-3 py-2 shadow-sm"
        )}
      >
        <label
          htmlFor={name}
          className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
        >
          {label}
        </label>
        <input
          {...register(name)}
          type={type || "text"}
          id={name}
          className={classNames(
            errors[name]
              ? "border-red-300 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
              : "",
            "block w-full border-0 p-0 text-gray-900 outline-none placeholder-gray-500 focus:ring-0 sm:text-sm " +
              className
          )}
          {...rest}
          placeholder={placeholder}
        />
        {isPriceField && (
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden sm:flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm" id="price-currency">
              VND
            </span>
          </div>
        )}
      </div>
      {errors[name] && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {errors[name].message}
        </p>
      )}
    </div>
  );
}
