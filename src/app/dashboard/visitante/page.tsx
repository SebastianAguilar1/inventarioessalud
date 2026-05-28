'use client';

import { useState, useEffect } from 'react';
import VisitanteDashboard from '@/components/VisitanteDashboard';
import Login from '@/components/Login';

export default function VisitantePage() {
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuarioParsed = JSON.parse(usuarioGuardado);
      if (usuarioParsed.rol === 'visitante') {
        setUsuario(usuarioParsed);
      } else {
        window.location.href = '/';
      }
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

  return <VisitanteDashboard usuario={usuario} setUsuario={setUsuario} />;
}
