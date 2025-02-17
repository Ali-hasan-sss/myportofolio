import React, { useState } from "react";

interface Column {
  id: string;
  label: string;
}

interface ActionConfig {
  edit?: boolean;
  delete?: boolean;
  view?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

interface GeneralTableProps {
  columns: Column[];
  data: Record<string, string>[];
  actions?: ActionConfig;
  details?: boolean;
}

type Order = "asc" | "desc";

const GeneralTable: React.FC<GeneralTableProps> = ({
  columns,
  data: initialData,
  actions,
  details,
}) => {
  const [data, setData] = useState<Record<string, string>[]>(initialData);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string | null>(null);

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    const sortedData = [...data].sort((a, b) => {
      if (a[property] < b[property]) return isAsc ? -1 : 1;
      if (a[property] > b[property]) return isAsc ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="text-xs w-full text-gray-500 uppercase bg-gray-50 ">
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col" className="px-6 py-3">
                <div className="flex items-center text-black">
                  {column.label}
                  <button
                    onClick={() => handleSort(column.id)}
                    className="ml-2 "
                    aria-label={`Sort by ${column.label}`}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                    </svg>
                  </button>
                </div>
              </th>
            ))}
            {actions && <th className="px-6 py-3 text-black">Actions</th>}
            {details && <th className="px-6 py-3"></th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-white " : "bg-gray-50 "
              } border-b `}
            >
              {columns.map((column) => (
                <td key={column.id} className="px-6 py-4 text-black">
                  {row[column.id]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {actions.delete && (
                      <div className="flex items-center justify-center w-[25px] h-[25px] bg-red-100 p-1 rounded-full overflow-hidden ">
                        <button
                          onClick={() => actions.onDelete?.(row.id)}
                          aria-label="Delete"
                        >
                          <img
                            src="/images/redtrash.png"
                            width={14}
                            alt="trash"
                          />
                        </button>
                      </div>
                    )}
                    {actions.edit && (
                      <div className="flex items-center justify-center w-[25px] h-[25px] bg-yellow-100 p-1 rounded-full overflow-hidden ">
                        <button
                          onClick={() => actions.onEdit?.(row.id)}
                          className=" "
                          aria-label="Edit"
                        >
                          <img src="/images/edit.png" width={14} alt="ben" />
                        </button>
                      </div>
                    )}
                    {actions.view && (
                      <div className="flex items-center justify-center w-[25px] h-[25px] bg-blue-100 p-1 rounded-full overflow-hidden ">
                        <button
                          onClick={() => actions.onView?.(row.id)}
                          aria-label="View"
                        >
                          <img src="/images/eye.png" width={14} alt="eye" />
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              )}
              {details && (
                <td className="px-6 py-4">
                  <button>
                    <img src="/images/list.png" alt="list" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GeneralTable;
