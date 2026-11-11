---
name: vegazetas-calidad-web
description: Revisa cambios web de Vegazetas considerando accesibilidad, seguridad y rendimiento. Usar al implementar o revisar interfaces y flujos existentes, especialmente formularios, autenticación y recetas.
---

# Calidad web en Vegazetas

1. Lee `doc/ESTADO-ACTUAL.md` y los componentes, endpoints y pruebas afectados.
   Identifica el comportamiento que se debe preservar y las decisiones pendientes.
2. En la interfaz, comprueba controles semánticos, nombres accesibles, etiquetas
   y errores de formularios, navegación por teclado, orden y visibilidad del foco,
   contraste y adaptación a distintos tamaños. Incluye estados de carga y error.
3. En los flujos con datos o sesión, revisa validación en servidor, autorización,
   exposición de datos y errores, gestión de tokens y dependencias externas.
   No expongas credenciales ni ejecutes pruebas sobre datos compartidos.
4. Para rendimiento, identifica y mide el flujo afectado antes de recomendar
   cambios; evita optimizaciones sin evidencia.
5. Ejecuta las comprobaciones disponibles y seguras para el cambio. Señala las
   comprobaciones manuales o con tecnologías de asistencia que no se realizaron.
   No afirmes conformidad WCAG ni ausencia de vulnerabilidades sin una auditoría.

Referencias: [WCAG 2.2](https://www.w3.org/TR/WCAG22/),
[OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
y [Web Vitals](https://web.dev/articles/vitals).
