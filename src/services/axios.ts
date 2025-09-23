import axios from 'axios';

const ENDPOINT = import.meta.env.VITE_SHEETS_ENDPOINT as string;
if (!ENDPOINT) throw new Error('SHEETS_ENDPOINT não configurado');
const url = ENDPOINT + (ENDPOINT.includes('?') ? '&' : '?') + 'action=gifts';
export const api = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
});
