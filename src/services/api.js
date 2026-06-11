import api from '../utils/api';

export async function sendMessage(data) {
  const res = await api.post('/api/messages', data);
  return res.data;
}