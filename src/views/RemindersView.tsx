import React, { useState } from 'react';
import { mongoDb } from '../services/mongoService';

export const RemindersView: React.FC = () => {
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('todos');
  const [patientConfirmedInSimulator, setPatientConfirmedInSimulator] = useState<boolean>(false);
  const [patientRescheduledInSimulator, setPatientRescheduledInSimulator] = useState<boolean>(false);
  const [showNewFlowModal, setShowNewFlowModal] = useState(false);
  const [showChannelConfigModal, setShowChannelConfigModal] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Read flows and monitor logs from MongoDB
  const flows = mongoDb.find('flujos_recordatorios');
  const monitorLogs = mongoDb.find('monitor_envios');

  // Filtered monitor table
  const filteredMonitor = monitorLogs.filter((m: any) => {
    if (selectedChannelFilter === 'todos') return true;
    return m.canalTipo === selectedChannelFilter;
  });

  // Flow 1 template state
  const [flow1Template, setFlow1Template] = useState(
    'Estimado/a {nombre_paciente}, recordamos tu sesión de psicoterapia programada para el {fecha_cita} con {nombre_terapeuta}. Adjuntamos las pautas para tu espacio de calma reflexivo. Por favor confirma tu asistencia con el botón inferior.'
  );

  // Flow 2 template state
  const [flow2Template, setFlow2Template] = useState(
    'Hola {nombre_paciente} 🌿, te recordamos tu espacio terapéutico de mañana {fecha_cita}. Queremos asegurarnos de que cuentas con este momento para ti.'
  );

  // Toggles for flows
  const [flow1Active, setFlow1Active] = useState(true);
  const [flow2Active, setFlow2Active] = useState(true);
  const [flow3Active, setFlow3Active] = useState(true);

  // Trigger simulated patient confirmation from phone
  const handleSimulatorConfirm = () => {
    setPatientConfirmedInSimulator(true);
    setPatientRescheduledInSimulator(false);

    // Update Mateo Valenzuela in MongoDB
    mongoDb.updateOne(
      'monitor_envios',
      { pacienteNombre: 'Mateo Valenzuela' },
      { $set: { estadoEnvio: 'Confirmado por Paciente', estadoColor: 'green', ultimaInteraccion: 'Justo ahora (WhatsApp)' } }
    );

    setActiveToast('✓ Confirmación de WhatsApp recibida y sincronizada en MongoDB');
    setTimeout(() => setActiveToast(null), 4000);
  };

  const handleSimulatorReschedule = () => {
    setPatientRescheduledInSimulator(true);
    setPatientConfirmedInSimulator(false);

    mongoDb.updateOne(
      'monitor_envios',
      { pacienteNombre: 'Mateo Valenzuela' },
      { $set: { estadoEnvio: 'Solicitud Reagendamiento', estadoColor: 'amber', ultimaInteraccion: 'Justo ahora (WhatsApp)' } }
    );

    setActiveToast('⚠️ El paciente solicitó reprogramar. Alerta guardada en MongoDB.');
    setTimeout(() => setActiveToast(null), 4000);
  };

  const handleSendSMSTest = () => {
    mongoDb.insertOne('monitor_envios', {
      pacienteNombre: 'Prueba Paciente (Tú)',
      iniciales: 'TU',
      tipoTerapia: 'Prueba de Recordatorio',
      citaProgramada: 'Hoy, 20:00 hrs',
      modalidadTexto: 'Tele-consulta Test',
      canal: 'SMS (1h)',
      canalTipo: 'sms',
      estadoEnvio: 'Entregado',
      estadoColor: 'amber',
      ultimaInteraccion: 'Recién enviado'
    });

    setActiveToast('📨 SMS de prueba enviado y registrado en la colección MongoDB `monitor_envios`');
    setTimeout(() => setActiveToast(null), 4000);
  };

  // Resend reminder to a patient in table
  const handleResendReminder = (paciente: string, canal: string) => {
    mongoDb.updateOne(
      'monitor_envios',
      { pacienteNombre: paciente },
      { $set: { ultimaInteraccion: 'Reenviado hace un momento' } }
    );
    setActiveToast(`Recordatorio reenviado a ${paciente} vía ${canal}.`);
    setTimeout(() => setActiveToast(null), 3000);
  };

  return (
    <div className="flex flex-col w-full max-w-[1440px] mx-auto px-4 md:px-6 py-6">
      
      {/* Toast feedback */}
      {activeToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#245347] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{activeToast}</span>
        </div>
      )}

      {/* Top Banner Ribbon matching Image 5 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#dbece7] px-3.5 py-1 rounded-full text-[11px] font-headline font-bold text-[#245347] uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#245347] animate-pulse"></span>
            AUTOMATIZACIÓN CLÍNICA ACTIVA • Actualizado hace 4 min
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#245347] tracking-tight">
            Sistema de Recordatorios Automáticos y Gestión de Asistencia
          </h1>
          <p className="text-xs sm:text-sm text-[#404945] max-w-3xl mt-1">
            Reduce el ausentismo clínico hasta en un 85% automatizando notificaciones inteligentes a tus pacientes con tono terapéutico y confirmación directa.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setShowChannelConfigModal(true)}
            className="flex-1 sm:flex-initial h-10 px-4 rounded-xl bg-white hover:bg-[#e6f7f2] text-[#404945] font-semibold text-xs border border-[#e0f2ed] shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-base">settings</span>
            Configurar Canales
          </button>
          <button
            onClick={() => setShowNewFlowModal(true)}
            className="flex-1 sm:flex-initial h-10 px-4 rounded-xl bg-[#245347] hover:bg-[#3d6b5e] text-white font-headline font-bold text-xs shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Nuevo Flujo
          </button>
        </div>
      </div>

      {/* 3 Metric Summary Cards matching Image 5 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0f2ed] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-headline font-bold text-xs uppercase tracking-wider text-[#404945]">
              Efectividad Global
            </span>
            <span className="w-8 h-8 rounded-xl bg-[#bbeddc] text-[#245347] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">trending_up</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-3xl sm:text-4xl font-bold text-[#245347]">92.4%</span>
              <span className="text-xs font-bold text-[#245347]">+4.2% vs mes anterior</span>
            </div>
            <span className="text-xs text-[#707975] mt-1 block">Tasa de confirmación anticipada</span>
          </div>
          {/* Sparkline svg */}
          <div className="mt-3 pt-2 border-t border-[#e0f2ed]">
            <svg className="w-full h-8" viewBox="0 0 200 30" fill="none">
              <path
                d="M0 25 C30 20, 50 22, 80 15 C110 10, 140 18, 170 8 L200 5"
                stroke="#245347"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0f2ed] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-headline font-bold text-xs uppercase tracking-wider text-[#404945]">
              Volumen del Ciclo
            </span>
            <span className="w-8 h-8 rounded-xl bg-[#d7e2ff] text-[#091b38] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">send</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-3xl sm:text-4xl font-bold text-[#0f1e1c]">158</span>
              <span className="text-xs font-bold text-[#404945]">mensajes enviados</span>
            </div>
            <span className="text-xs text-[#707975] mt-1 block">Últimos 30 días de atención clínica</span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#e0f2ed] flex items-center justify-between text-xs text-[#404945]">
            <span>WhatsApp: <strong>104</strong></span>
            <span>Email: <strong>36</strong></span>
            <span>SMS: <strong>18</strong></span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0f2ed] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-headline font-bold text-xs uppercase tracking-wider text-[#404945]">
              Optimización de Agenda
            </span>
            <span className="w-8 h-8 rounded-xl bg-[#c7d7fd] text-[#4e5e7f] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">event_available</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-3xl sm:text-4xl font-bold text-[#4e5e7f]">1.2%</span>
              <span className="text-xs font-bold text-[#245347]">-3.1% cancelaciones</span>
            </div>
            <span className="text-xs text-[#707975] mt-1 block">Tasa de ausentismo no notificado (No-Show)</span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#e0f2ed] flex items-center justify-between text-xs text-[#404945]">
            <span>Turnos reasignados a lista de espera: <strong>6 pacientes</strong></span>
          </div>
        </div>
      </div>

      {/* Main Two Columns: Automated Flows Config vs Mobile Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Left Column: Automated Flows (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-bold text-lg text-[#245347] flex items-center gap-2">
              <span className="material-symbols-outlined">workflow</span>
              Flujos Activos de Notificación
            </h2>
            <span className="text-xs text-[#707975]">3 secuencias configuradas</span>
          </div>

          {/* Flow 1: Anticipación Terapéutica (48h antes • Email) */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0f2ed] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#d7e2ff] text-[#091b38] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">mail</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-sm text-[#0f1e1c]">
                      Flujo 1: Anticipación Terapéutica
                    </h3>
                    <span className="bg-[#d7e2ff] text-[#091b38] text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                      48h antes • Email
                    </span>
                  </div>
                  <p className="text-xs text-[#404945]">Correo con guía previa, encuadre y botón de confirmación.</p>
                </div>
              </div>

              {/* Toggle switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={flow1Active}
                  onChange={(e) => setFlow1Active(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-[#d5e6e1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#245347]"></div>
              </label>
            </div>

            {/* Template Editor */}
            <div className="p-3 bg-[#e6f7f2] rounded-xl text-xs space-y-2">
              <span className="font-bold text-[#404945] block text-[11px]">Plantilla Editable:</span>
              <textarea
                rows={2}
                value={flow1Template}
                onChange={(e) => setFlow1Template(e.target.value)}
                className="w-full bg-white p-2.5 rounded-lg border border-[#e0f2ed] text-xs text-[#0f1e1c] focus:outline-none focus:ring-1 focus:ring-[#245347]"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[#707975]">Variables:</span>
                  <button onClick={() => setFlow1Template(t => t + ' {nombre_paciente}')} className="bg-white px-2 py-0.5 rounded text-[10px] font-mono text-[#245347] border border-[#e0f2ed]">+{'{nombre_paciente}'}</button>
                  <button onClick={() => setFlow1Template(t => t + ' {fecha_cita}')} className="bg-white px-2 py-0.5 rounded text-[10px] font-mono text-[#245347] border border-[#e0f2ed]">+{'{fecha_cita}'}</button>
                </div>
                <span className="text-[11px] text-[#245347] font-semibold">Incluye botón: [ Confirmar Cita ]</span>
              </div>
            </div>
          </div>

          {/* Flow 2: Confirmación Directa WhatsApp (24h antes) - DESTACADO */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-[#245347] ring-2 ring-[#245347]/10 flex flex-col gap-3 relative">
            <div className="absolute -top-3 right-6 bg-[#245347] text-white text-[10px] font-headline font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Más Efectivo (96% Respuesta)
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    chat
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-sm text-[#0f1e1c]">
                      Flujo 2: Confirmación Directa WhatsApp
                    </h3>
                    <span className="bg-[#bbeddc] text-[#002019] text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                      24h antes • WhatsApp
                    </span>
                  </div>
                  <p className="text-xs text-[#404945]">Mensaje enriquecido con botones de confirmación de 1 clic.</p>
                </div>
              </div>

              {/* Toggle switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={flow2Active}
                  onChange={(e) => setFlow2Active(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-[#d5e6e1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#245347]"></div>
              </label>
            </div>

            {/* Template Editor */}
            <div className="p-3 bg-[#e6f7f2] rounded-xl text-xs space-y-2">
              <span className="font-bold text-[#404945] block text-[11px]">Mensaje de WhatsApp Interactivo:</span>
              <textarea
                rows={2}
                value={flow2Template}
                onChange={(e) => setFlow2Template(e.target.value)}
                className="w-full bg-white p-2.5 rounded-lg border border-[#e0f2ed] text-xs text-[#0f1e1c] focus:outline-none focus:ring-1 focus:ring-[#245347]"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#404945]">Botones de Acción Rápida:</span>
                  <span className="bg-white px-2 py-0.5 rounded text-[#245347] font-bold border border-[#e0f2ed]">[ Sí, Asistiré ]</span>
                  <span className="bg-white px-2 py-0.5 rounded text-[#707975] font-bold border border-[#e0f2ed]">[ Reprogramar ]</span>
                </div>
                <span className="text-[#13AA52] font-semibold">✓ Sincroniza al instante con la agenda</span>
              </div>
            </div>
          </div>

          {/* Flow 3: Acceso Inmediato a Sala (1h antes • SMS) */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0f2ed] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ffdad2] text-[#7a3625] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">sms</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-sm text-[#0f1e1c]">
                      Flujo 3: Acceso Inmediato a Sala
                    </h3>
                    <span className="bg-[#ffdad2] text-[#7a3625] text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                      1h antes • SMS Prioritario
                    </span>
                  </div>
                  <p className="text-xs text-[#404945]">SMS con enlace directo a la sala cifrada de Google Meet.</p>
                </div>
              </div>

              {/* Toggle switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={flow3Active}
                  onChange={(e) => setFlow3Active(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-[#d5e6e1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#245347]"></div>
              </label>
            </div>

            <div className="p-3 bg-[#e6f7f2] rounded-xl text-xs flex items-center justify-between">
              <span className="font-mono text-[#404945] text-[11px]">
                Psico_Gestión: {`{nombre_paciente}`}, tu sesión inicia en 60 min. Conéctate seguro en: https://meet.psicogestion.com/s/934a
              </span>
              <span className="bg-white text-[#245347] font-bold text-[10px] px-2 py-1 rounded-full border border-[#e0f2ed] whitespace-nowrap ml-2">
                HIPAA Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Patient Simulator (5 cols) matching Image 5 */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-bold text-lg text-[#245347] flex items-center gap-2">
              <span className="material-symbols-outlined">smartphone</span>
              Simulador en Vivo del Paciente
            </h2>
            <button
              onClick={handleSendSMSTest}
              className="text-xs font-bold text-[#245347] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              Enviar Prueba SMS
            </button>
          </div>

          {/* Smartphone Mockup Frame */}
          <div className="bg-[#1e293b] p-3.5 rounded-[40px] shadow-2xl border-4 border-[#334155] max-w-sm mx-auto w-full">
            
            {/* Phone Screen Container */}
            <div className="bg-[#EFEAE2] rounded-[32px] overflow-hidden flex flex-col h-[540px] relative shadow-inner">
              
              {/* Notch Bar */}
              <div className="bg-[#128C7E] h-8 px-5 flex items-center justify-between text-white text-[11px] font-bold">
                <span>09:41</span>
                <div className="w-20 h-4 bg-black/30 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">signal_cellular_alt</span>
                  <span className="material-symbols-outlined text-xs">wifi</span>
                  <span className="material-symbols-outlined text-xs">battery_full</span>
                </div>
              </div>

              {/* WhatsApp App Header */}
              <div className="bg-[#128C7E] px-4 py-2.5 flex items-center justify-between text-white shadow-sm">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNDUphLVzIfjW-RNU92cgzGKrqMJiLOvRdlIiieE5qA9-n2HD6IXfHZYSs0OWUzswIwUMJVCNMVO3ZI88Lpnc81XkFyzTjncDNjqaKJxFZxQSRwrNa4Jp9UsfybhGhmBJ3_WzDk3BHavkjTthAku09JfMuS52e2Am8vQKjkNelh4NSJPBKJF383AOHveWYd0FllFOkte3_-tdVpmglkvAjKnPN-_wWmNq0SiTCcPo-kGjcuHfg5465"
                    alt="Dra. Sofía Mendoza"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-white/60"
                  />
                  <div className="leading-tight">
                    <span className="font-bold text-xs block flex items-center gap-1">
                      Dra. Sofía Mendoza
                      <span className="material-symbols-outlined text-[13px] text-[#25D366]">verified</span>
                    </span>
                    <span className="text-[10px] text-white/80">Psico_Gestión Oficial • En línea</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">videocam</span>
                  <span className="material-symbols-outlined text-base">call</span>
                </div>
              </div>

              {/* Chat Conversation Content */}
              <div className="flex-1 p-3.5 flex flex-col justify-between overflow-y-auto space-y-3">
                <div className="flex justify-center">
                  <span className="bg-[#d1d7db] text-[#404945] text-[10px] px-2.5 py-0.5 rounded-md shadow-xs">
                    HOY
                  </span>
                </div>

                {/* Reminder Bubble from Doctor */}
                <div className="bg-white rounded-2xl rounded-tl-xs p-3 shadow-xs max-w-[92%] self-start border border-[#d1d7db]/40">
                  <p className="text-xs text-[#111b21] leading-relaxed">
                    Hola Mateo 🌿, te recordamos tu espacio terapéutico de <strong>mañana 16:30 hrs</strong> con la <strong>Dra. Sofía Mendoza</strong>.
                  </p>
                  <p className="text-xs text-[#111b21] mt-1.5 leading-relaxed">
                    Queremos asegurarnos de que cuentas con este momento para ti. Por favor confirma tocando una opción:
                  </p>
                  <div className="text-right text-[10px] text-[#667781] mt-1">
                    10:14 AM
                  </div>
                </div>

                {/* Interactive Action Buttons inside WhatsApp Message */}
                <div className="space-y-1.5 self-start w-[92%]">
                  <button
                    onClick={handleSimulatorConfirm}
                    disabled={patientConfirmedInSimulator}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 ${
                      patientConfirmedInSimulator
                        ? 'bg-[#bbeddc] text-[#002019] cursor-default'
                        : 'bg-white hover:bg-[#dcf8c6] text-[#075e54] border border-[#25D366]/40 active:scale-95'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>{patientConfirmedInSimulator ? '✓ Confirmado con Éxito' : 'Sí, Asistiré a la Sesión'}</span>
                  </button>

                  <button
                    onClick={handleSimulatorReschedule}
                    disabled={patientRescheduledInSimulator}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 ${
                      patientRescheduledInSimulator
                        ? 'bg-[#ffd6cc] text-[#7a3625] cursor-default'
                        : 'bg-white hover:bg-[#ffdad6] text-[#ba1a1a] border border-[#ffdad6] active:scale-95'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span>{patientRescheduledInSimulator ? 'Solicitud Enviada' : 'Necesito Reprogramar'}</span>
                  </button>
                </div>

                {/* Patient Simulated Response Bubble */}
                {patientConfirmedInSimulator && (
                  <div className="bg-[#dcf8c6] rounded-2xl rounded-tr-xs p-2.5 shadow-xs max-w-[85%] self-end animate-in slide-in-from-bottom-2">
                    <p className="text-xs text-[#111b21]">
                      ✓ He confirmado mi asistencia. ¡Nos vemos mañana a las 16:30!
                    </p>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-[#667781] mt-0.5">
                      <span>10:15 AM</span>
                      <span className="material-symbols-outlined text-xs text-[#34B7F1]">done_all</span>
                    </div>
                  </div>
                )}

                {patientRescheduledInSimulator && (
                  <div className="bg-[#dcf8c6] rounded-2xl rounded-tr-xs p-2.5 shadow-xs max-w-[85%] self-end animate-in slide-in-from-bottom-2">
                    <p className="text-xs text-[#111b21]">
                      Hola doctora, se me presentó un imprevisto laboral. ¿Podríamos mover la sesión para el viernes?
                    </p>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-[#667781] mt-0.5">
                      <span>10:15 AM</span>
                      <span className="material-symbols-outlined text-xs text-[#34B7F1]">done_all</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Footer Input bar */}
              <div className="bg-[#f0f2f5] p-2 flex items-center gap-2 border-t border-[#d1d7db]">
                <span className="material-symbols-outlined text-[#54656f] text-lg">mood</span>
                <div className="flex-1 bg-white h-8 rounded-full px-3 text-xs flex items-center text-[#54656f]">
                  Escribe un mensaje...
                </div>
                <div className="w-8 h-8 rounded-full bg-[#128C7E] text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-sm">mic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monitor de Envíos en Vivo Table matching Image 5 */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#e0f2ed]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-headline font-bold text-lg text-[#245347] flex items-center gap-2">
              <span className="material-symbols-outlined">live_tv</span>
              Monitor de Envíos en Vivo (Sincronizado con MongoDB)
            </h3>
            <p className="text-xs text-[#707975]">
              Estado en tiempo real de los recordatorios despachados y respuestas de pacientes.
            </p>
          </div>

          {/* Channel filter tabs */}
          <div className="flex items-center bg-[#e6f7f2] p-1 rounded-xl text-xs font-semibold">
            {['todos', 'whatsapp', 'email', 'sms'].map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChannelFilter(ch)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  selectedChannelFilter === ch
                    ? 'bg-white text-[#245347] font-bold shadow-xs'
                    : 'text-[#404945] hover:text-[#0f1e1c]'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Live Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8faf9] text-[#707975] uppercase font-headline font-bold border-b border-[#e0f2ed]">
              <tr>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Cita Programada</th>
                <th className="py-3 px-4">Canal</th>
                <th className="py-3 px-4">Estado de Envío</th>
                <th className="py-3 px-4">Última Interacción</th>
                <th className="py-3 px-4 text-right">Acciones Inmediatas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0f2ed]">
              {filteredMonitor.map((row: any) => (
                <tr key={row._id} className="hover:bg-[#e6f7f2]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#bbeddc] text-[#245347] flex items-center justify-center font-bold text-xs">
                        {row.iniciales || 'PA'}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#0f1e1c] block">
                          {row.pacienteNombre}
                        </span>
                        <span className="text-[11px] text-[#707975]">
                          {row.tipoTerapia}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#0f1e1c] block">{row.citaProgramada}</span>
                    <span className="text-[11px] text-[#707975]">{row.modalidadTexto}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#404945]">
                      <span className="material-symbols-outlined text-base">
                        {row.canalTipo === 'whatsapp' ? 'chat' : row.canalTipo === 'email' ? 'mail' : 'sms'}
                      </span>
                      {row.canal}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      row.estadoColor === 'green'
                        ? 'bg-[#bbeddc] text-[#002019]'
                        : row.estadoColor === 'blue'
                        ? 'bg-[#d7e2ff] text-[#091b38]'
                        : 'bg-[#ffd6cc] text-[#7a3625]'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {row.estadoEnvio}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-[#707975]">
                    {row.ultimaInteraccion}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleResendReminder(row.pacienteNombre, row.canal)}
                        title="Reenviar Notificación"
                        className="p-1.5 rounded-lg bg-[#e6f7f2] hover:bg-[#dbece7] text-[#245347] transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">sync</span>
                      </button>
                      <button
                        title="Abrir WhatsApp Web"
                        className="p-1.5 rounded-lg bg-[#e6f7f2] hover:bg-[#dbece7] text-[#128C7E] transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                      </button>
                      <button
                        title="Llamada de Verificación"
                        className="p-1.5 rounded-lg bg-[#e6f7f2] hover:bg-[#dbece7] text-[#4e5e7f] transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">call</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Flow Modal */}
      {showNewFlowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#e0f2ed]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0f2ed] mb-4">
              <h3 className="font-headline text-lg font-bold text-[#245347]">
                + Crear Flujo de Notificación
              </h3>
              <button onClick={() => setShowNewFlowModal(false)} className="text-[#404945]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#0f1e1c] mb-1">Nombre del Flujo</label>
                <input
                  type="text"
                  placeholder="Ej. Flujo Post-Sesión: Tareas y Ejercicios"
                  className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0f1e1c] mb-1">Momento de Disparo</label>
                <select className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]">
                  <option>24 horas después de la sesión</option>
                  <option>3 días antes de la sesión</option>
                  <option>Al agendar una nueva consulta</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#0f1e1c] mb-1">Canal Predeterminado</label>
                <select className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]">
                  <option>WhatsApp API Oficial</option>
                  <option>Email con Plantilla HTML</option>
                  <option>SMS Gateway Encriptado</option>
                </select>
              </div>
              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => setShowNewFlowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#e6f7f2] text-[#404945] font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    mongoDb.insertOne('flujos_recordatorios', {
                      titulo: 'Flujo 4: Seguimiento Post-Sesión',
                      tiempo: '24h después',
                      tipo: 'whatsapp',
                      activo: true,
                      descripcion: 'Envío de resumen y ejercicios prácticos.'
                    });
                    setShowNewFlowModal(false);
                    setActiveToast('Flujo creado en la colección MongoDB `flujos_recordatorios`');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#245347] text-white font-bold hover:bg-[#3d6b5e]"
                >
                  Guardar Flujo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Channel Config Modal */}
      {showChannelConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#e0f2ed]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0f2ed] mb-4">
              <h3 className="font-headline text-lg font-bold text-[#245347]">
                Configuración de Canales Clínicos
              </h3>
              <button onClick={() => setShowChannelConfigModal(false)} className="text-[#404945]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 bg-[#e6f7f2] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0f1e1c] block">WhatsApp Cloud API</span>
                  <span className="text-xs text-[#245347]">Conectado • Número +57 310 948 2000</span>
                </div>
                <span className="material-symbols-outlined text-[#245347]">check_circle</span>
              </div>
              <div className="p-3 bg-[#e6f7f2] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0f1e1c] block">Servidor SMTP Clínico</span>
                  <span className="text-xs text-[#245347]">notificaciones@psicogestion.com</span>
                </div>
                <span className="material-symbols-outlined text-[#245347]">check_circle</span>
              </div>
              <div className="p-3 bg-[#e6f7f2] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0f1e1c] block">Pasarela SMS Twilio / AWS</span>
                  <span className="text-xs text-[#245347]">Activo • Cifrado de extremo a extremo</span>
                </div>
                <span className="material-symbols-outlined text-[#245347]">check_circle</span>
              </div>
              <button
                onClick={() => setShowChannelConfigModal(false)}
                className="w-full mt-3 py-2.5 rounded-xl bg-[#245347] text-white font-bold"
              >
                Cerrar Configuración
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
