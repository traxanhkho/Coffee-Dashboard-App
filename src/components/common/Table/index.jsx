'use client'
import React from 'react';
import Pagination from '../Pagination';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

function Table({ columns , data }) {
    return (
        <div className="xs:-my-2 xs:-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <TableHeader columns={columns} />
                        <TableBody columns={columns} data={data} />
                    </table>
                    <Pagination />
                </div>
            </div>
        </div>

    );
}

export default Table;