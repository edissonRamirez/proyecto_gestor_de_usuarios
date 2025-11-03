import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Profile } from "../models/Profile";
import { User } from "../models/User";

interface ProfileFormProps {
  profile?: Profile | null;
  handleUpdate: (values: Profile, file?: File) => void;
}

const ProfileFormValidator: React.FC<ProfileFormProps> = ({ profile, handleUpdate }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        phone: profile?.phone || "",
        photo_url: profile?.photo_url || "",
        user: profile?.user || { name: "", email: "" },
      }}
      validationSchema={Yup.object({
        phone: Yup.string()
          .matches(/^\+?\d{7,15}$/, "Teléfono inválido")
          .required("El teléfono es obligatorio"),
      })}
      onSubmit={(values) => {
        handleUpdate(values, selectedFile || undefined);
      }}
    >
      {({ handleSubmit }) => (
        <Form
          onSubmit={handleSubmit}
          className="flex flex-col bg-white rounded-md shadow-md p-6 max-w-xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            {profile?.user?.name || "Usuario"} - Profile
          </h2>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Name</label>
            <Field
              type="text"
              name="user.name"
              value={profile?.user?.name || ""}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Email</label>
            <Field
              type="email"
              name="user.email"
              value={profile?.user?.email || ""}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Phone</label>
            <Field type="text" name="phone" className="w-full border rounded-md p-2" />
            <ErrorMessage name="phone" component="p" className="text-red-500 text-sm" />
          </div>

          {/* Photo */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.currentTarget.files?.[0] || null)}
              className="w-full border rounded-md p-2"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Update
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ProfileFormValidator;
