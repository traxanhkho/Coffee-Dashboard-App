import { useEffect } from "react";

export default function Checkbox({ toppings, setToppings }) {
  const handleChange = (e) => {
    const { value, checked } = e.target;

    const toppingUpdate = toppings.map((topping) => {
      return topping._id === value
        ? { ...topping, isChecked: checked }
        : { ...topping };
    });
    setToppings(toppingUpdate);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        {toppings?.map((topping) => (
          <div key={topping._id} className=" sm:py-2 border-b ">
            <label
              htmlFor={topping._id}
              className="font-medium hover:border-orange-200 cursor-pointer flex items-center px-2 py-1 border-2 border-gray-200 text-gray-700"
            >
              <div className="flex h-5 items-center">
                <input
                  id={topping._id}
                  name={topping._id}
                  value={topping._id}
                  onChange={handleChange}
                  checked={topping.isChecked || false}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-200 ring-0"
                />
              </div>
              <div className="ml-3 text-sm">{topping.name}</div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
