# 🔧 Instrucciones para Actualizar la Base de Datos

## Cambios Realizados

Se ha actualizado el formulario para ser **dinámico** basado en el tipo de equipo seleccionado:

### ✅ DESKTOP (Computadora)
- Campos generales: Código Patrimonial, Serie, Marca, Modelo, Estado
- **Sección CPU**: SO, Procesador, IP, Ofimática
- **Sección Teclado**: Código Patrimonial, Serie, Marca, Modelo, Estado
- **Sección Monitor**: Código Patrimonial, Serie, Marca, Modelo, Estado
- **Sección Ubicación**: Red, Gerencia, Sub Gerencia, Ubicación, Piso

### ✅ IMPRESORA / SCANNER
- Campos generales: Código Patrimonial, Serie, Marca, Modelo, Estado
- **Sección Ubicación**: Red, Gerencia, Sub Gerencia, Ubicación, Piso

## 🗄️ Pasos para Actualizar la Base de Datos

### Paso 1: Ir a Supabase SQL Editor
1. Abre [https://supabase.com](https://supabase.com)
2. Inicia sesión en tu proyecto
3. Ve a **SQL Editor** (en el menú izquierdo)

### Paso 2: Ejecutar el Script de Actualización
1. Copia el contenido completo de `scripts-sql-actualizado.sql`
2. Pégalo en el editor SQL de Supabase
3. Haz clic en **Run** (botón azul)

### Paso 3: Verificar la Actualización
Después de ejecutar el script, verifica que:
- La tabla `inventario_equipos` se haya recreado
- Los índices se hayan creado correctamente
- Las políticas RLS estén activas

## 📝 Contenido del Script (scripts-sql-actualizado.sql)

El script contiene:
- ✅ Eliminación de la tabla anterior (DROP TABLE IF EXISTS)
- ✅ Creación de nueva tabla con estructura optimizada
- ✅ Campos comunes (código, serie, marca, modelo, estado)
- ✅ Campos específicos para DESKTOP (CPU, Teclado, Monitor)
- ✅ Campos de ubicación (red, gerencia, sub gerencia, ubicación, piso)
- ✅ Índices para mejor rendimiento
- ✅ Políticas RLS para seguridad
- ✅ Trigger para actualizar timestamp

## 🧪 Pruebas Después de la Actualización

Una vez actualizada la base de datos:

1. **Inicia sesión** con usuario admin
   - Usuario: `admin`
   - Contraseña: `nh1c4`

2. **Prueba el formulario DESKTOP**
   - Selecciona "DESKTOP"
   - Deberían aparecer secciones: CPU, Teclado, Monitor, Ubicación
   - Llena algunos campos y guarda

3. **Prueba el formulario IMPRESORA**
   - Selecciona "IMPRESORA"
   - Solo deberían aparecer: Info General, Ubicación
   - Llena algunos campos y guarda

4. **Prueba el formulario SCANNER**
   - Selecciona "SCANNER"
   - Solo deberían aparecer: Info General, Ubicación
   - Llena algunos campos y guarda

5. **Verifica la tabla**
   - Los equipos deben aparecer en "Equipos Registrados"
   - Al expandir un DESKTOP, debe mostrar todos los detalles
   - Al expandir IMPRESORA/SCANNER, debe mostrar solo lo relevante

## ⚠️ Importante

- **Backup**: Asegúrate de hacer backup de tus datos antes si tenías equipos registrados
- **Datos existentes**: Este script elimina la tabla anterior, así que perderás los datos previos
- **Credenciales**: Las credenciales de Supabase están en `.env.local`

## 🆘 Si algo falla

Si encuentras un error:
1. Verifica que estés ejecutando el script completo
2. Comprueba que tengas permisos en Supabase
3. Intenta copiar el script línea por línea en caso de errores de caracteres especiales

---

**Estado**: ✅ Código frontend actualizado
**Pendiente**: ⏳ Ejecutar script en Supabase
