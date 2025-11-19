import { useNavigate } from "react-router-dom";

interface Action {
  name: string;
  label: string;
}

interface GenericTableProps<T extends Record<string, any>> {
  name: string;
  entity: string;
  data: T[];
  columns: string[];
  actions?: Action[];
  onAction?: (actionName: string, item: T) => void;
}

const GenericTable = <T extends Record<string, any>>({
  name,
  entity,
  data,
  columns,
  actions = [],
  onAction,
}: GenericTableProps<T>) => {

  const navigate = useNavigate();

  const handleCreate = () => {
    navigate(`/api/${entity}/create`);
  };

  return (
    <div className="p-6 bg-gray-2 rounded-lg shadow border border-stroke">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-5 border-b-2 border-graydark pb-2">
        <h2 className="text-2xl font-semibold text-graydark">{name}</h2>

        <button
          onClick={handleCreate}
          className="bg-meta-5 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Create {entity.charAt(0).toUpperCase() + entity.slice(1)}
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full border border-stroke text-sm text-left">
          <thead className="bg-graydark text-white uppercase text-xs font-semibold">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-6 py-3 tracking-wider border border-stroke whitespace-nowrap">
                  {col.replace(/_/g, " ").toUpperCase()}
                </th>
              ))}
              {actions.length > 0 && <th className="px-6 py-3 border-stroke text-center">Actions</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-stroke bg-white text-custom_font">
            {data.length > 0 ? (
              data.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray transition-colors duration-200">
                  {columns.map((col) => (
                    <td key={col} className="px-6 py-3 border border-stroke whitespace-nowrap">
                      {item[col] ?? "—"}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td className="px-6 py-3 border border-stroke text-center">
                      <div className="flex justify-center gap-2">
                        {actions.map((action) => (
                          <button
                            key={action.name}
                            onClick={() => onAction?.(action.name, item)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md text-white transition duration-200
                              ${
                                action.name === "edit"
                                  ? "bg-warning hover:bg-[#e39500]"
                                  : action.name === "delete"
                                  ? "bg-danger hover:bg-[#b50c1f]"
                                  : "bg-bodydark2 hover:bg-graydark"
                              }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions.length ? 1 : 0)} className="text-center py-4">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTable;
