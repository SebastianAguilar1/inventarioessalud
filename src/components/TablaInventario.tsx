'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface TablaInventarioProps {
  equipos: any[];
  onRefresh: () => void;
  usuarioActual?: any;
}

export default function TablaInventario({ equipos, onRefresh, usuarioActual }: TablaInventarioProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [filterEstado, setFilterEstado] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const filteredEquipos = equipos.filter(equipo => {
    const matchEstado = filterEstado === 'TODOS' || equipo.estado === filterEstado;
    
    if (searchTerm === '') return matchEstado;
    
    const searchLower = searchTerm.toLowerCase();
    
    // Buscar en TODOS los campos del equipo
    const matchSearch = Object.values(equipo).some(value => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchLower);
    });
    
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

  const handleEditClick = (equipo: any) => {
    setEditingId(equipo.id);
    setEditData({ ...equipo });
  };

  const handleEditChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleGuardarCambios = async () => {
    if (!editData) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('inventario_equipos')
        .update(editData)
        .eq('id', editingId);

      if (error) throw error;
      
      setEditingId(null);
      setEditData(null);
      onRefresh();
      alert('✅ Equipo actualizado exitosamente');
    } catch (err) {
      console.error('Error actualizando equipo:', err);
      alert('Error al actualizar el equipo');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarEdicion = () => {
    setEditingId(null);
    setEditData(null);
  };

  const isAdmin = usuarioActual?.rol === 'admin';

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
          <label className="block text-sm font-semibold text-gray-700 mb-2">Buscar en todos los campos</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Busca por: código, serie, marca, modelo, IP, ubicación, etc..."
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
                        title="Ver detalles"
                      >
                        👁️
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleEditClick(equipo)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                          title="Editar equipo"
                        >
                          ✏️
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          onClick={() => handleEliminar(equipo.id)}
                          disabled={loading}
                          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-xs font-semibold transition"
                          title="Eliminar equipo"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Edición */}
      {editingId && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-blue-600 text-white p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">✏️ Editar Equipo ID: {editingId}</h3>
              <button
                onClick={handleCancelarEdicion}
                className="text-2xl font-bold hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* INFORMACIÓN GENERAL */}
              <div>
                <h4 className="text-md font-bold text-cyan-800 mb-3 border-b-2 border-cyan-300 pb-2">🖥️ Información General</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Equipo</label>
                    <input
                      type="text"
                      value={editData.tipo_equipo || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Código Patrimonial</label>
                    <input
                      type="text"
                      value={editData.codigo_patrimonial || ''}
                      onChange={(e) => handleEditChange('codigo_patrimonial', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Serie</label>
                    <input
                      type="text"
                      value={editData.serie || ''}
                      onChange={(e) => handleEditChange('serie', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Marca</label>
                    <input
                      type="text"
                      value={editData.marca || ''}
                      onChange={(e) => handleEditChange('marca', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Modelo</label>
                    <input
                      type="text"
                      value={editData.modelo || ''}
                      onChange={(e) => handleEditChange('modelo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                    <select
                      value={editData.estado || ''}
                      onChange={(e) => handleEditChange('estado', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    >
                      <option value="OPERATIVO">OPERATIVO</option>
                      <option value="INOPERATIVO">INOPERATIVO</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* INFORMACIÓN DE CPU (solo para DESKTOP) */}
              {editData.tipo_equipo === 'DESKTOP' && (
                <div>
                  <h4 className="text-md font-bold text-cyan-800 mb-3 border-b-2 border-cyan-300 pb-2">💾 Información de CPU</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Sistema Operativo</label>
                      <input
                        type="text"
                        value={editData.so_cpu || ''}
                        onChange={(e) => handleEditChange('so_cpu', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Procesador</label>
                      <input
                        type="text"
                        value={editData.procesador_cpu || ''}
                        onChange={(e) => handleEditChange('procesador_cpu', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">IP</label>
                      <input
                        type="text"
                        value={editData.ip_cpu || ''}
                        onChange={(e) => handleEditChange('ip_cpu', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Ofimática</label>
                      <input
                        type="text"
                        value={editData.ofimatica_cpu || ''}
                        onChange={(e) => handleEditChange('ofimatica_cpu', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* INFORMACIÓN DE TECLADO (solo para DESKTOP) */}
              {editData.tipo_equipo === 'DESKTOP' && (
                <div>
                  <h4 className="text-md font-bold text-purple-800 mb-3 border-b-2 border-purple-300 pb-2">⌨️ Información de Teclado</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Código Patrimonial Teclado</label>
                      <input
                        type="text"
                        value={editData.codigo_patrimonial_teclado || ''}
                        onChange={(e) => handleEditChange('codigo_patrimonial_teclado', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Serie Teclado</label>
                      <input
                        type="text"
                        value={editData.serie_teclado || ''}
                        onChange={(e) => handleEditChange('serie_teclado', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Marca Teclado</label>
                      <input
                        type="text"
                        value={editData.marca_teclado || ''}
                        onChange={(e) => handleEditChange('marca_teclado', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Modelo Teclado</label>
                      <input
                        type="text"
                        value={editData.modelo_teclado || ''}
                        onChange={(e) => handleEditChange('modelo_teclado', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Estado Teclado</label>
                      <select
                        value={editData.estado_teclado || ''}
                        onChange={(e) => handleEditChange('estado_teclado', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      >
                        <option value="OPERATIVO">OPERATIVO</option>
                        <option value="INOPERATIVO">INOPERATIVO</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* INFORMACIÓN DE MONITOR (solo para DESKTOP) */}
              {editData.tipo_equipo === 'DESKTOP' && (
                <div>
                  <h4 className="text-md font-bold text-emerald-800 mb-3 border-b-2 border-emerald-300 pb-2">🖥️ Información de Monitor</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Código Patrimonial Monitor</label>
                      <input
                        type="text"
                        value={editData.codigo_patrimonial_monitor || ''}
                        onChange={(e) => handleEditChange('codigo_patrimonial_monitor', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Serie Monitor</label>
                      <input
                        type="text"
                        value={editData.serie_monitor || ''}
                        onChange={(e) => handleEditChange('serie_monitor', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Marca Monitor</label>
                      <input
                        type="text"
                        value={editData.marca_monitor || ''}
                        onChange={(e) => handleEditChange('marca_monitor', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Modelo Monitor</label>
                      <input
                        type="text"
                        value={editData.modelo_monitor || ''}
                        onChange={(e) => handleEditChange('modelo_monitor', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Estado Monitor</label>
                      <select
                        value={editData.estado_monitor || ''}
                        onChange={(e) => handleEditChange('estado_monitor', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      >
                        <option value="OPERATIVO">OPERATIVO</option>
                        <option value="INOPERATIVO">INOPERATIVO</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* INFORMACIÓN DE UBICACIÓN */}
              <div>
                <h4 className="text-md font-bold text-yellow-800 mb-3 border-b-2 border-yellow-300 pb-2">📍 Información de Ubicación</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Red Asistencial</label>
                    <input
                      type="text"
                      value={editData.red_asistencial || ''}
                      onChange={(e) => handleEditChange('red_asistencial', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Gerencia</label>
                    <input
                      type="text"
                      value={editData.gerencia || ''}
                      onChange={(e) => handleEditChange('gerencia', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sub Gerencia</label>
                    <input
                      type="text"
                      value={editData.sub_gerencia || ''}
                      onChange={(e) => handleEditChange('sub_gerencia', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación (Oficina, Sala, etc.)</label>
                    <input
                      type="text"
                      value={editData.ubicacion || ''}
                      onChange={(e) => handleEditChange('ubicacion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Piso</label>
                    <select
                      value={editData.piso || ''}
                      onChange={(e) => handleEditChange('piso', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    >
                      <option value="PISO-1">PISO-1</option>
                      <option value="PISO-2">PISO-2</option>
                      <option value="PISO-3">PISO-3</option>
                      <option value="PISO-4">PISO-4</option>
                      <option value="PISO-5">PISO-5</option>
                      <option value="SÓTANO">SÓTANO</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancelarEdicion}
                  disabled={loading}
                  className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarCambios}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-semibold transition"
                >
                  {loading ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detalles expandidos */}
      {expandedRow && !editingId && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          {filteredEquipos.find(e => e.id === expandedRow) && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Detalles del Equipo ID: {expandedRow}</h3>
              {(() => {
                const equipo = filteredEquipos.find(e => e.id === expandedRow);
                return (
                  <div className="space-y-6">
                    {/* Info Básica */}
                    <div>
                      <h4 className="text-md font-bold text-gray-800 mb-3 border-b-2 border-gray-300 pb-2">📋 Información Básica</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-700">Tipo de Equipo:</p>
                          <p className="text-gray-600">{equipo.tipo_equipo}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Estado:</p>
                          <p className="text-gray-600">{equipo.estado || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* CPU - Información General + CPU (Fusionada) */}
                    {equipo.tipo_equipo === 'DESKTOP' && (
                      <div>
                        <h4 className="text-md font-bold text-cyan-800 mb-3 border-b-2 border-cyan-300 pb-2 bg-cyan-50 px-3 py-2 rounded">🖥️ Información de CPU</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-cyan-50 p-4 rounded">
                          <div>
                            <p className="font-semibold text-gray-700">Código Patrimonial:</p>
                            <p className="text-gray-600">{equipo.codigo_patrimonial || '-'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Serie:</p>
                            <p className="text-gray-600">{equipo.serie || '-'}</p>
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
                            <p className="font-semibold text-gray-700">Sistema Operativo:</p>
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
                        </div>
                      </div>
                    )}

                    {/* Información General para IMPRESORA y SCANNER */}
                    {equipo.tipo_equipo !== 'DESKTOP' && (
                      <div>
                        <h4 className="text-md font-bold text-cyan-800 mb-3 border-b-2 border-cyan-300 pb-2 bg-cyan-50 px-3 py-2 rounded">🖥️ Información General</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-cyan-50 p-4 rounded">
                          <div>
                            <p className="font-semibold text-gray-700">Código Patrimonial:</p>
                            <p className="text-gray-600">{equipo.codigo_patrimonial || '-'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Serie:</p>
                            <p className="text-gray-600">{equipo.serie || '-'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Marca:</p>
                            <p className="text-gray-600">{equipo.marca || '-'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Modelo:</p>
                            <p className="text-gray-600">{equipo.modelo || '-'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Teclado */}
                    {equipo.tipo_equipo === 'DESKTOP' && (
                      <div>
                        <h4 className="text-md font-bold text-purple-800 mb-3 border-b-2 border-purple-300 pb-2 bg-purple-50 px-3 py-2 rounded">⌨️ Información de Teclado</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-purple-50 p-4 rounded">
                          <div>
                            <p className="font-semibold text-gray-700">Código Patrimonial:</p>
                            <p className="text-gray-600">{equipo.codigo_patrimonial_teclado || '-'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Serie:</p>
                            <p className="text-gray-600">{equipo.serie_teclado || '-'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Marca:</p>
                            <p className="text-gray-600">{equipo.marca_teclado || '-'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Modelo:</p>
                            <p className="text-gray-600">{equipo.modelo_teclado || '-'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Estado:</p>
                            <p className="text-gray-600">{equipo.estado_teclado || '-'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Monitor */}
                    {equipo.tipo_equipo === 'DESKTOP' && (
                      <div>
                        <h4 className="text-md font-bold text-emerald-800 mb-3 border-b-2 border-emerald-300 pb-2 bg-emerald-50 px-3 py-2 rounded">🖥️ Información de Monitor</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-emerald-50 p-4 rounded">
                          <div>
                            <p className="font-semibold text-gray-700">Código Patrimonial:</p>
                            <p className="text-gray-600">{equipo.codigo_patrimonial_monitor || '-'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Serie:</p>
                            <p className="text-gray-600">{equipo.serie_monitor || '-'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Marca:</p>
                            <p className="text-gray-600">{equipo.marca_monitor || '-'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Modelo:</p>
                            <p className="text-gray-600">{equipo.modelo_monitor || '-'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Estado:</p>
                            <p className="text-gray-600">{equipo.estado_monitor || '-'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ubicación */}
                    <div>
                      <h4 className="text-md font-bold text-yellow-800 mb-3 border-b-2 border-yellow-300 pb-2 bg-yellow-50 px-3 py-2 rounded">📍 Información de Ubicación</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-yellow-50 p-4 rounded">
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
};