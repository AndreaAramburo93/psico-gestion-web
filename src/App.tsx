import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { PatientAppointmentsView } from './views/PatientAppointmentsView';
import { TherapistProfileView } from './views/TherapistProfileView';
import { ScheduleCalendarView } from './views/ScheduleCalendarView';
import { RemindersView } from './views/RemindersView';
import { MongoExplorerView } from './views/MongoExplorerView';
import { VirtualMeetingModal } from './components/VirtualMeetingModal';
import { EmergencyCrisisModal } from './components/EmergencyCrisisModal';
import { mongoDb } from './services/mongoService';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mis-citas');
  const [userRole, setUserRole] = useState<'paciente' | 'terapeuta'>('paciente');
  
  // Meeting modal state
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [activeMeetingAppointment, setActiveMeetingAppointment] = useState<any>(null);

  // Emergency crisis modal state
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  // Global total doc count for status badge
  const [totalMongoDocs, setTotalMongoDocs] = useState(0);

  const updateTotalCount = () => {
    const stats = mongoDb.getCollectionStats();
    const total = stats.reduce((acc, curr) => acc + curr.count, 0);
    setTotalMongoDocs(total);
  };

  useEffect(() => {
    updateTotalCount();
    const interval = setInterval(updateTotalCount, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleOpenMeeting = (appointment: any) => {
    setActiveMeetingAppointment(appointment);
    setMeetingModalOpen(true);
  };

  const handleAppointmentBooked = (newAppointment: any) => {
    updateTotalCount();
    // Prompt option to navigate to "mis-citas"
    setActiveTab('mis-citas');
  };

  return (
    <div className="min-h-screen bg-[#ecfdf8] text-[#0f1e1c] flex flex-col font-sans">
      
      {/* Fixed Global Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        mongoDocCount={totalMongoDocs}
      />

      {/* Main Content View Container with top padding to clear header (h-20 top + h-12 subnav = ~128px) */}
      <main className="flex-1 pt-32 pb-16">
        {activeTab === 'mis-citas' && (
          <PatientAppointmentsView
            onJoinMeeting={handleOpenMeeting}
            onNavigateToTherapist={() => setActiveTab('especialistas')}
            onOpenEmergencyModal={() => setEmergencyModalOpen(true)}
          />
        )}

        {activeTab === 'especialistas' && (
          <TherapistProfileView
            onAppointmentBooked={handleAppointmentBooked}
          />
        )}

        {activeTab === 'agenda' && (
          <ScheduleCalendarView
            onJoinMeeting={handleOpenMeeting}
            onOpenPatientFile={() => setActiveTab('mis-citas')}
          />
        )}

        {activeTab === 'recordatorios' && (
          <RemindersView />
        )}

        {activeTab === 'mongo-db' && (
          <MongoExplorerView />
        )}
      </main>

      {/* Interactive Video Call Modal */}
      <VirtualMeetingModal
        isOpen={meetingModalOpen}
        onClose={() => setMeetingModalOpen(false)}
        appointment={activeMeetingAppointment}
      />

      {/* Emergency Crisis Modal */}
      <EmergencyCrisisModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />

      {/* Floating MongoDB Status Quick Access Widget (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setActiveTab('mongo-db')}
          className="bg-white/95 backdrop-blur-md hover:bg-white text-[#0f1e1c] py-2 px-3.5 rounded-2xl shadow-lg border border-[#e0f2ed] hover:border-[#13AA52] flex items-center gap-2.5 transition-all text-xs font-semibold group cursor-pointer"
          title="Ver documentos y ejecutar consultas en MongoDB"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#13AA52] animate-pulse"></span>
          <div className="text-left">
            <span className="block font-bold text-[#13AA52] leading-none group-hover:underline">
              MongoDB Conectado
            </span>
            <span className="text-[10px] text-[#707975] leading-tight">
              {totalMongoDocs} documentos • 7 colecciones
            </span>
          </div>
          <span className="material-symbols-outlined text-sm text-[#13AA52] group-hover:translate-x-0.5 transition-transform">
            database
          </span>
        </button>
      </div>

      {/* Clinical Platform Footer */}
      <footer className="border-t border-[#e0f2ed] bg-white py-6 text-xs text-[#707975]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#245347] flex items-center justify-center text-white text-xs">
              <span className="material-symbols-outlined text-sm">psychology</span>
            </div>
            <span className="font-headline font-bold text-sm text-[#245347]">
              Psico_Gestión
            </span>
            <span>• Plataforma de Gestión Clínica & Tele-psicología</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-[#245347] font-semibold">
              <span className="material-symbols-outlined text-xs">verified_user</span>
              Cifrado Grado Médico HIPAA
            </span>
            <span className="flex items-center gap-1 text-[#13AA52] font-semibold">
              <span className="material-symbols-outlined text-xs">storage</span>
              MongoDB Atlas Ready & Local Engine
            </span>
            <span>© {new Date().getFullYear()} Psico_Gestión Inc. Todos los derechos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
