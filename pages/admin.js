import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Novo usuário
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newIsAdmin, setNewIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (profile?.is_admin) {
          setIsAdmin(true);
          const { data: users } = await supabase.from('profiles').select('*');
          setProfiles(users);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCreateUser = async () => {
    const { data, error: signupError } = await supabase.auth.signUp({
      email: newEmail,
      password: newPassword,
    });

    if (signupError) {
      alert('Erro ao criar usuário: ' + signupError.message);
      return;
    }

    // Após criar, inserir no profiles com is_admin
    const { user } = data;
    if (user) {
      const { error: insertError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          email: newEmail,
          is_admin: newIsAdmin,
        },
      ]);

      if (insertError) {
        alert('Erro ao inserir no perfil: ' + insertError.message);
      } else {
        alert('Usuário criado com sucesso!');
        setNewEmail('');
        setNewPassword('');
        setNewIsAdmin(false);
        // Recarrega lista
        const { data: updatedUsers } = await supabase.from('profiles').select('*');
        setProfiles(updatedUsers);
      }
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!isAdmin) return <div>Você não tem permissão para ver esta página.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Painel de Administração</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">Criar novo usuário</h2>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          className="border p-2"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <input
          className="border p-2"
          type="password"
          placeholder="Senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={newIsAdmin}
            onChange={(e) => setNewIsAdmin(e.target.checked)}
          />
          <span>Admin</span>
        </label>
        <button onClick={handleCreateUser} className="bg-black text-white px-4 py-2 mt-2 sm:col-span-3">
          Criar Usuário
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Usuários cadastrados</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Admin</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border text-xs">{u.id}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border text-center">{u.is_admin ? '✅' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
