import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Switch, StyleSheet, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGame } from 'lib/GameContex';
import { getPalabraAleatoria } from 'lib/database';

export default function ConfiguracionDelJuego() {
  const { 
    jugadores, 
    configuracion, 
    setNumImpostores, 
    iniciarPartida 
  } = useGame();

  const [timeEnabled, setTimeEnabled] = useState(true);
  const [modalImpostoresVisible, setModalImpostoresVisible] = useState(false);

  const handleJugar = async () => {
    try {
      const catSeleccionada = configuracion.categoria || 'Todas las categorías';
      const palabra = await getPalabraAleatoria(catSeleccionada);

      if (!palabra) {
        Alert.alert("Error", "No se encontraron palabras en la base de datos para esta selección.");
        return;
      }

      console.log(`Juego iniciado. Selección: ${JSON.stringify(catSeleccionada)}, Palabra: ${palabra}`);
      iniciarPartida(palabra);
      router.push("juego/RevealCardScreen");

    } catch (error) {
      console.error("Error al iniciar juego:", error);
      Alert.alert("Error", "Hubo un problema al acceder a la base de datos.");
    }
  };

  const getTextoCategoria = () => {
    if (!configuracion.categoria) return "Todas las categorías";
    if (Array.isArray(configuracion.categoria)) {
        return `${configuracion.categoria.length} categorías seleccionadas`;
    }
    return configuracion.categoria;
  };

  // CAMBIO: Eliminado el límite de mitad de jugadores.
  // Ahora el máximo es (Total Jugadores - 1) para asegurar que al menos haya un inocente.
  const maxImpostores = Math.max(1, jugadores.length - 1); 
  const opcionesImpostores = Array.from({ length: maxImpostores }, (_, i) => i + 1);

  const seleccionarImpostores = (num) => {
    setNumImpostores(num);
    setModalImpostoresVisible(false);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bgLeft} />
      <View style={styles.bgRight} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Feather name="chevron-left" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configuración del juego</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.premiumBanner}>
            <Text style={styles.premiumText}>Desbloquear categorías premium</Text>
            <TouchableOpacity style={styles.mejorarButton}>
              <Text style={styles.mejorarButtonText}>Mejorar</Text>
              <MaterialIcons name="diamond" size={14} color="white" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.gridContainer}>
            <TouchableOpacity 
              style={styles.counterCard}
              onPress={() => router.push("juego/ListaJugadores")}
            >
              <FontAwesome5 name="users" size={28} color="#60a5fa" style={styles.cardIcon} />
              <Text style={styles.cardLabel}>¿Cuántos jugadores?</Text>
              <Text style={styles.cardNumber}>{jugadores.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.counterCard}
                onPress={() => setModalImpostoresVisible(true)}
            >
                <FontAwesome5 name="user-secret" size={28} color="#60a5fa" style={styles.cardIcon} />
                <Text style={styles.cardLabel}>¿Cuántos impostores?</Text>
                <Text style={styles.cardNumber}>{configuracion.numImpostores}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeSection}>
            <View style={styles.timeInfo}>
              <MaterialIcons name="timer" size={28} color="#60a5fa" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.sectionTitleText}>Límite de tiempo</Text>
                <Text style={styles.subText}>2 minutos</Text>
              </View>
            </View>
            <View style={styles.timeControls}>
              <Switch
                value={timeEnabled}
                onValueChange={setTimeEnabled}
                trackColor={{ false: "#475569", true: "#3b82f6" }}
                thumbColor="#f4f4f5"
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], marginRight: 8 }}
              />
              <Feather name="chevron-right" size={24} color="#94a3b8" />
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Feather name="plus-square" size={20} color="#60a5fa" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitleText}>Modo de juego</Text>
          </View>

          <View style={styles.gridContainer}>
            <TouchableOpacity style={[styles.modeCard, styles.modeCardActive]}>
              <Text style={styles.modeIconText}>Tt</Text>
              <Text style={styles.modeTitle}>Word Game</Text>
              <Text style={styles.modeDescription}>Adivina quién no conoce la palabra secreta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modeCard, styles.modeCardInactive]}>
              <MaterialIcons name="question-answer" size={32} color="#60a5fa" style={{ marginBottom: 8 }} />
              <Text style={styles.modeTitle}>Question Game</Text>
              <Text style={styles.modeDescription}>Adivina quién recibió una pregunta diferente</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <MaterialIcons name="grid-view" size={20} color="#60a5fa" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitleText}>Categorías</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>Premium</Text>
            </View>
          </View>

          <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => router.push("juego/SeleccionCategoria")}
           >
              <View>
                <Text style={styles.categoryTitle}>{getTextoCategoria()}</Text>
                <View style={styles.categorySubtitleContainer}>
                  <Feather name="lock" size={12} color="#eab308" style={{ marginRight: 4 }} />
                  <Text style={styles.categorySubtitle}>+8 categorías premium disponibles</Text>
                </View>
              </View>
              <View style={styles.arrowButton}>
                <Feather name="chevron-right" size={20} color="#eab308" />
              </View>
          </TouchableOpacity>

        </ScrollView>

        <View style={styles.footerContainer}>
          <TouchableOpacity 
            onPress={handleJugar} 
            style={styles.startButton}
          >
            <Text style={styles.startButtonText}>Comenzar juego</Text>
          </TouchableOpacity>
        </View>

        {/* --- MODAL SELECTOR IMPOSTORES --- */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalImpostoresVisible}
          onRequestClose={() => setModalImpostoresVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Número de Impostores</Text>
              <Text style={styles.modalSubtitle}>
                Selecciona la cantidad
              </Text>
              
              <View style={styles.optionsContainer}>
                {opcionesImpostores.map((num) => (
                  <TouchableOpacity 
                    key={num}
                    style={[
                      styles.optionButton,
                      configuracion.numImpostores === num && styles.optionButtonSelected
                    ]}
                    onPress={() => seleccionarImpostores(num)}
                  >
                    <Text style={[
                      styles.optionText,
                      configuracion.numImpostores === num && styles.optionTextSelected
                    ]}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.modalCloseButton} 
                onPress={() => setModalImpostoresVisible(false)}
              >
                <Text style={styles.modalCloseText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#0f172a', position: 'relative' },
    bgLeft: { position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%', backgroundColor: '#0f172a' },
    bgRight: { position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%', backgroundColor: '#1a0f0f', opacity: 0.8 },
    safeArea: { flex: 1 },
    headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    iconButton: { padding: 4 },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
    premiumBanner: { backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: '#f59e0b', borderWidth: 1, borderRadius: 16, padding: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 24 },
    premiumText: { color: '#fef3c7', flex: 1, marginRight: 8, fontWeight: '500' },
    mejorarButton: { backgroundColor: '#f59e0b', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, flexDirection: 'row', alignItems: 'center' },
    mejorarButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    gridContainer: { flexDirection: 'row', gap: 16, marginBottom: 20 },
    counterCard: { flex: 1, backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: '#334155', borderWidth: 1, borderRadius: 16, padding: 20, alignItems: 'center', justifyContent: 'center', aspectRatio: 1 },
    cardIcon: { marginBottom: 8 },
    cardLabel: { color: '#cbd5e1', textAlign: 'center', fontSize: 12, marginBottom: 4 },
    cardNumber: { color: 'white', fontSize: 32, fontWeight: 'bold' },
    timeSection: { backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    timeInfo: { flexDirection: 'row', alignItems: 'center' },
    timeControls: { flexDirection: 'row', alignItems: 'center' },
    sectionTitleText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    subText: { color: '#94a3b8', fontSize: 12 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    modeCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', height: 140 },
    modeCardActive: { backgroundColor: '#1e293b', borderColor: '#475569', borderWidth: 2 },
    modeCardInactive: { backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: '#1e3a8a', borderWidth: 1 },
    modeIconText: { color: '#60a5fa', fontSize: 36, fontWeight: 'bold', marginBottom: 4 },
    modeTitle: { color: 'white', fontWeight: 'bold', marginBottom: 4 },
    modeDescription: { color: '#94a3b8', fontSize: 10, textAlign: 'center' },
    premiumBadge: { backgroundColor: '#f59e0b', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
    premiumBadgeText: { color: 'black', fontSize: 10, fontWeight: 'bold' },
    categoryCard: { backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: '#334155', borderWidth: 1, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
    categoryTitle: { color: 'white', fontWeight: '500', marginBottom: 4 },
    categorySubtitleContainer: { flexDirection: 'row', alignItems: 'center' },
    categorySubtitle: { color: '#eab308', fontSize: 12 },
    arrowButton: { backgroundColor: '#1e293b', padding: 8, borderRadius: 50 },
    footerContainer: { padding: 16, backgroundColor: 'rgba(15, 23, 42, 0.9)', borderTopWidth: 1, borderTopColor: '#1e293b' },
    startButton: { backgroundColor: '#3b82f6', paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    startButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
    
    // Estilos del Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '80%', backgroundColor: '#1e293b', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
    modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    modalSubtitle: { color: '#94a3b8', fontSize: 12, marginBottom: 20 },
    optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 20 },
    optionButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#475569' },
    optionButtonSelected: { backgroundColor: '#3b82f6', borderColor: '#60a5fa' },
    optionText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    optionTextSelected: { color: 'white' },
    modalCloseButton: { paddingVertical: 10, paddingHorizontal: 20 },
    modalCloseText: { color: '#cbd5e1', fontSize: 14 }
});