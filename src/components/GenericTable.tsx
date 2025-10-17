import React from "react";

interface Action {
  name: string;
  label: string;
}

interface GenericTableProps {
  data: Record<string, any>[];  // Record significa que es un vector de objetos con claves string y valores de cualquier tipo
  columns: string[];
  actions: Action[];
  onAction: (name: string, item: Record<string, any>) => void;
}

const GenericTable: React.FC<GenericTableProps> = ({ data, columns, actions, onAction }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
        <thead className="bg-primary text-white uppercase text-xs font-semibold">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-6 py-3 tracking-wider">
                {col}
              </th>
            ))}
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((item, index) => (
            <tr key={index} className="hover:bodydark2 transition">
              {columns.map((col) => (
                <td key={col} className="px-6 py-4 text-gray-700">
                  {item[col]}
                </td>
              ))}
              <td className="px-6 py-4 space-x-2">
                {actions.map((action) => (
                  <button
                    key={action.name}
                    onClick={() => onAction(action.name, item)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 text-white
                              ${action.name === "edit" && "bg-primary hover:bg-secondary"}
                              ${action.name === "delete" && "bg-danger hover:bg-meta-1"}
                              `}
                  >
                    {action.label}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;
