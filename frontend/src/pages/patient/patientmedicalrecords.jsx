import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function PatientMedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get("/patients/me/")
      .then((res) => api.get(`/patients/${res.data.id}/records/`))
      .then((res) => setRecords(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Failed to load medical records."))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  return (
    <Layout>
      <div className="space-y-5 max-w-3xl">

        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">Medical Records</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Your complete medical history and diagnoses
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-400 text-sm">Loading records...</div>
        ) : records.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
            <div className="text-4xl mb-3">📁</div>
            <p className="text-gray-500 font-medium">No medical records found</p>
            <p className="text-gray-400 text-sm mt-1">
              Records will appear here after your doctor consultations.
            </p>
          </div>
        ) : (
          <>
            {/* Summary count */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-teal-700">{records.length}</p>
                <p className="text-xs text-teal-600 mt-1">Total Records</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-700">
                  {records.filter((r) => r.prescription).length}
                </p>
                <p className="text-xs text-blue-600 mt-1">With Prescription</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-purple-700">
                  {records.reduce((acc, r) => acc + (r.reports?.length || 0), 0)}
                </p>
                <p className="text-xs text-purple-600 mt-1">Reports Attached</p>
              </div>
            </div>

            {/* Records list */}
            <div className="space-y-3">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                >
                  {/* Header row */}
                  <button
                    onClick={() => toggle(record.id)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg flex-shrink-0">
                        📋
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
                      {record.reports?.length > 0 && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                          {record.reports.length} report{record.reports.length > 1 ? "s" : ""}
                        </span>
                      )}
                      {record.prescription && (
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-medium">
                          Rx
                        </span>
                      )}
                      <span className="text-gray-400 text-lg">
                        {expanded === record.id ? "▴" : "▾"}
                      </span>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {expanded === record.id && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-4">

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
                            Prescription
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
                          <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-100 rounded-lg px-4 py-3 leading-relaxed">
                            {record.test_results}
                          </p>
                        </div>
                      )}

                      {/* Reports */}
                      {record.reports?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Attached Reports
                          </p>
                          <div className="space-y-2">
                            {record.reports.map((r) => (
                              <a
                                key={r.id}
                                href={`http://127.0.0.1:8000${r.file}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 text-sm text-teal-700 hover:text-teal-800 bg-teal-50 border border-teal-100 px-4 py-2.5 rounded-lg transition-colors hover:bg-teal-100"
                              >
                                <span>📄</span>
                                <span className="flex-1">{r.title}</span>
                                <span className="text-xs text-teal-500">Download →</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
