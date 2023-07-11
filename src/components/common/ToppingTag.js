"use client";
import { classNames } from "@/utils/classNames";
import { formatNumberInSeparateThousands } from "@/utils/formatNumberInSeparateThousands";
import React, { useState } from "react";

const toppings = [
  {
    _id: "646ef726d13f2dd2065d9c2f",
    name: "Thạch cà phê",
    price: 5000,
    __v: 0,
  },
  {
    _id: "646ef763d13f2dd2065d9c31",
    name: "Trân châu đen",
    price: 2000,
    __v: 0,
  },
  {
    _id: "646ef76bd13f2dd2065d9c33",
    name: "Trân châu trắng",
    price: 3000,
    __v: 0,
  },
];

const ToppingTag = () => {
  const [selectedToppings, setSelectedToppings] = useState([]);

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
    <div className="mt-4">
      <form className="topping-options grid grid-cols-auto gap-2">
        {toppings.map((item) => (
          <label
            className={classNames(
              selectedToppings.includes(item._id) ? "border-orange-500" : "",
              " px-4 py-2 rounded border border-gray-300 hover:cursor-pointer"
            )}
          >
            <input
              type="checkbox"
              className="hidden"
              value={JSON.stringify({ id: item._id })}
              onChange={handleCheckboxChange}
            />
            {`${item.name} + ${formatNumberInSeparateThousands(item.price)} đ`}
          </label>
        ))}
      </form>
    </div>
  );
};

export default ToppingTag;
