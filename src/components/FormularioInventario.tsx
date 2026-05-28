'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface FormularioInventarioProps {
  onSuccess: () => void;
}

export default function FormularioInventario({ onSuccess }: FormularioInventarioProps) {
  // Estado para tipo de equipo seleccionado
  const [tipoEquipo, setTipoEquipo] = useState('');

  // Estado para datos comunes
  const [commonData, setCommonData] = useState({
    codigo_patrimonial: '',
    serie: '',
    marca: '',
    modelo: '',
    estado: 'OPERATIVO',
  });

  // Estado para datos específicos de DESKTOP
  const [desktopData, setDesktopData] = useState({
    so_cpu: '',
    procesador_cpu: '',
    ip_cpu: '',
    ofimatica_cpu: '',
    codigo_patrimonial_teclado: '',
    serie_teclado: '',
    marca_teclado: '',
    modelo_teclado: '',
    estado_teclado: 'OPERATIVO',
    codigo_patrimonial_monitor: '',
    serie_monitor: '',
    marca_monitor: '',
    modelo_monitor: '',
    estado_monitor: 'OPERATIVO',
  });

  // Estado para ubicación (común a todos los tipos)
  const [ubicacionData, setUbicacionData] = useState({
    red_asistencial: '',
    gerencia: '',
    sub_gerencia: '',
    ubicacion: '',
    piso: 'PISO-1',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChangeCommon = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCommonData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeDesktop = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDesktopData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeUbicacion = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUbicacionData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!tipoEquipo) {
        setError('Por favor selecciona un tipo de equipo');
        setLoading(false);
        return;
      }

      // Construir objeto de datos según el tipo de equipo
      let dataToSave: any = {
        tipo_equipo: tipoEquipo,
        ...commonData,
        ...ubicacionData,
      };

      // Si es DESKTOP, agregar datos específicos
      if (tipoEquipo === 'DESKTOP') {
        dataToSave = {
          ...dataToSave,
          ...desktopData,
        };
      }

      const { error } = await supabase
        .from('inventario_equipos')
        .insert([dataToSave])
        .select();

      if (error) throw error;

      setSuccess('✅ Equipo registrado exitosamente');

      // Resetear formulario
      setTipoEquipo('');
      setCommonData({
        codigo_patrimonial: '',
        serie: '',
        marca: '',
        modelo: '',
        estado: 'OPERATIVO',
      });
      setDesktopData({
        so_cpu: '',
        procesador_cpu: '',
        ip_cpu: '',
        ofimatica_cpu: '',
        codigo_patrimonial_teclado: '',
        serie_teclado: '',
        marca_teclado: '',
        modelo_teclado: '',
        estado_teclado: 'OPERATIVO',
        codigo_patrimonial_monitor: '',
        serie_monitor: '',
        marca_monitor: '',
        modelo_monitor: '',
        estado_monitor: 'OPERATIVO',
      });
      setUbicacionData({
        red_asistencial: '',
        gerencia: '',
        sub_gerencia: '',
        ubicacion: '',
        piso: 'PISO-1',
      });

      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError('Error guardando equipo: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrar Nuevo Equipo</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECCIÓN 1: Tipo de Equipo */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Tipo de Equipo</h3>
          <select
            value={tipoEquipo}
            onChange={(e) => setTipoEquipo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Selecciona un tipo --</option>
            <option value="DESKTOP">💻 DESKTOP (Computadora)</option>
            <option value="IMPRESORA">🖨️ IMPRESORA</option>
            <option value="SCANNER">📠 SCANNER</option>
          </select>
        </div>

        {/* SECCIÓN 2: Datos Comunes (para todos los tipos) */}
        {tipoEquipo && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-4">📊 Información General</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="codigo_patrimonial"
                value={commonData.codigo_patrimonial}
                onChange={handleChangeCommon}
                placeholder="Código Patrimonial"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                name="serie"
                value={commonData.serie}
                onChange={handleChangeCommon}
                placeholder="Serie"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                name="marca"
                value={commonData.marca}
                onChange={handleChangeCommon}
                placeholder="Marca"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                name="modelo"
                value={commonData.modelo}
                onChange={handleChangeCommon}
                placeholder="Modelo"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <select
                name="estado"
                value={commonData.estado}
                onChange={handleChangeCommon}
                className="col-span-1 sm:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="OPERATIVO">✅ OPERATIVO</option>
                <option value="INOPERATIVO">❌ INOPERATIVO</option>
              </select>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: Detalles específicos para DESKTOP */}
        {tipoEquipo === 'DESKTOP' && (
          <>
            {/* CPU */}
            <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
              <h3 className="text-lg font-bold text-cyan-900 mb-4">🖥️ Información de CPU</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="so_cpu"
                  value={desktopData.so_cpu}
                  onChange={handleChangeDesktop}
                  placeholder="Sistema Operativo"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <input
                  type="text"
                  name="procesador_cpu"
                  value={desktopData.procesador_cpu}
                  onChange={handleChangeDesktop}
                  placeholder="Procesador"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <input
                  type="text"
                  name="ip_cpu"
                  value={desktopData.ip_cpu}
                  onChange={handleChangeDesktop}
                  placeholder="IP"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <input
                  type="text"
                  name="ofimatica_cpu"
                  value={desktopData.ofimatica_cpu}
                  onChange={handleChangeDesktop}
                  placeholder="Ofimática"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
            </div>

            {/* Teclado */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="text-lg font-bold text-purple-900 mb-4">⌨️ Información de Teclado</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="codigo_patrimonial_teclado"
                  value={desktopData.codigo_patrimonial_teclado}
                  onChange={handleChangeDesktop}
                  placeholder="Código Patrimonial"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="text"
                  name="serie_teclado"
                  value={desktopData.serie_teclado}
                  onChange={handleChangeDesktop}
                  placeholder="Serie"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="text"
                  name="marca_teclado"
                  value={desktopData.marca_teclado}
                  onChange={handleChangeDesktop}
                  placeholder="Marca"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="text"
                  name="modelo_teclado"
                  value={desktopData.modelo_teclado}
                  onChange={handleChangeDesktop}
                  placeholder="Modelo"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <select
                  name="estado_teclado"
                  value={desktopData.estado_teclado}
                  onChange={handleChangeDesktop}
                  className="col-span-1 sm:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="OPERATIVO">✅ OPERATIVO</option>
                  <option value="INOPERATIVO">❌ INOPERATIVO</option>
                </select>
              </div>
            </div>

            {/* Monitor */}
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-bold text-emerald-900 mb-4">🖥️ Información de Monitor</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="codigo_patrimonial_monitor"
                  value={desktopData.codigo_patrimonial_monitor}
                  onChange={handleChangeDesktop}
                  placeholder="Código Patrimonial"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <input
                  type="text"
                  name="serie_monitor"
                  value={desktopData.serie_monitor}
                  onChange={handleChangeDesktop}
                  placeholder="Serie"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <input
                  type="text"
                  name="marca_monitor"
                  value={desktopData.marca_monitor}
                  onChange={handleChangeDesktop}
                  placeholder="Marca"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <input
                  type="text"
                  name="modelo_monitor"
                  value={desktopData.modelo_monitor}
                  onChange={handleChangeDesktop}
                  placeholder="Modelo"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <select
                  name="estado_monitor"
                  value={desktopData.estado_monitor}
                  onChange={handleChangeDesktop}
                  className="col-span-1 sm:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="OPERATIVO">✅ OPERATIVO</option>
                  <option value="INOPERATIVO">❌ INOPERATIVO</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* SECCIÓN 4: Ubicación (común a todos los tipos) */}
        {tipoEquipo && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-bold text-yellow-900 mb-4">📍 Información de Ubicación</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="red_asistencial"
                value={ubicacionData.red_asistencial}
                onChange={handleChangeUbicacion}
                placeholder="Red Asistencial / Prestacional / Sede"
                className="col-span-1 sm:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              />
              <input
                type="text"
                name="gerencia"
                value={ubicacionData.gerencia}
                onChange={handleChangeUbicacion}
                placeholder="Gerencia / Centro Asistencial"
                className="col-span-1 sm:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              />
              <input
                type="text"
                name="sub_gerencia"
                value={ubicacionData.sub_gerencia}
                onChange={handleChangeUbicacion}
                placeholder="Sub Gerencia"
                className="col-span-1 sm:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              />
              <input
                type="text"
                name="ubicacion"
                value={ubicacionData.ubicacion}
                onChange={handleChangeUbicacion}
                placeholder="Ubicación (Oficina, Sala, etc.)"
                className="col-span-1 sm:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              />
              <select
                name="piso"
                value={ubicacionData.piso}
                onChange={handleChangeUbicacion}
                className="col-span-1 sm:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
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
        )}

        {/* Botón de Guardar */}
        {tipoEquipo && (
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              {loading ? '⏳ Guardando...' : '✅ Guardar Equipo'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
