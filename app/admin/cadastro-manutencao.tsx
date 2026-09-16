import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { styles } from '@/styles/cadastroManutencao';

// Ajuste para o IP da sua máquina na rede local
const API_URL = 'http://SEU_IP:8080/api';

type FuncionarioManutencao = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  ativo: boolean;
};

export default function CadastroManutencaoScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [salvando, setSalvando] = useState(false);

  const [funcionarios, setFuncionarios] = useState<FuncionarioManutencao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  async function carregarFuncionarios() {
    setCarregando(true);
    try {
      const response = await fetch(`${API_URL}/manutencao/funcionarios`);
      const data = await response.json();
      setFuncionarios(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a lista de funcionários.');
    } finally {
      setCarregando(false);
    }
  }

  async function cadastrarFuncionario() {
    if (!nome || !email || !telefone || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    setSalvando(true);
    try {
      const response = await fetch(`${API_URL}/manutencao/funcionarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone, senha }),
      });

      if (!response.ok) {
        throw new Error('Falha ao cadastrar');
      }

      const novoFuncionario = await response.json();
      setFuncionarios((prev) => [novoFuncionario, ...prev]);
      setNome('');
      setEmail('');
      setTelefone('');
      setSenha('');
      Alert.alert('Sucesso', 'Funcionário de manutenção cadastrado.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o funcionário. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Equipe de Manutenção</Text>
        <Text style={styles.headerSubtitle}>Cadastre quem vai atender os chamados</Text>
      </View>

      <Text style={styles.label}>Nome completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do funcionário"
        placeholderTextColor="#777"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="funcionario@academia.com"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        placeholder="(00) 00000-0000"
        placeholderTextColor="#777"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Senha de acesso</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha para o funcionário entrar no app"
        placeholderTextColor="#777"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={cadastrarFuncionario}
        disabled={salvando}
      >
        {salvando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>CADASTRAR</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Funcionários cadastrados</Text>

      {carregando ? (
        <ActivityIndicator color="#E63030" />
      ) : funcionarios.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum funcionário cadastrado ainda.</Text>
      ) : (
        <FlatList
          data={funcionarios}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.funcionarioCard}>
              <View>
                <Text style={styles.funcionarioNome}>{item.nome}</Text>
                <Text style={styles.funcionarioContato}>{item.email} · {item.telefone}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{item.ativo ? 'Ativo' : 'Inativo'}</Text>
              </View>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}