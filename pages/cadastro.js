import { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Certifique-se de que a configuração do Supabase está correta

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(''); // Para mostrar o erro
  const [carregando, setCarregando] = useState(false); // Para mostrar o estado de carregamento

  const handleCadastro = async (e) => {
    e.preventDefault(); // Impede o reload da página

    setErro(''); // Limpa o erro
    setCarregando(true); // Coloca a tela em estado de carregando

    // Criação do usuário no Supabase
    const { user, error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    setCarregando(false); // Retorna o estado de carregando

    if (error) {
      setErro(error.message); // Exibe o erro
      return;
    }

    alert('Cadastro bem-sucedido! Verifique seu e-mail para confirmar.');
    // Você pode redirecionar o usuário para a página de login ou qualquer outra página desejada
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Cadastro</h1>
      <form onSubmit={handleCadastro}>
        <input
          className="w-full mb-2 p-2 border"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full mb-2 p-2 border"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2"
          disabled={carregando} // Desabilita o botão durante o carregamento
        >
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      {erro && <p className="text-red-500 mt-4">{erro}</p>} {/* Exibe o erro se houver */}
    </div>
  );
}
