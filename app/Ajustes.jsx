import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, StatusBar, Alert, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { initDB, resetDB } from 'lib/database';

export default function Ajustes() {
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Función para el botón de reset
  const handleResetDatabase = () => {
    Alert.alert(
      "Restablecer Datos",
      "¿Estás seguro de que quieres borrar todos los jugadores y categorías personalizadas? Esto no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, borrar todo", 
          style: "destructive",
          onPress: async () => {
            const success = await resetDB();
            if (success) {
              ToastAndroid.show("CATEGORIAS Y USUARIOS RESETEADOS CORRECTAMENTE", ToastAndroid.SHORT);
              initDB();
            } else {
             ToastAndroid.show("ERROR", ToastAndroid.SHORT);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.overlay}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.8)" />
      
      <View style={styles.modalContainer}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <View style={{ width: 28 }} />
            <Text style={styles.headerTitle}>Configuración</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
               <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            
            {/* SECCIÓN PREMIUM */}
            <View style={styles.premiumSection}>
              <View style={{ marginBottom: 16 }}>
                 {[
                   { title: "Todos los paquetes", desc: "Acceso a todo el contenido premium", icon: "package" },
                   { title: "Sin anuncios", desc: "Disfruta de una experiencia sin publicidad", icon: "bell-off" },
                   { title: "Desbloquea categorías personalizadas", desc: "Categorías personalizadas ilimitadas", icon: "edit-2" }
                 ].map((item, index) => (
                   <View key={index} style={styles.premiumItem}>
                      <View style={styles.premiumIconContainer}>
                          <Feather name={item.icon} size={20} color="#60a5fa" />
                      </View>
                      <View style={styles.premiumTextContainer}>
                          <Text style={styles.premiumItemTitle}>{item.title}</Text>
                          <Text style={styles.premiumItemDesc}>{item.desc}</Text>
                      </View>
                      <Feather name="check" size={20} color="white" />
                   </View>
                 ))}
              </View>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Actualizar ahora</Text>
                <Feather name="arrow-right" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* LISTA DE OPCIONES */}
            <View style={styles.settingsList}>
              
              <TouchableOpacity style={styles.settingRow}>
                 <View style={styles.rowLeft}>
                   <Feather name="globe" size={22} color="#3b82f6" />
                   <Text style={styles.rowTitle}>Idioma</Text>
                 </View>
                 <View style={styles.rowRight}>
                   <Text style={styles.valueText}>🇪🇸 España</Text>
                   <Feather name="chevron-right" size={20} color="white" />
                 </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingRow}>
                 <View style={styles.rowLeft}>
                   <Feather name="refresh-ccw" size={22} color="#3b82f6" />
                   <Text style={styles.rowTitle}>Restaurar compra</Text>
                 </View>
                 <Feather name="chevron-right" size={20} color="white" />
              </TouchableOpacity>

              {/* SWITCHES */}
              <View style={styles.settingRow}>
                 <View style={styles.rowLeft}>
                   <Feather name="music" size={22} color="#3b82f6" />
                   <Text style={styles.rowTitle}>Música</Text>
                 </View>
                 <Switch 
                    value={musicEnabled} 
                    onValueChange={setMusicEnabled}
                    trackColor={{false: "#334155", true: "#3b82f6"}} 
                    thumbColor="white" 
                 />
              </View>

              <View style={styles.settingRow}>
                 <View style={styles.rowLeft}>
                   <FontAwesome5 name="volume-up" size={20} color="#3b82f6" style={{ width: 22, textAlign:'center' }} />
                   <Text style={styles.rowTitle}>Efectos de sonido</Text>
                 </View>
                 <Switch 
                    value={soundEnabled} 
                    onValueChange={setSoundEnabled}
                    trackColor={{false: "#334155", true: "#3b82f6"}} 
                    thumbColor="white" 
                 />
              </View>

              <View style={styles.settingRow}>
                 <View style={styles.rowLeft}>
                   <MaterialIcons name="touch-app" size={22} color="#3b82f6" />
                   <Text style={styles.rowTitle}>Vibración</Text>
                 </View>
                 <Switch 
                    value={vibrationEnabled} 
                    onValueChange={setVibrationEnabled}
                    trackColor={{false: "#334155", true: "#3b82f6"}} 
                    thumbColor="white" 
                 />
              </View>

              {/* BOTÓN RESET (NUEVO) */}
              <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 0 }]} onPress={handleResetDatabase}>
                 <View style={styles.rowLeft}>
                   <MaterialIcons name="delete-forever" size={24} color="#ef4444" />
                   <Text style={[styles.rowTitle, { color: '#ef4444' }]}>Restablecer datos de fábrica</Text>
                 </View>
              </TouchableOpacity>
              
            </View>
            
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* <View style={styles.adBanner}>
              <View style={styles.adContentLeft}>
                  <View style={styles.adIconWrapper}>
                      <Text style={styles.adIconText}>Temu</Text>
                  </View>
                  <View>
                      <Text style={styles.adTitle}>Compra como un multimillonario</Text>
                      <Text style={styles.adSubtitle}>Google Play</Text>
                  </View>
              </View>
              <TouchableOpacity style={styles.adButton}>
                  <Text style={styles.adButtonText}>INSTALAR</Text>
              </TouchableOpacity>
          </View> */}

        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '100%', height: '100%', backgroundColor: '#0f172a', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#1e293b', backgroundColor: '#0f172a' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', letterSpacing: 0.5 },
  closeButton: { padding: 4 },
  scrollView: { flex: 1, backgroundColor: '#0f172a' },
  premiumSection: { backgroundColor: '#1e293b', padding: 24 },
  premiumItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  premiumIconContainer: { width: 24, alignItems: 'center' },
  premiumTextContainer: { flex: 1, marginLeft: 12, paddingRight: 8 },
  premiumItemTitle: { color: 'white', fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  premiumItemDesc: { color: '#94a3b8', fontSize: 11 },
  upgradeButton: { backgroundColor: '#f59e0b', paddingVertical: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8, shadowColor: '#f59e0b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  upgradeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginRight: 8 },
  settingsList: { paddingBottom: 16 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#1e293b', backgroundColor: '#0f172a' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowTitle: { color: 'white', marginLeft: 16, fontSize: 16, fontWeight: '500' },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  valueText: { color: 'white', fontSize: 14, marginRight: 8 },
  adBanner: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8, height: 60 },
  adContentLeft: { flexDirection: 'row', alignItems: 'center' },
  adIconWrapper: { backgroundColor: '#f97316', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
  adIconText: { color: 'white', fontWeight: 'bold', fontSize: 10 },
  adTitle: { color: 'black', fontWeight: 'bold', fontSize: 12 },
  adSubtitle: { color: '#64748b', fontSize: 10 },
  adButton: { backgroundColor: '#2563eb', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20 },
  adButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 }
});