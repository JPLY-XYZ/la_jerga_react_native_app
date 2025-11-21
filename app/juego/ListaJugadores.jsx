import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGame } from 'lib/GameContex';

export default function ListaJugadores() {
  const { jugadores, agregarJugador, eliminarJugador, editarNombreJugador } = useGame();

  // Estados Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreTemp, setNombreTemp] = useState('');
  const [idEditando, setIdEditando] = useState(null);

  // Eliminar el último de la lista visual
  const eliminarUltimo = () => {
    if (jugadores.length > 0) {
      // Cogemos el último elemento del array y lo borramos
      const ultimoJugador = jugadores[jugadores.length - 1];
      eliminarJugador(ultimoJugador.id);
    } else {
      Alert.alert("Vacío", "No hay jugadores para eliminar.");
    }
  };

  const abrirModalEditar = (id, nombreActual) => {
    setIdEditando(id);
    setNombreTemp(nombreActual);
    setModalVisible(true);
  };

  const guardarEdicion = () => {
    if (idEditando !== null && nombreTemp.trim().length > 0) {
      editarNombreJugador(idEditando, nombreTemp);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bgLeft} />
      <View style={styles.bgRight} />

      <SafeAreaView style={styles.safeArea}>
        
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="chevron-left" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Jugadores</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* INFO */}
        <View style={styles.infoBar}>
          <View style={styles.infoBarLeft}>
            <FontAwesome5 name="users" size={16} color="#60a5fa" style={{ marginRight: 8 }} />
            <Text style={styles.infoBarText}>Jugadores: {jugadores.length}</Text>
          </View>
          <Text style={styles.infoBarTextRight}>3-20</Text>
        </View>

        {/* LISTA */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.listContent}>
          {jugadores.map((item) => (
            <View key={item.id} style={styles.playerCard}>
              <View style={styles.playerNumberBadge}>
                {/* Usamos el ID solo como referencia visual, o el índice + 1 si prefieres orden secuencial */}
                <Text style={styles.playerNumberText}>{item.id}</Text>
              </View>
              <Text style={styles.playerName} numberOfLines={1}>{item.nombre}</Text>
              
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => eliminarJugador(item.id)}>
                  <MaterialCommunityIcons name="trash-can" size={22} color="#ef4444" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => abrirModalEditar(item.id, item.nombre)}>
                  <MaterialCommunityIcons name="pencil" size={22} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* FOOTER BOTONES ACCIÓN */}
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.btnEliminar} onPress={eliminarUltimo} activeOpacity={0.7}>
            <MaterialCommunityIcons name="account-remove" size={24} color="#ef4444" style={{ marginRight: 8 }} />
            <Text style={styles.btnEliminarText}>Eliminar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnAgregar} onPress={agregarJugador} activeOpacity={0.7}>
            <MaterialCommunityIcons name="account-plus" size={24} color="#60a5fa" style={{ marginRight: 8 }} />
            <Text style={styles.btnAgregarText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* MODAL EDITAR */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Nombre</Text>
              <TextInput 
                style={styles.modalInput}
                value={nombreTemp}
                onChangeText={setNombreTemp}
                autoFocus={true}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalBtnTextCancel}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnSave]} onPress={guardarEdicion}>
                  <Text style={styles.modalBtnTextSave}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* BANNER */}
        <View style={styles.adBanner}>
           <View style={styles.adContentLeft}>
              <View style={styles.adIconWrapper}><Text style={styles.adIconText}>Ad</Text></View>
              <View><Text style={styles.adTitle}>Publicidad</Text></View>
           </View>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#0f172a', position: 'relative' },
  bgLeft: { position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%', backgroundColor: '#0f172a' },
  bgRight: { position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%', backgroundColor: '#1a0f0f', opacity: 0.9 },
  safeArea: { flex: 1 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: '400' },
  infoBar: { backgroundColor: '#1e293b', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#334155' },
  infoBarLeft: { flexDirection: 'row', alignItems: 'center' },
  infoBarText: { color: '#94a3b8', fontSize: 14 },
  infoBarTextRight: { color: '#94a3b8', fontSize: 14 },
  scrollView: { flex: 1 },
  listContent: { padding: 16 },
  playerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  playerNumberBadge: { backgroundColor: '#38bdf8', width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  playerNumberText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  playerName: { flex: 1, color: 'white', fontSize: 16, fontWeight: '400' },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { padding: 8, marginLeft: 4 },
  footerContainer: { flexDirection: 'row', padding: 16, gap: 16, paddingBottom: 10 },
  btnEliminar: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(239, 68, 68, 0.15)', borderWidth: 1, borderColor: '#ef4444', paddingVertical: 14, borderRadius: 12 },
  btnEliminarText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 },
  btnAgregar: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(96, 165, 250, 0.15)', borderWidth: 1, borderColor: '#60a5fa', paddingVertical: 14, borderRadius: 12 },
  btnAgregarText: { color: '#60a5fa', fontWeight: 'bold', fontSize: 16 },
  adBanner: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8, height: 60 },
  adContentLeft: { flexDirection: 'row', alignItems: 'center' },
  adIconWrapper: { backgroundColor: '#f97316', padding: 4, borderRadius: 4, marginRight: 8 },
  adIconText: { color: 'white', fontWeight: 'bold', fontSize: 10 },
  adTitle: { color: 'black', fontWeight: 'bold', fontSize: 12 },
  adSubtitle: { color: '#64748b', fontSize: 10 },
  adButton: { backgroundColor: '#2563eb', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20 },
  adButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#1e293b', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  modalInput: { backgroundColor: '#0f172a', color: 'white', padding: 12, borderRadius: 8, fontSize: 16, marginBottom: 24, borderWidth: 1, borderColor: '#334155' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modalBtnCancel: { backgroundColor: '#334155' },
  modalBtnSave: { backgroundColor: '#3b82f6' },
  modalBtnTextCancel: { color: '#cbd5e1', fontWeight: '600' },
  modalBtnTextSave: { color: 'white', fontWeight: 'bold' }
});