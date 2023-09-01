import ProductProvider from "./ProductContext";
import ToppingProvider from "./ToppingContext";

function DataProvider({ children }) {
  return (
    <ProductProvider>
      <ToppingProvider>{children}</ToppingProvider>;
    </ProductProvider>
  );
}

export default DataProvider;
