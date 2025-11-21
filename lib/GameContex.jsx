import React, { createContext, useState, useContext, useEffect } from 'react';
import { getJugadoresDB, addJugadorDB, deleteJugadorDB,updateJugadorDB } from './database';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [jugadores, setJugadores] = useState([]);
  
  const [configuracion, setConfiguracion] = useState({
    numImpostores: 1,
    tiempo: 120,
    categoria: null,
  });

  const [palabraSecreta, setPalabraSecreta] = useState('');
  const [juegoIniciado, setJuegoIniciado] = useState(false);

  // Carga Inicial
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const listaDB = await getJugadoresDB();
        if (listaDB) {
          const listaConEstado = listaDB.map(j => ({ ...j, esImpostor: false }));
          setJugadores(listaConEstado);
        }
      } catch (e) { console.error("Error cargando jugadores:", e); }
    };
    cargarDatos();
  }, []);

  // --- ACCIONES JUGADORES ---

  const agregarJugador = async () => {
    try {
      // Calculamos el número para el nombre por defecto
      const nuevoNum = jugadores.length > 0 ? Math.max(...jugadores.map(j => j.id)) + 1 : 1; // Usar ID máx para evitar nombres repes si borras
      const nombreDefault = `Jugador ${jugadores.length + 1}`; // O simplemente longitud + 1
      
      console.log("Agregando jugador...", nombreDefault);
      
      const nuevoId = await addJugadorDB(nombreDefault);
      
      // Actualizamos estado local inmediatamente
      setJugadores(prev => [...prev, { id: nuevoId, nombre: nombreDefault, esImpostor: false }]);
    } catch (e) { 
      console.error("Error al agregar:", e); 
    }
  };

  const eliminarJugador = async (id) => {
    try {
      console.log("Eliminando jugador ID:", id);
      await deleteJugadorDB(id);
      setJugadores(prev => prev.filter(j => j.id !== id));
    } catch (e) { 
      console.error("Error al eliminar:", e); 
    }
  };

  const editarNombreJugador = async (id, nombre) => {
    try {
      await updateJugadorDB(id, nombre);
      setJugadores(prev => prev.map(j => j.id === id ? { ...j, nombre } : j));
    } catch (e) { console.error(e); }
  };

  // --- Resto Lógica ---
  const setNumImpostores = (num) => {
    if (num < jugadores.length) setConfiguracion({ ...configuracion, numImpostores: num });
  };

  const setCategoria = (cat) => {
    setConfiguracion({ ...configuracion, categoria: cat });
  };

  const iniciarPartida = (palabraDeLaDB) => {
    setPalabraSecreta(palabraDeLaDB);
    let listaMezclada = [...jugadores].map(j => ({ ...j, esImpostor: false }));
    
    // Shuffle
    for (let i = listaMezclada.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [listaMezclada[i], listaMezclada[j]] = [listaMezclada[j], listaMezclada[i]];
    }

    // Impostores
    const totalImpostores = Math.min(configuracion.numImpostores, jugadores.length - 1);
    for (let i = 0; i < totalImpostores; i++) {
      listaMezclada[i].esImpostor = true;
    }

    setJugadores(listaMezclada);
    setJuegoIniciado(true);
  };

  const terminarPartida = () => {
    setJuegoIniciado(false);
    setPalabraSecreta('');
    setJugadores(jugadores.map(j => ({ ...j, esImpostor: false })));
  };

  return (
    <GameContext.Provider value={{
      jugadores, configuracion, palabraSecreta, juegoIniciado,
      agregarJugador, eliminarJugador, editarNombreJugador,
      setNumImpostores, setCategoria, iniciarPartida, terminarPartida
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);