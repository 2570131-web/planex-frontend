import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function AdminMessages() {
  const { id } = useParams();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await api.get(`/api/messages/${id}`);
        setMessage(res.data);
      } catch (err) {
        console.log("Failed to fetch message");
      }
    };

    fetchMessage();
  }, [id]);

  if (!message) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-white/70">
        Loading message...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">

      <h1 className="text-xl font-bold text-gold-500 dark:text-gold-400">
        Message Details
      </h1>

      <div className="bg-white dark:bg-navy-800 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-white/10 space-y-3">

        <p className="text-gray-900 dark:text-white">
          <span className="text-gold-500 dark:text-gold-400 font-semibold">Name:</span> {message.name}
        </p>

        <p className="text-gray-900 dark:text-white">
          <span className="text-gold-400 font-semibold">Email:</span> {message.email}
        </p>

        <p className="text-gray-900 dark:text-white">
          <span className="text-gold-400 font-semibold">Phone:</span> {message.mobile || "Not provided"}
        </p>

        <div>
          <p className="text-gold-400 font-semibold mb-1">Subject:</p>
          <p className="text-gray-800 dark:text-white/80">{message.subject}</p>
        </div>

        <div>
          <p className="text-gold-400 font-semibold mb-1">Message:</p>
          <p className="text-gray-800 dark:text-white/80">{message.message}</p>
        </div>

      </div>
    </div>
  );
}