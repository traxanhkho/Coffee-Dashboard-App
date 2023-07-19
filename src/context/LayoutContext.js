"use client";
import _ from "lodash";
import { createContext, useContext, useEffect, useState } from "react";
import {
  ChartPieIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import CoffeeIcon from "@/assets/icons/coffee.svg";
import PeopleRoofSolid from "@/assets/icons/people-roof-solid.svg";
import CandyCaneSolid from "@/assets/icons/candy-cane-solid.svg";
import IconsSolid from "@/assets/icons/icons-solid.svg";
import AddressCardRegular from "@/assets/icons/address-card-regular.svg";
import { usePathname } from "next/navigation";

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
        <CandyCaneSolid className="mr-4 h-6 w-6 fill-current flex-shrink-0 text-indigo-300" />
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
        <IconsSolid className="mr-4 h-6 w-6 fill-current flex-shrink-0 text-indigo-300" />
      ),
      current: false,
    },
    {
      name: "Nhân Viên",
      href: "/users",
      icon: () => (
        <PeopleRoofSolid className="mr-4 h-6 w-6 fill-current flex-shrink-0 text-indigo-300" />
      ),
      current: false,
    },
    {
      name: "Thông Tin Cá Nhân",
      href: "/profile",
      icon: () => (
        <AddressCardRegular className="mr-4 h-6 w-6 fill-current flex-shrink-0 text-indigo-300" />
      ),
      current: false,
    },
    
  ]);
  const pathname = usePathname();

  useEffect(() => {
    const currentPath = "/" + pathname.split("/")[1];

    const navUpdated = navigation.map((nav) =>
      nav.href !== currentPath
        ? { ...nav, current: false }
        : { ...nav, current: true }
    );

    setNavigation(navUpdated);
  }, [pathname]);

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
