import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import semFoto from "../assets/semfoto.svg";

export default function PacientesPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [editingDescriptions, setEditingDescriptions] = useState({});

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get("painel/patients/");
      setPatients(res.data.patients);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar pacientes");
      setLoading(false);
    }
  };

  const handleDescriptionChange = (activityId, value) => {
    setEditingDescriptions((prev) => ({ ...prev, [activityId]: value }));
  };

  const saveDescription = (activityId) => {
    console.log("Salvar descrição de", activityId, editingDescriptions[activityId]);
    // Aqui você chamaria o endpoint para salvar no backend
  };

  // Abre sessão do paciente ao clicar linha
  const openPatientSession = (patient) => {
    if (patient.sessions?.length > 0) {
      setActiveSession(patient);
    }
  };

  if (loading)
    return (
      <DashboardLayout title="Pacientes">
        <p className="text-center text-[#444]">Carregando...</p>
      </DashboardLayout>
    );

  if (error)
    return (
      <DashboardLayout title="Pacientes">
        <p className="text-center text-red-500">{error}</p>
      </DashboardLayout>
    );

  if (!activeSession) {
    return (
      <DashboardLayout title="Pacientes">
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm text-[#333]">
            <thead className="bg-[#f8f9fa] text-[#333]">
              <tr>
                <th className="px-4 py-3 text-left">Paciente</th>
                <th className="px-4 py-3 text-left">Nascimento</th>
                <th className="px-4 py-3 text-left">Profissional</th>
                <th className="px-4 py-3 text-center">Sessões</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr
                  key={p.id}
                  tabIndex={0}
                  role="button"
                  onClick={() => openPatientSession(p)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openPatientSession(p);
                  }}
                  className="border-t cursor-pointer hover:bg-gray-50 focus:bg-gray-100 transition"
                  aria-label={`Abrir sessões do paciente ${p.name}`}
                >
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={p.avatar || semFoto}
                      alt={p.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <span className="font-medium">{p.name}</span>
                  </td>

                  <td className="px-4 py-3 text-[#555]">
                    {p.date_nasc ? new Date(p.date_nasc).toLocaleDateString() : "-"}
                  </td>

                  <td className="px-4 py-3 text-[#555]">
                    {p.professional
                      ? `${p.professional.name} (${p.professional.code})`
                      : "-"}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {p.sessions?.length > 0 ? (
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          p.sessions.length > 0
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {p.sessions.length}
                      </span>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {p.sessions?.length > 0 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSession(p);
                        }}
                        className="px-3 py-1 text-sm bg-[#4b9ce2] text-white rounded hover:bg-[#3a7bb8] transition flex items-center gap-1 mx-auto"
                        aria-label={`Ver sessões do paciente ${p.name}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12H9m6 0a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Ver
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardLayout>
    );
  }

  // Sessão ativa
  const session = activeSession.sessions[0];
  return (
    <DashboardLayout title={`Sessão: ${activeSession.name}`}>
      <div className="space-y-6">
        <button
          onClick={() => setActiveSession(null)}
          className="px-4 py-2 bg-[#4b9ce2] text-white rounded hover:bg-[#3a7bb8] transition"
        >
          ← Voltar aos Pacientes
        </button>

        <div className="flex items-center gap-4 bg-white p-4 rounded shadow-sm">
          <img
            src={activeSession.avatar || semFoto}
            alt={activeSession.name}
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-xl font-semibold text-[#222]">{activeSession.name}</h2>
            <p className="text-[#555]">
              Início: {new Date(session.start_date).toLocaleString()} | Tipo:{" "}
              {session.session_type}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {session.activities?.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-3"
            >
              {activity.path_relative_image ? (
                <img
                  src={`http://localhost:8000/media/${activity.path_relative_image}`}
                  alt="Atividade"
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <div className="w-full h-48 bg-[#e9ecef] rounded flex items-center justify-center text-[#555]">
                  Sem imagem
                </div>
              )}

              <div className="flex flex-col gap-2">
                <p className="font-semibold text-[#222]">{activity.cod_activity}</p>
                <p className="text-[#555]">
                  Duração: {activity.duration ?? 0}s
                </p>

                <textarea
                  value={editingDescriptions[activity.id] ?? activity.description}
                  onChange={(e) =>
                    handleDescriptionChange(activity.id, e.target.value)
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-[#4b9ce2]"
                  placeholder="Descrição da atividade"
                />

                <button
                  onClick={() => saveDescription(activity.id)}
                  className="mt-2 px-4 py-2 bg-[#4b9ce2] text-white rounded hover:bg-[#3a7bb8] transition"
                >
                  Salvar descrição
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
