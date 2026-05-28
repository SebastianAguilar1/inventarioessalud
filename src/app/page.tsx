'use client';

import { useState, useEffect } from 'react';
import Login from '@/components/Login';
import AdminDashboard from '@/components/AdminDashboard';
import VisitanteDashboard from '@/components/VisitanteDashboard';

export default function Home() {
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <Login onLoginSuccess={setUsuario} />;
  }

  if (usuario.rol === 'admin') {
    return <AdminDashboard usuario={usuario} setUsuario={setUsuario} />;
  }

  return <VisitanteDashboard usuario={usuario} setUsuario={setUsuario} />;
}
