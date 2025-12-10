import gateway from '../gateway';

export const getIncidencias = async () => {
    const response = await gateway.get('/incidencias');
    return response.data;
};

export const createIncidencia = async (data) => {
    const response = await gateway.post('/incidencias', data);
    return response.data;
};
