"use client";
import { getProducts } from "@/services/productService";
import _ from "lodash";
import { createContext, useContext, useEffect, useState } from "react";

const ProductContext = createContext();

function ProductProvider({ children }) {
  const [productData, setProductData] = useState({});

  const getDataFromServer = async () => {
    setProductData(await getProducts());
  };

  useEffect(() => {
    getDataFromServer();
  }, []);

  // Function to set the authenticated user
  const productValue = {
    setProductData,
    productData,
  };

  return (
    <ProductContext.Provider value={productValue}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProduct = () => useContext(ProductContext);

export default ProductProvider;
