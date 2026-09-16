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
import { styles } from '@/styles/loginStyles';

// Ajuste para o IP da sua máquina na rede local (quando o backend estiver pronto)
const API_URL = 'http://SEU_IP:8080/api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }

    setLoading(true);

    // ===== MODO TEMPORÁRIO =====
    // Backend ainda não está pronto, então pulamos a validação real
    // e navegamos direto para o dashboard, só para testar a navegação.
    setTimeout(() => {
      setLoading(false);
      router.replace('/admin/dashboard'); // ajuste o caminho conforme a pasta real do seu projeto
    }, 500);
    return;
    // ===== FIM DO MODO TEMPORÁRIO =====

    /* Quando o backend estiver pronto, apague o bloco acima
       (do "MODO TEMPORÁRIO" até o "return;") e descomente isto:

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      // TODO: salvar token/dados do admin (ex: AsyncStorage ou contexto de auth)

      router.replace('/admin/dashboard');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer login. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
    */
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>VITALLY<Text style={styles.logoTextAccent}>EXERCISE</Text></Text>
        <Text style={styles.subtitle}>Painel do Administrador</Text>
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
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#777"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Acesso restrito a administradores</Text>
    </KeyboardAvoidingView>
  );
}