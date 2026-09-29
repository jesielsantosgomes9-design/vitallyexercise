import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/styles/loginStyles';

// Troque SEU_IP pelo IPv4 do seu PC (o backend roda na porta 8080)
const API_URL = 'http://192.168.1.7:8080/api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/usuario/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLimpo, senha }),
      });

      if (response.status === 401) {
        Alert.alert('Acesso negado', 'E-mail ou senha inválidos.');
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const cargo: string | undefined = data.usuario?.cargo;

      if (cargo === 'ADMIN') {
        router.replace('/admin/dashboard');
      } else if (cargo === 'TECNICO') {
        router.replace('/manutencao/chamados');
      } else {
        Alert.alert(
          'Acesso restrito',
          'Este aplicativo é exclusivo para administradores e equipe de manutenção.'
        );
      }
    } catch (e) {
      console.log('ERRO LOGIN:', e);
      Alert.alert(
        'Erro de conexão',
        'Não foi possível falar com o servidor. Confira o IP no app e se o backend está rodando.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          VITALLY<Text style={styles.logoTextAccent}>EXERCISE</Text>
        </Text>
        <Text style={styles.subtitle}>Gestão da academia</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seuemail@academia.com"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Senha</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={[styles.input, { paddingRight: 46 }]}
            placeholder="••••••••"
            placeholderTextColor="#777"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
            autoCapitalize="none"
            onSubmitEditing={handleLogin}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setMostrarSenha((v) => !v)}
          >
            <Ionicons name={mostrarSenha ? 'eye-off' : 'eye'} size={20} color="#8A8F98" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Acesso para administradores e equipe de manutenção
      </Text>
    </KeyboardAvoidingView>
  );
}