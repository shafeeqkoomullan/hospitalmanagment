import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function DoctorPrescriptionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    diagnosis: "",
    medicines: "",
    notes: "",
  });

  useEffect(() => {
    api.get(`/doctor/prescriptions/${id}/`).then((res) => {
      setForm(res.data);
    });
  }, [id]);

  const save = async () => {
    await api.put(`/doctor/prescriptions/${id}/`, form);
    alert("Prescription updated");
    navigate(-1);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h2 className="text-xl font-semibold">Edit Prescription</h2>

      <textarea
        value={form.diagnosis}
        onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
        className="border p-2 w-full"
      />

      <textarea
        value={form.medicines}
        onChange={(e) => setForm({ ...form, medicines: e.target.value })}
        className="border p-2 w-full"
      />

      <textarea
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        className="border p-2 w-full"
      />

      <button onClick={save} className="bg-green-600 text-white px-4 py-2 rounded">
        Update
      </button>
    </div>
  );
}
