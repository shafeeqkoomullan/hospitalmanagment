import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get("/patients/me/")
      .then((res) => {
        const patientId = res.data.id;
        return api.get(`/patients/${patientId}/records/`);
      })
      .then((res) => {
        // Flatten prescriptions from medical records
        const records = Array.isArray(res.data) ? res.data : [];
        setPrescriptions(records);
      })
      .catch(() => setError("Failed to load prescriptions."))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  return (
    <Layout>
      <div className="space-y-5 max-w-3xl">

        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">My Prescriptions</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Medicines and treatments prescribed by your doctors
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-400 text-sm">Loading prescriptions...</div>
        ) : prescriptions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
            <div className="text-4xl mb-3">💊</div>
            <p className="text-gray-500 font-medium">No prescriptions yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Your prescriptions will appear here after doctor consultations.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {prescriptions.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                {/* Card header */}
                <button
                  onClick={() => toggle(record.id)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      💊
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {record.doctor_name || "Doctor"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {record.created_at?.slice(0, 10) || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 max-w-xs truncate hidden md:block">
                      {record.diagnosis?.slice(0, 50)}{record.diagnosis?.length > 50 ? "..." : ""}
                    </span>
                    <span className="text-gray-400 text-lg">
                      {expanded === record.id ? "▴" : "▾"}
                    </span>
                  </div>
                </button>

                {/* Expanded detail */}
                {expanded === record.id && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <div className="space-y-4 pt-4">

                      {/* Diagnosis */}
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                          Diagnosis
                        </p>
                        <p className="text-sm text-gray-800 bg-gray-50 rounded-lg px-4 py-3 leading-relaxed">
                          {record.diagnosis || "—"}
                        </p>
                      </div>

                      {/* Prescription */}
                      {record.prescription && (
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                            Medicines / Prescription
                          </p>
                          <p className="text-sm text-gray-800 bg-teal-50 border border-teal-100 rounded-lg px-4 py-3 leading-relaxed whitespace-pre-line">
                            {record.prescription}
                          </p>
                        </div>
                      )}

                      {/* Test Results */}
                      {record.test_results && (
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                            Test Results
                          </p>
                          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-3 leading-relaxed">
                            {record.test_results}
                          </p>
                        </div>
                      )}

                      {/* Reports */}
                      {record.reports?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                            Attached Reports ({record.reports.length})
                          </p>
                          <div className="space-y-2">
                            {record.reports.map((r) => (
                              <a
                                key={r.id}
                                href={`http://127.0.0.1:8000${r.file}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 text-sm text-teal-700 hover:text-teal-800 bg-teal-50 border border-teal-100 px-4 py-2.5 rounded-lg transition-colors"
                              >
                                📄 {r.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
