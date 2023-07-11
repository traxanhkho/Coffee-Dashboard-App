"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  ChartPieIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import CoffeeIcon from "@/assets/icons/coffee.svg";
import ToppingIcon from "@/assets/icons/topping.svg";
import UiIcon from "@/assets/icons/ui.svg";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import _ from "lodash";

const LayoutContext = createContext();

function LayoutProvider({ children }) {
  const [navigation, setNavigation] = useState([
    { name: "Tổng quan", href: "/", icon: ChartPieIcon, current: false },
    {
      name: "Sản Phẩm",
      href: "/products",
      icon: () => (
        <CoffeeIcon className="mr-4 h-6 w-6 fill-current flex-shrink-0 text-indigo-300" />
      ),
      current: false,
    },
    {
      name: "Topping",
      href: "/toppings",
      icon: () => (
        <ToppingIcon className="mr-4 h-6 w-6 fill-current flex-shrink-0 text-indigo-300" />
      ),
      current: false,
    },
    {
      name: "Đơn Hàng",
      href: "/orders",
      icon: ShoppingBagIcon,
      current: false,
    },
    {
      name: "Khách Hàng",
      href: "/customers",
      icon: UsersIcon,
      current: false,
    },
    {
      name: "Giao Diện",
      href: "/interfaces",
      icon: () => (
        <UiIcon className="mr-4 h-6 w-6 fill-current flex-shrink-0 text-indigo-300" />
      ),
      current: false,
    },
    {
      name: "DS Quản Lý",
      href: "/users",
      icon: UsersIcon,
      current: false,
    },
  ]);
  const [pathname, setPathname] = useState("/" + usePathname().split("/")[1]);

  const { currentUser } = useAuth();
  useEffect(() => {
    const navUpdated = navigation.map((nav) =>
      nav.href !== pathname
        ? { ...nav, current: false }
        : { ...nav, current: true }
    );

    setNavigation(navUpdated);
  }, [currentUser]);

  const onChangeNavigation = (name) => {
    const newNavigation = navigation.map((item) =>
      item.name !== name
        ? { ...item, current: false }
        : { ...item, current: true }
    );

    setNavigation(newNavigation);
  };

  const layoutContextValue = {
    onChangeNavigation,
    navigation,
  };

  return (
    <LayoutContext.Provider value={layoutContextValue}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => useContext(LayoutContext);

export default LayoutProvider;
