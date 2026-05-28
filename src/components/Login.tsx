import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Buscar usuario en la tabla usuarios
      const { data, error: queryError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .eq('estado', true)
        .single();

      if (queryError || !data) {
        setError('Usuario o contraseña incorrectos');
        setLoading(false);
        return;
      }

      // Guardar usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(data));
      onLoginSuccess(data);
      
      // Redirigir según el rol
      if (data.rol === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/visitante');
      }
    } catch (err) {
      setError('Error en la autenticación');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Logo/Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              Inventario de Equipos
            </h1>
            <p className="text-gray-600 text-sm">
              Hospital IV Augusto Hernández Mendoza
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Campo Usuario */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Botón Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          {/* Credenciales de prueba */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 font-semibold uppercase mb-3">Credenciales de Prueba:</p>
            <div className="space-y-2">
              <div className="bg-blue-50 p-3 rounded text-xs">
                <p className="font-semibold text-blue-900">Admin</p>
                <p className="text-blue-700">Usuario: admin</p>
                <p className="text-blue-700">Contraseña: nh1c4</p>
              </div>
              <div className="bg-green-50 p-3 rounded text-xs">
                <p className="font-semibold text-green-900">Visitante</p>
                <p className="text-green-700">Usuario: visitante</p>
                <p className="text-green-700">Contraseña: EssaluDF123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
