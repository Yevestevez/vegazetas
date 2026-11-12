# Historial de versiones

Este historial describe versiones del producto completo. Las versiones de los
paquetes `api`, `app` y `com` son independientes. Una entrada aquí no implica
que exista una etiqueta de Git ni una publicación.

## v2.0.0 — en desarrollo

Versión acordada para la refactorización, todavía no desplegada ni publicada.
No se han creado versiones intermedias entre la referencia `v1.0.0` y esta
versión. Los siguientes hitos reflejan el trabajo realizado desde entonces.

### Avances desde v1.0.0

1. **Línea base y protección de datos:** se documentaron la arquitectura,
   rutas, dependencias y comprobaciones existentes. Se ensayaron copia y
   restauración con datos ficticios en bases locales separadas. Queda pendiente
   verificar la recuperación en el entorno real de Atlas.
2. **Pruebas y seguridad iniciales:** se aisló el correo de la suite habitual
   y se dejó Ethereal como integración opcional. Se corrigió la respuesta de
   favoritos para no devolver el hash de contraseña y se añadió una prueba HTTP.
   También se corrigieron los errores de lint; permanecen seis advertencias de
   efectos de React.
3. **Migración a Vitest:** se migraron las 22 suites de Mocha y se retiraron
   las herramientas anteriores de prueba y cobertura. Las suites se ejecutan
   secuencialmente sobre un MongoDB local desechable y reutilizable.
4. **Primer corte de arquitectura:** se separó la creación de Express de su
   arranque y se introdujeron TypeScript y la comprobación de tipos. La
   consulta de nombre de usuario comenzó a separarse en caso de uso y
   repositorio, conservando el resto de la API en JavaScript.
5. **Pruebas de navegador:** se incorporó Playwright para registro, inicio y
   cierre de sesión y credenciales incorrectas, con servicios locales y una
   base desechable distinta de la usada por Vitest.
6. **Entorno y frontend:** se sustituyó `dotenv` por la carga nativa de Node y
   se actualizaron Vite a `8.3.8` y su plugin React a `6.3.0`. Se conservaron
   los objetivos de navegadores anteriores, sin dar por probadas todas sus
   versiones.
7. **Node LTS:** se establecieron como mínimos `22.23.5`, `24.22.3` y
   `26.13.1` en sus respectivas líneas, con Node `26.13.1` como versión de
   referencia local. Los nuevos mínimos requieren coordinar los despliegues.
8. **Corte completo y Express 5:** se migraron a TypeScript la ruta y el
   controlador de `GET /users/name` y se eliminó el puente anterior. Se
   actualizó Express a `5.3.0`, manteniendo el comportamiento anterior del
   cuerpo JSON y los errores de autenticación caracterizados.
9. **Dependencias de correo y navegación:** se actualizaron Nodemailer a
   `10.5.0`, Resend a `6.38.0` y React Router a `7.18.5`. Se retiró el
   paquete obsoleto `crypto` de npm, conservando el módulo nativo de Node.
   Las nuevas pruebas de correo usan transporte en memoria y HTTP simulado;
   no demuestran entrega real.
10. **Validación compartida:** se inició la transición a Zod con las etiquetas,
    títulos, descripciones, imágenes, dificultades y tiempos de recetas, el
    texto y las notas de pasos, y la cantidad, el indicador principal, la unidad
    y la anotación de ingredientes, además del nombre usado en registro e
    ingredientes, el nombre de usuario y el correo, conservando el contrato
    existente. Los demás campos siguen pendientes; el detalle y las
    comprobaciones están en
    [la migración de Zod](./MIGRACION-ZOD-SPRINT3.md).

### Estado y pendientes

En la última comprobación local pasaron **105 pruebas Vitest**, los tipos, la
compilación y **tres pruebas Playwright** en cada una de las tres versiones de
Node admitidas. La refactorización, las demás actualizaciones y la ampliación de
pruebas siguen en curso; CI/CD se deja para después de terminarla.

Se ha acordado partir de una base de producción vacía al desplegar, pero no se
ha cambiado la conexión desplegada ni borrado la base anterior. Las versiones
de Node comunicadas para Netlify y Render quedan por debajo de los nuevos
mínimos y deben actualizarse antes del despliegue. El flujo de recuperación
también tiene un riesgo pendiente: puede informar de éxito si Resend devuelve
un error sin rechazar la promesa.

El detalle de resultados y riesgos está en el [estado actual](./ESTADO-ACTUAL.md)
y su seguimiento en el [plan](./PLAN-REFACTORIZACION.md).

## v1.0.0 — referencia de producción

Punto de partida acordado para la aplicación existente en producción, con
cuentas, sesión y gestión de recetas. Es una versión de referencia: no se ha
creado una etiqueta ni una publicación para ella.
