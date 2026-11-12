# Migración gradual de `com` a Zod

## Primer corte: etiquetas de recetas

El esquema compartido `tagSchema` valida cadenas de 1 a 30 unidades UTF-16,
sin transformarlas. `validate.tag` conserva su interfaz, su retorno y el tipo
y mensaje de error anteriores, incluido el mensaje que menciona 20 caracteres.
La API y el frontend continúan validando independientemente mediante esa
función. No se han migrado los demás campos ni cambiado los contratos HTTP.

Se utiliza Zod 4.6.7, última versión estable consultada el 12 de noviembre de
2026. `com` continúa siendo un paquete local enlazado; sus dependencias deben
instalarse en `com`. El esquema está en TypeScript ejecutable por Node y
procesable por Vite. Hay que comprobar los runtimes admitidos y la compilación
del frontend antes de dar el corte por validado. Zod no declara requisitos de
motor ni dependencias de pares en sus metadatos de npm.

## Comprobaciones del primer corte

- Pasan 12 casos de Vitest que comprueban límites, errores, consumidores y respuesta HTTP
  sin conectar MongoDB. La configuración de la suite exige igualmente
  `SPEC_MONGO_URL`; para ejecutar solo estos casos se puede usar un destino
  local ficticio con el nombre exigido por el guard de pruebas.
- El import y la validación se han ejecutado con Node 22.23.5, 24.22.3 y
  26.13.1. En Node 26.13.1 pasan la comprobación de tipos de la API y la
  compilación del frontend; el lint mantiene seis advertencias previas.
- La suite completa de MongoDB y las pruebas de navegador no se han ejecutado
  en este corte; la compilación no sustituye la comprobación en navegador.

## Pendiente

- Caracterizar y migrar más validaciones en cortes pequeños, incluyendo
  recetas y usuarios, sin introducir valores por defecto ni cambiar errores.
- Decidir la distribución y el tipado definitivos del paquete compartido.
- Ampliar las pruebas HTTP de recetas y revisar el primer módulo vertical.
- Actualizar las dependencias y runtimes restantes de forma coordinada.

El prototipo anterior de esquemas completos se retiró: no preservaba todos los
contratos y no se había integrado ni probado. La compilación de tipos por sí
sola no demostraba compatibilidad.
