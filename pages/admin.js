import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Admin() {
  const [user, setUser] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data?.user || data.user.email !== 'admin@bookfans.com') {
        router.push('/')
      } else {
        setUser(data.user)
        // Simulação de usuários cadastrados
        setUsuarios([
          { id: 1, email: 'autor1@email.com', tipo: 'autor' },
          { id: 2, email: 'leitor1@email.com', tipo: 'leitor' }
        ])
      }
    }
    fetchUser()
  }, [])

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>
      <h2 className="text-xl mb-2">Usuários cadastrados:</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Tipo</th>
            <th className="border p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.tipo}</td>
              <td className="border p-2"><button className="text-red-600">Desativar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}