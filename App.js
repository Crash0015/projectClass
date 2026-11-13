import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Modal,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// Datos simulados de candidatos con métricas Big Five y Embeddings
const CANDIDATES_DATA = [
  {
    id: '1',
    name: 'Valeria Mendoza',
    handle: '@valemendoza.dev',
    role: 'Product Designer & Frontend',
    socialSummary: 'Contenido sobre diseño UI, hackathons, viajes culturales y productividad.',
    embeddingMatch: 94,
    embeddingKeywords: ['Innovación', 'Liderazgo visual', 'Trabajo ágil', 'Empatía'],
    bigFive: {
      openness: 92,
      conscientiousness: 85,
      extraversion: 78,
      agreeableness: 88,
      neuroticism: 24,
    },
    avatarColor: '#6C5CE7',
    initials: 'VM',
  },
  {
    id: '2',
    name: 'Mateo Villacís',
    handle: '@mateotech_ec',
    role: 'Backend & Cloud Architect',
    socialSummary: 'Posts sobre servidores Linux, automatización, café de especialidad y ciclismo.',
    embeddingMatch: 87,
    embeddingKeywords: ['Pensamiento analítico', 'Resolución', 'Disciplina', 'Autonomía'],
    bigFive: {
      openness: 80,
      conscientiousness: 95,
      extraversion: 52,
      agreeableness: 74,
      neuroticism: 19,
    },
    avatarColor: '#00B894',
    initials: 'MV',
  },
  {
    id: '3',
    name: 'Camila Paredes',
    handle: '@cami.growth',
    role: 'Growth & Community Lead',
    socialSummary: 'Reels de tendencias digitales, storytelling de marca, eventos y networking.',
    embeddingMatch: 91,
    embeddingKeywords: ['Comunicación', 'Adaptabilidad', 'Persuasión', 'Creatividad'],
    bigFive: {
      openness: 89,
      conscientiousness: 79,
      extraversion: 96,
      agreeableness: 90,
      neuroticism: 31,
    },
    avatarColor: '#E17055',
    initials: 'CP',
  },
];

const PLATFORMS = [
  { id: 'tiktok', name: 'TikTok', color: '#000000', tag: 'Video & Tendencias' },
  { id: 'instagram', name: 'Instagram', color: '#E1306C', tag: 'Visual & Lifestyle' },
  { id: 'facebook', name: 'Facebook', color: '#1877F2', tag: 'Comunidades & Red' },
];

export default function App() {
  // Estados de Autenticación
  const [userSession, setUserSession] = useState(null); // null = no logueado
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Estados de Flujo de Reclutamiento
  const [step, setStep] = useState('select'); // 'select' | 'matching'
  const [selectedPlatform, setSelectedPlatform] = useState('tiktok');
  const [targetRole, setTargetRole] = useState('Tech Lead / Innovador');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedCandidate, setMatchedCandidate] = useState(null);

  const currentCandidate = CANDIDATES_DATA[currentIndex];

  // Lógica de Inicio de Sesión Simulado
  const handleLogin = () => {
    setLoginError('');
    if (!email.trim() || !password.trim()) {
      setLoginError('Por favor ingresa tu correo corporativo y contraseña.');
      return;
    }
    if (!email.includes('@')) {
      setLoginError('Ingresa un formato de correo válido (ej. reclutador@empresa.com).');
      return;
    }
    if (password.length < 4) {
      setLoginError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    const nameFromEmail = email.split('@')[0];
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

    setUserSession({
      email: email.trim().toLowerCase(),
      name: formattedName,
      role: 'Senior Talent Recruiter',
    });
    setStep('select');
  };

  const fillDemoCredentials = () => {
    setEmail('reclutador@talentai.ec');
    setPassword('123456');
    setLoginError('');
  };

  // Lógica de Cerrar Sesión
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir de tu cuenta de reclutador?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            setUserSession(null);
            setEmail('');
            setPassword('');
            setStep('select');
            setCurrentIndex(0);
            setMatchedCandidate(null);
          },
        },
      ]
    );
  };

  const handleNextCandidate = (isMatch) => {
    if (isMatch) {
      setMatchedCandidate(currentCandidate);
    } else {
      advanceCard();
    }
  };

  const advanceCard = () => {
    setMatchedCandidate(null);
    if (currentIndex + 1 < CANDIDATES_DATA.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const renderProgressBar = (label, value, color) => (
    <View style={styles.traitRow} key={label}>
      <View style={styles.traitHeader}>
        <Text style={styles.traitLabel}>{label}</Text>
        <Text style={styles.traitValue}>{value}%</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
    </View>
  );

  // ==========================================
  // PANTALLA 0: LOGIN COMPLETO
  // ==========================================
  if (!userSession) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.loginContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>AI</Text>
            </View>
            <Text style={styles.badge}>TALENT MATCH ENGINE</Text>
            <Text style={styles.loginTitle}>Iniciar Sesión</Text>
            <Text style={styles.loginSubtitle}>
              Accede al panel de reclutamiento psicométrico basado en Big Five y Embeddings.
            </Text>

            {loginError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{loginError}</Text>
              </View>
            ) : null}

            <Text style={styles.inputLabel}>Correo Corporativo</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="reclutador@empresa.com"
              placeholderTextColor="#7F8FA6"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Contraseña</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#7F8FA6"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeText}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Ingresar al Sistema →</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.demoButton} onPress={fillDemoCredentials}>
              <Text style={styles.demoButtonText}>⚡ Autocompletar Credenciales Demo</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ==========================================
  // PANTALLA 1: SELECCIÓN DE FUENTE SOCIAL
  // ==========================================
  if (step === 'select') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        {/* Barra de Sesión Activa */}
        <View style={styles.sessionBar}>
          <View>
            <Text style={styles.sessionWelcome}>Hola, {userSession.name}</Text>
            <Text style={styles.sessionEmail}>{userSession.email}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.setupContainer}>
          <Text style={styles.badge}>CONFIGURACIÓN DE BÚSQUEDA</Text>
          <Text style={styles.title}>Reclutamiento por Huella Digital</Text>
          <Text style={styles.subtitle}>
            Selecciona la red social de origen para extraer vectores semánticos (Embeddings) y rasgos de personalidad (Big Five).
          </Text>

          <Text style={styles.sectionTitle}>1. Fuente de Datos Sociales</Text>
          <View style={styles.platformGrid}>
            {PLATFORMS.map((p) => {
              const active = selectedPlatform === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.platformCard,
                    active && { borderColor: '#6C5CE7', backgroundColor: '#1E1B3A' },
                  ]}
                  onPress={() => setSelectedPlatform(p.id)}
                >
                  <View style={[styles.platformDot, { backgroundColor: p.color }]} />
                  <Text style={styles.platformName}>{p.name}</Text>
                  <Text style={styles.platformTag}>{p.tag}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>2. Vacante / Vector Objetivo</Text>
          <TextInput
            style={styles.input}
            value={targetRole}
            onChangeText={setTargetRole}
            placeholder="Ej. UX Researcher, Líder Comercial..."
            placeholderTextColor="#7F8FA6"
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Pipeline Simulado:</Text>
            <Text style={styles.infoText}>
              • Extracción simulada de bio, captions y hashtags en {selectedPlatform.toUpperCase()}.{'\n'}
              • Generación de Embedding de 1536 dimensiones.{'\n'}
              • Inferencia psicométrica modelo OCEAN (Big Five).
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setStep('matching')}
          >
            <Text style={styles.primaryButtonText}>Analizar y Buscar Match →</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ==========================================
  // PANTALLA 2: INTERFAZ TIPO MATCH
  // ==========================================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setStep('select')}>
          <Text style={styles.backText}>← Fuente: {selectedPlatform.toUpperCase()}</Text>
        </TouchableOpacity>
        <Text style={styles.counterText}>
          {currentIndex + 1}/{CANDIDATES_DATA.length}
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.topLogoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.cardScroll}>
        <View style={styles.candidateCard}>
          {/* Cabecera del Candidato */}
          <View style={styles.cardHeader}>
            <View style={[styles.avatar, { backgroundColor: currentCandidate.avatarColor }]}>
              <Text style={styles.avatarText}>{currentCandidate.initials}</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.candidateName}>{currentCandidate.name}</Text>
              <Text style={styles.candidateHandle}>{currentCandidate.handle}</Text>
              <Text style={styles.candidateRole}>{currentCandidate.role}</Text>
            </View>
          </View>

          {/* Score de Embeddings */}
          <View style={styles.embeddingBox}>
            <View style={styles.embeddingHeader}>
              <Text style={styles.embeddingTitle}>Similitud Semántica (Embeddings)</Text>
              <Text style={styles.embeddingScore}>{currentCandidate.embeddingMatch}%</Text>
            </View>
            <Text style={styles.embeddingSub}>
              Coseno de similitud vs. "{targetRole}"
            </Text>
            <View style={styles.tagsContainer}>
              {currentCandidate.embeddingKeywords.map((kw) => (
                <View key={kw} style={styles.tag}>
                  <Text style={styles.tagText}>#{kw}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Resumen extraído de la red social */}
          <Text style={styles.summaryLabel}>Actividad Analizada ({selectedPlatform}):</Text>
          <Text style={styles.summaryText}>{currentCandidate.socialSummary}</Text>

          {/* Modelo Big Five (OCEAN) */}
          <Text style={styles.bigFiveTitle}>Perfil Psicométrico Big Five (OCEAN)</Text>
          {renderProgressBar('Apertura (Openness)', currentCandidate.bigFive.openness, '#6C5CE7')}
          {renderProgressBar('Responsabilidad (Conscientiousness)', currentCandidate.bigFive.conscientiousness, '#00B894')}
          {renderProgressBar('Extraversión (Extraversion)', currentCandidate.bigFive.extraversion, '#FDCB6E')}
          {renderProgressBar('Amabilidad (Agreeableness)', currentCandidate.bigFive.agreeableness, '#0984E3')}
          {renderProgressBar('Estabilidad Emocional', 100 - currentCandidate.bigFive.neuroticism, '#E17055')}
        </View>
      </ScrollView>

      {/* Botones de Match / Descarte */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.passBtn]}
          onPress={() => handleNextCandidate(false)}
        >
          <Text style={styles.passIcon}>✕</Text>
          <Text style={styles.actionLabel}>Descartar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.matchBtn]}
          onPress={() => handleNextCandidate(true)}
        >
          <Text style={styles.matchIcon}>♥</Text>
          <Text style={styles.actionLabel}>Hacer Match</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Match Confirmado */}
      <Modal visible={!!matchedCandidate} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalBadge}>¡COMPATIBILIDAD ÓPTIMA!</Text>
            <Text style={styles.modalTitle}>Match con {matchedCandidate?.name}</Text>
            <Text style={styles.modalDesc}>
              Reclutador {userSession.name}: afinidad vectorial del {matchedCandidate?.embeddingMatch}% y perfil Big Five alineado con {targetRole}.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={advanceCard}>
              <Text style={styles.primaryButtonText}>Continuar Evaluando</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F111A' },
  // Estilos de Login
  loginContainer: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: { color: '#FFFFFF', fontSize: 26, fontWeight: '900' },
  loginTitle: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', marginBottom: 8 },
  loginSubtitle: { color: '#A4B0BE', fontSize: 14, lineHeight: 20, marginBottom: 24 },
  inputLabel: { color: '#D1D8E0', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191C2B',
    borderWidth: 1,
    borderColor: '#2C3149',
    borderRadius: 12,
    marginBottom: 24,
  },
  passwordInput: { flex: 1, padding: 14, color: '#FFFFFF', fontSize: 15 },
  eyeButton: { paddingHorizontal: 14 },
  eyeText: { color: '#A29BFE', fontWeight: '600', fontSize: 13 },
  errorBox: {
    backgroundColor: '#2C1D27',
    borderWidth: 1,
    borderColor: '#FF4757',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: '#FF6B81', fontSize: 13 },
  demoButton: {
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2C3149',
    backgroundColor: '#161926',
    alignItems: 'center',
  },
  demoButtonText: { color: '#A29BFE', fontWeight: '600', fontSize: 14 },

  // Barra de Sesión
  sessionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#161926',
    borderBottomWidth: 1,
    borderBottomColor: '#232842',
  },
  sessionWelcome: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  sessionEmail: { color: '#7F8FA6', fontSize: 11 },
  logoutBtn: {
    backgroundColor: '#2C1D27',
    borderWidth: 1,
    borderColor: '#FF4757',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutBtnText: { color: '#FF6B81', fontWeight: '700', fontSize: 12 },

  // Estilos Generales
  setupContainer: { padding: 24, paddingTop: 20 },
  badge: {
    color: '#A29BFE',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', marginBottom: 10 },
  subtitle: { color: '#A4B0BE', fontSize: 14, lineHeight: 20, marginBottom: 24 },
  sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  platformGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  platformCard: {
    width: '31%',
    backgroundColor: '#191C2B',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#2C3149',
    alignItems: 'center',
  },
  platformDot: { width: 14, height: 14, borderRadius: 7, marginBottom: 8 },
  platformName: { color: '#FFFFFF', fontWeight: '700', fontSize: 13, marginBottom: 2 },
  platformTag: { color: '#7F8FA6', fontSize: 10, textAlign: 'center' },
  input: {
    backgroundColor: '#191C2B',
    borderWidth: 1,
    borderColor: '#2C3149',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 18,
  },
  infoBox: {
    backgroundColor: '#161926',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#6C5CE7',
    marginBottom: 24,
  },
  infoTitle: { color: '#FFFFFF', fontWeight: '700', marginBottom: 6, fontSize: 13 },
  infoText: { color: '#A4B0BE', fontSize: 12, lineHeight: 19 },
  primaryButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2235',
  },
  backText: { color: '#A29BFE', fontWeight: '600', fontSize: 14 },
  counterText: { color: '#7F8FA6', fontSize: 13 },
  topLogoutText: { color: '#FF6B81', fontWeight: '700', fontSize: 13 },
  cardScroll: { padding: 16 },
  candidateCard: {
    backgroundColor: '#191C2B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2C3149',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  headerInfo: { flex: 1 },
  candidateName: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  candidateHandle: { color: '#A29BFE', fontSize: 13, marginBottom: 2 },
  candidateRole: { color: '#A4B0BE', fontSize: 13 },
  embeddingBox: {
    backgroundColor: '#121521',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2F4A',
  },
  embeddingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  embeddingTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  embeddingScore: { color: '#00B894', fontWeight: '800', fontSize: 20 },
  embeddingSub: { color: '#7F8FA6', fontSize: 12, marginTop: 2, marginBottom: 10 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: '#232842',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: { color: '#A29BFE', fontSize: 11, fontWeight: '600' },
  summaryLabel: { color: '#FFFFFF', fontWeight: '700', fontSize: 13, marginBottom: 4 },
  summaryText: { color: '#A4B0BE', fontSize: 13, lineHeight: 18, marginBottom: 18 },
  bigFiveTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 15, marginBottom: 12 },
  traitRow: { marginBottom: 10 },
  traitHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  traitLabel: { color: '#D1D8E0', fontSize: 12 },
  traitValue: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  barBackground: { height: 7, backgroundColor: '#2C3149', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#1E2235',
    backgroundColor: '#0F111A',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 30,
    gap: 8,
  },
  passBtn: { backgroundColor: '#2C1D27', borderWidth: 1, borderColor: '#FF4757' },
  matchBtn: { backgroundColor: '#16302B', borderWidth: 1, borderColor: '#00B894' },
  passIcon: { color: '#FF4757', fontSize: 18, fontWeight: '800' },
  matchIcon: { color: '#00B894', fontSize: 18, fontWeight: '800' },
  actionLabel: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#191C2B',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#6C5CE7',
  },
  modalBadge: { color: '#00B894', fontWeight: '800', fontSize: 12, marginBottom: 8 },
  modalTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginBottom: 10 },
  modalDesc: { color: '#A4B0BE', fontSize: 14, lineHeight: 20, marginBottom: 24 },
});