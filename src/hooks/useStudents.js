import { useSWR } from './useSWR';
import { studentApi } from '../api/studentApi';
import { useAuth } from '../context/AuthContext';

export const useStudents = () => {
    const { user } = useAuth();
    const { data, error, isLoading, mutate } = useSWR('students', studentApi.getAll);

    const filteredData = user?.role === 'student'
        ? data?.filter(s => s.id === user.id)
        : data;

    return {
        students: filteredData || [],
        isLoading,
        error,
        mutate,
        createStudent: async (student) => {
            const newStudent = await studentApi.create(student);
            await mutate();
            return newStudent;
        },
        updateStudent: async (id, updates) => {
            const updated = await studentApi.update(id, updates);
            await mutate();
            return updated;
        },
        deleteStudent: async (id) => {
            await studentApi.delete(id);
            await mutate();
        }
    };
};