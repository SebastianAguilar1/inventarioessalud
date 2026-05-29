'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import FormularioInventario from './FormularioInventario';
import TablaInventario from './TablaInventario';

interface AdminDashboardProps {
  usuario: any;
  setUsuario: (usuario: any) => void;
}

export default function AdminDashboard({ usuario, setUsuario }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'formulario' | 'tabla'>('formulario');
  const [equipos, setEquipos] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    cargarEquipos();
  }, [refreshTrigger]);

  const cargarEquipos = async () => {
    try {
      const { data, error } = await supabase
        .from('inventario_equipos')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setEquipos(data || []);
    } catch (err) {
      console.error('Error cargando equipos:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    window.location.href = '/';
  };

  const handleFormSubmit = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('tabla');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Inventario de Equipos</h1>
              <p className="text-blue-100 text-sm">Hospital IV Augusto Hernández Mendoza</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{usuario.username}</p>
                <p className="text-xs text-blue-100 uppercase">{usuario.rol}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('formulario')}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'formulario'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📝 Nuevo Equipo
            </button>
            <button
              onClick={() => setActiveTab('tabla')}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'tabla'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Ver Equipos ({equipos.length})
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'formulario' ? (
          <FormularioInventario onSuccess={handleFormSubmit} />
        ) : (
          <TablaInventario equipos={equipos} onRefresh={cargarEquipos} usuarioActual={usuario} />
        )}
      </main>
    </div>
  );
}
