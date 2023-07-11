import React from 'react';

function TableHeader({ columns }) {
    return (
        <thead className="bg-gray-50">
            <tr>
                {columns.map((column, index) => {
                    if (index === 0) {
                        return <th
                            scope="col"
                            key={column.path || column.key}
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                            {column.label}
                        </th>
                    } else if (index === columns.length - 1) {
                        return <th
                            scope="col"
                            key={column.path || column.key}
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                            {column.label || null}
                        </th>
                    }

                    return <th
                        scope="col"
                        key={column.path || column.key}
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                        {column.label}
                    </th>
                })}

            </tr>
        </thead>
    );
}

export default TableHeader;