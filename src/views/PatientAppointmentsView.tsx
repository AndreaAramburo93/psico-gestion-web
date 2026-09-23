import React, { useState } from 'react';
import { mongoDb } from '../services/mongoService';

interface PatientAppointmentsViewProps {
  onJoinMeeting: (cita: any) => void;
  onNavigateToTherapist: () => void;
  onOpenEmergencyModal: () => void;
}

export const PatientAppointmentsView: React.FC<PatientAppointmentsViewProps> = ({
  onJoinMeeting,
  onNavigateToTherapist,
  onOpenEmergencyModal,
}) => {
  const [activeTab, setActiveTab] = useState<'proximas' | 'historial' | 'notas' | 'facturacion'>('proximas');
  const [selectedMood, setSelectedMood] = useState<number>(4);
  const [chatInput, setChatInput] = useState('');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showReportSuccessModal, setShowReportSuccessModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('2024-10-26');
  const [rescheduleTime, setRescheduleTime] = useState('17:00');

  // Read data live from MongoDB
  const appointments = mongoDb.find('citas', { pacienteNombre: 'Camila Morales' });
  const featuredAppointment = appointments.find((c: any) => c.proximoDestacado) || appointments[0];
  const upcomingAppointments = appointments.filter((c: any) => c.estado === 'confirmada' && !c.proximoDestacado);
  const completedAppointments = appointments.filter((c: any) => c.estado === 'completada');

  const chatMessages = mongoDb.find('chat_mensajes');
  const moodHistory = mongoDb.find('diario_emocional');

  // Mood options
  const moods = [
    { level: 1, label: 'Alta', emoji: '😰', desc: 'Ansiedad' },
    { level: 2, label: 'Baja', emoji: '😔', desc: 'Desánimo' },
    { level: 3, label: 'Neutro', emoji: '😐', desc: 'Equilibrada' },
    { level: 4, label: 'Calma', emoji: '🌱', desc: 'Tranquilidad' },
    { level: 5, label: 'Óptima', emoji: '✨', desc: 'Energía' },
  ];

  const handleLogMood = (m: typeof moods[0]) => {
    setSelectedMood(m.level);
    mongoDb.insertOne('diario_emocional', {
      fecha: new Date().toISOString().split('T')[0],
      dia: 'Hoy',
      nivel: m.level,
      estado: m.label,
      emoji: m.emoji,
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Save patient message
    const patientMsg = mongoDb.insertOne('chat_mensajes', {
      remitente: 'paciente',
      nombre: 'Camila Morales',
      texto: chatInput,
      fecha: 'Ahora',
      leido: false,
    });

    setChatInput('');

    // Simulate therapist reply after 1.5s
    setTimeout(() => {
      mongoDb.insertOne('chat_mensajes', {
        remitente: 'terapeuta',
        nombre: 'Dra. Marcela Restrepo',
        texto: 'Recibido Camila. Me alegra que lo compartas. Lo abordaremos con calma al inicio de nuestra sesión del jueves.',
        fecha: 'Hace un momento',
        leido: true,
      });
    }, 1500);
  };

  const handleConfirmReschedule = () => {
    if (featuredAppointment) {
      mongoDb.updateOne(
        'citas',
        { _id: featuredAppointment._id },
        { $set: { fecha: rescheduleDate, horaInicio: rescheduleTime, horaFin: '18:00' } }
      );
    }
    setShowRescheduleModal(false);
  };

  return (
    <div className="flex flex-col w-full max-w-[1440px] mx-auto px-4 md:px-6 py-6">
      
      {/* Welcome Banner matching Images 8 & 10 */}
      <div className="relative w-full bg-gradient-to-r from-[#245347] to-[#3d6b5e] rounded-3xl p-6 sm:p-8 text-white shadow-lg overflow-hidden mb-6">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-white/20 text-[#bbeddc] font-headline font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full inline-block">
              Espacio Seguro Personal
            </span>
            <h1 className="font-headline font-bold text-2xl sm:text-4xl tracking-tight">
              Hola, Camila Morales 👋
            </h1>
            <p className="text-sm text-white/90 max-w-xl leading-relaxed">
              Plan de Acompañamiento Activo: <strong className="text-white">Manejo de Ansiedad y Regulación Emocional</strong>. Tienes una sesión programada en 2 días.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-xs text-center">
              <span className="block text-white/80 uppercase tracking-wider text-[10px]">Progreso Global</span>
              <span className="font-headline font-bold text-lg text-white">12 Sesiones</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-xs text-center">
              <span className="block text-white/80 uppercase tracking-wider text-[10px]">Estado Actual</span>
              <span className="font-headline font-bold text-lg text-[#bbeddc]">Fase de Integración</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Featured Appointment Card matching Image 10 */}
      <div className="relative w-full bg-white rounded-3xl shadow-[0_4px_24px_rgba(36,83,71,0.08)] p-6 sm:p-8 mb-8 border border-[#e0f2ed] overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Doctor Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1GNpbkxtgRO1KhXv32vjXeQ8dI7rLeMLjLVQ2NKBMmFfp-ztYGHp69qLkO1EZiTSNcdR5whj4e7mUCbs8hJVnamNLKSefj2bFh0xvW5nd7MLDZgv-H7IZGQq5q-YCAkgOGMJ3gHQM6VHrHsU6Il2HPOG-MUmrh1ibRJznEI5hKJvmYagshjR4cV06c8aVUsF54v3PONpzK8pO_kTEK1gUnX8SDNu87J9S6fBwPJXQzkCps1XBWxxS"
                alt="Dra. Marcela Restrepo"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-[#bbeddc] shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 bg-[#245347] text-white p-1 rounded-full shadow-xs">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#bbeddc] text-[#002019] text-[11px] font-headline font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Próximo Encuentro Destacado
                </span>
                <span className="text-xs text-[#245347] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">notifications_active</span>
                  Recordatorio activo: WhatsApp & Correo
                </span>
              </div>

              <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#245347] mt-1">
                Dra. Marcela Restrepo
              </h2>
              <p className="text-xs sm:text-sm text-[#404945]">
                Especialista en Psicoterapia Cognitivo-Conductual • Reg. Sanitario N° 84920-CL
              </p>

              {/* 3 Detail Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2 text-xs">
                <div className="p-2.5 bg-[#e6f7f2] rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#245347] text-base">calendar_today</span>
                  <div>
                    <span className="text-[10px] text-[#707975] block uppercase">Fecha</span>
                    <span className="font-bold text-[#0f1e1c]">Jueves, 24 Octubre</span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#e6f7f2] rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#245347] text-base">schedule</span>
                  <div>
                    <span className="text-[10px] text-[#707975] block uppercase">Horario</span>
                    <span className="font-bold text-[#0f1e1c]">16:00 - 17:00 hrs</span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#e6f7f2] rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#245347] text-base">videocam</span>
                  <div>
                    <span className="text-[10px] text-[#707975] block uppercase">Modalidad</span>
                    <span className="font-bold text-[#0f1e1c]">En Línea (Sala Segura)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-2.5 lg:min-w-[220px]">
            <button
              onClick={() => onJoinMeeting(featuredAppointment)}
              className="py-3 px-5 rounded-xl bg-[#245347] hover:bg-[#3d6b5e] text-white font-headline font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-lg">video_call</span>
              <span>Ingresar a Sala Virtual</span>
            </button>

            <button
              onClick={() => setShowRescheduleModal(true)}
              className="py-2.5 px-4 rounded-xl bg-[#e6f7f2] hover:bg-[#dbece7] text-[#245347] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">edit_calendar</span>
              <span>Reprogramar</span>
            </button>

            <button
              onClick={() => {
                alert('Sincronizado con Google Calendar: Cita agendada para el Jueves 24 de Octubre a las 16:00.');
              }}
              className="py-2 px-3 rounded-xl text-[#404945] hover:text-[#0f1e1c] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">event</span>
              <span>Google Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Content: Appointments & Clinical Notes vs Sidebar with Mood & Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Tabs for Next Sessions, Past History, Notes */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Tabs Bar */}
          <div className="w-full bg-white rounded-xl shadow-xs p-1.5 flex items-center gap-1 border border-[#e0f2ed] overflow-x-auto">
            <button
              onClick={() => setActiveTab('proximas')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-headline transition-all text-center whitespace-nowrap ${
                activeTab === 'proximas'
                  ? 'bg-[#bbeddc] text-[#002019] font-bold shadow-xs'
                  : 'text-[#404945] hover:text-[#0f1e1c]'
              }`}
            >
              Próximas Citas ({upcomingAppointments.length + 1})
            </button>
            <button
              onClick={() => setActiveTab('historial')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-headline transition-all text-center whitespace-nowrap ${
                activeTab === 'historial'
                  ? 'bg-[#bbeddc] text-[#002019] font-bold shadow-xs'
                  : 'text-[#404945] hover:text-[#0f1e1c]'
              }`}
            >
              Historial de Sesiones (12)
            </button>
            <button
              onClick={() => setActiveTab('notas')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-headline transition-all text-center whitespace-nowrap ${
                activeTab === 'notas'
                  ? 'bg-[#bbeddc] text-[#002019] font-bold shadow-xs'
                  : 'text-[#404945] hover:text-[#0f1e1c]'
              }`}
            >
              Notas y Tareas Terapéuticas
            </button>
            <button
              onClick={() => setActiveTab('facturacion')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-headline transition-all text-center whitespace-nowrap ${
                activeTab === 'facturacion'
                  ? 'bg-[#bbeddc] text-[#002019] font-bold shadow-xs'
                  : 'text-[#404945] hover:text-[#0f1e1c]'
              }`}
            >
              Documentos & Facturación
            </button>
          </div>

          {/* Subview: Próximas Citas */}
          {activeTab === 'proximas' && (
            <div className="flex flex-col gap-4">
              <h3 className="font-headline font-bold text-base text-[#245347]">
                Sesiones Confirmadas en Calendario
              </h3>

              {/* Card 1: Nov 02 */}
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e0f2ed] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#e6f7f2] flex flex-col items-center justify-center text-[#245347] font-headline font-bold">
                    <span className="text-[11px] uppercase">NOV</span>
                    <span className="text-xl leading-none">02</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#4e5e7f] bg-[#d7e2ff] px-2 py-0.2 rounded-full">
                      Sábado • 16:00 - 17:00 hrs
                    </span>
                    <h4 className="font-headline font-bold text-base text-[#0f1e1c] mt-1">
                      Técnicas de Reestructuración Cognitiva y Desescalada
                    </h4>
                    <p className="text-xs text-[#404945]">
                      Dra. Marcela Restrepo • Sala Virtual Segura
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onJoinMeeting(featuredAppointment)}
                    className="px-4 py-2 rounded-xl bg-[#e6f7f2] hover:bg-[#dbece7] text-[#245347] text-xs font-bold transition-colors"
                  >
                    Detalles
                  </button>
                </div>
              </div>

              {/* Card 2: Nov 16 */}
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e0f2ed] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#e6f7f2] flex flex-col items-center justify-center text-[#245347] font-headline font-bold">
                    <span className="text-[11px] uppercase">NOV</span>
                    <span className="text-xl leading-none">16</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#002019] bg-[#bbeddc] px-2 py-0.2 rounded-full">
                      Sábado • 16:00 - 17:00 hrs
                    </span>
                    <h4 className="font-headline font-bold text-base text-[#0f1e1c] mt-1">
                      Evaluación de Bitácora Semanal y Autocuidado
                    </h4>
                    <p className="text-xs text-[#404945]">
                      Dra. Marcela Restrepo • Consultorio 302 Presencial
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onJoinMeeting(featuredAppointment)}
                    className="px-4 py-2 rounded-xl bg-[#e6f7f2] hover:bg-[#dbece7] text-[#245347] text-xs font-bold transition-colors"
                  >
                    Detalles
                  </button>
                </div>
              </div>

              {/* Section: Última Sesión Concluida matching Image 8 */}
              <div className="bg-[#f8faf9] rounded-2xl p-5 border border-[#e0f2ed] mt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-headline font-bold text-xs uppercase tracking-wider text-[#404945]">
                    Última Sesión Concluida • 10 de Octubre, 2024
                  </span>
                  <span className="text-xs text-[#245347] font-bold">Sesión #12</span>
                </div>
                <h4 className="font-headline font-bold text-base text-[#0f1e1c] mb-1">
                  Evolución Clínica • Resumen Paciente
                </h4>
                <p className="text-xs text-[#404945] leading-relaxed mb-4">
                  "Camila presentó significativos avances en la identificación temprana de somatizaciones por sobrecarga laboral. Se establecieron micro-pausas y técnica de anclaje de 5 sentidos para momentos de alta tensión."
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowReportSuccessModal(true)}
                    className="py-2 px-3.5 rounded-xl bg-white border border-[#e0f2ed] text-xs font-bold text-[#245347] hover:bg-[#e6f7f2] flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Descargar Resumen Clínico & Tareas (PDF Seguro)
                  </button>
                  <button
                    onClick={onNavigateToTherapist}
                    className="py-2 px-3.5 rounded-xl bg-[#245347] text-white text-xs font-bold hover:bg-[#3d6b5e] flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    Volver a agendar con Dra. Marcela
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Subview: Historial */}
          {activeTab === 'historial' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0f2ed] space-y-4">
              <h3 className="font-headline font-bold text-base text-[#245347]">
                Historial de Sesiones Realizadas (12 sesiones completadas)
              </h3>
              <div className="divide-y divide-[#e0f2ed] text-xs">
                {[
                  { num: 12, fecha: '10 Oct 2024', tema: 'Técnica de anclaje de 5 sentidos y micro-pausas', terapeuta: 'Dra. Marcela Restrepo' },
                  { num: 11, fecha: '26 Sep 2024', tema: 'Desactivación fisiológica y respiración 4-7-8', terapeuta: 'Dra. Marcela Restrepo' },
                  { num: 10, fecha: '12 Sep 2024', tema: 'Reestructuración de pensamientos automáticos laborales', terapeuta: 'Dra. Marcela Restrepo' },
                  { num: 9, fecha: '29 Ago 2024', tema: 'Establecimiento de límites comunicacionales asertivos', terapeuta: 'Dra. Marcela Restrepo' },
                ].map((s) => (
                  <div key={s.num} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#0f1e1c]">Sesión #{s.num} • {s.fecha}</span>
                      <p className="text-[#404945]">{s.tema}</p>
                    </div>
                    <span className="bg-[#bbeddc] text-[#002019] px-2 py-0.5 rounded-full font-bold text-[10px]">
                      Completada
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subview: Notas y Tareas */}
          {activeTab === 'notas' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0f2ed] space-y-4">
              <h3 className="font-headline font-bold text-base text-[#245347]">
                Tareas Terapéuticas Asignadas para Esta Semana
              </h3>
              <div className="space-y-3">
                <div className="p-3.5 bg-[#e6f7f2] rounded-xl flex items-start gap-3">
                  <input type="checkbox" defaultChecked className="mt-1 accent-[#245347]" />
                  <div>
                    <h4 className="font-bold text-xs text-[#0f1e1c]">Autorregistro ABC de Pensamientos</h4>
                    <p className="text-xs text-[#404945]">Anotar en la bitácora cuando aparezca sensación de falta de aire en el trabajo.</p>
                  </div>
                </div>
                <div className="p-3.5 bg-[#e6f7f2] rounded-xl flex items-start gap-3">
                  <input type="checkbox" defaultChecked className="mt-1 accent-[#245347]" />
                  <div>
                    <h4 className="font-bold text-xs text-[#0f1e1c]">Respiración 4-7-8 antes de dormir</h4>
                    <p className="text-xs text-[#404945]">Realizar 4 ciclos continuos al acostarse para facilitar el inicio del sueño.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subview: Facturación */}
          {activeTab === 'facturacion' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0f2ed] space-y-4">
              <h3 className="font-headline font-bold text-base text-[#245347]">
                Comprobantes y Facturas Electrónicas
              </h3>
              <p className="text-xs text-[#707975]">
                Todos tus comprobantes emitidos válidos para reembolso en pólizas de salud o EPS.
              </p>
              <div className="divide-y divide-[#e0f2ed] text-xs">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0f1e1c]">Factura #FE-2024-891</span>
                    <p className="text-[#404945]">Sesión Individual • 10 Octubre • $55 USD</p>
                  </div>
                  <button onClick={() => alert('Descargando factura en PDF...')} className="text-[#245347] font-bold hover:underline">
                    Descargar PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Emotional Diary, Quick Booking & Direct Chat */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Quick Consultation CTA */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-[#e0f2ed]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-headline font-bold text-sm text-[#0f1e1c]">
                ¿Necesitas una nueva sesión?
              </h4>
              <span className="material-symbols-outlined text-[#245347]">add_circle</span>
            </div>
            <p className="text-xs text-[#404945] mb-3">
              Encuentra especialistas verificados con agenda abierta hoy.
            </p>
            <button
              onClick={onNavigateToTherapist}
              className="w-full py-2.5 rounded-xl bg-[#245347] text-white font-headline font-bold text-xs hover:bg-[#3d6b5e] shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-sm">search</span>
              Ver Directorio de Terapeutas
            </button>
          </div>

          {/* Registro Emocional Semanal matching Images 8 & 10 */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-[#e0f2ed]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-headline font-bold text-sm text-[#0f1e1c]">
                  Registro Emocional Semanal
                </h4>
                <span className="text-[11px] text-[#245347] font-bold">+14% Estabilidad esta semana</span>
              </div>
              <span className="material-symbols-outlined text-[#245347] text-xl">mood</span>
            </div>

            {/* Sparkline curve */}
            <div className="my-2 py-1">
              <svg className="w-full h-9" viewBox="0 0 200 35" fill="none">
                <path
                  d="M0 25 C30 28, 60 15, 90 18 C120 22, 150 10, 180 8 L200 10"
                  stroke="#245347"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="200" cy="10" r="4" fill="#245347" />
              </svg>
            </div>

            {/* Interactive Mood Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#404945] block">
                ¿Cómo te sientes hoy? (Toca para guardar en Mongo):
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {moods.map((m) => (
                  <button
                    key={m.level}
                    type="button"
                    onClick={() => handleLogMood(m)}
                    className={`py-2 flex flex-col items-center justify-center rounded-xl transition-all ${
                      selectedMood === m.level
                        ? 'bg-[#bbeddc] ring-2 ring-[#245347] shadow-xs scale-105'
                        : 'bg-[#e6f7f2] hover:bg-[#dbece7]'
                    }`}
                  >
                    <span className="text-lg">{m.emoji}</span>
                    <span className="text-[9px] font-bold text-[#0f1e1c] mt-0.5">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Days summary */}
            <div className="grid grid-cols-7 gap-1 text-center mt-3 pt-2 border-t border-[#e0f2ed] text-[10px]">
              {['Vie', 'Sáb', 'Dom', 'Lun', 'Mar', 'Mié', 'Hoy'].map((d, i) => (
                <div key={d} className="flex flex-col items-center">
                  <span className="text-[#707975] font-semibold">{d}</span>
                  <span className="text-sm mt-0.5">
                    {i === 3 ? '😔' : i === 0 ? '😐' : '🌱'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Chat with Dra. Marcela Restrepo */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-[#e0f2ed] flex flex-col h-80">
            <div className="flex items-center justify-between pb-2 border-b border-[#e0f2ed]">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUXQXkzyYstLCQL_Xb2n7668oRHnrBQTuvLWUWqkdMIgDskRyp7vppwDbGc3AHNn1OL4iMuci26VQ6nyygUjVekLNj3OjNPxs8_B_n71GsDcj9jIxfmF4keQFdFqF_FOxDBygRZSKniY4oQJkhs44cEaw4oh2-HtWc9_3Gmocn5yVOJkxBbly4vfMUS1Sjbelz2lAPJPODug8uDufF2h6fZKoBKIHNdktu_uBDhPE5axI_RhXnzR7a"
                    alt="Dra. Marcela"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-[#245347]"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#13AA52] ring-1 ring-white"></span>
                </div>
                <div>
                  <span className="font-bold text-xs text-[#0f1e1c] block">Dra. Marcela Restrepo</span>
                  <span className="text-[10px] text-[#245347]">Canal Encriptado Activo</span>
                </div>
              </div>
              <span className="text-[10px] text-[#707975]">Directo</span>
            </div>

            {/* Chat messages */}
            <div className="flex-1 py-3 overflow-y-auto space-y-2 text-xs">
              {chatMessages.map((msg: any) => {
                const isMe = msg.remitente === 'paciente';
                return (
                  <div
                    key={msg._id}
                    className={`max-w-[85%] p-2.5 rounded-2xl ${
                      isMe
                        ? 'bg-[#245347] text-white self-end ml-auto rounded-tr-xs'
                        : 'bg-[#e6f7f2] text-[#0f1e1c] self-start rounded-tl-xs'
                    }`}
                  >
                    <p className="text-xs leading-relaxed">{msg.texto}</p>
                    <span className={`text-[9px] block text-right mt-1 ${isMe ? 'text-white/70' : 'text-[#707975]'}`}>
                      {msg.fecha}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chat form */}
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-[#e0f2ed] flex items-center gap-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Escribe un mensaje a tu terapeuta..."
                className="flex-1 px-3 py-2 bg-[#e6f7f2] rounded-xl text-xs text-[#0f1e1c] focus:outline-none focus:ring-1 focus:ring-[#245347]"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-[#245347] text-white flex items-center justify-center hover:bg-[#3d6b5e] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>

          {/* Emergency Crisis Banner matching Image 8 */}
          <div className="bg-[#ffdad6] rounded-2xl p-4 border border-[#ffb4a2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#ba1a1a] text-2xl">emergency</span>
              <div>
                <span className="font-bold text-xs text-[#93000a] block">Línea gratuita de contención 24/7</span>
                <span className="text-[11px] text-[#7a3625]">Asistencia psicológica inmediata</span>
              </div>
            </div>
            <button
              onClick={onOpenEmergencyModal}
              className="py-1.5 px-3 rounded-xl bg-[#ba1a1a] text-white font-bold text-xs hover:bg-[#93000a] transition-colors"
            >
              Llamar
            </button>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#e0f2ed]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0f2ed] mb-4">
              <h3 className="font-headline text-lg font-bold text-[#245347]">
                Reprogramar Cita con Dra. Marcela
              </h3>
              <button onClick={() => setShowRescheduleModal(false)} className="text-[#404945]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs sm:text-sm">
              <p className="text-xs text-[#404945]">
                Selecciona una nueva fecha y hora dentro de las próximas 2 semanas. El cambio se guardará en MongoDB.
              </p>
              <div>
                <label className="block font-bold text-[#0f1e1c] mb-1">Nueva Fecha</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0f1e1c] mb-1">Nueva Hora</label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]"
                >
                  <option value="15:00">15:00 - 16:00 hrs</option>
                  <option value="16:00">16:00 - 17:00 hrs</option>
                  <option value="17:00">17:00 - 18:00 hrs</option>
                  <option value="18:00">18:00 - 19:00 hrs</option>
                </select>
              </div>
              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#e6f7f2] text-[#404945] font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmReschedule}
                  className="flex-1 py-2.5 rounded-xl bg-[#245347] text-white font-bold hover:bg-[#3d6b5e]"
                >
                  Confirmar Cambio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Report Downloaded Modal */}
      {showReportSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#e0f2ed] text-center">
            <div className="w-14 h-14 rounded-full bg-[#bbeddc] text-[#245347] flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-[#245347] mb-1">
              Informe Clínico Generado
            </h3>
            <p className="text-xs text-[#404945] mb-4">
              Se ha preparado tu archivo encriptado: <strong>Resumen_Sesion_12_Camila_Morales.pdf</strong> con tus tareas y ejercicios de anclaje de 5 sentidos.
            </p>
            <button
              onClick={() => setShowReportSuccessModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#245347] text-white font-bold text-xs"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
