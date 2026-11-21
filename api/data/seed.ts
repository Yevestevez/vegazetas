import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User, Recipe } from './models.ts'

const password = 'Dev12345'

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

const users = [
    {
        name: 'Eva Cocina',
        email: 'dev@vegazetas.local',
        username: 'evacocina',
        password,
        bio: 'Apasionada de la cocina vegetariana. Siempre probando recetas nuevas.',
    },
    {
        name: 'Marco Verduras',
        email: 'marco@vegazetas.local',
        username: 'marcoverduras',
        password,
        bio: 'Chef casero, amante de los sabores asiáticos.',
    },
    {
        name: 'Luna Setas',
        email: 'luna@vegazetas.local',
        username: 'lunasetas',
        password,
        bio: undefined,
    },
]

/* ------------------------------------------------------------------ */
/* Recipes                                                             */
/* ------------------------------------------------------------------ */

function recipe(
    title: string,
    authorIdx: number,
    opts: {
        published?: boolean
        images?: string[]
        description?: string
        time?: number
        difficulty?: 'easy' | 'medium' | 'difficult'
        category?: 'entrante' | 'principal' | 'postre' | 'sopa' | 'ensalada' | 'snack' | 'bebida' | 'otro'
        servings?: number
        tags?: string[]
        ingredients?: Array<{ name: string; quantity?: number; unit?: string; annotation?: string; main: boolean }>
        steps?: Array<{ text: string; note?: string; order?: number }>
        nutrition?: { calories?: number; protein?: number; carbs?: number; fat?: number }
        source?: 'manual' | 'ai-generated' | 'url-import'
        sourceUrl?: string
        aiNotes?: string
        views?: number
        likes?: number
        date?: Date
    } = {}
) {
    return {
        title,
        author: 0, /* filled after users are created */
        authorIdx,
        images: opts.images ?? [],
        date: opts.date ?? new Date(),
        description: opts.description,
        time: opts.time,
        difficulty: opts.difficulty,
        category: opts.category,
        servings: opts.servings,
        tags: opts.tags ?? [],
        ingredients: opts.ingredients ?? [],
        steps: opts.steps ?? [],
        published: opts.published ?? false,
        source: opts.source ?? 'manual',
        sourceUrl: opts.sourceUrl,
        aiNotes: opts.aiNotes,
        views: opts.views ?? 0,
        likes: opts.likes ?? 0,
        likedBy: [],
        comments: [],
        nutrition: opts.nutrition,
    }
}

const recipes = [
    /* ---- Receta 1: muchos ingredientes, publicada, con imágenes ---- */
    recipe('Buddha bowl de quinoa y garbanzos', 0, {
        published: true,
        images: [
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        ],
        description:
            'Un bowl completo y nutritivo con quinoa, garbanzos especiados, aguacate, edamame y una salsa tahini cremosa. Perfecto para un almuerzo equilibrado que mantiene la energía durante toda la mañana.',
        time: 35,
        difficulty: 'easy',
        category: 'principal',
        servings: 2,
        tags: ['bowl', 'quinoa', 'garbanzos', 'vegano', 'almuerzo'],
        ingredients: [
            { name: 'Quinoa', quantity: 200, unit: 'g', main: true },
            { name: 'Garbanzos cocidos', quantity: 400, unit: 'g', main: true },
            { name: 'Aguacate', quantity: 1, main: true },
            { name: 'Edamame', quantity: 150, unit: 'g', main: true },
            { name: 'Zanahoria', quantity: 1, main: true },
            { name: 'Col morada', quantity: 100, unit: 'g', main: true },
            { name: 'Tomate cherry', quantity: 100, unit: 'g', main: true },
            { name: 'Tahini', quantity: 3, unit: 'c.s.', main: false },
            { name: 'Limón', quantity: 1, main: false },
            { name: 'Ajo', quantity: 1, annotation: 'diente', main: false },
            { name: 'Comino', quantity: 1, unit: 'c.t.', main: false },
            { name: 'Pimentón dulce', quantity: 1, unit: 'c.t.', main: false },
            { name: 'Aceite de oliva', quantity: 2, unit: 'c.s.', main: false },
            { name: 'Sal', main: false },
            { name: 'Pimienta negra', main: false },
        ],
        steps: [
            { text: 'Cocinar la quinoa según las instrucciones del paquete, aproximadamente 15 minutos.', order: 1 },
            { text: 'Mientras tanto, mezclar los garbanzos con comino, pimentón, sal y un chorrito de aceite. Dorar en una sartén a fuego medio durante 8 minutos.', order: 2 },
            { text: 'Rallar la zanahoria en juliana fina y trocear la col morada en tiras.', order: 3 },
            { text: 'Preparar la salsa tahini: mezclar tahini, zumo de medio limón, ajo rallado y agua hasta obtener una consistencia cremosa.', note: 'Añadir agua poco a poco para ajustar la textura.', order: 4 },
            { text: 'Montar los bowls: base de quinoa, garbanzos, verduras, edamame, aguacate en láminas y tomate cherry partido. Regar con la salsa tahini.', order: 5 },
        ],
        nutrition: { calories: 520, protein: 18, carbs: 62, fat: 22 },
        views: 145,
        likes: 23,
        date: new Date('2026-10-15'),
    }),

    /* ---- Receta 2: pocos ingredientes, sin imágenes, borrador ---- */
    recipe('Tostadas de aguacate y tomate', 0, {
        published: false,
        images: [],
        description: undefined,
        time: 10,
        difficulty: 'easy',
        category: 'snack',
        servings: 1,
        tags: ['rápido', 'snack', 'aguacate'],
        ingredients: [
            { name: 'Pan de masa madre', quantity: 2, main: true },
            { name: 'Aguacate', quantity: 1, main: true },
            { name: 'Tomate', quantity: 1, main: true },
            { name: 'Sal', main: false },
            { name: 'Pimienta', main: false },
        ],
        steps: [
            { text: 'Tostar el pan hasta que esté crujiente.', order: 1 },
            { text: 'Machacar el aguacate con sal y pimienta. Extender sobre las tostadas.', order: 2 },
            { text: 'Colocar rodajas de tomate encima y sazonar.', order: 3 },
        ],
        views: 0,
        likes: 0,
        date: new Date('2026-11-01'),
    }),

    /* ---- Receta 3: receta compleja de Marco, publicada, con imágenes ---- */
    recipe('Pad thai de fideos de arroz y tofu', 1, {
        published: true,
        images: [
            'https://images.unsplash.com/photo-1559314809-0d1058593866?w=800',
            'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb1?w=800',
        ],
        description:
            'Versión vegetariana del clásico tailandés con tofu crujiente, fideos de arroz, brotes de soja, cacahuetes y la salsa equilibrada entre dulce, ácido y umami. Un plato que impresiona y está listo en menos de 30 minutos.',
        time: 25,
        difficulty: 'medium',
        category: 'principal',
        servings: 2,
        tags: ['asiático', 'tofu', 'fideos', 'tailandés'],
        ingredients: [
            { name: 'Fideos de arroz', quantity: 200, unit: 'g', main: true },
            { name: 'Tofu firme', quantity: 200, unit: 'g', main: true },
            { name: 'Brotes de soja', quantity: 100, unit: 'g', main: true },
            { name: 'Cebolla de soja', quantity: 2, main: true },
            { name: 'Cacahuetes', quantity: 50, unit: 'g', main: true },
            { name: 'Salsa de pescado vegetariana', quantity: 3, unit: 'c.s.', main: false },
            { name: 'Tamarindo pasta', quantity: 2, unit: 'c.s.', main: false },
            { name: 'Azúcar de palma', quantity: 1, unit: 'c.s.', main: false },
            { name: 'Limón', quantity: 1, main: false },
            { name: 'Chile rojo', quantity: 1, main: false },
            { name: 'Aceite de sésamo', quantity: 1, unit: 'c.s.', main: false },
            { name: 'Cebollino', quantity: 2, annotation: 'tallos', main: false },
        ],
        steps: [
            { text: 'Remojar los fideos de arroz en agua caliente 10 minutos. Escurrir y reservar.', order: 1 },
            { text: 'Cortar el tofu en cubos pequeños y dorar en wok con aceite hasta que esté crujiente por todos los lados.', note: 'Exprimir bien el tofu antes de cortarlo para que quede más crujiente.', order: 2 },
            { text: 'Preparar la salsa: mezclar salsa de pescado vegetariana, pasta de tamarindo, azúcar de palma y zumo de limón.', order: 3 },
            { text: 'En el wok, saltear la cebolla de soja y el chile picado 2 minutos. Añadir los fideos y la salsa, mezclar bien a fuego alto.', order: 4 },
            { text: 'Incorporar el tofu y los brotes de soja. Saltear 1 minuto más. Servir con cacahuetes picados y cebollino.', order: 5 },
        ],
        nutrition: { calories: 480, protein: 20, carbs: 58, fat: 18 },
        views: 312,
        likes: 47,
        date: new Date('2026-09-20'),
    }),

    /* ---- Receta 4: postre sencillo de Luna, sin imágenes ---- */
    recipe('Mousse de aguacate y chocolate', 2, {
        published: true,
        images: [],
        description: 'Un postre cremoso y sorprendente. El aguacate aporta textura sin dejar sabor.',
        time: 15,
        difficulty: 'easy',
        category: 'postre',
        servings: 4,
        tags: ['postre', 'chocolate', 'rápido', 'vegano'],
        ingredients: [
            { name: 'Aguacate maduro', quantity: 2, main: true },
            { name: 'Cacao en polvo', quantity: 3, unit: 'c.s.', main: true },
            { name: 'Miel o agave', quantity: 3, unit: 'c.s.', main: true },
            { name: 'Vainilla', quantity: 1, unit: 'c.t.', main: false },
            { name: 'Sal', annotation: 'una pizca', main: false },
        ],
        steps: [
            { text: 'Triturar todos los ingredientes en un procesador hasta obtener una mousse homogénea.', order: 1 },
            { text: 'Refrigerar 30 minutos antes de servir.', order: 2 },
        ],
        nutrition: { calories: 180, protein: 3, carbs: 14, fat: 14 },
        views: 89,
        likes: 15,
        date: new Date('2026-10-05'),
    }),

    /* ---- Receta 5: sopa con descripción larga, de Eva, publicada ---- */
    recipe('Sopa de lentejas y espinacas', 0, {
        published: true,
        images: [
            'https://images.unsplash.com/photo-1587049352846-4a222e704763?w=800',
        ],
        description:
            'Una sopa reconfortante de lentejas rojas y espinacas frescas, con un toque de cúrcuma y jengibre que la convierte en un plato ideal para los días fríos. Las lentejas rojas se deshacen durante la cocción, creando una textura cremosa sin necesidad de nata. Se puede preparar con antelación y sabe aún mejor al día siguiente. Perfecta para congelar en raciones individuales.',
        time: 45,
        difficulty: 'easy',
        category: 'sopa',
        servings: 4,
        tags: ['sopa', 'lentejas', 'espinacas', 'confort', 'congelable'],
        ingredients: [
            { name: 'Lentejas rojas', quantity: 300, unit: 'g', main: true },
            { name: 'Espínacas frescas', quantity: 200, unit: 'g', main: true },
            { name: 'Cebolla', quantity: 1, main: true },
            { name: 'Zanahoria', quantity: 2, main: true },
            { name: 'Jengibre fresco', quantity: 2, unit: 'cm', main: true },
            { name: 'Ajo', quantity: 3, annotation: 'dientes', main: true },
            { name: 'Cúrcuma', quantity: 1, unit: 'c.t.', main: false },
            { name: 'Caldo de verduras', quantity: 1, unit: 'L', main: false },
            { name: 'Aceite de oliva', quantity: 2, unit: 'c.s.', main: false },
            { name: 'Sal y pimienta', main: false },
        ],
        steps: [
            { text: 'Sofreír la cebolla, la zanahoria picada y el ajo laminado en aceite de oliva durante 5 minutos.', order: 1 },
            { text: 'Añadir el jengibre rallado y la cúrcuma. Sofreír 1 minuto más hasta que fragüe.', order: 2 },
            { text: 'Incorporar las lentejas rojas lavadas y el caldo de verduras. Llevar a ebullición y cocinar a fuego lento 25 minutos.', order: 3 },
            { text: 'Añadir las espinacas y cocinar 5 minutos más hasta que estén tiernas. Sazonar con sal y pimienta.', order: 4 },
            { text: 'Servir caliente con un chorrito de aceite de oliva virgen.', note: 'Se puede triturar parcialmente para una textura más cremosa.', order: 5 },
        ],
        nutrition: { calories: 280, protein: 16, carbs: 42, fat: 6 },
        views: 67,
        likes: 12,
        date: new Date('2026-11-10'),
    }),

    /* ---- Receta 6: ensalada de Marco, publicada, sin descripción ---- */
    recipe('Ensalada mediterránea de garbanzos', 1, {
        published: true,
        images: [],
        description: undefined,
        time: 15,
        difficulty: 'easy',
        category: 'ensalada',
        servings: 4,
        tags: ['ensalada', 'mediterráneo', 'garbanzos'],
        ingredients: [
            { name: 'Garbanzos cocidos', quantity: 400, unit: 'g', main: true },
            { name: 'Pepino', quantity: 1, main: true },
            { name: 'Tomate', quantity: 2, main: true },
            { name: 'Cebolla morada', quantity: 1, main: true },
            { name: 'Aceitunas negras', quantity: 100, unit: 'g', main: true },
            { name: 'Aceite de oliva', quantity: 3, unit: 'c.s.', main: false },
            { name: 'Vinagre de Jerez', quantity: 1, unit: 'c.s.', main: false },
            { name: 'Sal', main: false },
        ],
        steps: [
            { text: 'Cortar todos los vegetales en trozos similares.', order: 1 },
            { text: 'Mezclar con los garbanzos escurridos y las aceitunas.', order: 2 },
            { text: 'Aliñar con aceite, vinagre y sal. Dejar reposar 10 minutos.', order: 3 },
        ],
        views: 34,
        likes: 5,
        date: new Date('2026-11-12'),
    }),

    /* ---- Receta 7: receta difícil de Eva, con muchos pasos ---- */
    recipe('Lasaña de berenjenas y ragú de setas', 0, {
        published: true,
        images: [
            'https://images.unsplash.com/photo-1574868291451-ab1c05c36b68?w=800',
        ],
        description:
            'Una lasaña elaborada con láminas de berenjena asada en lugar de pasta, rellena de un ragú de setas mixtas y una bechamel de anacardos. Un plato de celebración que impresiona por su sabor y presentación.',
        time: 120,
        difficulty: 'difficult',
        category: 'principal',
        servings: 6,
        tags: ['lasaña', 'berenjena', 'setas', 'celebración', 'vegano'],
        ingredients: [
            { name: 'Berenjenas', quantity: 3, main: true },
            { name: 'Setas mixtas', quantity: 500, unit: 'g', main: true },
            { name: 'Anacardos', quantity: 200, unit: 'g', main: true },
            { name: 'Tomate triturado', quantity: 800, unit: 'g', main: true },
            { name: 'Cebolla', quantity: 2, main: true },
            { name: 'Ajo', quantity: 4, annotation: 'dientes', main: true },
            { name: 'Pasta de tomate', quantity: 2, unit: 'c.s.', main: false },
            { name: 'Orégano', quantity: 1, unit: 'c.t.', main: false },
            { name: 'Albahaca fresca', quantity: 10, annotation: 'hojas', main: false },
            { name: 'Leche de soja sin azúcar', quantity: 500, unit: 'ml', main: false },
            { name: 'Harina de trigo', quantity: 3, unit: 'c.s.', main: false },
            { name: 'Aceite de oliva', quantity: 4, unit: 'c.s.', main: false },
            { name: 'Nuez moscada', main: false },
            { name: 'Sal y pimienta', main: false },
            { name: 'Romero', quantity: 1, annotation: 'rama', main: false },
        ],
        steps: [
            { text: 'Remojar los anacardos en agua caliente al menos 2 horas o en agua fría toda la noche.', order: 1 },
            { text: 'Cortar las berenjenas en láminas longitudinales de 0.5 cm. Salpimentar y asar en el horno a 200°C durante 20 minutos, girando a mitad de cocción.', note: 'Pincelar con un poco de aceite para que queden doradas.', order: 2 },
            { text: 'Preparar el ragú: sofreír cebolla y ajo picados. Añadir las setas laminadas y cocinar hasta que suelten el agua y se doren. Incorporar pasta de tomate, orégano, romero y tomate triturado. Cocinar a fuego lento 40 minutos.', order: 3 },
            { text: 'Preparar la bechamel: escurrir los anacardos y triturar con leche de soja, harina, nuez moscada, sal y un diente de ajo hasta obtener una crema lisa. Calentar en cazo hasta espesar.', order: 4 },
            { text: 'Montar la lasaña en capas: base de ragú, láminas de berenjena, bechamel, repetir 3 veces. Terminar con bechamel y albahaca.', order: 5 },
            { text: 'Hornear a 180°C durante 30 minutos hasta que la superficie esté dorada. Dejar reposar 15 minutos antes de cortar.', note: 'El reposo es crucial para que las capas se asienten.', order: 6 },
        ],
        nutrition: { calories: 420, protein: 14, carbs: 38, fat: 24 },
        views: 203,
        likes: 38,
        date: new Date('2026-08-25'),
    }),

    /* ---- Receta 8: snack rápido de Luna, publicado ---- */
    recipe('Hummus de remolacha', 2, {
        published: true,
        images: [
            'https://images.unsplash.com/photo-1571091718767-487418561c1d?w=800',
        ],
        description: 'Hummus con color natural de remolacha asada. Ideal con crudités o pan pita.',
        time: 40,
        difficulty: 'easy',
        category: 'entrante',
        servings: 6,
        tags: ['hummus', 'remolacha', 'entrante', 'vegano'],
        ingredients: [
            { name: 'Garbanzos cocidos', quantity: 400, unit: 'g', main: true },
            { name: 'Remolacha cocida', quantity: 2, main: true },
            { name: 'Tahini', quantity: 2, unit: 'c.s.', main: true },
            { name: 'Limón', quantity: 1, main: true },
            { name: 'Ajo', quantity: 1, annotation: 'diente', main: true },
            { name: 'Aceite de oliva', quantity: 1, unit: 'c.s.', main: false },
            { name: 'Comino', quantity: 0.5, unit: 'c.t.', main: false },
            { name: 'Sal', main: false },
        ],
        steps: [
            { text: 'Asar las remolachas envueltas en papel de aluminio a 200°C durante 45 minutos. Pelar y trocear.', order: 1 },
            { text: 'Triturar todos los ingredientes hasta obtener una crema homogénea.', order: 2 },
            { text: 'Servir con un chorrito de aceite de oliva y comino por encima.', order: 3 },
        ],
        nutrition: { calories: 160, protein: 7, carbs: 18, fat: 7 },
        views: 56,
        likes: 9,
        date: new Date('2026-11-08'),
    }),

    /* ---- Receta 9: bebida de Marco, sin imágenes, borrador ---- */
    recipe('Smoothie verde detox', 1, {
        published: false,
        images: [],
        description: undefined,
        time: 5,
        difficulty: 'easy',
        category: 'bebida',
        servings: 1,
        tags: ['smoothie', 'verde', 'desayuno'],
        ingredients: [
            { name: 'Espinacas', quantity: 100, unit: 'g', main: true },
            { name: 'Plátano', quantity: 1, main: true },
            { name: 'Piña', quantity: 100, unit: 'g', main: true },
            { name: 'Leche de coco', quantity: 200, unit: 'ml', main: true },
            { name: 'Jengibre', quantity: 1, unit: 'cm', main: false },
        ],
        steps: [
            { text: 'Triturar todos los ingredientes hasta obtener una mezcla homogénea.', order: 1 },
            { text: 'Servir frío.', order: 2 },
        ],
        views: 0,
        likes: 0,
        date: new Date('2026-11-15'),
    }),

    /* ---- Receta 10: receta con source ai-generated ---- */
    recipe('Tacos de jackfruit', 2, {
        published: true,
        images: [],
        description: 'Receta generada con IA. Tacos de jackfruit con salsa de mango.',
        time: 30,
        difficulty: 'medium',
        category: 'principal',
        servings: 4,
        tags: ['tacos', 'jackfruit', 'mexicano'],
        ingredients: [
            { name: 'Jackfruit enlatado', quantity: 800, unit: 'g', main: true },
            { name: 'Tortillas de maíz', quantity: 8, main: true },
            { name: 'Mango', quantity: 1, main: true },
            { name: 'Chile', quantity: 1, main: true },
            { name: 'Cilantro', quantity: 5, annotation: 'tallos', main: false },
            { name: 'Limón', quantity: 1, main: false },
            { name: 'Comino', quantity: 1, unit: 'c.t.', main: false },
            { name: 'Pimentón', quantity: 1, unit: 'c.t.', main: false },
        ],
        steps: [
            { text: 'Escurrir el jackfruit y desmenuzar con tenedor.', order: 1 },
            { text: 'Sofreír con comino, pimentón y chile picado. Cocinar 15 minutos.', order: 2 },
            { text: 'Preparar salsa de mango: triturar mango con cilantro, limón y sal.', order: 3 },
            { text: 'Calentar tortillas y servir con el jackfruit y la salsa.', order: 4 },
        ],
        source: 'ai-generated',
        aiNotes: 'Generada con IA a partir de la URL proporcionada.',
        sourceUrl: 'https://example.com/jackfruit-tacos',
        views: 28,
        likes: 4,
        date: new Date('2026-11-14'),
    }),
]

/* ------------------------------------------------------------------ */
/* Favorites for Eva (user 0)                                          */
/* ------------------------------------------------------------------ */

/* Eva tiene como favoritas: */
/* - Su propia receta de Buddha bowl (0) */
/* - La receta de Pad thai de Marco (2) */
/* - La mousse de Luna (3) */
/* - La ensalada de Marco (5) */

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

export async function run() {
    /* Clear existing data */
    await Recipe.deleteMany()
    await User.deleteMany()
    console.log('Cleared existing data')

    /* Hash password */
    const hashedPassword = await bcrypt.hash(password, 10)

    /* Create users */
    const createdUsers = await Promise.all(
        users.map(u => User.create({ ...u, password: hashedPassword }))
    )
    console.log(`Created ${createdUsers.length} users`)

    /* Create recipes with resolved author IDs */
    const createdRecipes = await Promise.all(
        recipes.map(r =>
            Recipe.create({
                ...r,
                author: createdUsers[r.authorIdx]._id,
            })
        )
    )
    console.log(`Created ${createdRecipes.length} recipes`)

    /* Set favorites for Eva (user index 0) */
    const evaFavIndices = [0, 2, 3, 5]
    const evaFavIds = evaFavIndices.map(i => createdRecipes[i]._id)
    await User.findByIdAndUpdate(createdUsers[0]._id, { favorites: evaFavIds })
    console.log(`Set ${evaFavIds.length} favorites for Eva`)

    /* Set likedBy for some recipes */
    await Recipe.findByIdAndUpdate(createdRecipes[0]._id, {
        likedBy: [createdUsers[0]._id, createdUsers[1]._id, createdUsers[2]._id],
    })
    await Recipe.findByIdAndUpdate(createdRecipes[2]._id, {
        likedBy: [createdUsers[0]._id, createdUsers[2]._id],
    })
    console.log('Set likedBy for popular recipes')

    console.log('\nSeed completed successfully!')
    console.log('')
    console.log('Users:')
    for (const u of createdUsers) {
        console.log(`  - ${u.username} (${u.email})`)
    }
    console.log(`  Password for all: ${password}`)
    console.log('')
    console.log('Recipes:')
    for (const r of createdRecipes) {
        const author = createdUsers.find(u => u._id.toString() === r.author.toString())?.username ?? '?'
        const pub = r.published ? '📢' : '📝'
        console.log(`  ${pub} "${r.title}" by ${author} (${r.images.length} img, ${r.ingredients.length} ing, ${r.steps.length} steps)`)
    }
}

/* Run standalone when executed directly */
if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
    import('../config/loadEnv.ts').then(() => {
        const mongoUrl = process.env.MONGO_URL
        if (!mongoUrl) {
            console.error('Error: MONGO_URL environment variable is required')
            process.exit(1)
            return
        }
        return mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 10000,
        })
    })
    .then(() => {
        console.log('DB connected for seeding')
        return run()
    })
    .then(() => {
        console.log('\nDisconnected from DB')
        process.exit(0)
    })
    .catch(err => {
        console.error('Seed failed:', err)
        process.exit(1)
    })
}
