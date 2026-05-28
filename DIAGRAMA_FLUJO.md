# 🔄 DIAGRAMA DE FLUJO - FORMULARIO DINÁMICO

## 1. ESTADO INICIAL

```
┌─────────────────────────────────────────┐
│  PÁGINA DE INICIO (Admin Dashboard)    │
│                                         │
│  Login exitoso → usuario = admin       │
│  rol = 'admin'                          │
│                                         │
│  [Registrar Nuevo Equipo]              │
│        ↓                               │
│     (Muestra FormularioInventario)     │
└─────────────────────────────────────────┘
```

---

## 2. FLUJO PRINCIPAL DEL FORMULARIO

```
START
  ↓
┌─────────────────────────────────────────────────────────┐
│ FormularioInventario carga                              │
│                                                         │
│ Estados iniciales:                                      │
│ • tipoEquipo = ''                                       │
│ • commonData = { codigo: '', serie: '', ... }           │
│ • desktopData = { so_cpu: '', procesador: '', ... }     │
│ • ubicacionData = { red: '', gerencia: '', ... }        │
└─────────────────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────────────────┐
│ 📋 SECCIÓN 1: Tipo de Equipo                            │
│                                                         │
│ <select onChange={(e) => setTipoEquipo(e.target.value)}>│
│   -- Selecciona un tipo --                              │
│   DESKTOP                                               │
│   IMPRESORA                                             │
│   SCANNER                                               │
│ </select>                                               │
│                                                         │
│ IF tipoEquipo === '' → NO mostrar el resto              │
│ IF tipoEquipo !== '' → MOSTRAR el resto                 │
└─────────────────────────────────────────────────────────┘
  ↓
  
┌──────────────────────────────────┐
│ ¿tipoEquipo está vacío?          │
└──────────────────────────────────┘
  │
  ├─→ SÍ → Mostrar solo selector
  │         END
  │
  └─→ NO → Continuar...
       ↓
┌──────────────────────────────────────────────────────────┐
│ 📊 SECCIÓN 2: Información General (SIEMPRE VISIBLE)     │
│                                                          │
│ 📝 Campos:                                               │
│ • Código Patrimonial                                     │
│ • Serie                                                  │
│ • Marca                                                  │
│ • Modelo                                                 │
│ • Estado (OPERATIVO / INOPERATIVO)                       │
│                                                          │
│ onChange → handleChangeCommon()                          │
│            setCommonData({ ...prev, [name]: value })     │
└──────────────────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────┐
│ ¿tipoEquipo === 'DESKTOP'?       │
└──────────────────────────────────┘
  │
  ├─→ SÍ → Mostrar secciones DESKTOP
  │         ↓
  │    ┌────────────────────────────────────┐
  │    │ 🖥️ SECCIÓN 3A: CPU                 │
  │    │                                    │
  │    │ Campos:                            │
  │    │ • SO CPU                           │
  │    │ • Procesador CPU                   │
  │    │ • IP CPU                           │
  │    │ • Ofimática CPU                    │
  │    │                                    │
  │    │ onChange → handleChangeDesktop()   │
  │    └────────────────────────────────────┘
  │         ↓
  │    ┌────────────────────────────────────┐
  │    │ ⌨️ SECCIÓN 3B: Teclado             │
  │    │                                    │
  │    │ Campos:                            │
  │    │ • Código Patrimonial Teclado       │
  │    │ • Serie Teclado                    │
  │    │ • Marca Teclado                    │
  │    │ • Modelo Teclado                   │
  │    │ • Estado Teclado                   │
  │    │                                    │
  │    │ onChange → handleChangeDesktop()   │
  │    └────────────────────────────────────┘
  │         ↓
  │    ┌────────────────────────────────────┐
  │    │ 🖥️ SECCIÓN 3C: Monitor             │
  │    │                                    │
  │    │ Campos:                            │
  │    │ • Código Patrimonial Monitor       │
  │    │ • Serie Monitor                    │
  │    │ • Marca Monitor                    │
  │    │ • Modelo Monitor                   │
  │    │ • Estado Monitor                   │
  │    │                                    │
  │    │ onChange → handleChangeDesktop()   │
  │    └────────────────────────────────────┘
  │         ↓
  │
  └─→ NO → No mostrar secciones DESKTOP
           (saltarlas)
           ↓
┌──────────────────────────────────────────────────────────┐
│ 📍 SECCIÓN 4: Ubicación (SIEMPRE VISIBLE si tipo selec.)│
│                                                          │
│ Campos:                                                  │
│ • Red Asistencial                                        │
│ • Gerencia                                               │
│ • Sub Gerencia                                           │
│ • Ubicación                                              │
│ • Piso (dropdown)                                        │
│                                                          │
│ onChange → handleChangeUbicacion()                       │
│            setUbicacionData({ ...prev, [name]: value }) │
└──────────────────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────────────────┐
│ 🔘 SECCIÓN 5: Botón Submit                              │
│                                                          │
│ SOLO VISIBLE SI: tipoEquipo !== ''                       │
│                                                          │
│ <button type="submit" onClick={handleSubmit}>            │
│   ✅ Guardar Equipo                                       │
│ </button>                                                │
└──────────────────────────────────────────────────────────┘
  ↓
USER CLICKS "Guardar Equipo"
  ↓
┌──────────────────────────────────────────────────────────┐
│ handleSubmit() EXECUTED                                  │
│                                                          │
│ 1. e.preventDefault()                                    │
│ 2. setLoading(true)                                      │
│ 3. Validar que tipoEquipo !== ''                         │
│ 4. Construir objeto dataToSave dinámicamente:            │
│                                                          │
│    let dataToSave = {                                    │
│      tipo_equipo: tipoEquipo,  // "DESKTOP"              │
│      ...commonData,             // código, serie, etc.   │
│      ...ubicacionData           // red, gerencia, etc.   │
│    }                                                     │
│                                                          │
│    // Si es DESKTOP, agregar campos específicos          │
│    if (tipoEquipo === 'DESKTOP') {                       │
│      dataToSave = {                                      │
│        ...dataToSave,                                    │
│        ...desktopData  // so_cpu, procesador, etc.       │
│      }                                                   │
│    }                                                     │
│                                                          │
│ 5. Enviar a Supabase:                                    │
│    await supabase                                        │
│      .from('inventario_equipos')                         │
│      .insert([dataToSave])                               │
│                                                          │
│ 6. Si error → setError() → mostrar mensaje              │
│ 7. Si éxito → setSuccess() → resetear formulario         │
│           → setTimeout(() => onSuccess(), 2000)          │
│           → Refrescar tabla de inventario                │
│                                                          │
│ 8. setLoading(false)                                     │
└──────────────────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────────────────┐
│ RESPUESTA:                                               │
│                                                          │
│ SI ÉXITO:                                                │
│ ✅ Equipo registrado exitosamente                        │
│    (mensaje verde por 2 segundos)                        │
│    → Reload tabla → Mostrar nuevo equipo en lista        │
│                                                          │
│ SI ERROR:                                                │
│ ❌ Error guardando equipo: [mensaje detallado]           │
│    (mensaje rojo permanente)                             │
│    → Usuario debe corregir y reintentar                  │
└──────────────────────────────────────────────────────────┘
  ↓
END
```

---

## 3. ÁRBOL DE VISIBILIDAD CONDICIONAL

```
FormularioInventario
│
├─ Selector Tipo (SIEMPRE VISIBLE)
│  ├─ value: tipoEquipo
│  └─ options: DESKTOP, IMPRESORA, SCANNER
│
└─ IF tipoEquipo !== ''
   ├─ Sección Info General (SIEMPRE)
   │  ├─ Código Patrimonial
   │  ├─ Serie
   │  ├─ Marca
   │  ├─ Modelo
   │  └─ Estado
   │
   ├─ IF tipoEquipo === 'DESKTOP'
   │  ├─ Sección CPU
   │  │  ├─ SO CPU
   │  │  ├─ Procesador CPU
   │  │  ├─ IP CPU
   │  │  └─ Ofimática CPU
   │  │
   │  ├─ Sección Teclado
   │  │  ├─ Código Patrimonial Teclado
   │  │  ├─ Serie Teclado
   │  │  ├─ Marca Teclado
   │  │  ├─ Modelo Teclado
   │  │  └─ Estado Teclado
   │  │
   │  └─ Sección Monitor
   │     ├─ Código Patrimonial Monitor
   │     ├─ Serie Monitor
   │     ├─ Marca Monitor
   │     ├─ Modelo Monitor
   │     └─ Estado Monitor
   │
   ├─ Sección Ubicación (SIEMPRE)
   │  ├─ Red Asistencial
   │  ├─ Gerencia
   │  ├─ Sub Gerencia
   │  ├─ Ubicación
   │  └─ Piso
   │
   └─ Botón Guardar (SIEMPRE)
```

---

## 4. MAPEO DE DATOS A BASE DE DATOS

### Caso: Usuario selecciona DESKTOP

```
FRONTEND STATE:
├─ tipoEquipo = "DESKTOP"
├─ commonData = {
│   codigo_patrimonial: "DESK-001",
│   serie: "SN123456",
│   marca: "Dell",
│   modelo: "OptiPlex 7090",
│   estado: "OPERATIVO"
│ }
├─ desktopData = {
│   so_cpu: "Windows 10 Pro",
│   procesador_cpu: "Intel i7-10700K",
│   ip_cpu: "192.168.1.50",
│   ofimatica_cpu: "MS Office 365",
│   codigo_patrimonial_teclado: "KEY-001",
│   serie_teclado: "KB-SN-999",
│   marca_teclado: "Logitech",
│   modelo_teclado: "K845",
│   estado_teclado: "OPERATIVO",
│   codigo_patrimonial_monitor: "MON-001",
│   serie_monitor: "M-SN-888",
│   marca_monitor: "LG",
│   modelo_monitor: "27UK850",
│   estado_monitor: "OPERATIVO"
│ }
└─ ubicacionData = {
    red_asistencial: "PRESTACIONAL",
    gerencia: "GERENCIA CENTRAL",
    sub_gerencia: "IT",
    ubicacion: "OFICINA 101",
    piso: "PISO-2"
  }

        ↓ (merge in handleSubmit)

OBJETO GUARDADO EN SUPABASE:
{
  tipo_equipo: "DESKTOP",
  codigo_patrimonial: "DESK-001",
  serie: "SN123456",
  marca: "Dell",
  modelo: "OptiPlex 7090",
  estado: "OPERATIVO",
  so_cpu: "Windows 10 Pro",
  procesador_cpu: "Intel i7-10700K",
  ip_cpu: "192.168.1.50",
  ofimatica_cpu: "MS Office 365",
  codigo_patrimonial_teclado: "KEY-001",
  serie_teclado: "KB-SN-999",
  marca_teclado: "Logitech",
  modelo_teclado: "K845",
  estado_teclado: "OPERATIVO",
  codigo_patrimonial_monitor: "MON-001",
  serie_monitor: "M-SN-888",
  marca_monitor: "LG",
  modelo_monitor: "27UK850",
  estado_monitor: "OPERATIVO",
  red_asistencial: "PRESTACIONAL",
  gerencia: "GERENCIA CENTRAL",
  sub_gerencia: "IT",
  ubicacion: "OFICINA 101",
  piso: "PISO-2",
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### Caso: Usuario selecciona IMPRESORA

```
FRONTEND STATE:
├─ tipoEquipo = "IMPRESORA"
├─ commonData = {
│   codigo_patrimonial: "IMP-001",
│   serie: "SN555555",
│   marca: "HP",
│   modelo: "LaserJet Pro M404",
│   estado: "OPERATIVO"
│ }
├─ desktopData = {
│   so_cpu: "",           ← IGNORADO (no se incluye en dataToSave)
│   procesador_cpu: "",   ← IGNORADO
│   ...
│ }
└─ ubicacionData = {
    red_asistencial: "ADMINISTRATIVO",
    gerencia: "GERENCIA CENTRAL",
    sub_gerencia: "ADMINISTRACIÓN",
    ubicacion: "SALA DE IMPRESIÓN",
    piso: "PISO-1"
  }

        ↓ (merge in handleSubmit, WITHOUT desktopData)

OBJETO GUARDADO EN SUPABASE:
{
  tipo_equipo: "IMPRESORA",
  codigo_patrimonial: "IMP-001",
  serie: "SN555555",
  marca: "HP",
  modelo: "LaserJet Pro M404",
  estado: "OPERATIVO",
  so_cpu: null,                      ← NO INCLUIDO
  procesador_cpu: null,              ← NO INCLUIDO
  ip_cpu: null,                      ← NO INCLUIDO
  ofimatica_cpu: null,               ← NO INCLUIDO
  codigo_patrimonial_teclado: null,  ← NO INCLUIDO
  [... resto de campos DESKTOP ...]
  red_asistencial: "ADMINISTRATIVO",
  gerencia: "GERENCIA CENTRAL",
  sub_gerencia: "ADMINISTRACIÓN",
  ubicacion: "SALA DE IMPRESIÓN",
  piso: "PISO-1",
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

---

## 5. TABLA DE INVENTARIO - FLUJO DE VISUALIZACIÓN

```
AdminDashboard.tsx carga
  ↓
useEffect(() => {
  cargarEquipos()  // Obtiene todos los equipos de inventario_equipos
}, [])
  ↓
TablaInventario ({ equipos, onRefresh })
  ↓
┌─ Filtros (estado, búsqueda)
├─ filteredEquipos = aplicar filtros a equipos
│
├─ Tabla con columnas:
│  ├─ ID
│  ├─ Tipo (con icono: 💻 DESKTOP, 🖨️ IMPRESORA, 📠 SCANNER)
│  ├─ Marca/Modelo
│  ├─ Estado
│  ├─ Ubicación
│  └─ Acciones (👁️ expandir, 🗑️ eliminar)
│
└─ Para cada equipo:
   ├─ Mostrar fila con info básica
   │
   └─ IF usuario hace click en 👁️:
      ├─ setExpandedRow(equipo.id)
      │
      ├─ Mostrar panel expandido con detalles
      │
      └─ IF equipo.tipo_equipo === 'DESKTOP':
         ├─ Mostrar sección CPU
         ├─ Mostrar sección Teclado
         └─ Mostrar sección Monitor
         
         ELSE (IMPRESORA o SCANNER):
         └─ Solo mostrar info general + ubicación
```

---

## 6. RESUMEN DE CAMBIOS DE ESTADO

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE ESTADOS                         │
└─────────────────────────────────────────────────────────────┘

ESTADO 1: PÁGINA CARGA
  tipoEquipo = ''
  commonData = { todos vacíos }
  desktopData = { todos vacíos }
  ubicacionData = { todos vacíos }
  loading = false
  success = ''
  error = ''
  
  RESULT: Solo se ve selector de tipo


ESTADO 2: USUARIO SELECCIONA "DESKTOP"
  tipoEquipo = 'DESKTOP'
  [El resto sin cambios]
  
  RESULT: Aparecen todas las secciones
         (Info General + CPU + Teclado + Monitor + Ubicación)


ESTADO 3: USUARIO LLENA FORMULARIO
  tipoEquipo = 'DESKTOP'
  commonData = { codigo: 'ABC', serie: '123', ... }
  desktopData = { so_cpu: 'Win10', ... }
  ubicacionData = { red: 'PREST', ... }
  
  RESULT: Datos visibles en formulario


ESTADO 4: USUARIO HACE CLICK EN "GUARDAR"
  loading = true
  
  RESULT: Botón disabled, muestra "Guardando..."


ESTADO 5: SUPABASE RESPONDE OK
  loading = false
  success = '✅ Equipo registrado exitosamente'
  tipoEquipo = ''                 [RESET]
  commonData = { todos vacíos }   [RESET]
  desktopData = { todos vacíos }  [RESET]
  ubicacionData = { todos vacíos } [RESET]
  onSuccess() called
  
  RESULT: Mensaje verde
         Formulario vacío
         Tabla refresca
         Nuevo equipo visible


ESTADO 6: SUPABASE RESPONDE ERROR
  loading = false
  error = 'Error guardando equipo: [detalles]'
  [Datos sin cambios]
  
  RESULT: Mensaje rojo
         Usuario ve el error
         Puede reintentar
```

---

**Fin del diagrama de flujo**
