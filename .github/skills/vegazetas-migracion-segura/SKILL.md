---
name: vegazetas-migracion-segura
description: Planifica y valida cambios de Vegazetas que afectan MongoDB, datos, contratos o migraciones graduales a TypeScript. Usar antes de ejecutar scripts de datos o migrar módulos de la API y el frontend.
---

# Migración segura de Vegazetas

1. Consulta `doc/ESTADO-ACTUAL.md`, `doc/PLAN-REFACTORIZACION.md` y el código
   afectado. Identifica datos, contratos, consumidores y comportamiento que
   deben conservarse.
2. Antes de ejecutar cualquier script o prueba que escriba en MongoDB, revisa
   su código, conexión y efectos. Verifica que el destino sea aislado y
   desechable; nunca imprimas ni compartas credenciales.
3. Para cambios de datos o índices, prepara copia y restauración probada en
   otro destino, ensayo con datos representativos, comprobaciones posteriores
   y plan de reversión. No ejecutes operaciones destructivas en producción
   sin autorización explícita.
4. Migra cortes funcionales pequeños y comprobables. Mantén compatibilidad entre
   JavaScript y TypeScript y entre Node y Vite mientras sea necesaria; elimina
   los puentes al finalizar la transición.
5. Comprueba los contratos y flujos afectados con pruebas apropiadas, incluida
   autorización cuando corresponda. Documenta los resultados, riesgos y
   cambios de comportamiento acordados.
