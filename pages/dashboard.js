import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  if (!user) return <p className="text-center mt-20">Carregando...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-xl font-bold">Olá, {user.email}</h1>
      <p className="mt-2 text-gray-600">Este será o seu painel.</p>
    </div>
  );
}