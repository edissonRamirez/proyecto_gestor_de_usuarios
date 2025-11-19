import React, { useState } from "react";

interface OptionItem {
  id?: number;
  label: string;
}

interface RelationFormProps {
  title?: string;
  firstLabel?: string;
  secondLabel?: string;
  firstList?: OptionItem[];
  secondList?: OptionItem[];
  onSubmit: (firstId: number, secondId: number) => Promise<void> | void;
}

const RelationFormBootstrap: React.FC<RelationFormProps> = ({
  title = "Formulario de relación",
  firstLabel = "Primera opción",
  secondLabel = "Segunda opción",
  firstList = [],
  secondList = [],
  onSubmit,
}) => {
  const [firstSelected, setFirstSelected] = useState<number | null>(null);
  const [secondSelected, setSecondSelected] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (firstSelected !== null && secondSelected !== null) {
      try {
        await onSubmit(firstSelected, secondSelected);
      } catch (error) {
        console.error("Error al procesar la relación:", error);
        alert("❌ Ocurrió un error al intentar asignar la relación.");
      }
    } else {
      alert("⚠️ Por favor seleccione ambas opciones antes de continuar.");
    }
  };

  return (
    <div className="card p-4 shadow mx-auto" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">{title}</h2>

      <form onSubmit={handleSubmit} className="row g-3">

        {/* Primer select */}
        <div className="col-12">
          <label className="form-label">{firstLabel}</label>
          <select
            className="form-select"
            value={firstSelected ?? ""}
            onChange={(e) => setFirstSelected(Number(e.target.value))}
          >
            <option value="">
              Seleccione un {firstLabel.toLowerCase()}
            </option>

            {firstList.length > 0 ? (
              firstList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))
            ) : (
              <option disabled>No hay opciones disponibles</option>
            )}
          </select>
        </div>

        {/* Segundo select */}
        <div className="col-12">
          <label className="form-label">{secondLabel}</label>
          <select
            className="form-select"
            value={secondSelected ?? ""}
            onChange={(e) => setSecondSelected(Number(e.target.value))}
          >
            <option value="">
              Seleccione un {secondLabel.toLowerCase()}
            </option>

            {secondList.length > 0 ? (
              secondList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))
            ) : (
              <option disabled>No hay opciones disponibles</option>
            )}
          </select>
        </div>

        {/* Botón */}
        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100">
            Asignar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RelationFormBootstrap;
