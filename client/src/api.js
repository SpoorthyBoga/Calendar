// client/src/api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events'; // Use port 5000

const api = axios.create({
  baseURL: API_URL,
});

export const getEvents = () => api.get('/');
export const createEvent = (eventData) => api.post('/', eventData);
export const updateEvent = (id, eventData) => api.put(`/${id}`, eventData);
export const deleteEvent = (id) => api.delete(`/${id}`);

export default api;