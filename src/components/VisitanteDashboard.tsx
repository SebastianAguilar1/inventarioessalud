'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import TablaInventario from './TablaInventario';
import * as XLSX from 'xlsx';

interface VisitanteDashboardProps {
  usuario: any;
  setUsuario: (usuario: any) => void;
}

export default function VisitanteDashboard({ usuario, setUsuario }: VisitanteDashboardProps) {
  const [equipos, setEquipos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    cargarEquipos();
  }, []);

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

  const handleExportarExcel = async () => {
    setLoading(true);
    try {
      // Preparar datos para Excel
      const datosExport = equipos.map(equipo => ({
        'ID': equipo.id,
        'Tipo Equipo': equipo.tipo_equipo_id,
        'Código CPU': equipo.codigo_patrimonial_cpu || '',
        'Serie CPU': equipo.serie_cpu || '',
        'Marca CPU': equipo.marca_cpu || '',
        'Modelo CPU': equipo.modelo_cpu || '',
        'Sistema Operativo': equipo.sistema_operativo || '',
        'Procesador': equipo.procesador || '',
        'IP': equipo.ip || '',
        'Ofimática': equipo.ofimatica || '',
        'Estado CPU': equipo.estado_cpu || '',
        'Código Teclado': equipo.codigo_patrimonial_teclado || '',
        'Serie Teclado': equipo.serie_teclado || '',
        'Marca Teclado': equipo.marca_teclado || '',
        'Modelo Teclado': equipo.modelo_teclado || '',
        'Estado Teclado': equipo.estado_teclado || '',
        'Código Monitor': equipo.codigo_patrimonial_monitor || '',
        'Serie Monitor': equipo.serie_monitor || '',
        'Marca Monitor': equipo.marca_monitor || '',
        'Modelo Monitor': equipo.modelo_monitor || '',
        'Estado Monitor': equipo.estado_monitor || '',
        'Red Asistencial': equipo.red_asistencial || '',
        'Gerencia': equipo.gerencia_central || '',
        'Sub Gerencia': equipo.sub_gerencia || '',
        'Ubicación': equipo.ubicacion || '',
        'Piso': equipo.piso || '',
        'Estado General': equipo.estado_equipo || '',
        'Completado': equipo.completado ? 'Sí' : 'No',
        'Fecha Creación': new Date(equipo.created_at).toLocaleDateString('es-BO'),
      }));

      // Crear workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(datosExport);
      
      // Ajustar ancho de columnas
      ws['!cols'] = Array(Object.keys(datosExport[0] || {}).length).fill({ wch: 15 });
      
      XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
      
      // Descargar
      XLSX.writeFile(wb, `Inventario_Equipos_${new Date().toLocaleDateString('es-BO')}.xlsx`);
      
      setSuccess('Reporte exportado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error exportando Excel:', err);
      alert('Error al exportar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    window.location.href = '/';
  };

  const estadisticas = {
    total: equipos.length,
    operativos: equipos.filter(e => e.estado_equipo === 'OPERATIVO').length,
    inoperativos: equipos.filter(e => e.estado_equipo === 'INOPERATIVO').length,
    completados: equipos.filter(e => e.completado).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Consulta de Inventario</h1>
              <p className="text-green-100 text-sm">Hospital IV Augusto Hernández Mendoza</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{usuario.username}</p>
                <p className="text-xs text-green-100 uppercase">{usuario.rol}</p>
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

      {/* Estadísticas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <p className="text-gray-600 text-sm font-semibold">Total Equipos</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{estadisticas.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <p className="text-gray-600 text-sm font-semibold">Operativos</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{estadisticas.operativos}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <p className="text-gray-600 text-sm font-semibold">Inoperativos</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{estadisticas.inoperativos}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <p className="text-gray-600 text-sm font-semibold">Completados</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{estadisticas.completados}</p>
          </div>
        </div>

        {/* Botón Exportar */}
        <div className="mb-6">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-700">{success}</p>
            </div>
          )}
          <button
            onClick={handleExportarExcel}
            disabled={loading || equipos.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
          >
            📊 {loading ? 'Generando...' : 'Exportar a Excel'}
          </button>
        </div>

        {/* Tabla */}
        <TablaInventario equipos={equipos} onRefresh={cargarEquipos} />
      </div>
    </div>
  );
}
