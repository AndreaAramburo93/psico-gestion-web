import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_MONGO_DATA } from './src/data/mongoSeed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'mongo_storage.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load or initialize MongoDB in-memory / file document database
let mongoStorage: Record<string, any[]> = {};

function loadDatabase() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      mongoStorage = JSON.parse(content);
      return;
    }
  } catch (err) {
    console.warn('Could not read mongo_storage.json, resetting to seed:', err);
  }
  mongoStorage = JSON.parse(JSON.stringify(INITIAL_MONGO_DATA));
  saveDatabase();
}

function saveDatabase() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(mongoStorage, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save to mongo_storage.json:', err);
  }
}

loadDatabase();

async function startServer() {
  const app = express();
  app.use(express.json());

  // === MongoDB Explorer & CRUD API ===
  app.get('/api/mongo/collections', (req: Request, res: Response) => {
    const collections = Object.keys(mongoStorage).map(name => ({
      name,
      count: (mongoStorage[name] || []).length,
      sample: (mongoStorage[name] || [])[0] || null
    }));
    res.json({ success: true, collections });
  });

  app.get('/api/mongo/collections/:name', (req: Request, res: Response) => {
    const name = req.params.name;
    const docs = mongoStorage[name] || [];
    res.json({ success: true, collection: name, count: docs.length, documents: docs });
  });

  app.post('/api/mongo/collections/:name', (req: Request, res: Response) => {
    const name = req.params.name;
    if (!mongoStorage[name]) mongoStorage[name] = [];
    const doc = req.body;
    const _id = doc._id || `${name.slice(0, 3)}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newDoc = { ...doc, _id };
    mongoStorage[name].push(newDoc);
    saveDatabase();
    res.status(201).json({ success: true, document: newDoc });
  });

  app.post('/api/mongo/query', (req: Request, res: Response) => {
    const { collection, operation, filter, update, doc } = req.body;
    if (!collection || !mongoStorage[collection]) {
      return res.status(400).json({ success: false, message: `Collection '${collection}' not found` });
    }

    const docs = mongoStorage[collection];

    if (operation === 'find') {
      let results = [...docs];
      if (filter && Object.keys(filter).length > 0) {
        results = results.filter(item => {
          for (const [k, v] of Object.entries(filter)) {
            if (item[k] !== v) return false;
          }
          return true;
        });
      }
      return res.json({ success: true, count: results.length, documents: results });
    }

    if (operation === 'insertOne') {
      const _id = doc._id || `${collection.slice(0, 3)}_${Date.now()}`;
      const newDoc = { ...doc, _id };
      docs.push(newDoc);
      saveDatabase();
      return res.json({ success: true, document: newDoc });
    }

    if (operation === 'updateOne') {
      const idx = docs.findIndex(item => {
        for (const [k, v] of Object.entries(filter || {})) {
          if (item[k] !== v) return false;
        }
        return true;
      });
      if (idx !== -1) {
        docs[idx] = { ...docs[idx], ...(update.$set || update) };
        saveDatabase();
        return res.json({ success: true, updated: docs[idx] });
      }
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (operation === 'deleteOne') {
      const prevLen = docs.length;
      mongoStorage[collection] = docs.filter(item => {
        for (const [k, v] of Object.entries(filter || {})) {
          if (item[k] === v) return false;
        }
        return true;
      });
      saveDatabase();
      return res.json({ success: true, deletedCount: prevLen - mongoStorage[collection].length });
    }

    res.status(400).json({ success: false, message: 'Unsupported operation' });
  });

  app.post('/api/mongo/reset', (req: Request, res: Response) => {
    mongoStorage = JSON.parse(JSON.stringify(INITIAL_MONGO_DATA));
    saveDatabase();
    res.json({ success: true, message: 'Database reset to default seed' });
  });

  // === Domain Endpoints ===
  app.get('/api/citas', (req: Request, res: Response) => {
    res.json(mongoStorage.citas || []);
  });

  app.post('/api/citas', (req: Request, res: Response) => {
    const cita = req.body;
    const _id = `cita_${Date.now()}`;
    const newCita = { ...cita, _id };
    if (!mongoStorage.citas) mongoStorage.citas = [];
    mongoStorage.citas.push(newCita);
    saveDatabase();
    res.status(201).json(newCita);
  });

  app.put('/api/citas/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const idx = (mongoStorage.citas || []).findIndex(c => c._id === id);
    if (idx !== -1) {
      mongoStorage.citas[idx] = { ...mongoStorage.citas[idx], ...req.body };
      saveDatabase();
      return res.json(mongoStorage.citas[idx]);
    }
    res.status(404).json({ error: 'Cita no encontrada' });
  });

  app.delete('/api/citas/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    mongoStorage.citas = (mongoStorage.citas || []).filter(c => c._id !== id);
    saveDatabase();
    res.json({ success: true });
  });

  app.get('/api/terapeutas', (req: Request, res: Response) => {
    res.json(mongoStorage.terapeutas || []);
  });

  app.get('/api/recordatorios', (req: Request, res: Response) => {
    res.json(mongoStorage.flujos_recordatorios || []);
  });

  app.put('/api/recordatorios/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const idx = (mongoStorage.flujos_recordatorios || []).findIndex(f => f._id === id);
    if (idx !== -1) {
      mongoStorage.flujos_recordatorios[idx] = { ...mongoStorage.flujos_recordatorios[idx], ...req.body };
      saveDatabase();
      return res.json(mongoStorage.flujos_recordatorios[idx]);
    }
    res.status(404).json({ error: 'Flujo no encontrado' });
  });

  app.get('/api/recordatorios/monitor', (req: Request, res: Response) => {
    res.json(mongoStorage.monitor_envios || []);
  });

  app.put('/api/recordatorios/monitor/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const idx = (mongoStorage.monitor_envios || []).findIndex(m => m._id === id);
    if (idx !== -1) {
      mongoStorage.monitor_envios[idx] = { ...mongoStorage.monitor_envios[idx], ...req.body };
      saveDatabase();
      return res.json(mongoStorage.monitor_envios[idx]);
    }
    res.status(404).json({ error: 'Registro no encontrado' });
  });

  app.get('/api/paciente/emociones', (req: Request, res: Response) => {
    res.json(mongoStorage.diario_emocional || []);
  });

  app.post('/api/paciente/emociones', (req: Request, res: Response) => {
    const item = { ...req.body, _id: `emo_${Date.now()}` };
    if (!mongoStorage.diario_emocional) mongoStorage.diario_emocional = [];
    mongoStorage.diario_emocional.push(item);
    saveDatabase();
    res.status(201).json(item);
  });

  app.get('/api/paciente/chat', (req: Request, res: Response) => {
    res.json(mongoStorage.chat_mensajes || []);
  });

  app.post('/api/paciente/chat', (req: Request, res: Response) => {
    const msg = { ...req.body, _id: `msg_${Date.now()}` };
    if (!mongoStorage.chat_mensajes) mongoStorage.chat_mensajes = [];
    mongoStorage.chat_mensajes.push(msg);
    saveDatabase();
    res.status(201).json(msg);
  });

  // Mounting Vite middleware or static serving
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Psico_Gestión full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
