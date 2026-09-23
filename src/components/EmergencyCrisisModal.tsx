import React from 'react';

interface EmergencyCrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyCrisisModal: React.FC<EmergencyCrisisModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#ffb4a2] animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#e0f2ed]">
          <div className="flex items-center gap-2.5 text-[#ba1a1a]">
            <span className="material-symbols-outlined text-2xl">emergency</span>
            <h3 className="font-headline font-bold text-xl text-[#0f1e1c]">
              Asistencia Inmediata en Crisis 24/7
            </h3>
          </div>
          <button onClick={onClose} className="text-[#404945] hover:text-[#0f1e1c]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs sm:text-sm">
          <p className="text-xs text-[#404945] leading-relaxed">
            Si tú o alguien cercano está atravesando una crisis emocional aguda o pensamientos de autolesión, por favor comunícate de inmediato con estas líneas oficiales y gratuitas:
          </p>

          <div className="space-y-2">
            <div className="p-3 bg-[#ffdad6] rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-[#93000a] block">Colombia (Línea 106 / Línea Púrpura)</span>
                <span className="text-[11px] text-[#7a3625]">Atención psicosocial gratuita 24 horas</span>
              </div>
              <a
                href="tel:106"
                className="px-3.5 py-1.5 rounded-xl bg-[#ba1a1a] text-white font-bold text-xs"
              >
                Marcar 106
              </a>
            </div>

            <div className="p-3 bg-[#e6f7f2] rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-[#245347] block">México (Línea de la Vida 800 911 2000)</span>
                <span className="text-[11px] text-[#404945]">Apoyo emocional nacional especializado</span>
              </div>
              <a
                href="tel:8009112000"
                className="px-3.5 py-1.5 rounded-xl bg-[#245347] text-white font-bold text-xs"
              >
                Llamar
              </a>
            </div>

            <div className="p-3 bg-[#e6f7f2] rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-[#245347] block">España (Línea 024)</span>
                <span className="text-[11px] text-[#404945]">Atención a la conducta suicida</span>
              </div>
              <a
                href="tel:024"
                className="px-3.5 py-1.5 rounded-xl bg-[#245347] text-white font-bold text-xs"
              >
                Marcar 024
              </a>
            </div>
          </div>

          <div className="p-3.5 bg-[#f8faf9] rounded-2xl border border-[#e0f2ed]">
            <h4 className="font-bold text-xs text-[#0f1e1c] mb-1">
              Ejercicio Rápido de Contención (Técnica 5-4-3-2-1):
            </h4>
            <ul className="text-[11px] text-[#404945] space-y-0.5 list-disc list-inside">
              <li>Identifica <strong>5 cosas</strong> que puedas ver a tu alrededor.</li>
              <li>Toca <strong>4 cosas</strong> que puedas sentir con tus manos.</li>
              <li>Escucha <strong>3 sonidos</strong> diferentes en el ambiente.</li>
              <li>Reconoce <strong>2 olores</strong> cercanos.</li>
              <li>Respira profundo sintiendo el apoyo de tus pies en el suelo.</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#245347] text-white font-bold text-xs hover:bg-[#3d6b5e] transition-colors"
        >
          Entendido / Regresar a la Aplicación
        </button>
      </div>
    </div>
  );
};
