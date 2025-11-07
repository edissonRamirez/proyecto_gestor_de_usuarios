import React from "react";

interface Action {
  name: string;
  label: string;
}

interface GenericTableProps {
  name: string;
  data: Record<string, any>[];  // Record significa que es un vector de objetos con claves string y valores de cualquier tipo
  columns: string[];
  actions?: Action[];
  onAction?: (name: string, item: Record<string, any>) => void;
}

const GenericTable: React.FC<GenericTableProps> = ({ name, data, columns, actions, onAction }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-600 pb-2">{name}</h2>
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
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={col}>{String(item[col] ?? "")}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-3">
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </>
  );
};

export default GenericTable;
