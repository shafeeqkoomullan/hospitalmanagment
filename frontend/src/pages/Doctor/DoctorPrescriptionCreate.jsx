import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";

export default function DoctorPrescriptionCreate() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState("");
  const [notes, setNotes] = useState("");

  const submit = async () => {
    try {
      await api.post("/doctor/prescriptions/", {
        patient: patientId,
        diagnosis,
        medicines,
        notes,
      });

      alert("Prescription created");
      navigate(-1);
    } catch (err) {
      alert("Failed to create prescription");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-3">
      <h2 className="text-xl font-semibold">Create Prescription</h2>

      <textarea
        placeholder="Diagnosis"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        className="border p-2 w-full"
      />

      <textarea
        placeholder="Medicines"
        value={medicines}
        onChange={(e) => setMedicines(e.target.value)}
        className="border p-2 w-full"
      />

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border p-2 w-full"
      />

      <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Save
      </button>
    </div>
  );
}
