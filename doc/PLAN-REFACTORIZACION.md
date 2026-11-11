# Plan de refactorización por sprints

## Objetivo y decisiones

Migrar progresivamente la aplicación y la API a TypeScript, con una arquitectura
por capas inspirada en los ejemplos aportados, sin introducir funcionalidades
nuevas durante la refactorización.

Decisiones acordadas:

- Mantener React y Vite; usar componentes funcionales de React y POO de forma
  pragmática en servicios, repositorios y dominio cuando aporte claridad.
- Mantener MongoDB y migrar por módulos, en sprints pequeños y verificables.
- Actualizar todas las dependencias y runtimes, incluidos React, Vite y Node,
  a sus últimas versiones disponibles, verificando compatibilidad y migraciones.
- Trabajar con `main` para producción, `dev` para integración y ramas de
  características. Llegar a `main` mediante PR y los tests que se acuerden para
  CI/CD; solicitar aprobación antes de operaciones de escritura en Git.
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
- No hay fechas obligatorias. Se comienza el siguiente sprint cuando el
  resultado del anterior esté revisado y aceptado.
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

## Sprints propuestos

Cada sprint puede dividirse si resulta demasiado grande; el orden refleja
dependencias, no fechas.

### Sprint 1: línea base y protección de datos

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

### Sprint 2: caracterización y calidad reproducible

- Añadir pruebas centradas en los flujos y contratos existentes, incluidas
  autenticación/autorización y acceso a recetas propias y publicadas.
- Cubrir los flujos de UI prioritarios y documentar cómo se ejecutan;
  introducir únicamente las herramientas de prueba necesarias y acordadas.
- Establecer comprobaciones reproducibles de lint, compilación y pruebas para
  los paquetes afectados; acordar CI/CD y las comprobaciones requeridas para
  las PR hacia `main`.

**Aceptación:** las pruebas elegidas se ejecutan sobre datos aislados y
detectan regresiones en los flujos acordados; los comandos y sus dependencias
están documentados. Los fallos de la línea base tienen una decisión registrada.

### Sprint 3: cimientos de TypeScript y paquete compartido

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

### Sprint 4: primer módulo vertical de API

- Separar creación de la aplicación, composición de dependencias y arranque.
- Elegir un caso de uso de usuarios de alcance reducido y migrarlo de extremo
  a extremo: ruta, controlador, servicio, repositorio Mongoose y pruebas.
- Conservar las respuestas y la persistencia existentes; documentar la
  estructura de módulo resultante antes de extenderla.

**Aceptación:** el caso de uso funciona desde HTTP hasta MongoDB, con pruebas
de éxito y error y comprobación de tipos; el resto de rutas sigue operativo.
La estructura se revisa antes de repetirla.

### Sprint 5: usuarios y sesión

- Migrar progresivamente registro, autenticación, datos de usuario,
  recuperación de contraseña y favoritos a la estructura validada.
- Revisar expiración, almacenamiento y validación de tokens, control de
  acceso, recuperación y errores. Proponer cambios de sesión o contrato y
  acordarlos antes de implementarlos.
- Aislar el envío de correo mediante una dependencia sustituible en pruebas.

**Aceptación:** pruebas de rutas y casos de uso cubren los flujos migrados,
incluidas credenciales erróneas y accesos no autorizados; los cambios
acordados en seguridad y compatibilidad están documentados.

### Sprint 6: recetas y persistencia

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

### Sprint 7: frontend por flujos

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

### Sprint 8: cierre, seguridad y accesibilidad

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
- Herramientas concretas de tests, CI y validación, elegidas tras medir la
  línea base y teniendo en cuenta el coste de mantenimiento.
- Estructura definitiva de carpetas, contratos compartidos y estrategia de
  transición de `com`.
- Cambios específicos de autenticación y objetivos medibles de accesibilidad y
  rendimiento tras la revisión inicial.
