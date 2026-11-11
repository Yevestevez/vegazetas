# Instrucciones para trabajar en Vegazetas

- Consulta [el estado actual](doc/ESTADO-ACTUAL.md) y el código relevante antes
  de proponer o modificar arquitectura; distingue hechos de decisiones pendientes.
- El proyecto mantiene MongoDB. No sustituyas la base de datos ni introduzcas
  funcionalidades nuevas como parte de una refactorización sin acordarlo.
- Sigue el [plan por sprints](doc/PLAN-REFACTORIZACION.md): React y Vite,
  TypeScript gradual, MongoDB y POO pragmática. Acuerda los cambios visibles
  y las decisiones técnicas pendientes antes de implementarlos.
- Puedes proponer cambios justificados de stack o arquitectura; la decisión
  final corresponde a la persona responsable.
- Nombra variables, funciones, clases y demás identificadores en inglés, con
  nombres breves y descriptivos. Prioriza código comprensible, reutilizable y
  escalable, sin añadir abstracciones innecesarias.
- El objetivo es actualizar todas las dependencias y runtimes, incluidos Node,
  React y Vite, a sus últimas versiones disponibles. Comprueba compatibilidad,
  cambios incompatibles y pruebas; comunica cualquier bloqueo.
- Trabaja por ramas: `main` representa producción, `dev` integra el desarrollo
  y se usan ramas de características. Los cambios llegan a `main` únicamente
  mediante PR y las comprobaciones acordadas para CI/CD.
- Usa versionado semántico para el producto completo, con `v1.0.0` como punto
  de partida acordado para el estado actual de producción. No crees etiquetas
  ni publiques versiones sin autorización.
- No hagas commits ni push sin autorización previa. Pide aprobación antes de
  cualquier otra operación de escritura en Git, salvo petición explícita de
  la persona responsable; no presupongas autorización para acciones adicionales.
- Preserva datos, contratos y experiencia existentes salvo que se acuerde un
  cambio explícito. Considera seguridad y accesibilidad en cada modificación.
- `api`, `app` y `com` son paquetes separados; sigue sus scripts y patrones
  existentes hasta que se acuerde cambiarlos.
- Las suites `api/logic/*.spec.js` borran datos de `SPEC_MONGO_URL`. Ejecuta
  pruebas únicamente contra una base aislada y desechable verificada. Revisa
  los scripts manuales antes de ejecutarlos: pueden usar otras conexiones. No
  es necesario preservar la integridad de las bases de datos de pruebas.
- Preserva los datos de producción por defecto; no ejecutes operaciones
  destructivas sin autorización explícita y una estrategia de recuperación.
- Nunca incluyas secretos ni valores reales de variables de entorno en código,
  documentación, comandos compartidos o resultados.
- Documenta las decisiones aprobadas y verifica los cambios con pruebas
  apropiadas. No afirmes cumplimiento de seguridad o accesibilidad sin pruebas.
- Mantén sincronizados en contenido los README de la raíz, `README.md` en
  español y `README-EN.md` en inglés, al cambiar cualquiera de ellos. Los
  README de `app` y `api` contienen información específica de cada paquete.
- Si tienes dudas o una respuesta sencilla puede mejorar el resultado, pregunta
  antes de ejecutar. Mantén las respuestas breves, con la información relevante.
- Puedes instalar o crear skills cuando sean útiles, revisando su procedencia y
  usando preferentemente el alcance del proyecto.

## Skills de referencia

- [React: rendimiento y buenas prácticas](.github/skills/vercel-react-best-practices/SKILL.md),
  de [Vercel](https://github.com/vercel-labs/agent-skills), licencia MIT.
- [Node.js: patrones de backend](.github/skills/nodejs-backend-patterns/SKILL.md),
  de [Seth Hobson](https://github.com/wshobson/agents), licencia MIT incluida.
- [Calidad web](.github/skills/vegazetas-calidad-web/SKILL.md) y
  [migración segura](.github/skills/vegazetas-migracion-segura/SKILL.md),
  específicos de Vegazetas.

Usa las skills pertinentes y contrasta sus recomendaciones con el stack y las
versiones reales; no adoptes automáticamente herramientas, patrones de Next.js
u optimizaciones que no apliquen al proyecto.
