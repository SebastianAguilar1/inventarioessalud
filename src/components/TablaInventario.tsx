'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface TablaInventarioProps {
  equipos: any[];
  onRefresh: () => void;
}

export default function TablaInventario({ equipos, onRefresh }: TablaInventarioProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [filterEstado, setFilterEstado] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredEquipos = equipos.filter(equipo => {
    const matchEstado = filterEstado === 'TODOS' || equipo.estado === filterEstado;
    const matchSearch = searchTerm === '' || 
      equipo.codigo_patrimonial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchEstado && matchSearch;
  });

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este equipo?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('inventario_equipos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      onRefresh();
    } catch (err) {
      console.error('Error eliminando equipo:', err);
      alert('Error al eliminar el equipo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Equipos Registrados</h2>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Filtrar por Estado</label>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="TODOS">TODOS</option>
            <option value="OPERATIVO">OPERATIVO</option>
            <option value="INOPERATIVO">INOPERATIVO</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Buscar</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Código, marca, ubicación..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Tabla responsiva */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-blue-100">
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Marca/Modelo</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Ubicación</th>
              <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipos.length === 0 ? (
              <tr>
                <td colSpan={6} className="border border-gray-300 px-4 py-6 text-center text-gray-500">
                  No hay equipos registrados
                </td>
              </tr>
            ) : (
              filteredEquipos.map((equipo) => (
                <tr key={equipo.id} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-300 px-4 py-3 text-sm">{equipo.id}</td>
                  <td className="border border-gray-300 px-4 py-3 text-sm font-semibold text-blue-600">
                    {equipo.tipo_equipo === 'DESKTOP' && '💻'}
                    {equipo.tipo_equipo === 'IMPRESORA' && '🖨️'}
                    {equipo.tipo_equipo === 'SCANNER' && '📠'}
                    {' '}{equipo.tipo_equipo}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm">
                    {equipo.marca} {equipo.modelo}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      equipo.estado === 'OPERATIVO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {equipo.estado}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm">{equipo.ubicacion || '-'}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={() => setExpandedRow(expandedRow === equipo.id ? null : equipo.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleEliminar(equipo.id)}
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-xs font-semibold transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detalles expandidos */}
      {expandedRow && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          {filteredEquipos.find(e => e.id === expandedRow) && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Detalles del Equipo ID: {expandedRow}</h3>
              {(() => {
                const equipo = filteredEquipos.find(e => e.id === expandedRow);
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {/* Info General */}
                    <div>
                      <p className="font-semibold text-gray-700">Tipo de Equipo:</p>
                      <p className="text-gray-600">{equipo.tipo_equipo}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Código Patrimonial:</p>
                      <p className="text-gray-600">{equipo.codigo_patrimonial || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Marca:</p>
                      <p className="text-gray-600">{equipo.marca || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Modelo:</p>
                      <p className="text-gray-600">{equipo.modelo || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Serie:</p>
                      <p className="text-gray-600">{equipo.serie || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Estado:</p>
                      <p className="text-gray-600">{equipo.estado || '-'}</p>
                    </div>

                    {/* Detalles DESKTOP */}
                    {equipo.tipo_equipo === 'DESKTOP' && (
                      <>
                        <div className="col-span-2 border-t border-gray-300 pt-2 mt-2">
                          <p className="font-bold text-blue-700">📱 CPU</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">SO CPU:</p>
                          <p className="text-gray-600">{equipo.so_cpu || '-'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Procesador:</p>
                          <p className="text-gray-600">{equipo.procesador_cpu || '-'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">IP:</p>
                          <p className="text-gray-600">{equipo.ip_cpu || '-'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Ofimática:</p>
                          <p className="text-gray-600">{equipo.ofimatica_cpu || '-'}</p>
                        </div>

                        <div className="col-span-2 border-t border-gray-300 pt-2 mt-2">
                          <p className="font-bold text-purple-700">⌨️ Teclado</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Código Patrimonial Teclado:</p>
                          <p className="text-gray-600">{equipo.codigo_patrimonial_teclado || '-'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Marca Teclado:</p>
                          <p className="text-gray-600">{equipo.marca_teclado || '-'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Modelo Teclado:</p>
                          <p className="text-gray-600">{equipo.modelo_teclado || '-'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Estado Teclado:</p>
                          <p className="text-gray-600">{equipo.estado_teclado || '-'}</p>
                        </div>

                        <div className="col-span-2 border-t border-gray-300 pt-2 mt-2">
                          <p className="font-bold text-emerald-700">🖥️ Monitor</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Código Patrimonial Monitor:</p>
                          <p className="text-gray-600">{equipo.codigo_patrimonial_monitor || '-'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Marca Monitor:</p>
                          <p className="text-gray-600">{equipo.marca_monitor || '-'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Modelo Monitor:</p>
                          <p className="text-gray-600">{equipo.modelo_monitor || '-'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Estado Monitor:</p>
                          <p className="text-gray-600">{equipo.estado_monitor || '-'}</p>
                        </div>
                      </>
                    )}

                    {/* Ubicación */}
                    <div className="col-span-2 border-t border-gray-300 pt-2 mt-2">
                      <p className="font-bold text-yellow-700">📍 Ubicación</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Red Asistencial:</p>
                      <p className="text-gray-600">{equipo.red_asistencial || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Gerencia:</p>
                      <p className="text-gray-600">{equipo.gerencia || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Sub Gerencia:</p>
                      <p className="text-gray-600">{equipo.sub_gerencia || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Ubicación:</p>
                      <p className="text-gray-600">{equipo.ubicacion || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Piso:</p>
                      <p className="text-gray-600">{equipo.piso || '-'}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
