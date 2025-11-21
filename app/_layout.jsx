import { GameProvider } from "lib/GameContex";
import "../global.css"; // ¡Mueve la importación del CSS aquí!
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // Asegúrate de envolver la app con el Provider
   <GameProvider>
      <Stack>
           <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="MenuPrincipal" options={{ headerShown: false }} />
        <Stack.Screen name="Ajustes" options={{ headerShown: false }} />
         <Stack.Screen name="juego/RevealCardScreen" options={{ headerShown: false }} />
         <Stack.Screen name="juego/ConfiguracionDelJuego" options={{ headerShown: false }} />
          <Stack.Screen name="juego/ListaJugadores" options={{ headerShown: false }} />
          <Stack.Screen name="juego/SeleccionCategoria" options={{ headerShown: false }} />
           <Stack.Screen name="juego/FaseVotacion" options={{ headerShown: false }} />
      </Stack>
    </GameProvider>
  );
}