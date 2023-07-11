"use client";
import { useState, useEffect } from "react";
import Link from "next/link.js";
import FilterProducts from "@/components/FilterProducts.js";
import Btn from "@/components/common/Btn.js";
import Table from "@/components/common/Table/index.jsx";
import { useForm } from "react-hook-form";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  saveCustomer,
} from "@/services/customerService";
import CustomerForm from "@/components/CustomerForm";
import Layouts from "@/components/Layouts";

export default function Customers() {
  const [openCustomer, setOpenCustomer] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerIdUpdate, setCustomerIdUpdate] = useState(null);
  const [customerImage, setCustomerImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    setError,
  } = useForm();

  const handleGetDataFromServer = async () => {
    setCustomers(await getCustomers());
  };

  useEffect(() => {
    handleGetDataFromServer();
  }, []);

  const handleDeleteCustomer = async (customerId) => {
    setCustomers(
      customers.map((customer) =>
        customer._id === customerId ? { ...customer, removing: true } : customer
      )
    );
    setTimeout(async () => {
      const customerDeleted = await deleteCustomer(customerId);
      if (customerDeleted)
        setCustomers(
          customers.filter((customer) => customer._id !== customerDeleted._id)
        );
    }, 500);
  };

  const handleUpdateCustomer = async (customer, customerId) => {
    const customerUpdate = await saveCustomer(customer , customerId , setError);
    const listCustomer = customers.map((customer) =>
      customer._id !== customerId ? customer : { ...customerUpdate }
    );
    if (customerUpdate) {
      setCustomerIdUpdate(null);
      setCustomers(listCustomer);
      setOpenCustomer(false);
    }
  };

  const showCustomerUpdate = (customerUpdate) => {
    setOpenCustomer(true);
    setCustomerIdUpdate(customerUpdate._id);
    setValue("name", customerUpdate.name);
    setValue("street", customerUpdate.address.street);
    setValue("numberPhone", customerUpdate.numberPhone);
  };

  function getAddressCustomer(address) {
    let addressNames = [];
    const addressKeys = Object.keys(address);

    addressKeys.forEach((key) => {
      const value = address[key];
      if (value && key !== "street") {
        addressNames.push(value.name);
      } else {
        addressNames.push(value);
      }
    });

    let addressNamesString = addressNames.join(", ");
    return addressNamesString;
  }

  const columns = [
    {
      path: "name",
      label: "Khách hàng",
      content: (customer) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{customer.name}</div>
          </div>
        </div>
      ),
    },
    {
      path: "address",
      label: "Địa chỉ",
      content: (customer) => (
        <p className="max-w-[480px] truncate">
          {getAddressCustomer(customer.address)}
        </p>
      ),
    },
    {
      path: "numberPhone",
      label: "Số điện thoại",
      content: (customer) => (
        <a
          href={`tel:${customer.numberPhone}`}
          className="hover:text-orange-600"
        >
          {customer.numberPhone}
        </a>
      ),
    },
    {
      key: "edit",
      content: (customer) => (
        <Link
          href={{
            pathname: "customers",
            query: { customerId: customer._id },
          }}
          onClick={() => showCustomerUpdate(customer)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Chỉnh sửa <span className="sr-only">, {customer.name}</span>
        </Link>
      ),
    },
    {
      key: "remove",
      content: (customer) => (
        <button
          type="button"
          onClick={() => handleDeleteCustomer(customer._id)}
          className="text-red-600 hover:text-red-800 border-none"
        >
          Xóa <span className="sr-only">, {customer.name}</span>
        </button>
      ),
    },
  ];

  const handleCreateCustomer = async (customer) => {
    const newCustomer = await createCustomer(customer, setError, () =>
      setOpenCustomer(false)
    );

    const listCustomer = _.cloneDeep(customers);
    listCustomer.push(newCustomer);
    if (newCustomer) setCustomers(listCustomer);
  };

  const onSubmitFormCustomer = (data) => {
    const customer = {
      name: data.name,
      numberPhone: data.numberPhone,
      city: data.city,
      district: data.district,
      ward: data.ward,
      street: data.street,
    };

    if (customerIdUpdate) {
      handleUpdateCustomer(customer, customerIdUpdate);
    } else {
      handleCreateCustomer(customer);
    }
  };

  return (
    <Layouts>

    <div className="px-4 sm:px-6 lg:px-8 mt-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Danh sách khách hàng
          </h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Btn
            size="sm"
            onClick={() => {
              setOpenCustomer(!openCustomer);
              setCustomerIdUpdate(null);
            }}
          >
            Thêm khách hàng
          </Btn>

          <CustomerForm
            open={openCustomer}
            setOpen={setOpenCustomer}
            resetForm={reset}
            onSubmit={handleSubmit(onSubmitFormCustomer)}
            register={register}
            errors={errors}
            image={customerImage}
            watch={watch}
            setImage={setCustomerImage}
            idUpdate={customerIdUpdate}
          />
        </div>
      </div>
      <FilterProducts />
      <div className="mt-8 flex flex-col">
        <Table columns={columns} data={customers} />
      </div>
    </div>
    </Layouts>

  );
}
