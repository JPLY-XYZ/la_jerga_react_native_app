import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { initDB } from 'lib/database';

export default function MenuPrincipal() {

initDB();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* FONDO PARTIDO */}
      <View style={styles.bgLeft} />
      <View style={styles.bgRight} />

      <SafeAreaView style={styles.safeArea}>
        
        {/* HEADER ICONOS */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.push("Ajustes")} style={styles.iconButton}>
            <Ionicons name="settings-sharp" size={28} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity disabled={true} style={styles.iconButton}>
            <Ionicons name="star" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* ILUSTRACIÓN CENTRAL (Placeholder) */}
        <View style={styles.centerContent}>
          {/* Simulación de las siluetas de espías */}
          <View style={styles.illustrationPlaceholder}>
             <MaterialCommunityIcons name="incognito" size={200} color="#334190" style={styles.iconLeft} />
             <MaterialCommunityIcons name="incognito" size={200} color="#450a00" style={styles.iconRight} />
          </View>
        </View>

        {/* TEXTO Y BOTONES */}
        <View style={styles.footerContainer}>
          <Text style={styles.subTitle}>
            Juego de fiesta para 3+ jugadores
          </Text>

          <View style={styles.buttonContainer}>
            
            {/* Botón Activo */}
            <TouchableOpacity 
              onPress={() => router.push("juego/ConfiguracionDelJuego")} 
              style={styles.mainButton}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>NUEVO JUEGO</Text>
            </TouchableOpacity>

            {/* Botones Deshabilitados (Visualmente distintos) */}
            <TouchableOpacity 
              disabled={true} 
              style={[styles.mainButton, styles.disabledButton]}
            >
              <Text style={[styles.buttonText, styles.disabledText]}>CATEGORÍA</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              disabled={true} 
              style={[styles.mainButton, styles.disabledButton]}
            >
              <Text style={[styles.buttonText, styles.disabledText]}>INSTRUCCIONES</Text>
            </TouchableOpacity>

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
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Color base oscuro
    position: 'relative',
  },
  // Fondo Izquierdo (Azul Oscuro)
  bgLeft: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0,
    width: '50%',
    backgroundColor: '#0f172a',
  },
  // Fondo Derecho (Rojo Oscuro)
  bgRight: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0,
    width: '50%',
    backgroundColor: '#7f1d1d', // Rojo oscuro tipo "villano"
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.2)', // Fondo sutil para mejorar click
    borderRadius: 50,
  },

  // Centro
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationPlaceholder: {
    flexDirection: 'row',
    opacity: 0.6,
  },
  iconLeft: {
    marginRight: -20, // Superposición ligera
  },
  iconRight: {
    marginLeft: -20,
  },

  // Footer
  footerContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
    width: '100%',
  },
  subTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  buttonContainer: {
    width: '100%',
    gap: 16, // Espacio vertical entre botones
  },
  
  // Botones
  mainButton: {
    backgroundColor: '#3b82f6', // Blue 500
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    // Sombras
    shadowColor: '#1e3a8a', // Sombra azul oscura
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6, // Android
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 1.5, // tracking-widest
  },
  
  // Estilos para botones deshabilitados
  disabledButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.5)', // Azul más apagado
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: 'rgba(255, 255, 255, 0.7)',
  }
});