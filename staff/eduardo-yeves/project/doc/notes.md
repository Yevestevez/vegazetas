# NOTAS PREVIAS

## FUNCIONALIDADES BÁSICAS

### Usuarios
- Crear nuevo usuario
- Modificar datos de usuario
- Eliminar usuario
- Login/logout

### Recetas
- Añadir recetas nuevas
- Editar recetas
- Eliminar recetas

## OTRAS POSIBLES FUNCIONALIDADES APP
- Etiquetas personalizables de las recetas
- Planificador de recetas semanal/mensual (calendario)
- Lista de la compra, manual (poder añadir ingredientes externos a las recetas planificadas) y a partir de las recetas o el planificador (que sume ingredientes iguales de varias recetas añadidas a la lista y especifique de que receta proviene cada cantidad)
- Marcaje de elementos "comprados ya" en la lista de la compra
- Ordenar la lista de la compra por tipo de ingredientes para facilitar la compra en el supermercado
- Marcar elementos del carro de la compra como "no disponibles"
- Mostrar las recetas afectadas por un ingrediente "no disponible"
- Filtrado por etiquetas de receta, ingrediente, tipo de cocina (italiana...), tipo de comida (desayuno, merienda, cena...), etiquetas personalizadas
- Mostrar la fecha de la última vez que has hecho la receta
- Guardar ideas de recetas mediante enlace (RRSS, webs...) en una sección de "inspiración"
- Puntuación/recetas favoritas o habituales
- Posibilidad de crear listas o carpetas de recetas
- Compartir receta con otro usuario
- Añadir temporizador (para cuando estás cocinando)
- **Botón para que no se apague la pantalla de la tablet al cocinar**
- Filtrar recetas con frutas y verduras de temporada
- **Posibilidad de cambiar el tamaño de la letra (puedes necesitarlo más grande al cocinar)**
- Mostrar sugerencia de recetas parecidas dentro de una receta
- Opción de generar PDF/imprimir receta

### Data Model

Usuario

- id (ObjectId MongoDB)
- name (string)
- email (string)
- username (string)
- password (string)
- opcionales o a futuro:
    - amigos (para compartir las recetas)

Receta

- id (ObjectID MongoDB)
- author id (UserId)
- título
- breve descripción
- ingredientes y cantidades
- tiempo de elaboración
- etiquetas personalizadas (gastronomía, tipo, evento, temporada)
- instrucciones
- imágenes o vídeos
- opcionales o a futuro:
    - instrumentos necesarios (horno, sartén, olla, batidora...)
    - dificultad (sencilla, media, compleja)
