import React, { useState } from 'react';
import { mongoDb } from '../services/mongoService';

export const MongoExplorerView: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<string>('citas');
  const [searchQuery, setSearchQuery] = useState('');
  const [mongoQueryInput, setMongoQueryInput] = useState('db.citas.find({ estado: "confirmada" })');
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocJson, setNewDocJson] = useState('{\n  "pacienteNombre": "Nuevo Paciente",\n  "motivo": "Evaluación",\n  "estado": "confirmada"\n}');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const collections = mongoDb.getCollections();
  const collectionStats = mongoDb.getCollectionStats();

  // Active collection documents
  const currentDocs = mongoDb.find(selectedCollection);

  // Filter current docs by search term
  const filteredDocs = currentDocs.filter(d => {
    if (!searchQuery) return true;
    return JSON.stringify(d).toLowerCase().includes(searchQuery.toLowerCase());
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Run user Mongo query
  const handleExecuteMongoQuery = () => {
    setQueryError(null);
    try {
      const trimmed = mongoQueryInput.trim();
      const match = trimmed.match(/^db\.(\w+)\.find\((.*)\)$/);
      if (!match) {
        throw new Error('Formato esperado: db.<coleccion>.find({ clave: "valor" })');
      }
      const colName = match[1];
      const filterStr = match[2]?.trim();
      let filterObj = {};
      if (filterStr) {
        filterObj = JSON.parse(filterStr);
      }
      const res = mongoDb.find(colName, filterObj);
      setQueryResult(res);
      showToast(`✓ Consulta ejecutada: ${res.length} documentos encontrados en '${colName}'`);
    } catch (err: any) {
      setQueryError(err.message || 'Error de sintaxis en la consulta MongoDB');
      setQueryResult(null);
    }
  };

  const handleResetSeed = () => {
    if (confirm('¿Deseas restablecer la base de datos MongoDB a los datos clínicos iniciales?')) {
      mongoDb.resetDatabase();
      showToast('Base de datos MongoDB restaurada al estado inicial.');
      setQueryResult(null);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(mongoDb.exportDatabaseJson());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "psico_gestion_mongodb_dump.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Archivo JSON de MongoDB descargado.');
  };

  const handleAddNewDocument = () => {
    try {
      const parsed = JSON.parse(newDocJson);
      mongoDb.insertOne(selectedCollection, parsed);
      setShowAddDocModal(false);
      showToast(`Documento insertado con éxito en la colección '${selectedCollection}'`);
    } catch (e: any) {
      alert('JSON inválido: ' + e.message);
    }
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm(`¿Eliminar documento con _id: "${id}" de la colección "${selectedCollection}"?`)) {
      mongoDb.deleteOne(selectedCollection, { _id: id });
      showToast('Documento eliminado de MongoDB.');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[1440px] mx-auto px-4 md:px-6 py-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#13AA52] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#13AA52]/10 px-3.5 py-1 rounded-full text-xs font-bold text-[#13AA52] uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#13AA52] animate-pulse"></span>
            MongoDB Compass / Document Studio Integrado
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#0f1e1c]">
            Explorador de Base de Datos Mongo 🍃
          </h1>
          <p className="text-xs sm:text-sm text-[#404945] max-w-2xl mt-1">
            Motor de base de datos NoSQL integrado para almacenar citas, terapeutas, notas clínicas, pacientes y recordatorios con persistencia local y endpoints REST en <code className="bg-[#e6f7f2] px-1 py-0.5 rounded text-[#245347]">/api/mongo/*</code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="h-10 px-3.5 rounded-xl bg-white hover:bg-[#e6f7f2] text-[#404945] font-semibold text-xs border border-[#e0f2ed] shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Exportar JSON
          </button>
          <button
            onClick={handleResetSeed}
            className="h-10 px-3.5 rounded-xl bg-[#ffdad6] hover:bg-[#ffb4a2] text-[#ba1a1a] font-semibold text-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            Reset Demo Seed
          </button>
        </div>
      </div>

      {/* Interactive Mongo Query Console */}
      <div className="bg-[#1e293b] text-white rounded-2xl p-5 shadow-lg border border-[#334155] mb-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
            <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
            <span className="font-mono text-xs text-white/80 font-bold ml-2">
              mongosh &gt; Consola de Consultas
            </span>
          </div>
          <span className="text-[11px] text-[#10b981] font-mono">
            db.version() =&gt; 7.0.4-compat
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 flex items-center bg-[#0f172a] rounded-xl px-3 py-2 border border-white/10 font-mono text-xs">
            <span className="text-[#10b981] mr-2 font-bold">&gt;</span>
            <input
              type="text"
              value={mongoQueryInput}
              onChange={(e) => setMongoQueryInput(e.target.value)}
              placeholder='db.citas.find({ estado: "confirmada" })'
              className="flex-1 bg-transparent text-[#e2e8f0] focus:outline-none placeholder-white/30"
            />
          </div>
          <button
            onClick={handleExecuteMongoQuery}
            className="h-10 px-5 rounded-xl bg-[#13AA52] hover:bg-[#0f8741] text-white font-mono font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            Ejecutar Query
          </button>
        </div>

        {/* Quick query presets */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-white/60">
          <span>Ejemplos rápidos:</span>
          <button
            onClick={() => {
              setMongoQueryInput('db.citas.find({ estado: "confirmada" })');
            }}
            className="bg-white/10 hover:bg-white/20 text-white font-mono px-2 py-0.5 rounded"
          >
            citas confirmadas
          </button>
          <button
            onClick={() => {
              setMongoQueryInput('db.terapeutas.find()');
            }}
            className="bg-white/10 hover:bg-white/20 text-white font-mono px-2 py-0.5 rounded"
          >
            terapeutas
          </button>
          <button
            onClick={() => {
              setMongoQueryInput('db.monitor_envios.find({ canalTipo: "whatsapp" })');
            }}
            className="bg-white/10 hover:bg-white/20 text-white font-mono px-2 py-0.5 rounded"
          >
            recordatorios whatsapp
          </button>
        </div>

        {/* Error notice */}
        {queryError && (
          <div className="mt-3 p-2.5 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-xs font-mono">
            Error: {queryError}
          </div>
        )}

        {/* Query Result display */}
        {queryResult !== null && (
          <div className="mt-4 p-3.5 bg-[#0f172a] rounded-xl border border-white/10 max-h-60 overflow-y-auto font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] text-white/70 mb-2">
              <span>Resultado ({queryResult.length} documentos):</span>
              <button onClick={() => setQueryResult(null)} className="hover:text-white">Cerrar</button>
            </div>
            <pre className="text-[#38bdf8] whitespace-pre-wrap">
              {JSON.stringify(queryResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Collections Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Collections Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm p-4 border border-[#e0f2ed]">
          <h3 className="font-headline font-bold text-sm text-[#0f1e1c] uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Colecciones ({collections.length})</span>
            <span className="text-[10px] bg-[#e6f7f2] text-[#245347] px-2 py-0.5 rounded-full font-bold">
              Base: psico_gestion_db
            </span>
          </h3>

          <div className="space-y-1.5">
            {collectionStats.map((col) => (
              <button
                key={col.name}
                onClick={() => {
                  setSelectedCollection(col.name);
                  setQueryResult(null);
                }}
                className={`w-full p-3 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                  selectedCollection === col.name
                    ? 'bg-[#13AA52] text-white font-bold shadow-xs'
                    : 'bg-[#f8faf9] hover:bg-[#e6f7f2] text-[#0f1e1c]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">folder</span>
                  <span>{col.name}</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                  selectedCollection === col.name ? 'bg-white/20 text-white' : 'bg-[#e6f7f2] text-[#404945]'
                }`}>
                  {col.count} docs
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#e0f2ed] text-xs text-[#707975] space-y-1">
            <p><strong>Storage:</strong> LocalStorage & REST Sync</p>
            <p><strong>Status:</strong> Conectado y persistente</p>
          </div>
        </div>

        {/* Right: Document List & JSON Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm p-5 border border-[#e0f2ed] flex flex-col gap-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#e0f2ed]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#13AA52]">dataset</span>
              <h3 className="font-headline font-bold text-base text-[#0f1e1c]">
                Colección: <span className="text-[#13AA52]">{selectedCollection}</span>
              </h3>
              <span className="bg-[#e6f7f2] text-[#245347] font-bold text-xs px-2.5 py-0.5 rounded-full">
                {currentDocs.length} documentos
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search filter in collection */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar documentos..."
                className="px-3 py-1.5 bg-[#e6f7f2] rounded-xl text-xs text-[#0f1e1c] focus:outline-none w-full sm:w-44"
              />
              <button
                onClick={() => setShowAddDocModal(true)}
                className="py-1.5 px-3 rounded-xl bg-[#245347] hover:bg-[#3d6b5e] text-white text-xs font-bold flex items-center gap-1 whitespace-nowrap shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                + Documento
              </button>
            </div>
          </div>

          {/* Document list */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredDocs.length === 0 ? (
              <div className="py-12 text-center text-[#707975] text-xs">
                No se encontraron documentos en esta colección con el filtro aplicado.
              </div>
            ) : (
              filteredDocs.map((doc: any, idx: number) => (
                <div
                  key={doc._id || idx}
                  className="bg-[#f8faf9] rounded-2xl p-4 border border-[#e0f2ed] hover:border-[#13AA52]/40 transition-all font-mono text-xs group"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#e0f2ed]/60 text-[11px] text-[#707975] mb-2">
                    <span className="text-[#13AA52] font-bold">_id: "{doc._id}"</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(doc, null, 2));
                          showToast('JSON copiado al portapapeles');
                        }}
                        className="text-[#404945] hover:text-[#0f1e1c] flex items-center gap-0.5"
                        title="Copiar JSON"
                      >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                        Copiar
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc._id)}
                        className="text-[#ba1a1a] hover:underline flex items-center gap-0.5"
                        title="Eliminar documento"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <pre className="text-[#0f1e1c] whitespace-pre-wrap overflow-x-auto text-[11px] max-h-48 leading-relaxed">
                    {JSON.stringify(doc, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#e0f2ed]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0f2ed] mb-3">
              <h3 className="font-headline text-lg font-bold text-[#13AA52]">
                + Insertar Documento en '{selectedCollection}'
              </h3>
              <button onClick={() => setShowAddDocModal(false)} className="text-[#404945]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-xs text-[#404945] mb-2">
              Ingresa el objeto JSON a insertar. MongoDB generará automáticamente el <code className="bg-[#e6f7f2] px-1 rounded font-bold">_id</code> si no lo especificas.
            </p>
            <textarea
              rows={8}
              value={newDocJson}
              onChange={(e) => setNewDocJson(e.target.value)}
              className="w-full font-mono text-xs p-3 rounded-xl bg-[#0f172a] text-[#38bdf8] focus:outline-none focus:ring-2 focus:ring-[#13AA52]"
            />
            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setShowAddDocModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#e6f7f2] text-[#404945] font-semibold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddNewDocument}
                className="flex-1 py-2.5 rounded-xl bg-[#13AA52] text-white font-bold text-xs hover:bg-[#0f8741]"
              >
                db.{selectedCollection}.insertOne()
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
