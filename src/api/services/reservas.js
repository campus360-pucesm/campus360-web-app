import gateway from '../gateway';

export const getReservas = async () => {
    const response = await gateway.get('/reservas');
    return response.data;
};

export const createReserva = async (data) => {
    const response = await gateway.post('/reservas', data);
    return response.data;
};
