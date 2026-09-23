import React, { useState } from 'react';
import { mongoDb } from '../services/mongoService';

interface TherapistProfileViewProps {
  onAppointmentBooked: (cita: any) => void;
}

export const TherapistProfileView: React.FC<TherapistProfileViewProps> = ({ onAppointmentBooked }) => {
  const [activeTab, setActiveTab] = useState<'sobre-mi' | 'testimonios' | 'especialidades' | 'tarifas'>('sobre-mi');
  const [modality, setModality] = useState<'online' | 'presencial'>('online');
  const [reason, setReason] = useState('Consulta Inicial • Evaluación Diagnóstica');
  const [selectedDate, setSelectedDate] = useState('14');
  const [selectedTime, setSelectedTime] = useState('09:00 AM');
  const [activeReviewFilter, setActiveReviewFilter] = useState('Todas');
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);

  // Reviews from MongoDB
  const reviews = mongoDb.find('resenas', { terapeutaId: 'terap_001' });

  // Filtered reviews
  const filteredReviews = reviews.filter((r: any) => {
    if (activeReviewFilter === 'Todas') return true;
    if (activeReviewFilter === 'Empatía Terapéutica') return r.tags?.some((t: string) => t.toLowerCase().includes('empat'));
    if (activeReviewFilter === 'Manejo de Ansiedad') return r.tags?.some((t: string) => t.toLowerCase().includes('ansiedad'));
    if (activeReviewFilter === 'Claridad en Herramientas') return r.tags?.some((t: string) => t.toLowerCase().includes('claridad'));
    if (activeReviewFilter === 'Puntualidad Absoluta') return r.tags?.some((t: string) => t.toLowerCase().includes('puntualidad'));
    return true;
  });

  // Handle booking confirmation into MongoDB
  const handleConfirmBooking = () => {
    const newAppointment = {
      pacienteId: 'pac_001',
      pacienteNombre: 'Camila Morales',
      terapeutaId: 'terap_001',
      terapeutaNombre: 'Lic. Andrés Valencia Peña',
      fecha: `2024-10-${selectedDate.padStart(2, '0')}`,
      diaSemana: 'Lun',
      horaInicio: selectedTime.split(' ')[0],
      horaFin: selectedTime === '09:00 AM' ? '10:00' : '12:30',
      motivo: reason,
      modalidad: modality,
      canal: modality === 'online' ? 'Google Meet Encriptado' : 'Calle 93 #14-20, Cons. 302',
      estado: 'confirmada',
      montoUSD: 60,
      pagado: true,
      notas: 'Reserva generada desde portal de perfil profesional.'
    };

    mongoDb.insertOne('citas', newAppointment);
    setBookingSuccessModal(true);
    if (onAppointmentBooked) {
      onAppointmentBooked(newAppointment);
    }
  };

  // Review submission state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewTag, setNewReviewTag] = useState('#ManejoDeAnsiedad');

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewText) return;

    mongoDb.insertOne('resenas', {
      terapeutaId: 'terap_001',
      autor: newReviewAuthor,
      iniciales: newReviewAuthor.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      subtitulo: 'Paciente en Terapia Individual',
      calificacion: 5,
      fecha: 'Recién publicado',
      comentario: newReviewText,
      tags: [newReviewTag, 'Consulta Verificada']
    });

    setShowAddReviewModal(false);
    setNewReviewAuthor('');
    setNewReviewText('');
  };

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full max-w-[1440px] mx-auto px-4 md:px-6 py-6">
        
        {/* Top Breadcrumb & Status Alert Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-sm text-[#404945]">
          <div className="flex items-center gap-1.5">
            <span className="text-[#245347] flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span>Directorio de Especialistas</span>
            </span>
            <span>/</span>
            <span className="text-[#0f1e1c] font-semibold">Lic. Andrés Valencia Peña</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-[#dbece7] px-3.5 py-1.5 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#245347] animate-pulse"></span>
            <span className="font-headline font-bold text-xs text-[#245347] tracking-wider uppercase">
              Agenda abierta esta semana • Próximo hueco: Hoy 3:00 PM
            </span>
          </div>
        </div>

        {/* Hero / Profile Identity Card */}
        <div className="relative w-full bg-white rounded-2xl shadow-[0_4px_24px_rgba(36,83,71,0.06)] p-6 lg:p-8 overflow-hidden mb-6 border border-[#e0f2ed]">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#bbeddc]/25 blur-3xl pointer-events-none"></div>
          
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left: Avatar + Vital Data */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative flex-shrink-0">
                <img
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover shadow-md ring-2 ring-[#bbeddc]"
                  alt="Lic. Andrés Valencia Peña"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4hxORhwVPbeIqvikH2gdPiEHhxH7lLKb0k4AR8QsQH-TxeKxXFZ20cJ3q_kWUd2HEGLwoPY18Ep1it4dEtgOCfjB9_L0pYFanWMnks2lOnJ00dI_EnloB3zL_8b86Zj6eZymOIK7Xe45_jJsQ9-fxy0fhX15C37SoiRZ3J1rIM6Uf7FzGE69fmvcqdckCPX57wJixDPezX74__am0uSkP1oAIKUyAJ5L5Jksoy4aCc5q_JEpuqlPQ"
                />
                <div 
                  className="absolute -bottom-2 -right-2 bg-[#245347] text-white p-1.5 rounded-full shadow-md flex items-center justify-center" 
                  title="Terapeuta Certificado"
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#bbeddc] text-[#002019] px-2.5 py-0.5 rounded-full font-headline font-bold text-xs tracking-wider uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified_user
                    </span> 
                    Profesional Verificado
                  </span>
                  <span className="bg-[#d7e2ff] text-[#091b38] px-2.5 py-0.5 rounded-full font-headline font-bold text-xs tracking-wider uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">bolt</span> 
                    Atención Inmediata
                  </span>
                  <span className="bg-[#e6f7f2] text-[#404945] px-2.5 py-0.5 rounded-full text-xs font-medium">
                    Colegiado Nº 14.892
                  </span>
                </div>

                <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#245347] tracking-tight mt-1">
                  Lic. Andrés Valencia Peña
                </h1>
                <p className="font-headline text-base text-[#4e5e7f] font-semibold">
                  Psicólogo Clínico & Terapeuta Familiar, M.Sc.
                </p>

                {/* Rating & Quick Badges */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-1 text-sm text-[#404945]">
                  <div className="flex items-center gap-1 bg-[#e6f7f2] px-2.5 py-1 rounded-lg">
                    <span className="material-symbols-outlined text-[#974d3b] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="font-bold text-[#0f1e1c] text-sm">4.95</span>
                    <span className="text-[#404945] text-xs">/ 5.0</span>
                    <button 
                      onClick={() => setActiveTab('testimonios')}
                      className="text-[#245347] underline ml-1 hover:text-[#3d6b5e] font-semibold"
                    >
                      (148 reseñas verificadas)
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-[#245347] text-lg">psychology</span>
                    <span>TCC • Mindfulness • Terapia Sistémica</span>
                  </div>
                </div>

                {/* Modalities & Location */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-[#404945] mt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#245347] text-base">videocam</span>
                    Consulta Online (Meet Seguro Encriptado)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#4e5e7f] text-base">location_on</span>
                    Presencial: Calle 93 #14-20, Bogotá / CDMX
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Primary CTA and Price Snapshot */}
            <div className="w-full lg:w-auto flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 bg-[#e6f7f2]/70 p-4 rounded-2xl lg:min-w-[260px] border border-[#e0f2ed]">
              <div className="text-left lg:text-right">
                <span className="font-headline text-[11px] text-[#404945] uppercase tracking-wider block font-bold">
                  Sesión Individual (50 min)
                </span>
                <div className="flex items-baseline gap-1 lg:justify-end">
                  <span className="font-headline text-2xl font-bold text-[#245347]">$60 USD</span>
                  <span className="text-[#404945] text-xs">/ $240.000 COP</span>
                </div>
                <span className="text-[#245347] text-xs flex items-center gap-1 lg:justify-end font-medium">
                  <span className="material-symbols-outlined text-xs">verified</span> Reembolso con EPS/Seguros
                </span>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('booking-card-widget');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-11 px-5 bg-[#245347] hover:bg-[#3d6b5e] text-white rounded-xl font-headline font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-lg">calendar_today</span>
                Reservar Cita Ahora
              </button>
            </div>
          </div>
        </div>

        {/* Main Two-Column Layout (Content Tabs vs Sticky Booking Widget) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Interactive Navigation & Rich Content Panels */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Navigation Tabs */}
            <div className="w-full bg-white rounded-xl shadow-xs p-1.5 flex items-center gap-1 border border-[#e0f2ed] overflow-x-auto">
              <button
                onClick={() => setActiveTab('sobre-mi')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs md:text-sm font-headline transition-all text-center whitespace-nowrap ${
                  activeTab === 'sobre-mi'
                    ? 'bg-[#bbeddc] text-[#002019] font-bold shadow-xs'
                    : 'text-[#404945] hover:text-[#0f1e1c]'
                }`}
              >
                Sobre Mí & Formación
              </button>
              <button
                onClick={() => setActiveTab('testimonios')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs md:text-sm font-headline transition-all text-center whitespace-nowrap ${
                  activeTab === 'testimonios'
                    ? 'bg-[#bbeddc] text-[#002019] font-bold shadow-xs'
                    : 'text-[#404945] hover:text-[#0f1e1c]'
                }`}
              >
                Reseñas & Testimonios ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('especialidades')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs md:text-sm font-headline transition-all text-center whitespace-nowrap ${
                  activeTab === 'especialidades'
                    ? 'bg-[#bbeddc] text-[#002019] font-bold shadow-xs'
                    : 'text-[#404945] hover:text-[#0f1e1c]'
                }`}
              >
                Especialidades
              </button>
              <button
                onClick={() => setActiveTab('tarifas')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs md:text-sm font-headline transition-all text-center whitespace-nowrap ${
                  activeTab === 'tarifas'
                    ? 'bg-[#bbeddc] text-[#002019] font-bold shadow-xs'
                    : 'text-[#404945] hover:text-[#0f1e1c]'
                }`}
              >
                Tarifas & Políticas
              </button>
            </div>

            {/* TAB CONTENT 1: Sobre Mí & Formación */}
            {activeTab === 'sobre-mi' && (
              <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4 border border-[#e0f2ed]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#245347] rounded-full"></span>
                  <h2 className="font-headline text-xl text-[#245347] font-bold">Biografía Profesional</h2>
                </div>
                <p className="text-sm text-[#0f1e1c] leading-relaxed">
                  Hola, soy Andrés. Mi propósito como terapeuta es ofrecerte un espacio de absoluta confidencialidad, calidez humana y rigor clínico donde podamos deconstruir juntos aquellas dinámicas, pensamientos automáticos y cargas emocionales que hoy limitan tu bienestar.
                </p>
                <p className="text-sm text-[#404945] leading-relaxed">
                  Cuento con más de 11 años de experiencia acompañando a adultos y parejas en el abordaje integral de crisis de ansiedad, desregulación del estado de ánimo, duelo migratorio y patrones de vinculación disfuncionales. Trabajo desde un marco integrador con base en la <strong className="text-[#0f1e1c]">Terapia Cognitivo-Conductual de Tercera Generación (ACT y TCC)</strong>, sumando herramientas prácticas de autorregulación neuro-afectiva y Mindfulness clínico.
                </p>

                {/* Gallery / Office Spaces */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="relative rounded-2xl overflow-hidden shadow-xs group border border-[#e0f2ed]">
                    <img
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="Consultorio presencial"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy1_M2DfxN5wcXmA_EGn5Xe1cL33QIJP1dHPzrXzzGgEI9Gv6452ZywLFKDBzNfpmAm0DzcHkf2VQ27IJWBzLK1UN_1Iiwy5W5mULoTyw1i5bh9hvWa0vSLDtV3IoZEzQ5wB-tPDw_BWbbXDd1Cq0tTyG6ttitI-RYVE52yjy0a_-gYaZq5gXbaJ_7BYcSvyf3UOlQAiuOzYNNiB-1xm81F585GLLgiAnM7OfPiG3ZLjxsfpCHpQEx"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0f1e1c]/80 to-transparent p-3 text-white">
                      <span className="font-headline font-bold text-xs uppercase tracking-wider block">Espacio Presencial</span>
                      <span className="text-xs text-white/90">Consultorio Calle 93 • Sala Privada Acústica</span>
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden shadow-xs group border border-[#e0f2ed]">
                    <img
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="Tele-psicología setup"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9YFkcnCfIQn1k7AZ4j0aPm5pVqoPi2HXKGieTKiLH7BLB7XO3GGy7gRBEyjpWcIXLwww93IwIXHTB7oKjpgwYw7ldmGgcld4eaaQw87QUVDW_TLOMuhAsvBkZf3ovko3yUdIyn-zn03JAtNZ_VFbGOG9ahohzQ-LPnUjIoe5DGk7FUO-Fuv_GEmJlFmKqPjWPkgCYhrkvA_idR1sLZ7vBO_rTjscnw9QwTpIF3A_Q-4d6cnFLSxh9"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0f1e1c]/80 to-transparent p-3 text-white">
                      <span className="font-headline font-bold text-xs uppercase tracking-wider block">Tele-psicología</span>
                      <span className="text-xs text-white/90">Conexión Encriptada • Entorno Libre de Ruido</span>
                    </div>
                  </div>
                </div>

                {/* Credentials & Timeline */}
                <div className="flex flex-col gap-3 pt-2">
                  <h3 className="font-headline text-lg text-[#0f1e1c] font-bold">Trayectoria y Acreditaciones</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#e6f7f2]">
                      <div className="p-2 rounded-lg bg-white text-[#245347] shadow-xs">
                        <span className="material-symbols-outlined text-xl">school</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#0f1e1c]">Máster en Psicología Clínica</h4>
                        <p className="text-xs text-[#404945]">Universidad Complutense de Madrid (M.Sc. Cum Laude)</p>
                        <span className="text-xs text-[#245347] font-semibold">2014 - 2016</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#e6f7f2]">
                      <div className="p-2 rounded-lg bg-white text-[#245347] shadow-xs">
                        <span className="material-symbols-outlined text-xl">workspace_premium</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#0f1e1c]">Certificación Internacional TCC</h4>
                        <p className="text-xs text-[#404945]">Beck Institute for Cognitive Behavior Therapy, PA</p>
                        <span className="text-xs text-[#245347] font-semibold">2018</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#e6f7f2]">
                      <div className="p-2 rounded-lg bg-white text-[#245347] shadow-xs">
                        <span className="material-symbols-outlined text-xl">diversity_3</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#0f1e1c]">Especialista en Terapia Familiar</h4>
                        <p className="text-xs text-[#404945]">Instituto Sistémico de Relaciones Humanas</p>
                        <span className="text-xs text-[#245347] font-semibold">2019 - 2021</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#e6f7f2]">
                      <div className="p-2 rounded-lg bg-white text-[#245347] shadow-xs">
                        <span className="material-symbols-outlined text-xl">self_improvement</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#0f1e1c]">Facilitador Mindfulness MBSR</h4>
                        <p className="text-xs text-[#404945]">Center for Mindfulness Medicine (San Diego)</p>
                        <span className="text-xs text-[#245347] font-semibold">2022</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* TAB CONTENT 2: Reseñas & Testimonios */}
            {activeTab === 'testimonios' && (
              <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-6 border border-[#e0f2ed]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-[#e6f7f2] rounded-2xl">
                  <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
                    <span className="font-headline text-xs font-bold text-[#404945] uppercase tracking-wider">
                      Calificación Global
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-headline text-4xl font-bold text-[#245347]">4.95</span>
                      <span className="text-lg text-[#404945]">/ 5.0</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#974d3b] my-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-[#404945]">
                      Basado en 148 consultas finalizadas con feedback anónimo verificado
                    </span>
                  </div>

                  {/* Distribution Progress Bars */}
                  <div className="w-full md:w-64 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-14 text-[#404945]">5 estrellas</span>
                      <div className="flex-1 h-2 rounded-full bg-[#d5e6e1] overflow-hidden">
                        <div className="h-full bg-[#245347] rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <span className="w-8 font-bold text-[#0f1e1c] text-right">92%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-14 text-[#404945]">4 estrellas</span>
                      <div className="flex-1 h-2 rounded-full bg-[#d5e6e1] overflow-hidden">
                        <div className="h-full bg-[#245347]/70 rounded-full" style={{ width: '6%' }}></div>
                      </div>
                      <span className="w-8 font-bold text-[#0f1e1c] text-right">6%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-14 text-[#404945]">3 estrellas</span>
                      <div className="flex-1 h-2 rounded-full bg-[#d5e6e1] overflow-hidden">
                        <div className="h-full bg-[#707975] rounded-full" style={{ width: '2%' }}></div>
                      </div>
                      <span className="w-8 font-bold text-[#0f1e1c] text-right">2%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-14 text-[#404945]">2 estrellas</span>
                      <div className="flex-1 h-2 rounded-full bg-[#d5e6e1] overflow-hidden">
                        <div className="h-full bg-[#c0c8c4] rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="w-8 font-bold text-[#0f1e1c] text-right">0%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-14 text-[#404945]">1 estrella</span>
                      <div className="flex-1 h-2 rounded-full bg-[#d5e6e1] overflow-hidden">
                        <div className="h-full bg-[#c0c8c4] rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="w-8 font-bold text-[#0f1e1c] text-right">0%</span>
                    </div>
                  </div>
                </div>

                {/* Filter Badges + Add Review button */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-xs font-bold text-[#404945] uppercase tracking-wider">
                      Filtrar testimonios por cualidad clínica:
                    </span>
                    <button
                      onClick={() => setShowAddReviewModal(true)}
                      className="inline-flex items-center gap-1 text-xs font-headline font-bold text-[#245347] hover:underline"
                    >
                      <span className="material-symbols-outlined text-sm">add_comment</span>
                      + Dejar Reseña en Mongo
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: 'Todas', label: 'Todas', count: '148' },
                      { id: 'Empatía Terapéutica', label: 'Empatía Terapéutica', count: '89' },
                      { id: 'Manejo de Ansiedad', label: 'Manejo de Ansiedad', count: '64' },
                      { id: 'Claridad en Herramientas', label: 'Claridad en Herramientas', count: '51' },
                      { id: 'Puntualidad Absoluta', label: 'Puntualidad Absoluta', count: '42' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setActiveReviewFilter(f.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          activeReviewFilter === f.id
                            ? 'bg-[#245347] text-white shadow-xs'
                            : 'bg-[#e6f7f2] hover:bg-[#dbece7] text-[#404945] hover:text-[#0f1e1c]'
                        }`}
                      >
                        {f.label} <span className="opacity-75">({f.count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Cards List */}
                <div className="flex flex-col gap-4">
                  {filteredReviews.map((rev: any) => (
                    <article key={rev._id} className="p-4 rounded-xl bg-[#e6f7f2]/70 flex flex-col gap-2 border border-[#e0f2ed]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#bbeddc] flex items-center justify-center font-bold text-sm text-[#245347]">
                            {rev.iniciales || 'SR'}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#0f1e1c]">{rev.autor}</h4>
                            <span className="text-xs text-[#404945]">{rev.subtitulo}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex text-[#974d3b]">
                            {[...Array(rev.calificacion || 5)].map((_, i) => (
                              <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                star
                              </span>
                            ))}
                          </div>
                          <span className="text-[11px] text-[#404945]">{rev.fecha}</span>
                        </div>
                      </div>
                      <p className="text-sm text-[#0f1e1c] mt-1 leading-relaxed">
                        "{rev.comentario}"
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {rev.tags?.map((tag: string, i: number) => (
                          <span key={i} className="bg-white text-[#245347] text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[#e0f2ed]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* TAB CONTENT 3: Especialidades */}
            {activeTab === 'especialidades' && (
              <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4 border border-[#e0f2ed]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#245347] rounded-full"></span>
                  <h2 className="font-headline text-xl text-[#245347] font-bold">Áreas de Especialidad Clínica</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#e6f7f2] flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[#245347] font-headline font-bold text-base">
                      <span className="material-symbols-outlined">psychology_alt</span>
                      <h3>Trastornos de Ansiedad y Fobias</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#404945]">
                      Tratamiento sistemático de ataques de pánico, agorafobia, ansiedad generalizada (TAG) e hipocondría mediante exposición graduada y reestructuración cognitiva.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#e6f7f2] flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[#245347] font-headline font-bold text-base">
                      <span className="material-symbols-outlined">favorite</span>
                      <h3>Vínculos de Pareja y Afectividad</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#404945]">
                      Resolución de conflictos comunicacionales crónicos, redefinición de acuerdos, infidelidad y fortalecimiento del apego seguro mediante enfoque sistémico relacional.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#e6f7f2] flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[#245347] font-headline font-bold text-base">
                      <span className="material-symbols-outlined">mood_bad</span>
                      <h3>Depresión y Distimia</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#404945]">
                      Activación conductual, resignificación de esquemas tempranos desadaptativos y reincorporación progresiva al ritmo vital y laboral cotidiano.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#e6f7f2] flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[#245347] font-headline font-bold text-base">
                      <span className="material-symbols-outlined">flight_takeoff</span>
                      <h3>Duelo Migratorio & Adaptación</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#404945]">
                      Acompañamiento a hispanohablantes en el extranjero transitando choque cultural, soledad no deseada y reconfiguración del proyecto de vida.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* TAB CONTENT 4: Tarifas y Políticas */}
            {activeTab === 'tarifas' && (
              <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4 border border-[#e0f2ed]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#245347] rounded-full"></span>
                  <h2 className="font-headline text-xl text-[#245347] font-bold">Inversión y Términos Terapéuticos</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#e6f7f2] flex flex-col justify-between">
                    <div>
                      <span className="font-headline font-bold text-xs text-[#245347] uppercase">Modalidad Estándar</span>
                      <h3 className="font-headline text-base text-[#0f1e1c] font-bold mt-1">Psicoterapia Individual (50 min)</h3>
                      <p className="text-xs text-[#404945] mt-2">
                        Atención online por videollamada HD o presencial en consultorio.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 flex items-baseline justify-between border-t border-[#d5e6e1]">
                      <span className="font-headline text-xl text-[#245347] font-bold">$60 USD</span>
                      <span className="text-xs text-[#404945]">$240.000 COP</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#e6f7f2] flex flex-col justify-between">
                    <div>
                      <span className="font-headline font-bold text-xs text-[#4e5e7f] uppercase">Modalidad Vincular</span>
                      <h3 className="font-headline text-base text-[#0f1e1c] font-bold mt-1">Terapia de Pareja / Familiar (75 min)</h3>
                      <p className="text-xs text-[#404945] mt-2">
                        Sesión extendida para dinámicas diádicas y mediación comunicacional.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 flex items-baseline justify-between border-t border-[#d5e6e1]">
                      <span className="font-headline text-xl text-[#245347] font-bold">$85 USD</span>
                      <span className="text-xs text-[#404945]">$340.000 COP</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#e6f7f2]/50 flex flex-col gap-2 mt-2 border border-[#e0f2ed]">
                  <h4 className="font-headline font-semibold text-sm text-[#0f1e1c] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#245347]">event_repeat</span> Política de Cancelación y Reagendamiento
                  </h4>
                  <p className="text-xs text-[#404945] leading-relaxed">
                    Puedes reagendar o cancelar tu sesión sin costo alguno hasta con <strong>24 horas de antelación</strong> directamente desde tu portal de paciente. Las cancelaciones informadas con menos de 24 horas requerirán el abono del 50% de los honorarios correspondientes al tiempo reservado en consultorio.
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Right Column (4 cols): Sticky Quick Booking Widget */}
          <div className="lg:col-span-4 w-full sticky top-24" id="booking-card-widget">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(36,83,71,0.08)] p-6 flex flex-col gap-4 border border-[#e0f2ed]">
              
              {/* Title & Badge */}
              <div className="flex items-center justify-between pb-1">
                <h3 className="font-headline text-lg text-[#245347] font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#245347]">edit_calendar</span> 
                  Agendar Sesión
                </h3>
                <span className="font-headline font-bold text-xs bg-[#bbeddc] text-[#002019] px-2.5 py-0.5 rounded-full">
                  En Vivo
                </span>
              </div>

              {/* Modality Selector Chips */}
              <div className="flex flex-col gap-1.5">
                <label className="font-headline text-xs font-bold text-[#404945] uppercase tracking-wider">
                  Tipo de Consulta:
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#e6f7f2] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setModality('online')}
                    className={`py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      modality === 'online'
                        ? 'bg-white text-[#245347] shadow-xs'
                        : 'text-[#404945] hover:text-[#0f1e1c]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">videocam</span> Online
                  </button>
                  <button
                    type="button"
                    onClick={() => setModality('presencial')}
                    className={`py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      modality === 'presencial'
                        ? 'bg-white text-[#245347] shadow-xs'
                        : 'text-[#404945] hover:text-[#0f1e1c]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">apartment</span> Presencial
                  </button>
                </div>
              </div>

              {/* Session Reason */}
              <div className="flex flex-col gap-1.5">
                <label className="font-headline text-xs font-bold text-[#404945] uppercase tracking-wider">
                  Motivo de Asistencia:
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#e6f7f2] text-xs font-medium text-[#0f1e1c] focus:outline-none focus:ring-2 focus:ring-[#245347]/30 transition-all border-0"
                >
                  <option value="Consulta Inicial • Evaluación Diagnóstica">Consulta Inicial • Evaluación Diagnóstica</option>
                  <option value="Sesión de Seguimiento Terapéutico">Sesión de Seguimiento Terapéutico</option>
                  <option value="Consulta de Pareja / Familiar">Consulta de Pareja / Familiar</option>
                  <option value="Sesión Breve de Orientación Emocional">Sesión Breve de Orientación Emocional</option>
                </select>
              </div>

              {/* Mini Calendar: Month Nav & Date Grid */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-headline font-bold text-sm text-[#0f1e1c]">Octubre 2024</span>
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 rounded-lg bg-[#e6f7f2] flex items-center justify-center text-[#404945] hover:text-[#245347]">
                      <span className="material-symbols-outlined text-base">chevron_left</span>
                    </button>
                    <button className="w-7 h-7 rounded-lg bg-[#e6f7f2] flex items-center justify-center text-[#404945] hover:text-[#245347]">
                      <span className="material-symbols-outlined text-base">chevron_right</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center font-headline text-[11px] font-bold text-[#707975]">
                  <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  <span className="py-1 text-[#c0c8c4] opacity-50">29</span>
                  <span className="py-1 text-[#c0c8c4] opacity-50">30</span>
                  <button onClick={() => setSelectedDate('1')} className={`py-1 rounded-lg ${selectedDate === '1' ? 'bg-[#245347] text-white font-bold' : 'hover:bg-[#e6f7f2]'}`}>1</button>
                  <button onClick={() => setSelectedDate('2')} className={`py-1 rounded-lg ${selectedDate === '2' ? 'bg-[#245347] text-white font-bold' : 'hover:bg-[#e6f7f2]'}`}>2</button>
                  <button onClick={() => setSelectedDate('3')} className={`py-1 rounded-lg ${selectedDate === '3' ? 'bg-[#245347] text-white font-bold' : 'hover:bg-[#e6f7f2]'}`}>3</button>
                  <span className="py-1 text-[#c0c8c4] opacity-50">4</span>
                  <span className="py-1 text-[#c0c8c4] opacity-50">5</span>
                  <button onClick={() => setSelectedDate('6')} className={`py-1 rounded-lg ${selectedDate === '6' ? 'bg-[#245347] text-white font-bold' : 'hover:bg-[#e6f7f2]'}`}>6</button>
                  <button onClick={() => setSelectedDate('7')} className={`py-1 rounded-lg ${selectedDate === '7' ? 'bg-[#245347] text-white font-bold' : 'hover:bg-[#e6f7f2]'}`}>7</button>
                  <button onClick={() => setSelectedDate('8')} className={`py-1 rounded-lg ${selectedDate === '8' ? 'bg-[#245347] text-white font-bold' : 'hover:bg-[#e6f7f2]'}`}>8</button>
                  <button onClick={() => setSelectedDate('9')} className={`py-1 rounded-lg ${selectedDate === '9' ? 'bg-[#245347] text-white font-bold' : 'hover:bg-[#e6f7f2]'}`}>9</button>
                  <button onClick={() => setSelectedDate('10')} className={`py-1 rounded-lg ${selectedDate === '10' ? 'bg-[#245347] text-white font-bold' : 'hover:bg-[#e6f7f2]'}`}>10</button>
                  <span className="py-1 text-[#c0c8c4] opacity-50">11</span>
                  <span className="py-1 text-[#c0c8c4] opacity-50">12</span>
                  <button onClick={() => setSelectedDate('13')} className={`py-1 rounded-lg ${selectedDate === '13' ? 'bg-[#245347] text-white font-bold' : 'hover:bg-[#e6f7f2]'}`}>13</button>
                  <button onClick={() => setSelectedDate('14')} className={`py-1 rounded-lg ${selectedDate === '14' ? 'bg-[#245347] text-white font-bold shadow-xs' : 'hover:bg-[#e6f7f2]'}`}>14</button>
                  <button onClick={() => setSelectedDate('15')} className={`py-1 rounded-lg ${selectedDate === '15' ? 'bg-[#245347] text-white font-bold' : 'hover:bg-[#e6f7f2]'}`}>15</button>
                  <button onClick={() => setSelectedDate('16')} className={`py-1 rounded-lg ${selectedDate === '16' ? 'bg-[#245347] text-white font-bold' : 'hover:bg-[#e6f7f2]'}`}>16</button>
                  <button onClick={() => setSelectedDate('17')} className={`py-1 rounded-lg ${selectedDate === '17' ? 'bg-[#245347] text-white font-bold' : 'hover:bg-[#e6f7f2]'}`}>17</button>
                  <span className="py-1 text-[#c0c8c4] opacity-50">18</span>
                  <span className="py-1 text-[#c0c8c4] opacity-50">19</span>
                </div>
              </div>

              {/* Time Slots */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-headline font-bold text-[#404945] uppercase">
                    Horarios Libres • Lun {selectedDate} Oct:
                  </label>
                  <span className="text-[#245347] font-bold">GMT-5</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['09:00 AM', '11:30 AM', '03:00 PM', '05:00 PM'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-2 rounded-xl text-center text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        selectedTime === slot
                          ? 'bg-[#bbeddc] text-[#002019] shadow-xs'
                          : 'bg-[#e6f7f2] hover:bg-[#dbece7] text-[#0f1e1c]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Summary Badge */}
              <div className="p-3 rounded-xl bg-[#e6f7f2] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#245347] text-xl">lock</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-[#0f1e1c]">Reserva Inmediata</span>
                    <span className="text-[11px] text-[#404945]">Cancelación gratis hasta 24h</span>
                  </div>
                </div>
                <span className="font-headline text-base text-[#245347] font-bold">$60 USD</span>
              </div>

              {/* Primary Submit Action */}
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="w-full h-12 rounded-xl bg-[#245347] hover:bg-[#3d6b5e] text-white font-headline font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Confirmar y Pasar a Reserva</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>

              <p className="text-[11px] text-center text-[#404945] leading-tight">
                Al agendar, aceptas los términos del código de confidencialidad psicológica y el consentimiento informado de telemedicina.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Success Modal */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#e0f2ed] text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#bbeddc] text-[#245347] flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-[#245347] mb-1">¡Cita Confirmada con Éxito!</h3>
            <p className="text-sm text-[#404945] mb-4">
              Hemos registrado tu sesión en la base de datos MongoDB con el <strong>Lic. Andrés Valencia Peña</strong> para el día <strong>{selectedDate} de Octubre</strong> a las <strong>{selectedTime}</strong> ({modality.toUpperCase()}).
            </p>
            <div className="bg-[#e6f7f2] p-3 rounded-2xl text-xs text-[#0f1e1c] text-left mb-5 space-y-1">
              <p><strong>Paciente:</strong> Camila Morales</p>
              <p><strong>Motivo:</strong> {reason}</p>
              <p><strong>Canal:</strong> {modality === 'online' ? 'Google Meet Seguro Encriptado' : 'Calle 93 #14-20, Cons. 302'}</p>
              <p className="text-[#13AA52] font-semibold">✓ Guardado en colección MongoDB: `citas`</p>
            </div>
            <button
              onClick={() => setBookingSuccessModal(false)}
              className="w-full py-3 rounded-xl bg-[#245347] text-white font-bold text-sm hover:bg-[#3d6b5e] transition-colors"
            >
              Aceptar y Continuar
            </button>
          </div>
        </div>
      )}

      {/* Add Review Modal (writes to MongoDB) */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#e0f2ed]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0f2ed] mb-4">
              <h3 className="font-headline text-lg font-bold text-[#245347]">Dejar Reseña en MongoDB</h3>
              <button onClick={() => setShowAddReviewModal(false)} className="text-[#404945] hover:text-[#0f1e1c]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateReview} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#0f1e1c] mb-1">Tu Nombre o Iniciales</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Sofía R."
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#0f1e1c] mb-1">Cualidad Clínica Destacada</label>
                <select
                  value={newReviewTag}
                  onChange={(e) => setNewReviewTag(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]"
                >
                  <option value="#ManejoDeAnsiedad">#ManejoDeAnsiedad</option>
                  <option value="#Empatía">#Empatía</option>
                  <option value="#Claridad">#Claridad</option>
                  <option value="#Puntualidad">#Puntualidad</option>
                  <option value="#Mindfulness">#Mindfulness</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#0f1e1c] mb-1">Testimonio Clínico</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe cómo el proceso terapéutico te ayudó..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#e6f7f2] border-0 focus:ring-2 focus:ring-[#245347]"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#e6f7f2] text-[#404945] font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#245347] text-white font-bold hover:bg-[#3d6b5e]"
                >
                  Guardar en MongoDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
