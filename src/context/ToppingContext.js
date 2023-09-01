"use client";
import _ from "lodash";
import { createContext, useContext, useEffect, useState } from "react";
import { getToppings } from "@/services/toppingService";

const ToppingContext = createContext();

function ToppingProvider({ children }) {
  const [toppingData, setToppingData] = useState([]);

  const getDataFromServer = async () => {
    setToppingData(await getToppings());
  };

  useEffect(() => {
    getDataFromServer();
  }, []);

  // Function to set the authenticat  ed user
  const toppingValue = {
    toppingData,
    setToppingData,
  };

  return (
    <ToppingContext.Provider value={toppingValue}>
      {children}
    </ToppingContext.Provider>
  );
}

export const useTopping = () => useContext(ToppingContext);

export default ToppingProvider;
