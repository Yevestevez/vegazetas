# Migración gradual de `com` a Zod

## Primer corte: etiquetas de recetas

El esquema compartido `tagSchema` valida cadenas de 1 a 30 unidades UTF-16,
sin transformarlas. `validate.tag` conserva su interfaz, su retorno y el tipo
y de error anterior; su mensaje indica ahora el límite real de 30 caracteres.
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

`timeSchema` acepta números enteros entre 5 y 9999. La migración inicial
reprodujo una comprobación heredada que no aplicaba el máximo; la revisión
correctiva de este documento la alineó con el límite anunciado. El tratamiento
posterior del tiempo opcional se describe en la sección «Tiempo opcional».

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
La cantidad sigue siendo mayor que cero y como máximo 9999, con hasta dos
decimales según la representación decimal del número, también cuando se
expresa en notación científica. El indicador principal sigue siendo opcional
en sus consumidores y, cuando se proporciona, debe ser booleano.

Pasan 120 pruebas Vitest de validación y HTTP sin conectar MongoDB. También
pasan las tres pruebas existentes de creación de ingredientes en el contenedor
MongoDB desechable verificado, que borran usuarios y recetas. Los esquemas se
comprobaron en Node 22.23.5, 24.22.3 y 26.13.1. En Node 26.13.1 pasan tipos
y compilación; el lint mantiene seis advertencias previas. No se ejecutaron
la suite completa ni las pruebas de navegador.

## Séptimo corte: unidad y anotación de ingredientes

`unitSchema` y `annotationSchema` aceptan texto, `undefined` y `null`. La
unidad, si se proporciona, debe tener entre 1 y 20 unidades UTF-16 y ajustarse
a su expresión regular; la anotación admite la cadena vacía y hasta 300
unidades UTF-16. Se rechazan valores no textuales como `false` y `NaN`; los
consumidores validan la anotación siempre que no sea `undefined` o `null`.

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

`idSchema(explain)` exige una cadena de 24 caracteres hexadecimales y conserva
los mensajes dinámicos que identifican el campo. Los valores mal formados se
rechazan antes de llegar al acceso a MongoDB.

Pasan 19 pruebas Vitest: seis de esquema y 13 del endpoint `GET /users/name`,
ejecutadas en el MongoDB desechable verificado. El esquema se comprobó en Node
22.23.5, 24.22.3 y 26.13.1. En Node 26.13.1 pasan tipos y compilación; el lint
mantiene seis advertencias previas. No se ejecutaron las suites completas de
Vitest ni Playwright.

## Decimotercer corte: índice

`indexSchema(explain)` conserva la aceptación de enteros no negativos y el
orden y texto de los errores anteriores. Valores no enteros (incluidos
`NaN` e infinito) producen el mensaje de entero; solo después se rechazan los
enteros negativos con el mensaje de límite inferior. `validate.index` conserva
su interfaz y sigue lanzando `ValidationError`.

Pasan 10 pruebas Vitest unitarias, sin conexión a MongoDB. No se ejecutaron las
suites completas de Vitest ni Playwright.

## Decimocuarto corte: dirección

`directionSchema` conserva la aceptación exacta de `up` y `down`.
`validate.direction` lanza `ValidationError`, de forma coherente con los demás
validadores compartidos.

Pasan ocho pruebas Vitest unitarias, sin conexión a MongoDB. También pasan el
typecheck de la API y el build de la app. No se ejecutaron las suites completas
de Vitest ni Playwright.

## Revisión correctiva

Se corrigieron las discrepancias detectadas al revisar los consumidores:

- El error de etiqueta coincide con su máximo real de 30; el tiempo ahora
  impone el máximo anunciado de 9999 y la cantidad rechaza también precisiones
  excesivas expresadas en notación científica.
- Los IDs deben ser hexadecimales de 24 caracteres, los campos opcionales de
  unidad y anotación aceptan solo texto, `undefined` o `null`, y todos los
  validadores de dirección producen `ValidationError`. La API comprueba la
  dirección antes de buscar o modificar datos.
- El nombre de ingrediente tiene un esquema propio alineado con los caracteres
  permitidos por el formulario; el nombre de usuario conserva sus restricciones
  distintas. El formulario limita cantidades a valores positivos y el tiempo a
  minutos enteros.
- El formulario de registro comparte la validación de contraseña, sin un patrón
  HTML más restrictivo. `registerUser` dejó de validar el correo dos veces.

Se mantienen los límites de longitud en unidades UTF-16 para preservar el
contrato existente y la aceptación de caracteres Unicode no espaciados en
contraseñas que incluyen una letra y un dígito ASCII.

Pasan 273 pruebas en 10 suites dirigidas, el typecheck de la API y el build de
la app. Las pruebas de validación no requieren MongoDB. Las dos suites
integradas de `GET /users/name` no pudieron conectar con MongoDB local y
agotaron el tiempo de espera antes de ejecutar pruebas; no se realizaron
operaciones de borrado. No se ejecutaron la suite completa ni Playwright.

## Tiempo opcional

El tiempo sin especificar se representa mediante la ausencia del campo. Si se
proporciona, debe ser un entero de 5 a 9999 minutos; `0` y `null` explícitos
se rechazan. En `PATCH` omitir `time` elimina el tiempo guardado. El formulario
lo muestra vacío y permite borrarlo; también muestra vacíos los valores
históricos `0`, que no se visualizan en la receta. No se han migrado ni borrado
datos existentes; un cero anterior se elimina cuando se guarda una edición.
Hay que coordinar el despliegue con los clientes que aún envíen `0` o `null`.

Pasan 98 pruebas Vitest de creación, edición y validación, incluidas pruebas
de borrado del campo en MongoDB aislado y desechable y de autorización. Pasan
cuatro pruebas Playwright en Chromium con la API simulada para la interfaz.
Pasan los tipos de la API y el build de la app; el lint dirigido mantiene dos
advertencias previas de `useEffect`. No se ejecutaron las suites completas ni
pruebas manuales con tecnologías de asistencia.

## Pendiente

- La interfaz original `validate` ya usa Zod para todos sus validadores.
- Caracterizar y migrar más validaciones en cortes pequeños, incluyendo
  recetas y usuarios, sin introducir valores por defecto ni cambiar errores.
- Decidir la distribución y el tipado definitivos del paquete compartido.
- Ampliar las pruebas HTTP de recetas y revisar el primer módulo vertical.
- Actualizar las dependencias y runtimes restantes de forma coordinada.

El prototipo anterior de esquemas completos se retiró: no preservaba todos los
contratos y no se había integrado ni probado. La compilación de tipos por sí
sola no demostraba compatibilidad.
