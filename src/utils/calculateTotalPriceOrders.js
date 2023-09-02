export const calculateTotalProductPrice = (product) => {
  let totalPrice = product.productId?.price * product.quantity;

  if (product.size) {
    const size = product.productId?.sizes.find(
      (size) => size._id === product.size
    );
    totalPrice += size.price;
  }

  if (product.toppings) {
    product.toppings.forEach((topping) => {
      if (topping.quantity)
        totalPrice += topping.toppingId?.price * topping.quantity;
    });
  }

  return totalPrice;
};

export const calculateTotalOrderPrice = (order) => {
  let totalPriceOrder = 0;
  order.products.forEach((product, index) => {
    const totalProduct = calculateTotalProductPrice(product);

    totalPriceOrder += totalProduct;
  });

  return totalPriceOrder;
};
