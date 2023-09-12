"use client";
import React from "react";
import Pagination from "../Pagination";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

function Table({ columns, data }) {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <TableHeader columns={columns} />
      <TableBody columns={columns} data={data} />
    </table>
  );
}

export default Table;
