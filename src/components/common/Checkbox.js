import { formatNumberInSeparateThousands } from "@/utils/formatNumberInSeparateThousands";

export default function Checkbox({ toppings, register , selectedToppings , setSelectedToppings }) {

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const topping = JSON.parse(value);
    if (checked) {
      setSelectedToppings([...selectedToppings, topping.id]);
    } else {
      const updatedToppings = selectedToppings.filter(
        (item) => item !== topping.id
      );
      setSelectedToppings(updatedToppings);
    }
  };


  return (
    <>
      {toppings.map((topping) => (
        <div key={topping._id} className="relative flex items-start">
          <div className="flex h-5 items-center">
            <input
              {...register(`${topping._id}`)}
              id={`${topping._id}`}
              aria-describedby="topping-description"
              name={`${topping._id}`}
              type="checkbox"
              value={JSON.stringify({ id: topping._id })}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor={`${topping._id}`}
              className="font-medium text-gray-700"
            >
              {topping.name}
            </label>
            <p id="topping-price" className="text-gray-500">
              {`${formatNumberInSeparateThousands(topping.price)} đ`}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
