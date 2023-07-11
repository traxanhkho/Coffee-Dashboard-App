export default function SelectMenu({ register, label, name, defaultValue ,  items, ...rest }) {
  return (
    <div className="relative rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
      <label
        htmlFor={name}
        className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
      >
        {label}
      </label>
      {items.length && (
        
        <select
          {...register(name)}
          id={name}
          name={name}
          defaultValue={items[0].name}
          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
          {...rest}
        >
          <option value={''}>Cập nhật TT</option>
          {items.map((item, index) => (
            <option key={item._id || index} value={item.value || item.name || item}>
              {item.name || item}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
