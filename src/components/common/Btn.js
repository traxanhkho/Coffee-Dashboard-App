import { classNames } from "@/utils/classNames";

export default function Btn({
  children,
  size,
  type = "button",
  className,
  ...rest
}) {
  return (
    <>
      {size === "sm" && (
        <button
          {...rest}
          type={type}
          className={classNames(
            "inline-flex items-center rounded-md border shadow bg-white px-3 py-2 text-sm font-medium leading-4 text-black hover:bg-[#f9fafb] ",
            className
          )}
        >
          {children}
        </button>
      )}

      {size === "md" && (
        <button
          {...rest}
          type={type}
          className={classNames(
            "inline-flex items-center rounded-md border shadow bg-white px-4 py-2 text-base font-medium text-black hover:bg-[#f9fafb] ",
            className
          )}
        >
          {children}
        </button>
      )}
      {size === "lg" && (
        <button
          {...rest}
          type={type}
          className={classNames(
            "inline-flex items-center rounded-md border border bg-white px-6 py-3 text-base font-medium text-black hover:bg-[#f9fafb] shadow ",
            className
          )}
        >
          {children}
        </button>
      )}
    </>
  );
}
