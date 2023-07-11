import _ from 'lodash';
import React from 'react';

function TableBody({ columns, data }) {

    const renderCell = (item, column) => {
        if (column.content) return column.content(item);

        return _.get(item, column.path);
    }

    const createKey = (item, column) => {
        return item._id + (column.path || column.key || null);
    }
    
    return (
        <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((item) => (
                <tr key={item._id}  className={`transition-opacity duration-500 ${
                    item.removing ? 'opacity-0' : 'opacity-100'
                  }`}>
                    {
                        columns.map((column, index) => {
                            if (index === 0) {
                                return (
                                    <td key={createKey(item, column)} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        {renderCell(item, column)}
                                    </td>
                                )
                            } else if (index === columns.length - 1) {
                                return (
                                    <td key={createKey(item, column)} className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        {renderCell(item, column)}
                                    </td>
                                )
                            }

                            return (
                                <td key={createKey(item, column)} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {renderCell(item, column)}
                                </td>
                            )
                        })

                    }
                </tr>
            ))}
        </tbody>
    );
}

export default TableBody;