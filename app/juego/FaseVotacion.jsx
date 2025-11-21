import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGame } from 'lib/GameContex';


export default function FaseVotacion() {
  const { jugadores } = useGame();

  // Seleccionamos un jugador inicial al azar (o el primero) para mostrarlo en el paso 1
  // Usamos useMemo para que no cambie si se renderiza de nuevo
  const jugadorInicial = useMemo(() => {
    if (jugadores && jugadores.length > 0) {
      // Opción A: Siempre el Jugador 1
      // return jugadores[0].nombre;
      
      // Opción B: Uno aleatorio
      const randomIndex = Math.floor(Math.random() * jugadores.length);
      return jugadores[randomIndex].nombre;
    }
    return "Player 1";
  }, [jugadores]);

  const handleMostrarResultados = () => {
    router.push('juego/ConfiguracionDelJuego');
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />

      {/* FONDO PARTIDO */}
      <View style={styles.bgLeft} />
      <View style={styles.bgRight} />

      <SafeAreaView style={styles.safeArea}>
        
        {/* HEADER TEXTO */}
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             {/* Icono menú o atrás, en la imagen no se ve claro, pongo flecha por usabilidad */}
             <Feather name="chevron-left" size={28} color="white" /> 
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Fase de votación</Text>
            <Text style={styles.headerSubtitle}>¡Es hora de discutir y votar quién es el impostor!</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.sectionTitle}>Cómo votar</Text>

          {/* PASO 1: JUGADOR INICIAL */}
          <View style={styles.stepCard}>
             <View style={[styles.numberBadge, { backgroundColor: '#3b82f6' }]}>
                <Text style={styles.numberText}>1</Text>
             </View>
             <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Jugador inicial</Text>
                <Text style={styles.cardDesc}>
                  El jugador <Text style={{color:'#facc15', fontWeight:'bold'}}>{jugadorInicial}</Text> comienza la ronda
                </Text>
             </View>
             <View style={[styles.iconBox, { backgroundColor: '#1e3a8a' }]}>
                <FontAwesome5 name="user" size={24} color="#60a5fa" />
             </View>
          </View>

          {/* PASO 2: DISCUSIÓN */}
          <View style={styles.stepCard}>
             <View style={[styles.numberBadge, { backgroundColor: '#8b5cf6' }]}>
                <Text style={styles.numberText}>2</Text>
             </View>
             <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Discusión en grupo</Text>
                <Text style={styles.cardDesc}>Continúa en el sentido de las agujas del reloj</Text>
             </View>
             <View style={[styles.iconBox, { backgroundColor: '#4c1d95' }]}>
                <FontAwesome5 name="users" size={24} color="#a78bfa" />
             </View>
          </View>

          {/* PASO 3: TIEMPO VOTACIÓN */}
          <View style={styles.stepCard}>
             <View style={[styles.numberBadge, { backgroundColor: '#f59e0b' }]}>
                <Text style={styles.numberText}>3</Text>
             </View>
             <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Tiempo de votación</Text>
                <Text style={styles.cardDesc}>
                  Cada jugador dice una palabra relacionada con la palabra secreta. Haz dos o tres rondas.
                </Text>
             </View>
             <View style={[styles.iconBox, { backgroundColor: '#78350f' }]}>
                <MaterialCommunityIcons name="vote" size={28} color="#fbbf24" />
             </View>
          </View>

          {/* PASO 4: REVELACIÓN */}
          <View style={styles.stepCard}>
             <View style={[styles.numberBadge, { backgroundColor: '#ef4444' }]}>
                <Text style={styles.numberText}>4</Text>
             </View>
             <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Fase de revelación</Text>
                <Text style={styles.cardDesc}>
                  Vota por el jugador que creas que es el impostor, luego toca para ver los resultados.
                </Text>
             </View>
             <View style={[styles.iconBox, { backgroundColor: '#7f1d1d' }]}>
                <MaterialCommunityIcons name="incognito" size={28} color="#f87171" />
             </View>
          </View>

        </ScrollView>

        {/* BOTÓN INFERIOR */}
        <View style={styles.footerContainer}>
          <TouchableOpacity 
            style={styles.redButton}
            onPress={handleMostrarResultados}
          >
            <Text style={styles.redButtonText}>IR AL INICIO</Text>
          </TouchableOpacity>
        </View>

        {/* BANNER PUBLICIDAD */}
        <View style={styles.adBanner}>
            {/* Placeholder simple para el Mahjong de la imagen */}
            <Image 
              source={{ uri: 'https://placehold.co/320x50/png?text=Mahjong+Ad' }} 
              style={{ width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.8 }} 
            />
            <View style={styles.adOverlay}>
                <Text style={{color:'black', fontSize:10, fontWeight:'bold', backgroundColor:'white', padding:2}}>Anuncio</Text>
            </View>
        </View>

      </SafeAreaView>
    </View>
  );
}

// ==================================================================
// ESTILOS
// ==================================================================
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#0f172a', 
    position: 'relative',
  },
  bgLeft: {
    position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%',
    backgroundColor: '#0f172a',
  },
  bgRight: {
    position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%',
    backgroundColor: '#1a0f0f', 
    opacity: 0.9,
  },
  safeArea: {
    flex: 1,
  },
  
  // Header
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 16,
    width: 40, 
    height: 40,
    justifyContent:'center',
  },
  titleContainer: {
    marginTop: 0,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#cbd5e1', // Slate 300
    fontSize: 16,
    lineHeight: 22,
  },

  // Scroll Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 4,
  },

  // Tarjetas de Pasos
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.7)', // Slate 800 semi-transparente
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)', // Borde azul sutil
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  numberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDesc: {
    color: '#94a3b8', // Slate 400
    fontSize: 13,
    lineHeight: 18,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Footer
  footerContainer: {
    padding: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  redButton: {
    backgroundColor: '#b91c1c', // Rojo intenso
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#7f1d1d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  redButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // Banner Publicidad
  adBanner: {
    height: 60,
    width: '100%',
    backgroundColor: 'white',
    position: 'relative',
  },
  adOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  }
});