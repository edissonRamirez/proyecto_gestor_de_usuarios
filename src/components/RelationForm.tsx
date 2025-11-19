// src/components/RelationForm.tsx
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

const RelationForm: React.FC<RelationFormProps> = ({
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center text-graydark">
        {title}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Primer select */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {firstLabel}
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={firstSelected ?? ""}
            onChange={(e) => setFirstSelected(Number(e.target.value))}
          >
            <option value="">Seleccione un {firstLabel.toLowerCase()}</option>
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
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {secondLabel}
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={secondSelected ?? ""}
            onChange={(e) => setSecondSelected(Number(e.target.value))}
          >
            <option value="">Seleccione un {secondLabel.toLowerCase()}</option>
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
        <button
          type="submit"
          className="w-full bg-meta-5 text-white rounded-md py-2 hover:bg-meta-6 transition"
        >
          Asignar
        </button>
      </form>
    </div>
  );
};

export default RelationForm;
