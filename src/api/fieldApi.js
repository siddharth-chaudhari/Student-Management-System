import { storageService } from '../utils/storage';

export const fieldApi = {
    getAll: async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return storageService.get('customFields') || [];
    },

    create: async (field) => {
        const fields = storageService.get('customFields') || [];
        const newField = { ...field, id: `cf-${Date.now()}` };
        fields.push(newField);
        storageService.set('customFields', fields);
        return newField;
    },

    update: async (id, updates) => {
        const fields = storageService.get('customFields') || [];
        const index = fields.findIndex(f => f.id === id);
        if (index !== -1) {
            fields[index] = { ...fields[index], ...updates };
            storageService.set('customFields', fields);
            return fields[index];
        }
        return null;
    },

    delete: async (id) => {
        const fields = storageService.get('customFields') || [];
        const filtered = fields.filter(f => f.id !== id);
        storageService.set('customFields', filtered);
        return true;
    }
};