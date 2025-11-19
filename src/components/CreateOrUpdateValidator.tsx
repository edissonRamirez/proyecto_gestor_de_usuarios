import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";

export interface FieldConfig {
  name: string;
  label: string;
  type:
  | "text"
  | "number"
  | "email"
  | "password"
  | "checkbox"
  | "date"
  | "textarea"
  | "select"
  | "file";
  required?: boolean;
  readOnly?: boolean;
  options?: { value: string | number; label: string }[];
}

interface CreateOrUpdateProps<T> {
  mode: number; // 1 = crear, 2 = actualizar
  title?: string;
  entity?: T | null;
  fields: FieldConfig[];
  validationSchema: Yup.AnyObjectSchema;
  handleCreate?: (values: T, file?: File) => void;
  handleUpdate?: (values: T, file?: File) => void;
}

const CreateOrUpdateValidator = <T extends Record<string, any>>({
  mode,
  title,
  entity,
  fields,
  validationSchema,
  handleCreate,
  handleUpdate,
}: CreateOrUpdateProps<T>) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = (values: T) => {
    if (mode === 1 && handleCreate) handleCreate(values, selectedFile || undefined);
    else if (mode === 2 && handleUpdate) handleUpdate(values, selectedFile || undefined);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
    field: any
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setFieldValue(field.name, file.name);

      // 🔥 Llamar al callback personalizado de la page
      if (field.onFileSelect) {
        field.onFileSelect(file);
      }
    }
  };


  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-lg mx-auto">
      {title && <h2 className="text-2xl font-bold mb-4 text-center text-graydark">{title}</h2>}

      <Formik
        enableReinitialize
        initialValues={(entity || Object.fromEntries(fields.map((f) => [f.name, ""])) as T)}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-lg font-medium text-gray-700 mb-1">
                  {field.label}
                </label>

                {/* ✅ Campo tipo SELECT */}
                {field.type === "select" && field.options ? (
                  <Field
                    as="select"
                    name={field.name}
                    className="w-full border rounded-md p-2"
                    disabled={field.readOnly}
                  >
                    <option value="">Seleccione una opción</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </option>
                    ))}
                  </Field>
                ) : field.type === "textarea" ? (
                  <Field
                    as="textarea"
                    name={field.name}
                    readOnly={field.readOnly}
                    className="w-full border rounded-md p-2 min-h-[80px]"
                  />
                ) : field.type === "checkbox" ? (
                  <div className="flex items-center">
                    <Field type="checkbox" name={field.name} className="mr-2" />
                    <span className="text-gray-700">{field.label}</span>
                  </div>
                ) : field.type === "file" ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setFieldValue, field)}
                      className="w-full border rounded-md p-2"
                    />
                    {preview && (
                      <img
                        src={preview}
                        alt="Vista previa"
                        className="mt-2 w-24 h-24 object-cover rounded-md border"
                      />
                    )}
                  </div>
                )
                  : (
                    <Field
                      type={field.type}
                      name={field.name}
                      readOnly={field.readOnly}
                      className="w-full border rounded-md p-2"
                    />
                  )}

                <ErrorMessage
                  name={field.name}
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            ))}

            <button
              type="submit"
              className={`${mode === 1 ? "bg-meta-5 hover:bg-blue-700" : "bg-warning hover:bg-[#e39500]"
                } text-white py-2 rounded-md transition`}
            >
              {mode === 1 ? "Crear" : "Actualizar"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateOrUpdateValidator;
