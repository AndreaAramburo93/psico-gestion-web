import { INITIAL_MONGO_DATA, MongoDocument } from '../data/mongoSeed';

const STORAGE_KEY = 'psico_gestion_mongodb_v1';

class MongoDatabase {
  private inMemoryData: Record<string, MongoDocument[]> = {};

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.inMemoryData = JSON.parse(stored);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using memory seed:', e);
    }
    // Default to seed data
    this.inMemoryData = JSON.parse(JSON.stringify(INITIAL_MONGO_DATA));
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemoryData));
      }
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  public getCollections(): string[] {
    return Object.keys(this.inMemoryData);
  }

  public getCollectionStats(): { name: string; count: number; sample: MongoDocument }[] {
    return Object.keys(this.inMemoryData).map(colName => {
      const docs = this.inMemoryData[colName] || [];
      return {
        name: colName,
        count: docs.length,
        sample: docs[0] || { _id: 'empty' }
      };
    });
  }

  public find(collectionName: string, query?: Record<string, any>): MongoDocument[] {
    const docs = this.inMemoryData[collectionName] || [];
    if (!query || Object.keys(query).length === 0) {
      return [...docs];
    }

    return docs.filter(doc => {
      for (const [key, value] of Object.entries(query)) {
        if (typeof value === 'object' && value !== null) {
          if (value.$in && Array.isArray(value.$in)) {
            if (!value.$in.includes(doc[key])) return false;
          } else if (value.$ne !== undefined) {
            if (doc[key] === value.$ne) return false;
          }
        } else if (doc[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  public findOne(collectionName: string, query: Record<string, any>): MongoDocument | null {
    const results = this.find(collectionName, query);
    return results.length > 0 ? results[0] : null;
  }

  public insertOne(collectionName: string, doc: Partial<MongoDocument>): MongoDocument {
    if (!this.inMemoryData[collectionName]) {
      this.inMemoryData[collectionName] = [];
    }

    const _id = doc._id || `${collectionName.slice(0, 3)}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newDoc: MongoDocument = { ...doc, _id };
    this.inMemoryData[collectionName].push(newDoc);
    this.saveToStorage();
    return newDoc;
  }

  public updateOne(collectionName: string, query: Record<string, any>, update: Record<string, any>): boolean {
    const docs = this.inMemoryData[collectionName];
    if (!docs) return false;

    const index = docs.findIndex(d => {
      for (const [k, v] of Object.entries(query)) {
        if (d[k] !== v) return false;
      }
      return true;
    });

    if (index === -1) return false;

    const existing = docs[index];
    let updatedDoc = { ...existing };

    if (update.$set) {
      updatedDoc = { ...updatedDoc, ...update.$set };
    } else {
      updatedDoc = { ...updatedDoc, ...update };
    }

    docs[index] = updatedDoc;
    this.saveToStorage();
    return true;
  }

  public deleteOne(collectionName: string, query: Record<string, any>): boolean {
    const docs = this.inMemoryData[collectionName];
    if (!docs) return false;

    const initialLength = docs.length;
    this.inMemoryData[collectionName] = docs.filter(d => {
      for (const [k, v] of Object.entries(query)) {
        if (d[k] === v) return false;
      }
      return true;
    });

    const changed = this.inMemoryData[collectionName].length !== initialLength;
    if (changed) this.saveToStorage();
    return changed;
  }

  public count(collectionName: string, query?: Record<string, any>): number {
    return this.find(collectionName, query).length;
  }

  public resetDatabase(): void {
    this.inMemoryData = JSON.parse(JSON.stringify(INITIAL_MONGO_DATA));
    this.saveToStorage();
  }

  public exportDatabaseJson(): string {
    return JSON.stringify(this.inMemoryData, null, 2);
  }

  public importDatabaseJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed === 'object' && parsed !== null) {
        this.inMemoryData = parsed;
        this.saveToStorage();
        return true;
      }
    } catch (e) {
      console.error('Error importing JSON to MongoDB:', e);
    }
    return false;
  }
}

export const mongoDb = new MongoDatabase();
