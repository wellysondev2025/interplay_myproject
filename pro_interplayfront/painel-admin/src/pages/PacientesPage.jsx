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

  if (loading) return <DashboardLayout title="Pacientes"><p>Carregando...</p></DashboardLayout>;
  if (error) return <DashboardLayout title="Pacientes"><p>{error}</p></DashboardLayout>;

  // Tela principal com lista de pacientes
  if (!activeSession) {
    return (
      <DashboardLayout title="Pacientes">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src={patient.avatar || semFoto}
                alt={patient.name || "Sem foto"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-[#333333] font-semibold text-lg">{patient.name}</p>
                {patient.date_nasc && (
                  <p className="text-[#555555] text-sm">Nascimento: {new Date(patient.date_nasc).toLocaleDateString()}</p>
                )}
                {patient.professional && (
                  <p className="text-[#555555] text-sm">
                    Profissional: {patient.professional.name} ({patient.professional.code})
                  </p>
                )}
              </div>
            </div>

            {patient.sessions?.length > 0 ? (
              <button
                onClick={() => setActiveSession(patient)}
                className="mt-2 px-4 py-2 bg-[#83e8ea] rounded hover:brightness-105 transition"
              >
                Ver Sessões ({patient.sessions.length})
              </button>
            ) : (
              <p className="text-[#777777] text-sm mt-2">Nenhuma sessão</p>
            )}
          </div>

          ))}
        </div>
      </DashboardLayout>
    );
  }

  // Tela de sessão ativa
  const session = activeSession.sessions[0]; // mostra a primeira sessão, ou você pode criar seleção
  return (
    <DashboardLayout title={`Sessão do paciente: ${activeSession.name}`}>
      <div className="space-y-6">
        <button
          onClick={() => setActiveSession(null)}
          className="px-4 py-2 bg-[#83e8ea] text-[#333333] rounded hover:brightness-105 transition"
        >
          ← Voltar aos Pacientes
        </button>

        <div className="flex items-center gap-4">
          <img
            src={activeSession.avatar || semFoto}
            alt={activeSession.name || "Sem foto"}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-[#333333]">{activeSession.name}</h2>
            <p className="text-[#555555]">
              Início: {new Date(session.start_date).toLocaleString()} | Tipo: {session.session_type}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {session.activities?.map((activity) => (
            <div key={activity.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-4">
              {activity.path_relative_image ? (
                <img
                  src={`http://localhost:8000/media/${activity.path_relative_image}`}
                  alt="Atividade"
                  className="w-full h-64 object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-64 bg-[#f3f3f3] rounded-md flex items-center justify-center text-[#555555]">
                  Sem imagem
                </div>
              )}

              <div className="flex flex-col gap-2">
                <p className="font-semibold text-[#333333]">{activity.cod_activity}</p>
                <p className="text-[#555555]">Duração: {activity.duration ?? 0}s</p>

                <textarea
                  value={editingDescriptions[activity.id] ?? activity.description}
                  onChange={(e) => handleDescriptionChange(activity.id, e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-[#83e8ea]"
                  placeholder="Descrição da atividade"
                />

                <button
                  onClick={() => saveDescription(activity.id)}
                  className="mt-2 px-4 py-2 bg-[#83e8ea] text-[#333333] rounded hover:brightness-105 transition"
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
