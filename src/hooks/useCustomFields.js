import { useSWR } from './useSWR';
import { fieldApi } from '../api/fieldApi';

export const useCustomFields = () => {
    const { data, error, isLoading, mutate } = useSWR('customFields', fieldApi.getAll);

    return {
        fields: data || [],
        isLoading,
        error,
        mutate,
        createField: async (field) => {
            const newField = await fieldApi.create(field);
            await mutate();
            return newField;
        },
        updateField: async (id, updates) => {
            await fieldApi.update(id, updates);
            await mutate();
        },
        deleteField: async (id) => {
            await fieldApi.delete(id);
            await mutate();
        }
    };
};