import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  RefreshCw, 
  Eye, 
  User, 
  Phone, 
  Tag 
} from "lucide-react";

export const Route = createFileRoute("/admin/mensajes")({
  component: AdminMensajes,
});

interface Message {
  id: string;
  created_at: string;
  nombre: string;
  email: string;
  telefono: string;
  interes: string;
  mensaje: string;
  leido: boolean;
}

function AdminMensajes() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"todos" | "no-leidos" | "leidos">("todos");

  // Cargar mensajes desde Supabase
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_messages" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages((data as unknown as Message[]) || []);
    } catch (err) {
      console.error("Error al obtener mensajes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Cambiar estado leído/no leído
  const toggleLeido = async (msg: Message) => {
    const nuevoEstado = !msg.leido;
    try {
      const { error } = await supabase
        .from("contact_messages" as any)
        .update({ leido: nuevoEstado })
        .eq("id", msg.id);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((item) => (item.id === msg.id ? { ...item, leido: nuevoEstado } : item))
      );

      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, leido: nuevoEstado });
      }
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  // Abrir detalle y marcar automáticamente como leído si es nuevo
  const handleSelectMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.leido) {
      toggleLeido(msg);
    }
  };

  // Eliminar mensaje
  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("¿Estás seguro de que deseas eliminar este mensaje?")) return;

    try {
      const { error } = await supabase
        .from("contact_messages" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      console.error("Error al eliminar mensaje:", err);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === "no-leidos") return !msg.leido;
    if (filter === "leidos") return msg.leido;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.leido).length;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Mail className="w-6 h-6 text-emerald-600" />
            Mensajes de Contacto
          </h1>
          <p className="text-slate-500 text-sm">
            Gestiona las consultas recibidas desde el formulario web.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-50 text-slate-600 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setFilter("todos")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === "todos"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Todos ({messages.length})
        </button>
        <button
          onClick={() => setFilter("no-leidos")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
            filter === "no-leidos"
              ? "bg-emerald-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Sin leer
          {unreadCount > 0 && (
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilter("leidos")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === "leidos"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Leídos
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">Cargando mensajes...</div>
      ) : filteredMessages.length === 0 ? (
        <div className="p-12 text-center bg-white border rounded-xl text-slate-500">
          No hay mensajes en esta categoría.
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-500 uppercase font-semibold text-xs">
                  <th className="p-4">Estado</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Interés</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`cursor-pointer transition hover:bg-slate-50/80 ${
                      !msg.leido ? "bg-emerald-50/30 font-medium" : "text-slate-600"
                    }`}
                  >
                    <td className="p-4">
                      {msg.leido ? (
                        <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                          <MailOpen className="w-4 h-4" /> Leído
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          <Mail className="w-3.5 h-3.5" /> Nuevo
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-slate-900 font-semibold">{msg.nombre}</div>
                      <div className="text-xs text-slate-500">{msg.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md">
                        {msg.interes || "General"}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString("es-CR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSelectMessage(msg)}
                          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-md"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl p-6 relative">
            <div className="flex items-start justify-between border-b pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{selectedMessage.nombre}</h3>
                <p className="text-xs text-slate-400">
                  Enviado el {new Date(selectedMessage.created_at).toLocaleString("es-CR")}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">Nombre:</span> {selectedMessage.nombre}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">Email:</span>{" "}
                <a href={`mailto:${selectedMessage.email}`} className="text-emerald-600 hover:underline">
                  {selectedMessage.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">Teléfono:</span>{" "}
                <a
                  href={`https://wa.me/${selectedMessage.telefono?.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 hover:underline"
                >
                  {selectedMessage.telefono || "No especificado"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">Interés:</span> {selectedMessage.interes || "General"}
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="font-semibold text-slate-800 mb-1">Mensaje:</p>
                <div className="bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed border">
                  {selectedMessage.mensaje}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => toggleLeido(selectedMessage)}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                {selectedMessage.leido ? "Marcar como no leído" : "Marcar como leído"}
              </button>

              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${selectedMessage.telefono?.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
                >
                  Responder por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}