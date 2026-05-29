const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno desde .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let supabaseUrl = '';
let supabaseKey = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  lines.forEach(line => {
    if (line.includes('NEXT_PUBLIC_SUPABASE_URL')) {
      supabaseUrl = line.split('=')[1]?.trim() || '';
    }
    if (line.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
      supabaseKey = line.split('=')[1]?.trim() || '';
    }
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ No se encontraron las credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const equiposPrueba = [
  {
    tipo_equipo: 'DESKTOP',
    codigo_patrimonial: 'CPU-001',
    serie: 'SN20241001',
    marca: 'HP',
    modelo: 'EliteDesk 800 G5',
    estado: 'OPERATIVO',
    so_cpu: 'Windows 10 Pro',
    procesador_cpu: 'Intel Core i7-9700',
    ip_cpu: '192.168.1.10',
    ofimatica_cpu: 'Office 2019',
    codigo_patrimonial_teclado: 'TEC-001',
    serie_teclado: 'KB123456',
    marca_teclado: 'Logitech',
    modelo_teclado: 'K270',
    estado_teclado: 'OPERATIVO',
    codigo_patrimonial_monitor: 'MON-001',
    serie_monitor: 'MN654321',
    marca_monitor: 'Dell',
    modelo_monitor: 'P2419H',
    estado_monitor: 'OPERATIVO',
    red_asistencial: 'Red Principal',
    gerencia: 'Gerencia de Sistemas',
    sub_gerencia: 'Soporte Técnico',
    ubicacion: 'Oficina 101',
    piso: 'PISO-1',
  },
  {
    tipo_equipo: 'DESKTOP',
    codigo_patrimonial: 'CPU-002',
    serie: 'SN20241002',
    marca: 'Lenovo',
    modelo: 'ThinkCentre M75s',
    estado: 'OPERATIVO',
    so_cpu: 'Windows 11 Pro',
    procesador_cpu: 'AMD Ryzen 5 5600G',
    ip_cpu: '192.168.1.11',
    ofimatica_cpu: 'Office 365',
    codigo_patrimonial_teclado: 'TEC-002',
    serie_teclado: 'KB789012',
    marca_teclado: 'Microsoft',
    modelo_teclado: 'Sculpt',
    estado_teclado: 'OPERATIVO',
    codigo_patrimonial_monitor: 'MON-002',
    serie_monitor: 'MN987654',
    marca_monitor: 'LG',
    modelo_monitor: '24UP550',
    estado_monitor: 'OPERATIVO',
    red_asistencial: 'Red Principal',
    gerencia: 'Gerencia de TI',
    sub_gerencia: 'Administración de Sistemas',
    ubicacion: 'Oficina 102',
    piso: 'PISO-1',
  },
  {
    tipo_equipo: 'IMPRESORA',
    codigo_patrimonial: 'IMP-001',
    serie: 'SN-IMP-2024-001',
    marca: 'HP',
    modelo: 'LaserJet Pro M404n',
    estado: 'OPERATIVO',
    red_asistencial: 'Red Principal',
    gerencia: 'Gerencia de Servicios',
    sub_gerencia: 'Reprografía',
    ubicacion: 'Sala de Impresoras',
    piso: 'PISO-1',
  },
  {
    tipo_equipo: 'IMPRESORA',
    codigo_patrimonial: 'IMP-002',
    serie: 'SN-IMP-2024-002',
    marca: 'Canon',
    modelo: 'imagePRUNNER 2425i',
    estado: 'OPERATIVO',
    red_asistencial: 'Red Principal',
    gerencia: 'Gerencia de Servicios',
    sub_gerencia: 'Reprografía',
    ubicacion: 'Sala de Juntas',
    piso: 'PISO-2',
  },
  {
    tipo_equipo: 'SCANNER',
    codigo_patrimonial: 'SCAN-001',
    serie: 'SN-SCAN-2024-001',
    marca: 'Fujitsu',
    modelo: 'fi-7460',
    estado: 'OPERATIVO',
    red_asistencial: 'Red Principal',
    gerencia: 'Gerencia de Documentos',
    sub_gerencia: 'Digitalización',
    ubicacion: 'Archivo Central',
    piso: 'PISO-1',
  },
  {
    tipo_equipo: 'DESKTOP',
    codigo_patrimonial: 'CPU-003',
    serie: 'SN20241003',
    marca: 'Dell',
    modelo: 'OptiPlex 5090',
    estado: 'INOPERATIVO',
    so_cpu: 'Windows 10 Pro',
    procesador_cpu: 'Intel Core i5-10400',
    ip_cpu: '192.168.1.12',
    ofimatica_cpu: 'Office 2016',
    codigo_patrimonial_teclado: 'TEC-003',
    serie_teclado: 'KB345678',
    marca_teclado: 'HP',
    modelo_teclado: 'Standard',
    estado_teclado: 'OPERATIVO',
    codigo_patrimonial_monitor: 'MON-003',
    serie_monitor: 'MN345678',
    marca_monitor: 'ASUS',
    modelo_monitor: 'VP249HE',
    estado_monitor: 'INOPERATIVO',
    red_asistencial: 'Red Secundaria',
    gerencia: 'Gerencia de Almacén',
    sub_gerencia: 'Inventario',
    ubicacion: 'Bodega',
    piso: 'SÓTANO',
  },
  {
    tipo_equipo: 'IMPRESORA',
    codigo_patrimonial: 'IMP-003',
    serie: 'SN-IMP-2024-003',
    marca: 'Xerox',
    modelo: 'VersaLink C9070',
    estado: 'OPERATIVO',
    red_asistencial: 'Red Principal',
    gerencia: 'Gerencia de Operaciones',
    sub_gerencia: 'Impresión',
    ubicacion: 'Centro de Copia',
    piso: 'PISO-2',
  },
  {
    tipo_equipo: 'SCANNER',
    codigo_patrimonial: 'SCAN-002',
    serie: 'SN-SCAN-2024-002',
    marca: 'Epson',
    modelo: 'WorkForce ES-400',
    estado: 'OPERATIVO',
    red_asistencial: 'Red Principal',
    gerencia: 'Gerencia de Documentos',
    sub_gerencia: 'Digitalización',
    ubicacion: 'Recepción',
    piso: 'PISO-1',
  },
  {
    tipo_equipo: 'DESKTOP',
    codigo_patrimonial: 'CPU-004',
    serie: 'SN20241004',
    marca: 'Lenovo',
    modelo: 'IdeaCentre 5i',
    estado: 'OPERATIVO',
    so_cpu: 'Windows 11 Home',
    procesador_cpu: 'Intel Core i7-11700',
    ip_cpu: '192.168.1.13',
    ofimatica_cpu: 'LibreOffice',
    codigo_patrimonial_teclado: 'TEC-004',
    serie_teclado: 'KB901234',
    marca_teclado: 'Lenovo',
    modelo_teclado: 'L101',
    estado_teclado: 'OPERATIVO',
    codigo_patrimonial_monitor: 'MON-004',
    serie_monitor: 'MN901234',
    marca_monitor: 'BenQ',
    modelo_monitor: 'PD2500Q',
    estado_monitor: 'OPERATIVO',
    red_asistencial: 'Red Principal',
    gerencia: 'Gerencia de Recursos Humanos',
    sub_gerencia: 'Administración de Personal',
    ubicacion: 'Oficina RRHH',
    piso: 'PISO-3',
  },
  {
    tipo_equipo: 'DESKTOP',
    codigo_patrimonial: 'CPU-005',
    serie: 'SN20241005',
    marca: 'HP',
    modelo: 'Pavilion 590',
    estado: 'OPERATIVO',
    so_cpu: 'Windows 10',
    procesador_cpu: 'Intel Core i3-10100',
    ip_cpu: '192.168.1.14',
    ofimatica_cpu: 'Microsoft Office',
    codigo_patrimonial_teclado: 'TEC-005',
    serie_teclado: 'KB567890',
    marca_teclado: 'Generic',
    modelo_teclado: 'USB',
    estado_teclado: 'OPERATIVO',
    codigo_patrimonial_monitor: 'MON-005',
    serie_monitor: 'MN567890',
    marca_monitor: 'Acer',
    modelo_monitor: 'K222HQL',
    estado_monitor: 'OPERATIVO',
    red_asistencial: 'Red Secundaria',
    gerencia: 'Gerencia Financiera',
    sub_gerencia: 'Contabilidad',
    ubicacion: 'Oficina Contable',
    piso: 'PISO-4',
  },
];

async function seedData() {
  console.log('🌱 Iniciando inserción de datos de prueba...\n');

  try {
    const { data, error } = await supabase
      .from('inventario_equipos')
      .insert(equiposPrueba);

    if (error) {
      console.error('❌ Error insertando datos:', error);
      process.exit(1);
    }

    console.log('✅ Se insertaron correctamente 10 registros de prueba');
    console.log('\n📊 Resumen:');
    console.log(`   - 5 DESKTOP`);
    console.log(`   - 3 IMPRESORAS`);
    console.log(`   - 2 SCANNERS`);
    console.log(`\n✨ Los datos han sido agregados a la tabla 'inventario_equipos'\n`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedData();
