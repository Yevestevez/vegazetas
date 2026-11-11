# Plan de refactorización por sprints

## Objetivo y decisiones

Migrar progresivamente la aplicación y la API a TypeScript, con una arquitectura
por capas inspirada en los ejemplos aportados, sin introducir funcionalidades
nuevas durante la refactorización.

Decisiones acordadas:

- Mantener React y Vite; usar componentes funcionales de React y POO de forma
  pragmática en servicios, repositorios y dominio cuando aporte claridad.
- Mantener MongoDB y migrar por módulos, en sprints pequeños y verificables.
- Usar Vitest para pruebas unitarias y de integración, y Playwright para
  pruebas en navegador. Migrar las pruebas existentes sin perder cobertura y
  utilizar bases de prueba desechables, separadas de producción.
- Actualizar todas las dependencias y runtimes, incluidos React, Vite y Node,
  a sus últimas versiones disponibles, verificando compatibilidad y migraciones.
- Trabajar con `main` para producción, `dev` para integración y ramas de
  características. Llegar a `main` mediante PR y las comprobaciones acordadas;
  solicitar aprobación antes de operaciones de escritura en Git.
- Implantar CI/CD con GitHub Actions después de terminar la refactorización,
  no durante ella. Hasta entonces, ejecutar las comprobaciones pertinentes
  localmente. Evaluar después si aportan valor hooks ligeros como Husky.
- Usar versionado semántico para el producto completo. El punto de partida
  acordado es `v1.0.0`, correspondiente al estado actual de producción; no
  implica que ya se haya creado una etiqueta o publicación.
- Partir de una base de producción vacía sin migrar ni copiar los datos
  actuales; se perderá el acceso a las cuentas y recetas existentes al cambiar
  la aplicación. Mantener el esquema actual inicialmente. No borrar la base
  actual ni cambiar la conexión desplegada hasta concretar y autorizar cada
  operación. Se aplaza el cambio de conexión hasta el despliegue. Proteger los
  nuevos datos de producción por defecto.
- Corregir problemas existentes de seguridad y accesibilidad cuando sea
  necesario; acordar previamente los cambios de comportamiento.
- No hay fechas obligatorias. Los sprints pueden solaparse cuando se acuerde
  expresamente; sus criterios de aceptación siguen pendientes hasta revisarlos
  y aceptarlos.
- La integridad de las bases de pruebas no necesita preservarse; aun así, hay
  que identificar y aislar el destino para proteger producción y otros datos.

Punto de partida y riesgos conocidos: [estado actual](./ESTADO-ACTUAL.md).

## Versionado

- **Parche** (`v1.0.1`): correcciones y refactorizaciones compatibles.
- **Menor** (`v1.1.0`): funcionalidades compatibles.
- **Mayor** (`v2.0.0`): cambios incompatibles en contratos o datos que
  requieran migración.

Un sprint no exige una versión propia. La refactorización no implica por sí sola
un cambio de versión mayor. Las etiquetas y publicaciones requieren autorización.

## Principios de trabajo

- Conservar funcionalidades y contratos actuales salvo cambios acordados y
  documentados. Registrar cualquier incompatibilidad, migración y reversión.
- Organizar por funcionalidad y separar transporte HTTP, casos de uso,
  persistencia y presentación. Evitar clases y capas que no aporten valor.
- Permitir convivencia temporal de JavaScript y TypeScript. Migrar por cortes
  funcionales completos, sin duplicar la lógica de negocio permanentemente.
- Definir contratos tipados y validar datos externos en tiempo de ejecución;
  los tipos de TypeScript no sustituyen la validación.
- Aplicar seguridad, accesibilidad y rendimiento desde el diseño, sin asumir
  conformidad ni optimizar sin mediciones.
- Mantener un resultado ejecutable y reversible al finalizar cada sprint.
  Registrar decisiones, comandos y resultados en la documentación.
- Se pueden recomendar cambios justificados de stack o arquitectura; su
  adopción requiere la decisión de la persona responsable.

## Arquitectura orientativa

No es un árbol definitivo; se concretará al diseñar el primer corte vertical.

- **API:** módulos de usuarios/autenticación y recetas, con routers,
  controladores HTTP, servicios o casos de uso, entidades/contratos y
  repositorios Mongoose. Las dependencias apuntan hacia el dominio; composición
  explícita en el arranque. Centralizar configuración, autenticación, validación
  y tratamiento de errores sin ocultar fallos.
- **Frontend:** módulos funcionales con componentes React, páginas, estado y
  servicios de acceso a la API tipados. Mantener separación entre presentación
  y comunicación; usar clases solo cuando simplifiquen el diseño.
- **Compartido:** decidir cómo migrar `com` y sus consumidores, y qué contratos
  conviene compartir sin acoplar la API a la UI. Durante la transición debe
  seguir funcionando tanto en Node como en Vite.
- **Datos:** mantener Mongoose y el esquema actual como punto de partida para
  una base vacía. Cambiar esquemas o índices solo cuando exista una razón
  contrastada y un procedimiento adecuado para los datos en uso, incluida su
  protección y reversión.

El ejemplo de API inspira sus capas, no el cambio a SQL ni la adopción de
Prisma. El ejemplo de frontend inspira la organización funcional, no exige
abandonar React.

Para visualizar la estructura actual y una posible organización futura,
consulta el [esquema del proyecto](./ESTRUCTURA-PROYECTO.md).

## Sprints propuestos

Cada sprint puede dividirse si resulta demasiado grande; el orden refleja
dependencias, no fechas.

### Sprint 1: línea base y protección de datos — completado

Se cerró el sprint con los siguientes resultados:

- Línea base documentada de rutas, contratos, dependencias, pruebas, lint y
  compilación. Las versiones de los despliegues fueron comunicadas, pero no
  verificadas directamente desde esta sesión.
- MongoDB de pruebas aislado y desechable; actualmente se reutiliza el
  contenedor dedicado documentado en el [README de la API](../api/README.md).
- Copia y restauración ensayadas entre destinos locales separados con datos
  ficticios, comprobando documentos, referencias e índices.
- Correo simulado en la suite habitual; integración con Ethereal separada.
- Corregida la exposición del hash de contraseña en la respuesta de favoritos
  y añadida una prueba HTTP. No se ha confirmado su despliegue.

**Seguimiento pendiente:** seis advertencias de dependencias de efectos en
React y validación del procedimiento de recuperación para el entorno real de
Atlas. El ensayo local no demuestra la recuperación de producción.

- Inventariar los despliegues reales, configuraciones y versiones en uso, sin
  registrar secretos. Revisar la base de pruebas remota y la local antes de
  usarlas; asegurar una base de pruebas exclusivamente desechable.
- Inventariar versiones actuales y últimas versiones disponibles de Node y
  dependencias; estudiar requisitos de motor, compatibilidad y cambios
  incompatibles antes de decidir el orden de actualización.
- Definir y verificar con datos de prueba y una restauración en un destino
  separado el procedimiento de copia y recuperación para los nuevos datos de
  producción. No es necesario copiar ni restaurar los datos actuales.
- Registrar rutas, contratos, flujos principales, resultados de lint/build y
  pruebas disponibles. Identificar huecos en registro, sesión, recetas,
  publicación y favoritos.
- Acordar cómo aislar el correo de prueba y evitar servicios externos en las
  pruebas automatizadas.

**Aceptación:** existe una base de pruebas aislada verificada; se ha probado
una restauración en un destino separado; la línea base identifica comandos,
resultados y fallos preexistentes. No se ejecutan pruebas destructivas contra
bases compartidas ni de producción.

### Sprint 2: caracterización y calidad reproducible — en curso

**Hecho:** migradas las 22 suites de Mocha a Vitest, sin ejecución paralela
sobre las colecciones compartidas. Tras sustituir `dotenv` pasan
93 pruebas en 25 archivos; la integración opcional de Ethereal pasa por
separado. La selección explícita de archivos evita ejecutar scripts manuales
por accidente. Playwright ejecuta tres pruebas locales de registro, sesión y
credenciales incorrectas en Chromium, con una base de pruebas independiente.

**Pendiente:** ampliar la caracterización de contratos y flujos prioritarios,
incluidas recetas, y completar las comprobaciones locales de los paquetes
afectados.

- Migrar las pruebas existentes de Mocha a Vitest, preservando sus escenarios
  y evitando que las suites concurrentes compartan datos que se eliminan.
- Preparar Playwright para los flujos de navegador que se prioricen.
- Añadir pruebas centradas en los flujos y contratos existentes, incluidas
  autenticación/autorización y acceso a recetas propias y publicadas.
- Cubrir los flujos de UI prioritarios y documentar cómo se ejecutan;
  introducir únicamente las herramientas de prueba necesarias y acordadas.
- Establecer comprobaciones locales reproducibles de lint, compilación y
  pruebas para los paquetes afectados.

**Aceptación:** las pruebas elegidas se ejecutan sobre datos aislados y
detectan regresiones en los flujos acordados; los comandos y sus dependencias
están documentados. Los fallos de la línea base tienen una decisión registrada.

### Sprint 3: cimientos de TypeScript y paquete compartido — en curso

**Hecho:** configuración inicial de TypeScript y comprobación de tipos para
los módulos migrados de la API. Node ejecuta directamente TypeScript con
sintaxis eliminable y requiere la versión `22.18.0` o posterior. JavaScript
y el paquete `com` siguen en uso; no están completamente comprobados por tipos.
La API carga `.env` con Node y ya no depende de `dotenv`. El frontend usa Vite
8 y su plugin React compatible; en la última comprobación sus dependencias no
presentaron avisos de `npm audit`.

- Acordar configuración de TypeScript, módulos, compilación y convivencia con
  JavaScript en API y frontend, verificando compatibilidad con Node y Vite.
- Diseñar y aplicar la transición de `com` y su distribución para ambos
  consumidores; migrar primero una superficie pequeña con sus validaciones y
  errores.
- Añadir comprobación de tipos a los comandos de calidad sin introducir
  configuraciones que oculten errores de forma permanente.
- Actualizar Node y las herramientas necesarias de forma coordinada, respetando
  compatibilidad y documentando cualquier bloqueo de versiones.

**Aceptación:** un corte compartido tipado funciona en API y frontend, los
comandos de desarrollo y compilación siguen funcionando y las pruebas del
contrato migrado pasan. Queda documentado qué partes siguen en JavaScript.

### Sprint 4: primer módulo vertical de API — en curso

**Hecho:** separada la creación de la aplicación del arranque; el caso de uso
de nombre de usuario y su repositorio se han migrado a TypeScript. El caso de
uso recibe el repositorio como dependencia, compuesto en el puente temporal.
La ruta y el handler siguen en JavaScript. Las pruebas HTTP caracterizan el
contrato actual, incluidos los errores de autenticación.

- Separar creación de la aplicación, composición de dependencias y arranque.
- Elegir un caso de uso de usuarios de alcance reducido y migrarlo de extremo
  a extremo: ruta, controlador, servicio, repositorio Mongoose y pruebas.
- Conservar las respuestas y la persistencia existentes; documentar la
  estructura de módulo resultante antes de extenderla.

**Aceptación:** el caso de uso funciona desde HTTP hasta MongoDB, con pruebas
de éxito y error y comprobación de tipos; el resto de rutas sigue operativo.
La estructura se revisa antes de repetirla.

### Sprint 5: usuarios y sesión — pendiente

- Migrar progresivamente registro, autenticación, datos de usuario,
  recuperación de contraseña y favoritos a la estructura validada.
- Revisar expiración, almacenamiento y validación de tokens, control de
  acceso, recuperación y errores. Proponer cambios de sesión o contrato y
  acordarlos antes de implementarlos.
- Aislar el envío de correo mediante una dependencia sustituible en pruebas.

**Aceptación:** pruebas de rutas y casos de uso cubren los flujos migrados,
incluidas credenciales erróneas y accesos no autorizados; los cambios
acordados en seguridad y compatibilidad están documentados.

### Sprint 6: recetas y persistencia — pendiente

- Migrar recetas por operaciones o subáreas pequeñas: consulta y listado,
  creación/edición/eliminación, publicación, favoritos y elementos anidados.
- Consolidar acceso a Mongoose en repositorios y preservar permisos, orden,
  documentos e índices salvo decisión expresa.
- Revisar los scripts de actualización existentes antes de considerar cualquier
  cambio de esquema; ensayar cualquier migración sobre una copia aislada.

**Aceptación:** los flujos migrados pasan pruebas HTTP y de persistencia,
incluidos permisos y datos existentes; los endpoints antiguos siguen siendo
compatibles o sus cambios están acordados. No quedan accesos nuevos a Mongoose
fuera de la frontera definida.

### Sprint 7: frontend por flujos — pendiente

- Migrar progresivamente a TypeScript: base compartida y sesión, después
  listados, detalle y edición de recetas. Mantener React y Vite.
- Actualizar React, Vite y las demás dependencias del frontend, teniendo en
  cuenta sus requisitos de Node y cambios incompatibles.
- Tipar respuestas y errores, validar los límites necesarios y separar la
  comunicación con la API de los componentes.
- Revisar formularios, navegación por teclado, foco, mensajes y adaptación
  durante cada corte; acordar los cambios visuales o de comportamiento.

**Aceptación:** cada flujo migrado compila y pasa sus pruebas, mantiene las
funciones existentes y dispone de comprobaciones de accesibilidad acordadas;
el código aún no migrado continúa funcionando.

### Sprint 8: cierre, seguridad y accesibilidad — pendiente

- Completar la eliminación de puentes temporales y JavaScript pendiente
  incluido en el alcance; actualizar documentación de instalación,
  despliegue, contratos y operación.
- Revisar seguridad según los riesgos reales, dependencias y configuración;
  probar autenticación y permisos, sin exponer información sensible.
- Completar la actualización de dependencias y runtimes de API, frontend y
  herramientas; registrar cualquier excepción o bloqueo pendiente de resolver.
- Revisar accesibilidad con herramientas automáticas y pruebas manuales de
  teclado y tecnologías de asistencia. Usar WCAG 2.2 AA como objetivo propuesto,
  sujeto a acuerdo y a pruebas verificables.
- Medir rendimiento en flujos y dispositivos representativos, acordar objetivos
  a partir de la línea base y corregir regresiones relevantes.
- Ensayar despliegue y reversión, incluida la compatibilidad con datos
  existentes y la recuperación de la copia.

**Aceptación:** no quedan puentes temporales ni módulos funcionales pendientes
de migración dentro del alcance acordado; pasan las comprobaciones definidas;
las versiones objetivo se han comprobado o sus bloqueos están registrados y
aceptados; los demás riesgos y limitaciones están registrados y aceptados. La
refactorización se cierra antes de planificar nuevas funcionalidades.

## Validación local y siguiente corte

Las pruebas de Vitest y las pruebas de navegador con Playwright se ejecutan
localmente, sin esperar a CI/CD ni desplegar. La instalación inicial de
Playwright puede requerir acceso a internet para descargar los navegadores.

Playwright arranca el frontend y una API locales con datos ficticios; la API
de prueba conecta directamente a la base aislada indicada por `E2E_MONGO_URL`.
`SPEC_MONGO_URL` es la conexión separada que usan las suites actuales de
Vitest. Ambos destinos deben ser desechables, nunca de producción. Las pruebas
de navegador bloquean peticiones a orígenes externos. La integración opcional
de Ethereal sí requiere acceso a internet.

Se ha adelantado el primer corte de `GET /users/name` de los sprints 3 y 4.
Antes de extender el
patrón, revisar la estructura, el puente temporal con JavaScript y el contrato
de errores de autenticación caracterizado por las pruebas.

## Después de la refactorización: CI/CD

- Diseñar flujos de GitHub Actions para las PR y las ramas acordadas, con
  instalación reproducible, lint, tipos, compilación y pruebas de Vitest y
  Playwright. Las pruebas que escriban usarán una base aislada y desechable.
- Acordar qué comprobaciones serán obligatorias en las PR hacia `main` y,
  si procede, `dev`. Ajustar frecuencia y alcance para controlar el tiempo y
  el coste de ejecución.
- Definir por separado despliegue, permisos, secretos, aprobaciones y reversión;
  no habilitar publicaciones o despliegues automáticos sin autorización.
- Evaluar si Husky u otros hooks locales aportan valor para comprobaciones
  rápidas. Son opcionales y no sustituyen las comprobaciones de CI.

## Condiciones para cada entrega

1. Alcance y cambios visibles acordados antes de implementarlos.
2. Pruebas pertinentes, lint, comprobación de tipos y compilación de las partes
   afectadas pasan, o los fallos preexistentes y su tratamiento se documentan.
3. La prueba incluye errores y permisos cuando el cambio los afecta; las
   pruebas que escriben usan exclusivamente datos aislados.
4. Documentación, configuración y contratos afectados están actualizados.
5. Se describe cómo validar, desplegar y revertir el cambio; no se ejecutan
   operaciones destructivas en producción sin autorización explícita.

## Decisiones aún pendientes

- Ubicación real de los despliegues y procedimiento de acceso a cada entorno.
- Detalles de CI/CD, comprobaciones obligatorias y posible uso de hooks,
  decididos después de la refactorización teniendo en cuenta su coste.
- Estructura definitiva de carpetas, contratos compartidos y estrategia de
  transición de `com`.
- Cambios específicos de autenticación y objetivos medibles de accesibilidad y
  rendimiento tras la revisión inicial.
