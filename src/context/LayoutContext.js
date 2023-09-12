"use client";
import _ from "lodash";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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
import { useSession } from "next-auth/react";
import axios from "axios";

const LayoutContext = createContext();

function LayoutProvider({ children }) {
  const { data: session } = useSession();
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
      name: "Nhân Sự",
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
  const [profile, setProfile] = useState(null);
  const pathname = usePathname();
  const imageDemo =
    "https://png.pngtree.com/png-vector/20220611/ourmid/pngtree-person-gray-photo-placeholder-woman-in-shirt-on-gray-background-png-image_4826227.png";

  const getDataFromServer = useCallback(async () => {
    if (!session) return;
    const { data: profileSelected } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_KEY}/profiles/me`,
      {
        headers: {
          "x-auth-token": session?.token,
        },
      }
    );

    if (profileSelected) {
      let userInfo = _.pick(profileSelected, [
        "userId",
        "aboutMe",
        "address",
        "numberPhone",
        "position",
        "image",
      ]);
      return setProfile(userInfo);
    }
  }, [session]);

  useEffect(() => {
    getDataFromServer();
  }, [getDataFromServer]);

  const handleChangeNavigationBar = useCallback(() => {
    const currentPath = "/" + pathname.split("/")[1];

    const navUpdated = navigation.map((nav) =>
      nav.href !== currentPath
        ? { ...nav, current: false }
        : { ...nav, current: true }
    );

    setNavigation(navUpdated);
  }, [pathname]);

  useEffect(() => {
    handleChangeNavigationBar();
  }, [handleChangeNavigationBar]);

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
    profile,
    imageDemo,
  };

  return (
    <LayoutContext.Provider value={layoutContextValue}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => useContext(LayoutContext);
export default LayoutProvider;
