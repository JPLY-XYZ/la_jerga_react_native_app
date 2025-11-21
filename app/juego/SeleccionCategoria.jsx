import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, StyleSheet, Dimensions, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getCategoriasDB, addCategoriaDB,addPalabraDB } from 'lib/database';
import { useGame } from 'lib/GameContex';
  import { ToastAndroid } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const CATEGORY_METADATA = {
  Comida: { icon: 'food', color: '#1e293b' },
  Fruta: { icon: 'fruit-pineapple', color: '#1e293b' },
  Celebridades: { icon: 'star-face', color: '#6366f1' },
  Ciudades: { icon: 'city', color: '#3b82f6' },
  Paises: { icon: 'earth', color: '#8b5cf6' },
  'Cuerpo y Salud': { icon: 'heart-pulse', color: '#0ea5e9' },
  Marcas: { icon: 'tag', color: '#f59e0b' },
  Deportes: { icon: 'soccer', color: '#10b981' },
  Default: { icon: 'shape', color: '#64748b' },
  Custom: { icon: 'pencil-box-outline', color: '#334155' } // Color para las custom
};

export default function SeleccionCategoria() {
  const { setCategoria, configuracion } = useGame();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para Modales
  const [modalNuevaCat, setModalNuevaCat] = useState(false);
  const [nombreNuevaCat, setNombreNuevaCat] = useState('');

  const [modalAddPalabra, setModalAddPalabra] = useState(false);
  const [nuevaPalabra, setNuevaPalabra] = useState('');
  const [catEditando, setCatEditando] = useState(null); // { id, nombre }

  const cargarDatos = useCallback(async () => {
    try {
      const catsDB = await getCategoriasDB();
      const currentSelection = configuracion.categoria;

      const catsUI = catsDB.map(c => {
        // Si es custom, usamos metadatos especiales, si no, los del mapa o default
        let meta = CATEGORY_METADATA[c.nombre] || CATEGORY_METADATA.Default;
        if (c.is_custom === 1) meta = CATEGORY_METADATA.Custom;

        let isSelected = false;
        if (Array.isArray(currentSelection)) {
           isSelected = currentSelection.includes(c.nombre);
        } else if (typeof currentSelection === 'string') {
           isSelected = currentSelection === c.nombre;
        }

        return {
          ...c,
          icon: meta.icon,
          color: meta.color,
          type: c.premium === 1 ? 'premium' : 'standard',
          selected: isSelected
        };
      });

      setCategorias(catsUI);
    } catch (e) {
      console.error("Error cargando categorías:", e);
    } finally {
      setLoading(false);
    }
  }, [configuracion.categoria]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const toggleSelection = (id) => {
    setCategorias(categorias.map(cat => 
      cat.id === id ? { ...cat, selected: !cat.selected } : cat
    ));
  };

  // --- CREAR CATEGORÍA ---
  const handleCrearCategoria = async () => {
    if (nombreNuevaCat.trim().length === 0) return;
    try {
      await addCategoriaDB(nombreNuevaCat);
      setModalNuevaCat(false);
      setNombreNuevaCat('');
      cargarDatos(); // Recargar lista
    } catch (e) {
      Alert.alert("Error", "No se pudo crear la categoría (quizás ya existe).");
    }
  };

  // --- AÑADIR PALABRA A CATEGORÍA ---
  const abrirModalPalabras = (cat) => {
    setCatEditando(cat);
    setModalAddPalabra(true);
  };

  const handleGuardarPalabra = async () => {
    if (nuevaPalabra.trim().length === 0 || !catEditando) return;
    try {
      await addPalabraDB(nuevaPalabra, catEditando.id);


ToastAndroid.show(("Éxito", `Palabra "${nuevaPalabra}" añadida a ${catEditando.nombre}`), ToastAndroid.SHORT);
      setNuevaPalabra(''); // Limpiar input para añadir otra seguida
      cargarDatos(); // Actualizar contadores
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo guardar la palabra");
    }
  };

  const handleListo = () => {
    const seleccionadas = categorias.filter(c => c.selected);
    const nombres = seleccionadas.map(c => c.nombre);
    
    if (nombres.length === 0) setCategoria(null);
    else if (nombres.length === 1) setCategoria(nombres[0]);
    else setCategoria(nombres);
    
    router.back();
  };

  const selectedCount = categorias.filter(c => c.selected).length;

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bgLeft} />
      <View style={styles.bgRight} />

      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="chevron-left" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Selección de categoría</Text>
          <TouchableOpacity style={styles.nuevoButton} onPress={() => setModalNuevaCat(true)}>
            <Text style={styles.nuevoButtonText}>+Nuevo</Text>
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

          {loading && <Text style={{color:'white', textAlign:'center'}}>Cargando categorías...</Text>}

          <View style={styles.gridContainer}>
            {categorias.map((cat) => (
              <TouchableOpacity 
                key={cat.id} 
                onPress={() => toggleSelection(cat.id)}
                activeOpacity={0.8}
                style={[
                  styles.card, 
                  { backgroundColor: cat.color },
                  cat.selected && styles.cardSelectedBorder
                ]}
              >
                <View style={styles.cardInner}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{cat.nombre}</Text>
                  
                  <View style={styles.iconCircle}>
                     <MaterialCommunityIcons 
                        name={cat.icon} 
                        size={40} 
                        color={cat.type === 'premium' ? cat.color : '#f97316'} 
                     />
                  </View>
                  
                  <Text style={styles.cardCount}>{cat.count} palabras</Text>
                </View>

                {/* Icono Premium */}
                {cat.type === 'premium' && (
                  <View style={styles.premiumBadge}>
                    <MaterialIcons name="diamond" size={16} color="white" />
                  </View>
                )}

                {/* Botón Editar (Solo para Custom) */}
                {cat.is_custom === 1 && (
                  <TouchableOpacity 
                    style={styles.editBadge}
                    onPress={() => abrirModalPalabras(cat)}
                  >
                    <Feather name="plus" size={16} color="white" />
                  </TouchableOpacity>
                )}

                {/* Check Selection */}
                {cat.selected && (
                  <View style={styles.checkBadge}>
                    <Feather name="check" size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 80 }} />
        </ScrollView>

        <View style={styles.floatingFooter}>
           <TouchableOpacity style={styles.btnListo} onPress={handleListo}>
              <Text style={styles.btnListoText}>
                {selectedCount} paquetes seleccionados - Listo 
              </Text>
              <Feather name="arrow-right" size={20} color="white" style={{marginLeft: 8}} />
           </TouchableOpacity>
        </View>

        {/* --- MODAL: NUEVA CATEGORÍA --- */}
        <Modal animationType="fade" transparent={true} visible={modalNuevaCat} onRequestClose={() => setModalNuevaCat(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nueva Categoría</Text>
              <TextInput 
                style={styles.modalInput}
                value={nombreNuevaCat}
                onChangeText={setNombreNuevaCat}
                placeholder="Nombre de la categoría"
                placeholderTextColor="#64748b"
                autoFocus={true}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => setModalNuevaCat(false)}>
                  <Text style={styles.modalBtnTextCancel}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnSave]} onPress={handleCrearCategoria}>
                  <Text style={styles.modalBtnTextSave}>Crear</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* --- MODAL: AÑADIR PALABRA --- */}
        <Modal animationType="fade" transparent={true} visible={modalAddPalabra} onRequestClose={() => setModalAddPalabra(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Añadir Palabra</Text>
              <Text style={{color:'#94a3b8', marginBottom:10, textAlign:'center'}}>
                Añadiendo a: <Text style={{fontWeight:'bold', color:'white'}}>{catEditando?.nombre}</Text>
              </Text>
              <TextInput 
                style={styles.modalInput}
                value={nuevaPalabra}
                onChangeText={setNuevaPalabra}
                placeholder="Escribe una palabra..."
                placeholderTextColor="#64748b"
                autoFocus={true}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => setModalAddPalabra(false)}>
                  <Text style={styles.modalBtnTextCancel}>Cerrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnSave]} onPress={handleGuardarPalabra}>
                  <Text style={styles.modalBtnTextSave}>Añadir</Text>
                </TouchableOpacity>
              </View>
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
  bgRight: { position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%', backgroundColor: '#1a0f0f', opacity: 0.9 },
  safeArea: { flex: 1 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  nuevoButton: { backgroundColor: '#0ea5e9', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#7dd3fc' },
  nuevoButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 10 },
  premiumBanner: { backgroundColor: 'rgba(234, 179, 8, 0.2)', borderColor: '#eab308', borderWidth: 1, borderRadius: 16, padding: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  premiumText: { color: '#fef08a', flex: 1, marginRight: 8, fontSize: 13 },
  mejorarButton: { backgroundColor: '#eab308', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  mejorarButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: CARD_WIDTH, height: CARD_WIDTH * 1.2, borderRadius: 16, marginBottom: 16, padding: 12, position: 'relative', borderWidth: 2, borderColor: 'transparent', overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  cardSelectedBorder: { borderColor: '#ef4444' },
  cardInner: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  cardTitle: { color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center', zIndex: 2 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  cardCount: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  
  // Badges
  premiumBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#f59e0b', borderRadius: 20, padding: 4, borderWidth: 1, borderColor: 'white' },
  // Badge para editar (Esquina superior izquierda o derecha, he puesto izq para no chocar con premium/check si hubiera)
  editBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#64748b', borderRadius: 20, padding: 6, borderWidth: 1, borderColor: '#94a3b8', zIndex: 10 },
  checkBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: '#ef4444', borderRadius: 20, padding: 4, borderWidth: 2, borderColor: '#1e293b' },

  floatingFooter: { position: 'absolute', bottom: 70, left: 0, right: 0, alignItems: 'center', paddingHorizontal: 16 },
  btnListo: { backgroundColor: '#3b82f6', width: '100%', paddingVertical: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: "#3b82f6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8 },
  btnListoText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  // Estilos Modales (Reutilizados del anterior)
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