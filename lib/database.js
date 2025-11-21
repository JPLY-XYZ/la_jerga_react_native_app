import * as SQLite from 'expo-sqlite';

// SINGLETON ROBUSTO: Guardamos la promesa, no solo la instancia
let dbPromise = null;

const getDB = () => {
  if (!dbPromise) {
    // Guardamos la promesa de apertura inmediatamente
    dbPromise = SQLite.openDatabaseAsync('juego_palabras.db');
  }
  return dbPromise;
};

const DATOS_SEMILLA = {
  // --- Lugares Geográficos y Edificaciones ---
 Animales: [
    "Perro", "Gato", "Caballo", "Vaca", "Oveja", "Cerdo", "Tigre", "León", 
    "Elefante", "Jirafa", "Cebra", "Rinoceronte", "Hipopótamo", "Oso", 
    "Lobo", "Zorro", "Conejo", "Ardilla", "Delfín", "Ballena", "Tiburón",
    "Águila", "Búho", "Loro", "Pato", "Ganso", "Gallina", "Serpiente", 
    "Lagarto", "Cocodrilo", "Tortuga", "Rana", "Pez", "Mariposa", "Abeja", 
    "Hormiga", "Araña", "Murciélago", "Camello", "Alpaca", "Canguro", 
    "Koala", "Pingüino", "Nutria", "Castor", "Foca", "Mapache", "Armadillo",
    "Gacela", "Halcón", "Cóndor", "Pelícano", "Flamenco", "Chimpancé"
  ],
  Frutas: [
    "Manzana", "Plátano", "Fresa", "Uva", "Naranja", "Pera", "Melocotón", 
    "Cereza", "Kiwi", "Piña", "Mango", "Sandía", "Melón", "Aguacate", 
    "Limón", "Mandarina", "Pomelo", "Higo", "Ciruela", "Frambuesa", 
    "Mora", "Arándano", "Coco", "Papaya", "Guayaba", "Maracuyá", 
    "Caqui", "Granada", "Chirimoya", "Níspero", "Membrillo", "Albaricoque",
    "Dátil", "Lima", "Grosella", "Endrina", "Nuez", "Almendra", "Avellana",
    "Pistacho", "Castaña", "Haba", "Guisante", "Lenteja", "Garbanzo", 
    "Maíz", "Trigo", "Arroz", "Cebada", "Centeno", "Avena"
  ],

  // --- Geografía y Ubicaciones ---
  Lugares_Geográficos: [
    "Montaña", "Río", "Lago", "Mar", "Océano", "Desierto", "Bosque", 
    "Selva", "Valle", "Cueva", "Volcán", "Playa", "Isla", "Península", 
    "Archipiélago", "Cascada", "Glaciar", "Sabana", "Tundra", "Cordillera",
    "Ciudad", "Pueblo", "Carretera", "Calle", "Plaza", "Parque", 
    "Edificio", "Puente", "Túnel", "Estación", "Aeropuerto", 
    "Puerto", "Faro", "Catedral", "Castillo", "Museo", "Biblioteca",
    "Hospital", "Escuela", "Mercado", "Tienda", "Restaurante", 
    "Hotel", "Banco", "Teatro", "Cine", "Estadio", "Gimnasio",
    "Jardín", "Santuario", "Palacio", "Fábrica"
  ],

  // --- Objetos y Tecnología ---
  Electrónica_Dispositivos: [
    "Teléfono Móvil", "Ordenador", "Tableta", "Televisor", "Reloj Inteligente", 
    "Auriculares", "Altavoz", "Cámara de Fotos", "Videoconsola", "Ratón", 
    "Teclado", "Impresora", "Monitor", "Disco Duro", "Router", "Batería", 
    "Cargador", "Cable USB", "Micrófono", "Proyector", "Radio", 
    "Calculadora", "Termostato", "Dron", "Gafas de Realidad Virtual",
    "Webcam", "Lector de Libros", "Secador de Pelo", "Aspiradora", 
    "Tostadora", "Microondas", "Nevera", "Lavadora", "Ventilador",
    "Mando a Distancia", "Tarjeta de Memoria", "Pendrive", "Linterna", 
    "Grabadora", "Walkie-Talkie", "GPS", "Robot de Cocina", "Licuadora",
    "Hervidor de Agua", "Máquina de Afeitar", "Calentador", "Cinta de Correr",
    "Termómetro Digital", "Sensor de Movimiento", "Báscula", "Binoculares"
  ],
  Juguetes_Ocio: [
    "Muñeca", "Peluche", "Coche de Juguete", "Tren Eléctrico", "Bloques de Construcción", 
    "Puzzle", "Cometa", "Canicas", "Balón", "Patinete", "Bicicleta", 
    "Skate", "Columpio", "Tobogán", "Triciclo", "Dardos", "Ajengrez", 
    "Damas", "Dominó", "Cartas", "Cubo de Rubik", "Figuras de Acción",
    "Piscina Hinchable", "Arena de Playa", "Pala y Cubo", "Soldaditos", 
    "Marioneta", "Aro de Plástico", "Cuerda de Saltar", "Arcilla", 
    "Pinturas", "Crayones", "Libro para Colorear", "Tizas", 
    "Ajedrez", "Dinosaurio de Plástico", "Mascota Virtual", "Hula Hoop",
    "Instrumento Musical de Juguete", "Diábolo", "Yoyó", "Laberinto", 
    "Tienda de Campaña Infantil", "Disfraces", "Careta", "Pistola de Agua",
    "Globo", "Barco de Papel", "Títere", "Tren de Madera"
  ],

  // --- Vida Diaria ---
  Ropas_Accesorios: [
    "Camiseta", "Pantalón", "Vestido", "Falda", "Chaqueta", "Jersey", 
    "Abrigo", "Bufanda", "Gorro", "Guantes", "Calcetines", "Zapatos", 
    "Botas", "Sandalias", "Zapatillas", "Corbata", "Cinturón", 
    "Gafas de Sol", "Sombrero", "Reloj", "Pulsera", "Anillo", 
    "Collar", "Pendientes", "Bolso", "Mochila", "Cartera", "Paraguas", 
    "Bañador", "Bikini", "Pijama", "Bata", "Sujetador", "Bragas", 
    "Calzoncillos", "Vaqueros", "Chándal", "Gabardina", "Chaleco",
    "Bolsillo", "Capucha", "Cordón", "Cremallera", "Hombrera", 
    "Tirantes", "Gemelos", "Pañuelo", "Fular", "Velo", "Tocado",
    "Traje", "Esmoquin", "Chaqueta de Cuero"
  ],
  Comidas_Generales: [
    "Pan", "Leche", "Huevo", "Carne", "Pescado", "Pollo", "Arroz", 
    "Pasta", "Queso", "Mantequilla", "Aceite", "Sal", "Azúcar", 
    "Pimienta", "Harina", "Patata", "Tomate", "Cebolla", "Ajo", 
    "Zanahoria", "Lechuga", "Pepino", "Pimiento", "Setas", "Bacon",
    "Salchicha", "Jamón", "Atún", "Sardina", "Bocadillo", "Sopa", 
    "Ensalada", "Pizza", "Hamburguesa", "Tacos", "Sushi", "Chocolate", 
    "Café", "Té", "Zumo", "Agua", "Vino", "Cerveza", "Refresco", 
    "Helado", "Galletas", "Pastel", "Mermelada", "Miel", "Vinagre"
  ],

  // --- Actividades y Roles ---
  Juegos_Deportivos: [
    "Fútbol", "Baloncesto", "Tenis", "Natación", "Golf", "Boxeo", 
    "Voleibol", "Ciclismo", "Atletismo", "Gimnasia", "Bádminton", 
    "Esquí", "Snowboard", "Surf", "Remo", "Vela", "Judo", "Karate", 
    "Esgrima", "Polo", "Hockey", "Rugby", "Balonmano", "Pádel", 
    "Petanca", "Ajedrez", "Póker", "Monopolio", "Parchís", "Dardos", 
    "Dominó", "Billar", "Futbolín", "Videojuego", "Roleplaying", 
    "Escape Room", "Paintball", "Airsoft", "Senderismo", "Escalada",
    "Maratón", "Triatlón", "Motociclismo", "Fórmula 1", "Danza", 
    "Yoga", "Pilates", "Caza", "Pesca", "Carrera", "Salto"
  ],
  Profesiones: [
    "Médico", "Ingeniero", "Profesor", "Abogado", "Arquitecto", "Bombero", 
    "Periodista", "Chef", "Fontanero", "Electricista", "Pintor", 
    "Programador", "Farmacéutico", "Cartero", "Piloto", "Bailarín",
    "Músico", "Escritor", "Actor", "Cantante", "Artista", "Científico", 
    "Policía", "Militar", "Juez", "Comercial", "Cajero", "Conductor", 
    "Mecánico", "Agricultor", "Pescador", "Minero", "Camarero", 
    "Dependiente", "Contable", "Diseñador", "Fotógrafo", "Traductor", 
    "Psicólogo", "Sociólogo", "Historiador", "Filósofo", "Relojero",
    "Modista", "Peluquero", "Veterinario", "Bibliotecario", 
    "Geólogo", "Azafata", "Taxista", "Panadero", "Sastre"
  ],

  // --- 💚 Andalucía (Lugares/Objetos de Córdoba) ---
  Andalucía_Córdoba: [
    "Mezquita", "Alcázar", "Puente Romano", "Giralda", "Patios (recinto)", 
    "Alcantarilla", "Calleja", "Alameda", "Ribera", "Taberna", 
    "Reja", "Azahar (flor)", "Naranjo", "Maceta", "Carcasa (flor)", 
    "Salmorejo (comida)", "Rabo de Toro (comida)", "Fino (vino)", 
    "Rebujito (bebida)", "Telera (pan)", "Perol (recipiente)", "Tartera (recipiente)", 
    "Aljofifa (fregona)", "Zacatúa (agujero)", "Charnique (vasija)", 
    "Cenacho (cesto)", "Pinchito (brocheta)", "Pescaito (comida)", 
    "Chicharrón", "Baticola (cola)", "Lagar (bodega)", "Abanico", 
    "Mantilla", "Farol", "Capillo (gorro)", "Banderilla", "Traje de Luces", 
    "Capote", "Muleta", "Tumba", "Zarcillo (pendiente)", "Graílla (parrilla)", 
    "Zahúrda (pocilga)", "Cortijo (finca)", "Chavea (niño)", "Cachimba (pipa)", 
    "Piti (cigarrillo)", "Piso", "Estudio", "Adosado", "Chalet"
  ]
};

export const initDB = async () => {
  try {
    const db = await getDB();

    // 1. Crear tablas
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE,
        premium INTEGER DEFAULT 0,
        is_custom INTEGER DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS palabras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        texto TEXT,
        categoria_id INTEGER,
        FOREIGN KEY (categoria_id) REFERENCES categorias (id)
      );
      CREATE TABLE IF NOT EXISTS jugadores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT
      );
    `);

    // 2. Migración segura
    try {
        const tableInfo = await db.getAllAsync("PRAGMA table_info(categorias)");
        const hasCustomCol = tableInfo.some(col => col.name === 'is_custom');
        if (!hasCustomCol) {
            await db.execAsync('ALTER TABLE categorias ADD COLUMN is_custom INTEGER DEFAULT 0');
        }
    } catch (e) {}

    // 3. Poblar Categorías si está vacío
    const resultCat = await db.getFirstAsync('SELECT count(*) as count FROM categorias');
    if (resultCat && resultCat.count === 0) {
      console.log("Poblando Categorías...");
      for (const [catNombre, palabras] of Object.entries(DATOS_SEMILLA)) {
        const resCat = await db.runAsync('INSERT INTO categorias (nombre, is_custom) VALUES (?, 0)', [catNombre]);
        const catId = resCat.lastInsertRowId;
        for (const palabra of palabras) {
          await db.runAsync('INSERT INTO palabras (texto, categoria_id) VALUES (?, ?)', [palabra, catId]);
        }
      }
    }

    // 4. Poblar Jugadores si está vacío
    const resultJug = await db.getFirstAsync('SELECT count(*) as count FROM jugadores');
    if (resultJug && resultJug.count === 0) {
      await db.runAsync('INSERT INTO jugadores (nombre) VALUES (?)', ['Jugador 1']);
      await db.runAsync('INSERT INTO jugadores (nombre) VALUES (?)', ['Jugador 2']);
      await db.runAsync('INSERT INTO jugadores (nombre) VALUES (?)', ['Jugador 3']);
      await db.runAsync('INSERT INTO jugadores (nombre) VALUES (?)', ['Jugador 4']);
    }

    console.log("DB Inicializada OK.");
  } catch (error) {
    console.error("Error initDB:", error);
  }
};

// --- NUEVA FUNCIÓN DE RESETEO ---
export const resetDB = async () => {
  try {
    const db = await getDB();
    console.log("Reseteando base de datos...");
    // Borramos las tablas
    await db.execAsync('DROP TABLE IF EXISTS palabras');
    await db.execAsync('DROP TABLE IF EXISTS categorias');
    await db.execAsync('DROP TABLE IF EXISTS jugadores');
    
    // Volvemos a inicializar (esto recreará tablas y datos semilla)
    await initDB();
    console.log("Base de datos reseteada a fábrica.");
    return true;
  } catch (e) {
    console.error("Error al resetear DB:", e);
    return false;
  }
};

// --- CATEGORÍAS ---

export const getCategoriasDB = async () => {
  const db = await getDB();
  return await db.getAllAsync(`
    SELECT c.id, c.nombre, c.premium, c.is_custom, COUNT(p.id) as count 
    FROM categorias c 
    LEFT JOIN palabras p ON c.id = p.categoria_id 
    GROUP BY c.id
  `, []);
};

export const addCategoriaDB = async (nombre) => {
  const db = await getDB();
  const result = await db.runAsync('INSERT INTO categorias (nombre, is_custom) VALUES (?, 1)', [nombre]);
  return result.lastInsertRowId;
};

export const addPalabraDB = async (texto, categoriaId) => {
  const db = await getDB();
  await db.runAsync('INSERT INTO palabras (texto, categoria_id) VALUES (?, ?)', [texto, categoriaId]);
};

// --- JUGADORES ---

export const getJugadoresDB = async () => {
  const db = await getDB();
  return await db.getAllAsync('SELECT * FROM jugadores', []);
};

export const addJugadorDB = async (nombre) => {
  const db = await getDB();
  const result = await db.runAsync('INSERT INTO jugadores (nombre) VALUES (?)', [nombre]);
  return result.lastInsertRowId;
};

export const deleteJugadorDB = async (id) => {
  const db = await getDB();
  await db.runAsync('DELETE FROM jugadores WHERE id = ?', [id]);
};

export const updateJugadorDB = async (id, nombre) => {
  const db = await getDB();
  await db.runAsync('UPDATE jugadores SET nombre = ? WHERE id = ?', [nombre, id]);
};

// --- LÓGICA DE JUEGO ---

export const getPalabraAleatoria = async (categoriaInput) => {
  try {
    const db = await getDB();
    let query, params;

    if (Array.isArray(categoriaInput) && categoriaInput.length > 0) {
      const placeholders = categoriaInput.map(() => '?').join(',');
      query = `
        SELECT p.texto FROM palabras p 
        JOIN categorias c ON p.categoria_id = c.id 
        WHERE c.nombre IN (${placeholders}) 
        ORDER BY RANDOM() LIMIT 1
      `;
      params = categoriaInput;
    } 
    else if (typeof categoriaInput === 'string' && categoriaInput !== 'Todas las categorías') {
      query = `
        SELECT p.texto FROM palabras p 
        JOIN categorias c ON p.categoria_id = c.id 
        WHERE c.nombre = ? 
        ORDER BY RANDOM() LIMIT 1
      `;
      params = [categoriaInput];
    } 
    else {
      query = 'SELECT texto FROM palabras ORDER BY RANDOM() LIMIT 1';
      params = [];
    }

    const result = await db.getFirstAsync(query, params);
    return result ? result.texto : null;
  } catch (error) {
    console.error("Error getPalabra:", error);
    return null;
  }
};