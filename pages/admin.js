import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push('/');
        return;
      }
      
      setUser(data.user);

      // Verifique se o usuário tem o perfil e se a flag is_admin é verdadeira
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single();

      if (error || !profileData?.is_admin) {
        router.push('/');
        return;
      }
      
      setProfile(profileData);
    };

    fetchUser();
  }, []);

  if (!user || !profile) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>
      <h2 className="text-xl mb-2">Usuários cadastrados:</h2>
      {/* Aqui você pode exibir a lista de usuários ou fazer o que for necessário */}
    </div>
  );
}
