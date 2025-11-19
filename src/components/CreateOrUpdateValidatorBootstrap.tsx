import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FieldConfig } from "../components/CreateOrUpdateValidator";

interface CreateOrUpdateProps<T> {
  mode: number; // 1 = crear, 2 = actualizar
  title?: string;
  entity?: T | null;
  fields: FieldConfig[];
  validationSchema: Yup.AnyObjectSchema;
  handleCreate?: (values: T, file?: File) => void;
  handleUpdate?: (values: T, file?: File) => void;
}

const CreateOrUpdateValidatorBootstrap = <T extends Record<string, any>>({
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

  const submit = (values: T) => {
    if (mode === 1 && handleCreate) handleCreate(values, selectedFile || undefined);
    else if (mode === 2 && handleUpdate) handleUpdate(values, selectedFile || undefined);
  };

  return (
    <div className="card p-4 shadow mx-auto" style={{ maxWidth: "600px" }}>
      {title && <h3 className="text-center mb-3">{title}</h3>}

      <Formik
        enableReinitialize
        initialValues={(entity || Object.fromEntries(fields.map((f) => [f.name, ""])) as T)}
        validationSchema={validationSchema}
        onSubmit={submit}
      >
        {({ setFieldValue }) => (
          <Form className="row g-3">

            {fields.map((field) => (
              <div key={field.name} className="col-12">
                <label className="form-label">{field.label}</label>

                {field.type === "select" && field.options ? (
                  <Field as="select" name={field.name} className="form-select" disabled={field.readOnly}>
                    <option value="">Seleccione una opción</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Field>

                ) : field.type === "textarea" ? (
                  <Field
                    as="textarea"
                    name={field.name}
                    readOnly={field.readOnly}
                    className="form-control"
                  />

                ) : field.type === "checkbox" ? (
                  <div className="form-check">
                    <Field type="checkbox" name={field.name} className="form-check-input" />
                    <label className="form-check-label">{field.label}</label>
                  </div>

                ) : field.type === "file" ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setPreview(URL.createObjectURL(file));
                          setFieldValue(field.name, file.name);
                        }
                      }}
                    />
                    {preview && (
                      <img src={preview} className="img-thumbnail mt-2" width={120} />
                    )}
                  </div>

                ) : (
                  <Field
                    type={field.type}
                    name={field.name}
                    readOnly={field.readOnly}
                    className="form-control"
                  />
                )}

                <ErrorMessage name={field.name} component="div" className="text-danger" />
              </div>
            ))}

            <button
              type="submit"
              className={`btn ${mode === 1 ? "btn-primary" : "btn-warning"} mt-3`}
            >
              {mode === 1 ? "Crear" : "Actualizar"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateOrUpdateValidatorBootstrap;
