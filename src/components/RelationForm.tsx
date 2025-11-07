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
  title,
  firstLabel,
  secondLabel,
  firstList,
  secondList,
  onSubmit,
}) => {
  const [firstSelected, setFirstSelected] = useState<number | null>(null);
  const [secondSelected, setSecondSelected] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (firstSelected && secondSelected) {
      await onSubmit(firstSelected, secondSelected);
    } else {
      alert("Por favor seleccione ambas opciones antes de continuar.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Primer select */}
        <div>
          <label className="block mb-1 text-sm font-medium">{firstLabel}</label>
          <select
            className="w-full border rounded-md p-2"
            value={firstSelected ?? ""}
            onChange={(e) => setFirstSelected(Number(e.target.value))}
          >
            <option value="">Seleccione un {firstLabel.toLowerCase()}</option>
            {firstList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Segundo select */}
        <div>
          <label className="block mb-1 text-sm font-medium">{secondLabel}</label>
          <select
            className="w-full border rounded-md p-2"
            value={secondSelected ?? ""}
            onChange={(e) => setSecondSelected(Number(e.target.value))}
          >
            <option value="">Seleccione un {secondLabel.toLowerCase()}</option>
            {secondList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition"
        >
          Asignar
        </button>
      </form>
    </div>
  );
};

export default RelationForm;
