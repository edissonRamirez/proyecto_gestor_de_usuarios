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

const GenericTableBootstrap = <T extends Record<string, any>>({
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
    <div className="card p-4 shadow">
      <div className="d-flex justify-content-between mb-3">
        <h4 className="mb-0">{name}</h4>
        <button className="btn btn-primary" onClick={handleCreate}>
          Create {entity}
        </button>
      </div>

      {/* 🔥 Scroll horizontal para evitar que se desborde */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped mb-0">
          <thead className="table-dark">
            <tr>
              {columns.map((col) => (
                <th key={col}>{col.replace(/_/g, " ").toUpperCase()}</th>
              ))}
              {actions.length > 0 && <th>ACTIONS</th>}
            </tr>
          </thead>

          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={col} className="text-break">
                      {item[col] ?? "—"}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td>
                      {actions.map((action) => (
                        <button
                          key={action.name}
                          className={`btn btn-sm me-2 ${
                            action.name === "edit"
                              ? "btn-warning"
                              : action.name === "delete"
                              ? "btn-danger"
                              : "btn-secondary"
                          }`}
                          onClick={() => onAction?.(action.name, item)}
                        >
                          {action.label}
                        </button>
                      ))}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions.length ? 1 : 0)}
                  className="text-center py-4"
                >
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTableBootstrap;
