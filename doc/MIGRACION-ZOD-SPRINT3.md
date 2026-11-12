# Migración gradual de `com` a Zod

## Primer corte: etiquetas de recetas

El esquema compartido `tagSchema` valida cadenas de 1 a 30 unidades UTF-16,
sin transformarlas. `validate.tag` conserva su interfaz, su retorno y el tipo
y mensaje de error anteriores, incluido el mensaje que menciona 20 caracteres.
La API y el frontend continúan validando independientemente mediante esa
función. En ese primer corte no se migraron los demás campos ni se cambiaron
los contratos HTTP.

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

## Segundo corte: título y descripción de recetas

`titleSchema` y `descriptionSchema` conservan las comprobaciones y mensajes
existentes, sin modificar los valores. El título admite de 1 a 50 unidades
UTF-16 y la descripción hasta 500, incluida la cadena vacía. Sus consumidores
conservan también sus condiciones anteriores para validar la descripción.

Al probar caracteres fuera del plano básico se detectó que los límites de
longitud de Zod no coincidían con `String.length`. Se corrigió asimismo
`tagSchema`, que en el primer corte aceptaba indebidamente algunas etiquetas
largas con esos caracteres. Los tres esquemas comprueban ahora las unidades
UTF-16, como hacían los validadores originales.

Pasan 34 pruebas Vitest en los dos archivos de validación, incluyendo errores
HTTP y límites Unicode, sin conectar MongoDB. El import y los límites Unicode
se comprobaron en Node 22.23.5, 24.22.3 y 26.13.1. En Node 26.13.1 pasan la
comprobación de tipos y la compilación; el lint mantiene seis advertencias
previas. No se ejecutaron la suite completa ni las pruebas de navegador.

## Tercer corte: imagen y dificultad

`imageSchema` conserva la expresión regular anterior, sin normalizar la URL.
`difficultySchema` admite exactamente `easy`, `medium` y `difficult`. Ambos
conservan los tipos y mensajes de error, y las condiciones existentes de sus
consumidores; por ejemplo, la dificultad vacía sigue sin validarse al crear o
editar una receta y no se modifica antes de enviarla.

Pasan 56 pruebas Vitest en los dos archivos de validación, incluidas respuestas
HTTP y comprobaciones de API y frontend, sin conectar MongoDB. Las validaciones
se comprobaron en Node 22.23.5, 24.22.3 y 26.13.1. En Node 26.13.1 pasan la
comprobación de tipos y la compilación; el lint mantiene seis advertencias
previas. No se ejecutaron la suite completa ni las pruebas de navegador.

## Cuarto corte: tiempo de preparación

`timeSchema` conserva la validación real anterior: acepta números enteros a
partir de 5, incluso por encima de 9999 y del rango de enteros seguros de
JavaScript. La antigua comprobación de longitud usaba `time.length` sobre un
número y no imponía el máximo indicado en su mensaje. La creación y edición
siguen omitiendo la validación cuando el tiempo es cero. Establecer un límite
o cambiar ese comportamiento requiere una decisión aparte.

Pasan 72 pruebas Vitest en los dos archivos de validación, incluidas respuestas
HTTP, límites y comprobaciones de API y frontend, sin conectar MongoDB. Las
validaciones se comprobaron en Node 22.23.5, 24.22.3 y 26.13.1. En Node
26.13.1 pasan la comprobación de tipos y la compilación; el lint mantiene seis
advertencias previas. No se ejecutaron la suite completa ni las pruebas de
navegador.

## Quinto corte: texto y notas de pasos

`textSchema` y `noteSchema` conservan los límites anteriores, medidos en
unidades UTF-16. Para la edición, `stepNoteUpdateSchema` conserva la regla
distinta: permite la nota vacía y mantiene su propio mensaje para notas largas.
La API y el frontend usan la misma validación para editar, sin modificar las
condiciones ni el orden de validación.

Pasan 100 pruebas Vitest en cuatro archivos: 90 de validación y HTTP, y 10 de
creación y edición de pasos con MongoDB. Las pruebas de persistencia borran
usuarios y recetas; se ejecutaron secuencialmente en el contenedor dedicado
verificado. Los esquemas se comprobaron en Node 22.23.5, 24.22.3 y 26.13.1.
En Node 26.13.1 pasan tipos y compilación; el lint mantiene seis advertencias
previas. No se ejecutaron la suite completa ni las pruebas de navegador.

## Sexto corte: cantidad e indicador principal de ingredientes

`quantitySchema` y `mainSchema` conservan los valores y errores existentes.
La cantidad sigue siendo mayor que cero y como máximo 9999; el control de
decimales continúa usando la representación del número como texto. Por ello,
por ejemplo, `1e-7` se acepta y `1.2e-7` se rechaza. Cambiar esa regla requiere
una decisión aparte. El indicador principal sigue siendo opcional en sus
consumidores y, cuando se proporciona, debe ser booleano.

Pasan 120 pruebas Vitest de validación y HTTP sin conectar MongoDB. También
pasan las tres pruebas existentes de creación de ingredientes en el contenedor
MongoDB desechable verificado, que borran usuarios y recetas. Los esquemas se
comprobaron en Node 22.23.5, 24.22.3 y 26.13.1. En Node 26.13.1 pasan tipos
y compilación; el lint mantiene seis advertencias previas. No se ejecutaron
la suite completa ni las pruebas de navegador.

## Séptimo corte: unidad y anotación de ingredientes

`unitSchema` y `annotationSchema` conservan la validación anterior, incluidos
los límites medidos en unidades UTF-16 y los mensajes. El validador de unidad
acepta `undefined`, `null`, `false` y `NaN` porque la expresión regular los
convierte en texto; en cambio, rechaza la cadena vacía y el cero. La anotación
acepta esos valores falsos y la cadena vacía. Esto describe solo la validación,
no garantiza cómo Mongoose guarda esos valores. Los consumidores siguen
omitiendo la validación de la anotación cuando es falsa. Cualquier cambio de
estas reglas requiere una decisión aparte.

Pasan 161 pruebas Vitest en cuatro archivos: 158 de validación y HTTP y tres de
persistencia de ingredientes. Estas últimas borran usuarios y recetas y se
ejecutaron secuencialmente en el contenedor MongoDB desechable verificado. Los
esquemas se comprobaron en Node 22.23.5, 24.22.3 y 26.13.1. En Node 26.13.1
pasan tipos y compilación; el lint mantiene seis advertencias previas. No se
ejecutaron la suite completa ni las pruebas de navegador.

## Octavo corte: nombre en registro e ingredientes

`nameSchema` conserva el límite de 1 a 50 unidades UTF-16 y la expresión
regular existente, sin recortar ni normalizar. Se mantienen los mensajes y
el orden de validación propios de cada consumidor: el registro del frontend
comprueba el nombre de usuario antes que el nombre, mientras que la API
comprueba primero el nombre. No se ha ampliado el conjunto de caracteres
aceptados.

Pasan 183 pruebas Vitest en seis archivos, incluidas cinco pruebas de
persistencia de registro e ingredientes que borran usuarios y recetas en el
contenedor MongoDB desechable verificado. Pasa también la prueba Playwright
de registro en Chromium, con una base desechable separada. El esquema se
comprobó en Node 22.23.5, 24.22.3 y 26.13.1. En Node 26.13.1 pasan tipos
y compilación; el lint mantiene seis advertencias previas. No se ejecutaron
las suites completas de Vitest ni Playwright.

## Noveno corte: nombre de usuario

`usernameSchema` conserva el límite de 1 a 25 unidades UTF-16, la expresión
regular y los mensajes existentes, sin normalizar el valor. La API y el
frontend mantienen sus respectivos órdenes de validación durante el registro.

Pasan 197 pruebas Vitest en seis archivos, incluidas dos pruebas de registro
que borran usuarios en el contenedor MongoDB desechable verificado. Pasa
también la prueba Playwright de registro en Chromium, con una base desechable
separada. El esquema se comprobó en Node 22.23.5, 24.22.3 y 26.13.1. En Node
26.13.1 pasan tipos y compilación; el lint mantiene seis advertencias previas.
No se ejecutaron las suites completas de Vitest ni Playwright.

## Décimo corte: correo

`emailSchema` reutiliza exactamente la expresión regular anterior y mantiene
los errores de tipo y sintaxis. No recorta ni normaliza las direcciones. El
registro, la autenticación y la recuperación conservan sus órdenes de
validación en API y frontend.

Pasan 51 pruebas Vitest en tres archivos, incluyendo respuestas HTTP de
autenticación y recuperación; estas pruebas no necesitan MongoDB. El esquema
se comprobó en Node 22.23.5, 24.22.3 y 26.13.1. En Node 26.13.1 pasan tipos
y compilación; el lint mantiene seis advertencias previas. No se ejecutaron
las suites completas de Vitest ni Playwright.

## Undécimo corte: contraseña

`passwordSchema` conserva la expresión regular y los límites de 8 a 25
unidades UTF-16, así como la prioridad de los errores de tipo, longitud y
sintaxis. No recorta ni normaliza. La expresión heredada permite caracteres
Unicode en algunas posiciones si la contraseña también contiene una letra
ASCII y un dígito; no se amplió ni restringió el criterio. La API y el frontend
siguen usando sus validadores existentes para autenticación y restablecimiento.
El registro del frontend no invocaba `validate.password`; no se cambió ese
comportamiento en esta migración.

Pasan 50 pruebas Vitest en tres archivos, incluyendo los errores HTTP de
autenticación y restablecimiento; no requieren MongoDB. El esquema se comprobó
en Node 22.23.5, 24.22.3 y 26.13.1. En Node 26.13.1 pasan tipos y compilación;
el lint mantiene seis advertencias previas. No se ejecutaron las suites
completas de Vitest ni Playwright.

## Duodécimo corte: identificadores

`idSchema(explain)` conserva la validación original de tipo cadena y longitud
exacta de 24 unidades UTF-16, así como los mensajes que incluyen el nombre del
campo. No comprueba que la cadena sea hexadecimal ni la transforma; por eso un
valor de 24 caracteres no hexadecimales sigue pasando esta validación, aunque
MongoDB pueda rechazarlo después.

Pasan 19 pruebas Vitest: seis de esquema y 13 del endpoint `GET /users/name`,
ejecutadas en el MongoDB desechable verificado. El esquema se comprobó en Node
22.23.5, 24.22.3 y 26.13.1. En Node 26.13.1 pasan tipos y compilación; el lint
mantiene seis advertencias previas. No se ejecutaron las suites completas de
Vitest ni Playwright.

## Pendiente

- Migrar los dos validadores originales restantes de `validate`: índice y
  dirección.

- Migrar los tres validadores originales restantes de `validate`:
  identificador, índice y dirección.
- Caracterizar y migrar más validaciones en cortes pequeños, incluyendo
  recetas y usuarios, sin introducir valores por defecto ni cambiar errores.
- Decidir la distribución y el tipado definitivos del paquete compartido.
- Ampliar las pruebas HTTP de recetas y revisar el primer módulo vertical.
- Actualizar las dependencias y runtimes restantes de forma coordinada.

El prototipo anterior de esquemas completos se retiró: no preservaba todos los
contratos y no se había integrado ni probado. La compilación de tipos por sí
sola no demostraba compatibilidad.
