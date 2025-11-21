import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGame } from 'lib/GameContex';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 1.3;

export default function RevealCardScreen() {
  // 1. Consumimos los datos del contexto global
  const { jugadores, palabraSecreta } = useGame();
  
  // 2. Estado local para controlar el turno
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // Obtenemos el jugador actual basado en el índice
  const jugadorActual = jugadores[currentPlayerIndex];

  // Protección por si entra sin iniciar partida
  if (!jugadorActual) return null; 

  const handleNextPlayer = () => {
    if (currentPlayerIndex < jugadores.length - 1) {
      // Si quedan jugadores, reseteamos la carta y avanzamos índice
      setIsRevealed(false);
      setCurrentPlayerIndex(prev => prev + 1);
    } else {
      // Si es el último, vamos a la pantalla de juego principal/timer
      router.replace('juego/FaseVotacion'); 
      
    }
  };

  // Lógica para el texto de la carta
  const textoPrincipal = jugadorActual.esImpostor ? "ERES EL IMPOSTOR" : palabraSecreta;
  const textoSecundario = jugadorActual.esImpostor 
    ? "Intenta engañar a los demás" 
    : "Encuentra al impostor antes de que se acabe el tiempo";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER: Turno y Cerrar */}
      <View style={styles.header}>
        <View style={styles.turnBadge}>
           <Text style={styles.turnText}>
             Jugador {currentPlayerIndex + 1} de {jugadores.length}
           </Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Feather name="x" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* ÁREA CENTRAL */}
      <View style={styles.centerContainer}>
        
        {!isRevealed ? (
          /* ==================== ESTADO 1: OCULTO ==================== */
          <View style={{ alignItems: 'center', width: '100%' }}>
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => setIsRevealed(true)}
              style={[styles.cardContainer, { width: CARD_WIDTH, height: CARD_HEIGHT }]}
            >
              {/* FONDO DIVIDIDO */}
              <View style={styles.splitBackground}>
                <View style={{ flex: 1, backgroundColor: '#3b82f6' }} /> 
                <View style={{ flex: 1, backgroundColor: '#dc2626' }} /> 
              </View>

              {/* CONTENIDO */}
              <View style={styles.cardContent}>
                <Text style={styles.playerName}>
                  {jugadorActual.nombre}
                </Text>

                <FontAwesome5 name="user-secret" size={140} color="#1e293b" />

                <Text style={styles.tapText}>
                  Toca para revelar
                </Text>
              </View>
            </TouchableOpacity>

            {/* Instrucciones */}
            <View style={styles.instructionContainer}>
              <MaterialCommunityIcons name="gesture-tap" size={40} color="white" />
              <Text style={styles.instructionText}>
                Pásale el móvil a <Text style={{fontWeight:'bold', color:'#60a5fa'}}>{jugadorActual.nombre}</Text>. Toca la carta para ver tu rol secreto.
              </Text>
            </View>
          </View>

        ) : (
          /* ==================== ESTADO 2: REVELADO ==================== */
          <View style={{ alignItems: 'center', width: '100%' }}>
            
            <View style={[styles.cardRevealed, { width: CARD_WIDTH, height: CARD_WIDTH * 1.1 }]}>
              <Text style={styles.revealedTitle}>
                {textoSecundario}
              </Text>
              
              <Text style={[styles.secretWord, jugadorActual.esImpostor && { color: '#ef4444' }]}>
                {textoPrincipal}
              </Text>
              
              <View style={{ opacity: 0.8 }}>
                <FontAwesome5 
                    name={jugadorActual.esImpostor ? "user-secret" : "users"} 
                    size={50} 
                    color={jugadorActual.esImpostor ? "#ef4444" : "#3b82f6"} 
                />
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleNextPlayer}
              style={styles.buttonAction}
            >
              <Text style={styles.buttonText}>¡Entendido!</Text>
            </TouchableOpacity>

            <Text style={styles.subText}>
               {currentPlayerIndex < jugadores.length - 1 
                 ? "Pasa el dispositivo al siguiente jugador"
                 : "¡Listo para comenzar!"}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Slate 900
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  turnBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  turnText: {
    color: '#cbd5e1',
    fontWeight: 'bold',
    fontSize: 12,
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 50,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    paddingHorizontal: 16,
  },
  cardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  splitBackground: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    zIndex: 10,
  },
  playerName: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  tapText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  instructionContainer: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  instructionText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  // CARTA REVELADA
  cardRevealed: {
    backgroundColor: '#172554', // Azul muy oscuro
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  revealedTitle: {
    color: '#bfdbfe',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  secretWord: {
    color: 'white',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  buttonAction: {
    backgroundColor: '#3b82f6',
    width: '90%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subText: {
    color: '#64748b',
    fontSize: 14,
  }
});