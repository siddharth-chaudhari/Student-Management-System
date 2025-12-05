import { storageService } from '../utils/storage';

export const studentApi = {
    getAll: async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return storageService.get('students') || [];
    },

    getById: async (id) => {
        const students = storageService.get('students') || [];
        return students.find(s => s.id === id);
    },

    create: async (student) => {
        const students = storageService.get('students') || [];
        const newStudent = {
            ...student,
            id: `student-${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0]
        };
        students.push(newStudent);
        storageService.set('students', students);
        return newStudent;
    },

    update: async (id, updates) => {
        const students = storageService.get('students') || [];
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) {
            students[index] = { ...students[index], ...updates };
            storageService.set('students', students);
            return students[index];
        }
        return null;
    },

    delete: async (id) => {
        const students = storageService.get('students') || [];
        const filtered = students.filter(s => s.id !== id);
        storageService.set('students', filtered);
        return true;
    }
};