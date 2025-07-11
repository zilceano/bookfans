import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = async () => {
    const { error } = await supabase.auth.signUp({ email, password: senha });
    if (error) alert(error.message);
    else alert("Cadastro feito! Confirme seu e-mail.");
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Cadastro</h1>
      <input className="w-full mb-2 p-2 border" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input className="w-full mb-2 p-2 border" type="password" placeholder="Senha" onChange={e => setSenha(e.target.value)} />
      <button className="bg-black text-white px-4 py-2" onClick={handleCadastro}>Cadastrar</button>
    </div>
  );
}