import React, { useState, useEffect } from 'react';

interface VirtualMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
}

export const VirtualMeetingModal: React.FC<VirtualMeetingModalProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState(
    'Paciente se presenta orientada en tiempo y espacio. Expresa disminución en episodios de angustia anticipatoria tras aplicar respiración diafragmática.'
  );
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setSeconds(0);
      return;
    }
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-6">
      <div className="bg-[#0f1e1c] text-white rounded-3xl w-full max-w-5xl h-[85vh] max-h-[750px] shadow-2xl flex flex-col overflow-hidden border border-white/10 relative animate-in zoom-in-95">
        
        {/* Top Video Header */}
        <div className="h-14 px-6 bg-black/40 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#13AA52] animate-pulse"></span>
            <div>
              <h3 className="font-headline font-bold text-sm text-white">
                Sala Virtual Encriptada • {appointment?.terapeutaNombre || 'Dra. Marcela Restrepo'}
              </h3>
              <span className="text-[10px] text-white/60">
                Cifrado 256-bit AES • Conexión Segura HIPAA Compliant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-white/10 text-white font-mono text-xs px-3 py-1 rounded-full">
              {formatTimer(seconds)}
            </span>
            <button
              onClick={() => setIsNotesOpen(!isNotesOpen)}
              className="px-3 py-1 rounded-xl bg-[#245347] hover:bg-[#3d6b5e] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">edit_note</span>
              {isNotesOpen ? 'Ocultar Notas' : 'Notas de Sesión'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>

        {/* Video Streams Grid */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Video (Therapist) */}
          <div className="flex-1 bg-[#142321] relative flex items-center justify-center p-4">
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#1b2f2c] to-[#0f1e1c] flex items-center justify-center">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1GNpbkxtgRO1KhXv32vjXeQ8dI7rLeMLjLVQ2NKBMmFfp-ztYGHp69qLkO1EZiTSNcdR5whj4e7mUCbs8hJVnamNLKSefj2bFh0xvW5nd7MLDZgv-H7IZGQq5q-YCAkgOGMJ3gHQM6VHrHsU6Il2HPOG-MUmrh1ibRJznEI5hKJvmYagshjR4cV06c8aVUsF54v3PONpzK8pO_kTEK1gUnX8SDNu87J9S6fBwPJXQzkCps1XBWxxS"
                alt="Therapist"
                className="w-full h-full object-cover object-top opacity-90"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-xs text-[#13AA52]">mic</span>
                <span className="font-semibold">{appointment?.terapeutaNombre || 'Dra. Marcela Restrepo'} (Terapeuta)</span>
              </div>
            </div>

            {/* Self View (Camila Morales) - Picture in Picture */}
            <div className="absolute top-8 right-8 w-44 h-32 sm:w-56 sm:h-40 rounded-2xl overflow-hidden bg-[#243330] shadow-2xl border-2 border-white/20">
              {isVideoOn ? (
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMtUxbh5Jfc1_BQ4YTh2-EGYyje97zOcwV2n6DBex5dk9PEpXbf-5FF6WQzCWxL69MOI9RgtoSgNG9Oa_muo4yXtaHGKMTGgk4dN90KxpZQP3ootF0j4XNT9I_pALAIMUMBW_skVDZmiCGUF5vj3QJluNthNnvnWgJEgXWZhL8ET37a8TXmg9lBGC8vtGoUr0uuk5Klfc7PwzvIGh7sh9ioh-Yz2wjnoC3YWwsnY_wZyDrtzIq7M3l"
                  alt="Self View"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#1b2f2c] text-white/60">
                  <span className="material-symbols-outlined text-3xl">videocam_off</span>
                  <span className="text-[10px] mt-1">Cámara Apagada</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px] text-[#13AA52]">
                  {isMicOn ? 'mic' : 'mic_off'}
                </span>
                <span>Tú (Camila)</span>
              </div>
            </div>
          </div>

          {/* Side Drawer: Clinical Notes during call */}
          {isNotesOpen && (
            <div className="w-80 bg-[#172b27] border-l border-white/10 p-4 flex flex-col justify-between animate-in slide-in-from-right">
              <div>
                <h4 className="font-headline font-bold text-sm text-white mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">clinical_notes</span>
                  Bitácora de Sesión en Vivo
                </h4>
                <p className="text-[11px] text-white/70 mb-3">
                  Anotaciones confidenciales sincronizadas con la ficha del paciente.
                </p>
                <textarea
                  rows={14}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#bbeddc]"
                  placeholder="Registrar intervenciones, observaciones y acuerdos..."
                ></textarea>
              </div>
              <button
                onClick={() => {
                  alert('Notas clínicas guardadas en el historial del paciente.');
                }}
                className="w-full py-2.5 rounded-xl bg-[#245347] hover:bg-[#3d6b5e] text-white font-bold text-xs"
              >
                Guardar Anotación
              </button>
            </div>
          )}
        </div>

        {/* Video Call Footer Controls */}
        <div className="h-20 bg-black/60 backdrop-blur-md px-6 flex items-center justify-center gap-4 border-t border-white/10">
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isMicOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-[#ba1a1a] text-white'
            }`}
            title={isMicOn ? 'Silenciar micrófono' : 'Activar micrófono'}
          >
            <span className="material-symbols-outlined text-xl">
              {isMicOn ? 'mic' : 'mic_off'}
            </span>
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isVideoOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-[#ba1a1a] text-white'
            }`}
            title={isVideoOn ? 'Apagar cámara' : 'Encender cámara'}
          >
            <span className="material-symbols-outlined text-xl">
              {isVideoOn ? 'videocam' : 'videocam_off'}
            </span>
          </button>

          <button
            onClick={onClose}
            className="h-12 px-6 rounded-2xl bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
            title="Finalizar consulta"
          >
            <span className="material-symbols-outlined text-lg">call_end</span>
            <span>Finalizar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};
