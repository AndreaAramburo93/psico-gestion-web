import React, { useState } from 'react';

export type ActiveTab = 
  | 'mis-citas' 
  | 'especialistas' 
  | 'agenda' 
  | 'recordatorios' 
  | 'mongo-db';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userRole: 'paciente' | 'terapeuta';
  setUserRole: (role: 'paciente' | 'terapeuta') => void;
  mongoDocCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  mongoDocCount,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ecfdf8]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Top row */}
      <div className="h-20 max-w-[1440px] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('mis-citas')} 
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#245347] to-[#3d6b5e] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
            </div>
            <div>
              <span className="font-headline font-bold text-xl text-[#245347] tracking-tight block leading-tight">
                Psico_Gestión
              </span>
              <span className="text-[10px] text-[#404945] font-medium tracking-wide uppercase block">
                Salud Mental Integral
              </span>
            </div>
          </button>

          {/* Search bar */}
          <div className="hidden lg:flex items-center bg-[#e6f7f2] px-3 py-2 rounded-xl focus-within:ring-2 focus-within:ring-[#245347]/30 transition-all">
            <span className="material-symbols-outlined text-[#404945] text-lg mr-2">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar terapeutas, citas, notas clínicas..."
              className="bg-transparent text-sm text-[#0f1e1c] placeholder:text-[#707975] focus:outline-none w-56 xl:w-72"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-xs text-[#707975] hover:text-[#0f1e1c]">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Role switcher */}
          <div className="flex items-center bg-[#e6f7f2] p-1 rounded-xl">
            <button
              onClick={() => {
                setUserRole('paciente');
                setActiveTab('mis-citas');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm transition-all ${
                userRole === 'paciente'
                  ? 'bg-white text-[#245347] font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.06)]'
                  : 'text-[#404945] hover:text-[#0f1e1c]'
              }`}
            >
              Vista Paciente
            </button>
            <button
              onClick={() => {
                setUserRole('terapeuta');
                setActiveTab('agenda');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm transition-all ${
                userRole === 'terapeuta'
                  ? 'bg-white text-[#245347] font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.06)]'
                  : 'text-[#404945] hover:text-[#0f1e1c]'
              }`}
            >
              Portal Terapeuta
            </button>
          </div>

          {/* MongoDB Quick Access Pill */}
          <button
            onClick={() => setActiveTab('mongo-db')}
            title="Abrir Explorador de Base de Datos MongoDB"
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'mongo-db'
                ? 'bg-[#13AA52] text-white shadow-sm'
                : 'bg-[#e6f7f2] text-[#13AA52] hover:bg-[#d5e6e1]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#13AA52] animate-pulse"></span>
            <span>Mongo DB</span>
            <span className="bg-white/80 text-[#0f1e1c] px-1.5 py-0.2 rounded-md text-[10px]">
              {mongoDocCount} docs
            </span>
          </button>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationToast(!showNotificationToast)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#e6f7f2] text-[#404945] hover:bg-[#dbece7] transition-colors focus:outline-none"
              title="Notificaciones Clínicas"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#ecfdf8]"></span>
            </button>

            {showNotificationToast && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#e0f2ed] p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#e0f2ed]">
                  <span className="font-semibold text-xs text-[#0f1e1c] uppercase tracking-wider">Avisos Recientes</span>
                  <span className="text-[10px] text-[#245347] font-bold bg-[#bbeddc] px-2 py-0.5 rounded-full">2 Nuevas</span>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="p-2 bg-[#e6f7f2] rounded-xl text-xs">
                    <p className="font-semibold text-[#245347]">Recordatorio enviado a Camila Morales</p>
                    <p className="text-[11px] text-[#404945]">Confirmación recibida vía WhatsApp para mañana 16:30 hrs.</p>
                  </div>
                  <div className="p-2 bg-[#f8faf9] rounded-xl text-xs">
                    <p className="font-semibold text-[#0f1e1c]">Base de datos MongoDB sincronizada</p>
                    <p className="text-[11px] text-[#404945]">6 colecciones activas y respaldadas localmente.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-[#d5e6e1]">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-semibold text-xs md:text-sm text-[#0f1e1c] leading-tight">
                {userRole === 'paciente' ? 'Camila Morales' : 'Dra. Sofía Mendoza'}
              </span>
              <span className="text-[11px] text-[#404945]">
                {userRole === 'paciente' ? 'Paciente Activo' : 'Psicóloga Clínica'}
              </span>
            </div>
            <img
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#245347]/25 shadow-sm"
              src={
                userRole === 'paciente'
                  ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMtUxbh5Jfc1_BQ4YTh2-EGYyje97zOcwV2n6DBex5dk9PEpXbf-5FF6WQzCWxL69MOI9RgtoSgNG9Oa_muo4yXtaHGKMTGgk4dN90KxpZQP3ootF0j4XNT9I_pALAIMUMBW_skVDZmiCGUF5vj3QJluNthNnvnWgJEgXWZhL8ET37a8TXmg9lBGC8vtGoUr0uuk5Klfc7PwzvIGh7sh9ioh-Yz2wjnoC3YWwsnY_wZyDrtzIq7M3l'
                  : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuABKe4Lk09MqNmwgcQMYEKviIXh1Pa-I_J9-4XEHeefbH-K2QbzG8NWE68D2x6YURpqEEVX4-OtZWmv3vN0Lkqkt7rS8hHftIXE13fDl_emjsEk5OjRxiq434Fp852uYV8rRn3zjPJGwPzPvAV1scTyDYzfbUWLAznkZZIgcr7ywj7WwLGw68nGSQMLUKd4X59LZX6SZCg-oL--hD-sTX49uB44qvVaSrjAPFyBVh9q77t6S3LmdY'
              }
            />
          </div>
        </div>
      </div>

      {/* Secondary Navigation Row matching images */}
      <div className="bg-white shadow-[0_1px_4px_rgba(0,0,0,0.02)] border-t border-[#e0f2ed]/70">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <nav className="flex items-center gap-6 md:gap-8 overflow-x-auto py-0 text-sm font-medium scrollbar-none">
            <button
              onClick={() => setActiveTab('mis-citas')}
              className={`py-3 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'mis-citas'
                  ? 'text-[#245347] font-bold border-b-2 border-[#245347]'
                  : 'text-[#404945] hover:text-[#0f1e1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>Mis Citas (Paciente)</span>
            </button>

            <button
              onClick={() => setActiveTab('especialistas')}
              className={`py-3 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'especialistas'
                  ? 'text-[#245347] font-bold border-b-2 border-[#245347]'
                  : 'text-[#404945] hover:text-[#0f1e1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">badge</span>
              <span>Especialistas y Perfil Profesional</span>
            </button>

            <button
              onClick={() => setActiveTab('agenda')}
              className={`py-3 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'agenda'
                  ? 'text-[#245347] font-bold border-b-2 border-[#245347]'
                  : 'text-[#404945] hover:text-[#0f1e1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Agenda y Calendario Terapéutico</span>
            </button>

            <button
              onClick={() => setActiveTab('recordatorios')}
              className={`py-3 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'recordatorios'
                  ? 'text-[#245347] font-bold border-b-2 border-[#245347]'
                  : 'text-[#404945] hover:text-[#0f1e1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
              <span>Recordatorios y Notificaciones</span>
            </button>

            <button
              onClick={() => setActiveTab('mongo-db')}
              className={`py-3 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'mongo-db'
                  ? 'text-[#13AA52] font-bold border-b-2 border-[#13AA52]'
                  : 'text-[#404945] hover:text-[#13AA52]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">database</span>
              <span>Base de Datos Mongo 🍃</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
