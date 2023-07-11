import { classNames } from "@/utils/classNames";

export default function Textarea({
  register,
  name,
  label,
  errors,
  rows,
  ...rest
}) {
  return (
    <div>
      <div
        className={classNames(
          errors[name]
            ? "border-red-300 focus-within:border-red-500 focus-within:outline-none focus-within:ring-red-500"
            : "focus-within:border-indigo-600 focus-within:ring-indigo-600 focus-within:ring-1 border-gray-300",
          "relative rounded-md border px-3 py-2 shadow-sm"
        )}
      >
        <label
          htmlFor={name}
          className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
        >
          {label}
        </label>
        <textarea
          {...register(name)}
          id={name}
          name={name}
          rows={rows && 3}
          className={classNames(  errors[name]
            ? "placeholder-red-300"
            : "" , "block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm")}
          {...rest}
        />
      </div>
      {errors[name] && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {errors[name].message}
        </p>
      )}
    </div>
  );
}
