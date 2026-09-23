import React, { useState } from 'react';
import { mongoDb } from '../services/mongoService';

interface ScheduleCalendarViewProps {
  onJoinMeeting: (cita: any) => void;
  onOpenPatientFile: (pacienteId: string) => void;
}

export const ScheduleCalendarView: React.FC<ScheduleCalendarViewProps> = ({
  onJoinMeeting,
  onOpenPatientFile,
}) => {
  const [viewMode, setViewMode] = useState<'semana' | 'dia' | 'mes' | 'lista'>('semana');
  const [filterType, setFilterType] = useState<string>('todos');
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showBlockTimeModal, setShowBlockTimeModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  // Read appointments live from MongoDB
  const appointments = mongoDb.find('citas');

  // Filtered appointments
  const filteredAppointments = appointments.filter((c: any) => {
    if (filterType === 'todos') return true;
    if (filterType === 'confirmada') return c.estado === 'confirmada';
    if (filterType === 'pendiente_pago') return c.estado === 'pendiente_pago';
    if (filterType === 'virtual') return c.modalidad === 'virtual';
    if (filterType === 'presencial') return c.modalidad === 'presencial';
    return true;
  });

  // Next imminent patient card (Camila Morales)
  const nextPatient = appointments.find((c: any) => c.pacienteNombre === 'Camila Morales' && c.horaInicio === '09:00') || appointments[0];

  // Manual appointment form state
  const [newPatientName, setNewPatientName] = useState('');
  const [newTherapist, setNewTherapist] = useState('Dra. Sofía Mendoza');
  const [newDate, setNewDate] = useState('2024-10-22');
  const [newHour, setNewHour] = useState('11:00');
  const [newModality, setNewModality] = useState<'virtual' | 'presencial'>('virtual');
  const [newReason, setNewReason] = useState('Sesión de Terapia Individual');

  const handleCreateManualAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName) return;

    const newAppt = {
      pacienteNombre: newPatientName,
      pacienteId: `pac_${Date.now()}`,
      terapeutaNombre: newTherapist,
      fecha: newDate,
      diaSemana: 'Mar',
      horaInicio: newHour,
      horaFin: `${parseInt(newHour.split(':')[0]) + 1}:00`,
      motivo: newReason,
      modalidad: newModality,
      canal: newModality === 'virtual' ? 'Google Meet Encriptado' : 'Consultorio 302',
      estado: 'confirmada',
      montoUSD: 60,
      pagado: true,
      notas: 'Cita manual creada desde agenda de terapeuta.'
    };

    mongoDb.insertOne('citas', newAppt);
    setShowNewAppointmentModal(false);
    setNewPatientName('');
  };

  // Block time form state
  const [blockLabel, setBlockLabel] = useState('Almuerzo / Espacio Terapéutico');
  const [blockDate, setBlockDate] = useState('2024-10-22');
  const [blockHour, setBlockHour] = useState('13:00');

  const handleCreateBlockTime = (e: React.FormEvent) => {
    e.preventDefault();
    mongoDb.insertOne('citas', {
      pacienteNombre: blockLabel,
      pacienteId: 'bloqueo',
      fecha: blockDate,
      diaSemana: 'Mar',
      horaInicio: blockHour,
      horaFin: `${parseInt(blockHour.split(':')[0]) + 1}:00`,
      motivo: 'Espacio bloqueado',
      modalidad: 'bloqueo',
      canal: 'No asignable',
      estado: 'bloqueado',
      montoUSD: 0,
      pagado: true
    });
    setShowBlockTimeModal(false);
  };

  const daysOfWeek = [
    { name: 'Lun', date: '21', dayStr: '2024-10-21' },
    { name: 'Mar', date: '22', dayStr: '2024-10-22', today: true },
    { name: 'Mié', date: '23', dayStr: '2024-10-23' },
    { name: 'Jue', date: '24', dayStr: '2024-10-24' },
    { name: 'Vie', date: '25', dayStr: '2024-10-25' },
    { name: 'Sáb', date: '26', dayStr: '2024-10-26' },
  ];

  const hours = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  return (
    <div className="flex flex-col w-full max-w-[1440px] mx-auto px-4 md:px-6 py-6">
      
      {/* Top Controls Bar matching Image 3 */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5">
        
        {/* Left: View Mode Segmented Switcher */}
        <div className="flex items-center bg-white p-1 rounded-xl shadow-xs border border-[#e0f2ed]">
          {(['semana', 'dia', 'mes', 'lista'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold capitalize transition-all ${
                viewMode === mode
                  ? 'bg-[#245347] text-white shadow-xs'
                  : 'text-[#404945] hover:text-[#0f1e1c]'
              }`}
            >
              {mode === 'lista' ? 'Lista de Pacientes' : mode}
            </button>
          ))}
        </div>

        {/* Center: Date Range Navigator */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-xs border border-[#e0f2ed]">
          <button className="p-1 rounded-lg hover:bg-[#e6f7f2] text-[#404945]">
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <div className="flex items-center gap-2 px-2">
            <span className="material-symbols-outlined text-[#245347] text-lg">event</span>
            <span className="font-headline font-bold text-xs sm:text-sm text-[#0f1e1c]">
              Semana del 21 al 27 de Octubre, 2024
            </span>
          </div>
          <button className="p-1 rounded-lg hover:bg-[#e6f7f2] text-[#404945]">
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
          <button className="ml-2 px-2.5 py-1 bg-[#bbeddc] text-[#002019] text-xs font-bold rounded-lg hover:bg-[#a0d1c1]">
            Hoy
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={() => setShowBlockTimeModal(true)}
            className="flex-1 lg:flex-initial h-10 px-3.5 rounded-xl bg-white hover:bg-[#e6f7f2] text-[#404945] font-semibold text-xs border border-[#e0f2ed] shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-base">block</span>
            <span>Bloquear Horario</span>
          </button>

          <button
            onClick={() => setShowNewAppointmentModal(true)}
            className="flex-1 lg:flex-initial h-10 px-4 rounded-xl bg-[#245347] hover:bg-[#3d6b5e] text-white font-headline font-bold text-xs shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Nueva Cita Manual</span>
          </button>
        </div>
      </div>

      {/* Quick Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-xs font-headline font-bold text-[#404945] uppercase mr-1">
          Filtros de Agenda:
        </span>
        <button
          onClick={() => setFilterType('todos')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            filterType === 'todos' ? 'bg-[#245347] text-white' : 'bg-white text-[#404945] border border-[#e0f2ed]'
          }`}
        >
          Todas ({appointments.length})
        </button>
        <button
          onClick={() => setFilterType('confirmada')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            filterType === 'confirmada' ? 'bg-[#245347] text-white' : 'bg-white text-[#404945] border border-[#e0f2ed]'
          }`}
        >
          Confirmada (8)
        </button>
        <button
          onClick={() => setFilterType('pendiente_pago')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            filterType === 'pendiente_pago' ? 'bg-[#245347] text-white' : 'bg-white text-[#404945] border border-[#e0f2ed]'
          }`}
        >
          Pendiente de Pago (3)
        </button>
        <button
          onClick={() => setFilterType('virtual')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            filterType === 'virtual' ? 'bg-[#245347] text-white' : 'bg-white text-[#404945] border border-[#e0f2ed]'
          }`}
        >
          Virtual (14)
        </button>
        <button
          onClick={() => setFilterType('presencial')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            filterType === 'presencial' ? 'bg-[#245347] text-white' : 'bg-white text-[#404945] border border-[#e0f2ed]'
          }`}
        >
          Presencial (10)
        </button>
        {filterType !== 'todos' && (
          <button
            onClick={() => setFilterType('todos')}
            className="text-xs text-[#ba1a1a] hover:underline font-semibold ml-2"
          >
            Restablecer
          </button>
        )}
      </div>

      {/* Main Grid + Therapist Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left/Center: Calendar Weekly Timeline (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-[#e0f2ed] overflow-hidden">
          
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-[#e0f2ed] bg-[#f8faf9]">
            <div className="py-3 px-2 text-center text-xs font-headline font-bold text-[#707975] border-r border-[#e0f2ed]">
              Hora
            </div>
            {daysOfWeek.map((day) => (
              <div
                key={day.dayStr}
                className={`py-3 px-2 text-center border-r border-[#e0f2ed] last:border-r-0 ${
                  day.today ? 'bg-[#e6f7f2]' : ''
                }`}
              >
                <span className="block text-[11px] font-bold text-[#404945] uppercase">
                  {day.name}
                </span>
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-headline font-bold mt-0.5 ${
                    day.today
                      ? 'bg-[#245347] text-white shadow-xs'
                      : 'text-[#0f1e1c]'
                  }`}
                >
                  {day.date}
                </span>
              </div>
            ))}
          </div>

          {/* Hourly Timeline Cells */}
          <div className="divide-y divide-[#e0f2ed] max-h-[700px] overflow-y-auto">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-7 min-h-[64px] group">
                {/* Hour label */}
                <div className="p-2 text-center font-mono text-xs font-semibold text-[#707975] border-r border-[#e0f2ed] bg-[#f8faf9]/50 flex items-start justify-center pt-2">
                  {hour}
                </div>

                {/* Day cells for this hour */}
                {daysOfWeek.map((day) => {
                  // Find appointments starting around this hour for this day
                  const appts = filteredAppointments.filter((a: any) => {
                    return a.fecha === day.dayStr && a.horaInicio.startsWith(hour.slice(0, 2));
                  });

                  return (
                    <div
                      key={day.dayStr + hour}
                      onClick={() => {
                        if (appts.length === 0) {
                          setNewDate(day.dayStr);
                          setNewHour(hour);
                          setShowNewAppointmentModal(true);
                        }
                      }}
                      className={`p-1 border-r border-[#e0f2ed] last:border-r-0 transition-colors relative cursor-pointer hover:bg-[#e6f7f2]/40 ${
                        day.today ? 'bg-[#ecfdf8]/20' : ''
                      }`}
                    >
                      {appts.map((appt: any) => {
                        const isBlock = appt.modalidad === 'bloqueo';
                        const isConfirmed = appt.estado === 'confirmada' || appt.estado === 'presencial';
                        const isPending = appt.estado === 'pendiente_pago';

                        return (
                          <div
                            key={appt._id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppointment(appt);
                            }}
                            className={`rounded-xl p-2 text-xs shadow-xs transition-all hover:scale-[1.02] cursor-pointer mb-1 ${
                              isBlock
                                ? 'bg-[#d5e6e1]/70 text-[#404945] border border-dashed border-[#707975]/40'
                                : isPending
                                ? 'bg-[#ffd6cc] text-[#7a3625] border border-[#ffb4a2]'
                                : appt.modalidad === 'presencial'
                                ? 'bg-[#c7d7fd] text-[#091b38] border border-[#b6c7ec]'
                                : 'bg-[#bbeddc] text-[#002019] border border-[#a0d1c1]'
                            }`}
                          >
                            <div className="flex items-center justify-between font-headline font-bold text-[11px] leading-tight">
                              <span className="truncate">{appt.pacienteNombre}</span>
                              <span className="material-symbols-outlined text-xs">
                                {isBlock ? 'lock' : appt.modalidad === 'presencial' ? 'apartment' : 'videocam'}
                              </span>
                            </div>
                            {!isBlock && (
                              <p className="text-[10px] opacity-85 truncate mt-0.5">
                                {appt.horaInicio} - {appt.motivo}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-1 text-[9px] font-medium">
                              <span className="capitalize">
                                {isBlock ? 'Bloqueado' : appt.canal || appt.modalidad}
                              </span>
                              {isConfirmed && !isBlock && (
                                <span className="text-[#245347] font-bold">✓ Confirmada</span>
                              )}
                              {isPending && (
                                <span className="text-[#ba1a1a] font-bold">Por Pagar</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Therapist Real-Time Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Imminent Patient Card matching Image 3 */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(36,83,71,0.06)] p-5 border border-[#e0f2ed]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0f2ed]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping"></span>
                <span className="font-headline font-bold text-xs uppercase tracking-wider text-[#ba1a1a]">
                  En 15 minutos
                </span>
              </div>
              <span className="text-xs text-[#404945] font-medium">09:00 - 10:00</span>
            </div>

            <div className="flex items-center gap-3.5 mt-3.5">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMtUxbh5Jfc1_BQ4YTh2-EGYyje97zOcwV2n6DBex5dk9PEpXbf-5FF6WQzCWxL69MOI9RgtoSgNG9Oa_muo4yXtaHGKMTGgk4dN90KxpZQP3ootF0j4XNT9I_pALAIMUMBW_skVDZmiCGUF5vj3QJluNthNnvnWgJEgXWZhL8ET37a8TXmg9lBGC8vtGoUr0uuk5Klfc7PwzvIGh7sh9ioh-Yz2wjnoC3YWwsnY_wZyDrtzIq7M3l"
                alt="Camila Morales"
                className="w-13 h-13 rounded-xl object-cover ring-2 ring-[#bbeddc]"
              />
              <div>
                <h4 className="font-headline font-bold text-base text-[#0f1e1c]">
                  Camila Morales
                </h4>
                <p className="text-xs text-[#404945]">Sesión 4 • TCC Manejo de Ansiedad</p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#245347] font-semibold mt-0.5">
                  <span className="material-symbols-outlined text-xs">videocam</span>
                  <span>Google Meet Seguro</span>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => onJoinMeeting(nextPatient)}
                className="col-span-2 py-2.5 rounded-xl bg-[#245347] hover:bg-[#3d6b5e] text-white font-headline font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-base">video_call</span>
                Unirse a Meet Clínico
              </button>

              <button
                onClick={() => onOpenPatientFile('pac_001')}
                className="py-2 rounded-xl bg-[#e6f7f2] hover:bg-[#dbece7] text-[#245347] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">clinical_notes</span>
                Ficha Clínica
              </button>

              <button
                onClick={() => setShowTemplatesModal(true)}
                className="py-2 rounded-xl bg-[#e6f7f2] hover:bg-[#dbece7] text-[#404945] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">description</span>
                Últimas Notas
              </button>
            </div>

            {/* Last session note snapshot */}
            <div className="mt-3.5 p-3 rounded-xl bg-[#f8faf9] border border-[#e0f2ed] text-xs">
              <span className="font-bold text-[#404945] text-[11px] block mb-1">
                Anotación de la Sesión Previa (Sesión #3):
              </span>
              <p className="text-[#0f1e1c] italic leading-relaxed text-[11px]">
                "Trabajo de reestructuración ante pensamientos catastrofistas laborales. Tarea cumplida: autorregistro ABC."
              </p>
            </div>
          </div>

          {/* Monthly Clinical Metrics Card */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-[#e0f2ed]">
            <h4 className="font-headline font-bold text-sm text-[#0f1e1c] mb-3 flex items-center justify-between">
              <span>Métricas del Mes (Octubre)</span>
              <span className="text-xs text-[#245347] font-semibold">En tiempo real</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-xl bg-[#e6f7f2]">
                <span className="text-[11px] text-[#404945] font-medium block">Citas Realizadas</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-headline text-xl font-bold text-[#245347]">34</span>
                  <span className="text-[11px] text-[#245347] font-bold">+12%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#e6f7f2]">
                <span className="text-[11px] text-[#404945] font-medium block">Ingresos Generados</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-headline text-xl font-bold text-[#0f1e1c]">$2,040</span>
                  <span className="text-[11px] text-[#404945]">USD</span>
                </div>
              </div>
            </div>

            {/* Attendance Rate Circle SVG */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#e6f7f2]/60 border border-[#e0f2ed]">
              <div>
                <span className="font-bold text-xs text-[#0f1e1c] block">Tasa de Asistencia</span>
                <span className="text-[11px] text-[#404945]">Ausentismo reducido por recordatorios</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-xl text-[#245347]">96%</span>
                <span className="text-[10px] bg-[#bbeddc] text-[#002019] px-2 py-0.5 rounded-full font-bold">
                  Óptimo
                </span>
              </div>
            </div>

            {/* DSM-5 & CIE-11 Templates button */}
            <button
              onClick={() => setShowTemplatesModal(true)}
              className="w-full mt-3 py-2.5 rounded-xl border border-[#245347] text-[#245347] hover:bg-[#e6f7f2] font-headline font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-base">library_books</span>
              Plantillas Clínicas (Formato CIE-11 & DSM-5)
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#e0f2ed] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0f2ed]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#245347]">calendar_today</span>
                <h3 className="font-headline text-lg font-bold text-[#0f1e1c]">Detalle de la Cita</h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-[#404945] hover:text-[#0f1e1c]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs sm:text-sm">
              <div className="p-3 bg-[#e6f7f2] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#404945] block">Paciente</span>
                  <span className="font-bold text-base text-[#0f1e1c]">
                    {selectedAppointment.pacienteNombre}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#bbeddc] text-[#002019] uppercase">
                  {selectedAppointment.estado}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#f8faf9] rounded-xl border border-[#e0f2ed]">
                  <span className="text-[#707975] block">Fecha & Horario</span>
                  <span className="font-bold text-[#0f1e1c]">
                    {selectedAppointment.fecha} ({selectedAppointment.horaInicio} - {selectedAppointment.horaFin})
                  </span>
                </div>
                <div className="p-2.5 bg-[#f8faf9] rounded-xl border border-[#e0f2ed]">
                  <span className="text-[#707975] block">Modalidad</span>
                  <span className="font-bold text-[#0f1e1c] capitalize">
                    {selectedAppointment.modalidad} ({selectedAppointment.canal})
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#404945] block mb-1">Motivo / Tipo de Intervención</span>
                <p className="p-2.5 bg-[#f8faf9] rounded-xl border border-[#e0f2ed] text-xs text-[#0f1e1c]">
                  {selectedAppointment.motivo || 'Sesión de psicoterapia'}
                </p>
              </div>

              {selectedAppointment.notas && (
                <div>
                  <span className="text-xs font-bold text-[#404945] block mb-1">Notas Clínicas</span>
                  <p className="p-2.5 bg-[#e6f7f2]/50 rounded-xl border border-[#e0f2ed] text-xs text-[#404945]">
                    {selectedAppointment.notas}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e0f2ed]">
              {selectedAppointment.modalidad !== 'bloqueo' && (
                <button
                  onClick={() => {
                    setSelectedAppointment(null);
                    onJoinMeeting(selectedAppointment);
                  }}
                  className="py-2.5 rounded-xl bg-[#245347] text-white font-bold text-xs hover:bg-[#3d6b5e] flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">video_call</span>
                  Iniciar Consulta
                </button>
              )}
              <button
                onClick={() => {
                  mongoDb.deleteOne('citas', { _id: selectedAppointment._id });
                  setSelectedAppointment(null);
                }}
                className="py-2.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] font-bold text-xs hover:bg-[#ffb4a2] flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                Eliminar de Mongo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Manual Appointment Modal */}
      {showNewAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#e0f2ed]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0f2ed] mb-4">
              <h3 className="font-headline text-lg font-bold text-[#245347]">
                + Nueva Cita en MongoDB
              </h3>
              <button onClick={() => setShowNewAppointmentModal(false)} className="text-[#404945]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateManualAppointment} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#0f1e1c] mb-1">Nombre del Paciente</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Camila Morales o Roberto Díaz"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#0f1e1c] mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0f1e1c] mb-1">Hora Inicio</label>
                  <select
                    value={newHour}
                    onChange={(e) => setNewHour(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0f1e1c] mb-1">Terapeuta Asignado</label>
                <select
                  value={newTherapist}
                  onChange={(e) => setNewTherapist(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]"
                >
                  <option value="Dra. Sofía Mendoza">Dra. Sofía Mendoza</option>
                  <option value="Lic. Andrés Valencia Peña">Lic. Andrés Valencia Peña</option>
                  <option value="Dra. Marcela Restrepo">Dra. Marcela Restrepo</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0f1e1c] mb-1">Modalidad</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewModality('virtual')}
                    className={`py-2 rounded-xl text-xs font-semibold ${
                      newModality === 'virtual' ? 'bg-[#245347] text-white' : 'bg-[#e6f7f2] text-[#404945]'
                    }`}
                  >
                    Virtual (Meet)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewModality('presencial')}
                    className={`py-2 rounded-xl text-xs font-semibold ${
                      newModality === 'presencial' ? 'bg-[#245347] text-white' : 'bg-[#e6f7f2] text-[#404945]'
                    }`}
                  >
                    Presencial
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0f1e1c] mb-1">Motivo de Consulta</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. TCC Ansiedad, Pareja, Evaluación..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAppointmentModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#e6f7f2] text-[#404945] font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#245347] text-white font-bold hover:bg-[#3d6b5e]"
                >
                  Guardar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Block Schedule Modal */}
      {showBlockTimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#e0f2ed]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0f2ed] mb-4">
              <h3 className="font-headline text-lg font-bold text-[#245347]">
                Bloquear Horario en Agenda
              </h3>
              <button onClick={() => setShowBlockTimeModal(false)} className="text-[#404945]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateBlockTime} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#0f1e1c] mb-1">Motivo del Bloqueo</label>
                <input
                  type="text"
                  required
                  value={blockLabel}
                  onChange={(e) => setBlockLabel(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#0f1e1c] mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0f1e1c] mb-1">Hora</label>
                  <select
                    value={blockHour}
                    onChange={(e) => setBlockHour(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBlockTimeModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#e6f7f2] text-[#404945] font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#245347] text-white font-bold hover:bg-[#3d6b5e]"
                >
                  Bloquear Hora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clinical Templates Drawer/Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#e0f2ed]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0f2ed] mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#245347]">menu_book</span>
                <h3 className="font-headline text-lg font-bold text-[#245347]">
                  Plantillas Clínicas (CIE-11 & DSM-5)
                </h3>
              </div>
              <button onClick={() => setShowTemplatesModal(false)} className="text-[#404945]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {mongoDb.find('plantillas_clinicas').map((plan: any) => (
                <div key={plan._id} className="p-3.5 bg-[#e6f7f2] rounded-2xl border border-[#e0f2ed]">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-headline font-bold text-xs sm:text-sm text-[#0f1e1c]">
                      {plan.titulo}
                    </h4>
                    <span className="text-[10px] bg-white text-[#245347] px-2 py-0.5 rounded-full font-bold">
                      {plan.codigo}
                    </span>
                  </div>
                  <pre className="font-sans text-xs text-[#404945] whitespace-pre-wrap leading-relaxed">
                    {plan.contenido}
                  </pre>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowTemplatesModal(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-[#245347] text-white font-bold text-xs"
            >
              Cerrar Plantillas
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
