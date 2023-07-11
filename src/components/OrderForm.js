import React, { useEffect, useState } from "react";
import Modal from "./common/Modal";
import Input from "./common/Input";
import Btn from "./common/Btn";
import _ from "lodash";
import SelectMenu from "./common/SelectMenu";
import { getTotalAmount } from "@/services/orderServices";
import { formatNumberInSeparateThousands } from "@/utils/formatNumberInSeparateThousands";

function OrderForm({
  open,
  setOpen,
  status,
  onSubmit,
  resetForm,
  selectedOrder,
  register,
}) {
  const [totalAmount, setTotalAmount] = useState(0);

  const calculateTotalPrice = async () => {
    if (!selectedOrder) return;
    const totalPrice = await getTotalAmount(selectedOrder._id);
    setTotalAmount(totalPrice);
  };

  const calculateTheForEachProduct = (product) => {
    let totalPrice = 0;
    const size = product.productId.sizes.find((s) => s.name === product.size);
    const productPrice = size.price + product.productId.price;

    let toppingsPrice = 0;
    for (const topping of product.toppings) {
      toppingsPrice += topping.toppingId.price * topping.quantity;
    }

    totalPrice += (productPrice + toppingsPrice) * product.quantity;

    return `${formatNumberInSeparateThousands(totalPrice)}đ`;
  };

  useEffect(() => {
    if (!open) resetForm();
    calculateTotalPrice();
  }, [open]);

  return (
    <Modal open={open} title="" setOpen={setOpen} buttonSave={false}>
      <div className="flex justify-between align-center ">
        <h2 className="font-semibold">Các món đã chọn</h2>
        <form className="w-[160px]">
          {selectedOrder && (
            <SelectMenu
              register={register}
              label="Trạng thái"
              name="status"
              items={status}
            />
          )}
        </form>
      </div>
      <span className="block h-[2px] w-12 rounded-md mt-2 bg-orange-400"></span>
      {selectedOrder &&
        selectedOrder.products.map((product, index) => (
          <div key={index} className="text-[14px] mt-2 relative">
            <h4 className="font-semibold">{`${product.quantity} x ${product.productId.name}`}</h4>
            <p className="capitalize">{`Size: ${product.size}`}</p>
            {product.toppings.map((topping, index) => {
              return (
                <p
                  key={index}
                >{`+ ${topping.toppingId.name} x ${topping.quantity}`}</p>
              );
            })}
            <p className="absolute text-[16px] right-0 top-1/2 transform -translate-y-1/2">
              {calculateTheForEachProduct(product)}
            </p>
          </div>
        ))}

      <div className="mt-2">
        <h2 className=" text-md font-semibold">Ghi chú khách hàng :</h2>
        <p className="text-sm">{selectedOrder && selectedOrder.note}</p>
      </div>
      <h2 className="font-semibold mt-4">Tổng cộng</h2>
      <span className="block h-[2px] w-12 rounded-md mt-1 bg-orange-400"></span>
      <ul className="mt-2">
        <li className="flex items-center justify-between py-4 border-b ">
          <p>Phí giao hàng</p>
          <p>0đ</p>
        </li>
        <li className="flex items-center justify-between py-4">
          <p>Thành tiền</p>
          <p>{`${formatNumberInSeparateThousands(totalAmount)}đ`}</p>
        </li>
      </ul>
      <button
        onClick={() => onSubmit()}
        className="w-full h-10 rounded-3xl mb-[-10px] text-white bg-orange-400"
      >
        Cập nhật trạng thái
      </button>
    </Modal>
  );
}

export default OrderForm;
