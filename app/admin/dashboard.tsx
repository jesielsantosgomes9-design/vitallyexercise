import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../styles/dashboardStyles';

// Ajuste para o IP da sua máquina na rede local
const API_URL = 'http://SEU_IP:8080/api';

type Chamado = {
  id: string;
  equipamento: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta';
  criadoEm: string;
  imagemUrl?: string;
};

type Inadimplente = {
  id: string;
  nome: string;
  diasAtraso: number;
  valor: number;
};

type PlanoDistribuicao = {
  nome: string;
  quantidade: number;
};

type ResumoAcademia = {
  totalAlunos: number;
  planosAtivos: number;
  pagamentosPendentes: number;
  novosAlunosMes: number;
  faturamentoMes: number;
};

export default function DashboardScreen() {
  const [resumo, setResumo] = useState<ResumoAcademia | null>(null);
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [inadimplentes, setInadimplentes] = useState<Inadimplente[]>([]);
  const [planosDistribuicao, setPlanosDistribuicao] = useState<PlanoDistribuicao[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [equipamento, setEquipamento] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState<'baixa' | 'media' | 'alta'>('media');
  const [imagem, setImagem] = useState<{ uri: string; nome: string; tipo: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    try {
      const [resumoRes, chamadosRes, inadimplentesRes, planosRes] = await Promise.all([
        fetch(`${API_URL}/academia/resumo`),
        fetch(`${API_URL}/chamados`),
        fetch(`${API_URL}/academia/inadimplentes`),
        fetch(`${API_URL}/academia/alunos-por-plano`),
      ]);

      setResumo(await resumoRes.json());
      setChamados(await chamadosRes.json());
      setInadimplentes(await inadimplentesRes.json());
      setPlanosDistribuicao(await planosRes.json());
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados da academia.');
    } finally {
      setCarregando(false);
    }
  }

  function abrirModal() {
    setEquipamento('');
    setDescricao('');
    setPrioridade('media');
    setImagem(null);
    setModalVisible(true);
  }

  async function escolherImagem() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos para anexar uma imagem.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      allowsEditing: true,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      const asset = resultado.assets[0];
      const nomeArquivo = asset.uri.split('/').pop() ?? 'chamado.jpg';
      const extensao = nomeArquivo.split('.').pop();
      setImagem({
        uri: asset.uri,
        nome: nomeArquivo,
        tipo: `image/${extensao === 'jpg' ? 'jpeg' : extensao}`,
      });
    }
  }

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar a foto.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      quality: 0.6,
      allowsEditing: true,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      const asset = resultado.assets[0];
      const nomeArquivo = asset.uri.split('/').pop() ?? 'chamado.jpg';
      const extensao = nomeArquivo.split('.').pop();
      setImagem({
        uri: asset.uri,
        nome: nomeArquivo,
        tipo: `image/${extensao === 'jpg' ? 'jpeg' : extensao}`,
      });
    }
  }

  async function enviarChamado() {
    if (!equipamento || !descricao) {
      Alert.alert('Atenção', 'Preencha o equipamento e a descrição do problema.');
      return;
    }

    setEnviando(true);
    try {
      // Envia como multipart/form-data quando há imagem anexada
      const formData = new FormData();
      formData.append('equipamento', equipamento);
      formData.append('descricao', descricao);
      formData.append('prioridade', prioridade);

      if (imagem) {
        formData.append('imagem', {
          uri: imagem.uri,
          name: imagem.nome,
          type: imagem.tipo,
        } as any);
      }

      const response = await fetch(`${API_URL}/chamados`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha ao abrir chamado');
      }

      const novoChamado = await response.json();
      setChamados((prev) => [novoChamado, ...prev]);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o chamado. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  function badgeStyle(p: Chamado['prioridade']) {
    if (p === 'alta') return { box: styles.badgeAlta, text: styles.badgeAltaText, label: 'Alta' };
    if (p === 'baixa') return { box: styles.badgeBaixa, text: styles.badgeBaixaText, label: 'Baixa' };
    return { box: styles.badgeMedia, text: styles.badgeMediaText, label: 'Média' };
  }

  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const maxPlano = planosDistribuicao.length
    ? Math.max(...planosDistribuicao.map((p) => p.quantidade))
    : 1;

  if (carregando) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#E63030" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Visão Geral</Text>
          <Text style={styles.headerSubtitle}>Acompanhe sua academia em tempo real</Text>
        </View>

        {/* Indicadores principais */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.statPositive]}>
              {resumo ? formatarMoeda(resumo.faturamentoMes) : '—'}
            </Text>
            <Text style={styles.statLabel}>Faturamento do mês</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.statPositive]}>
              {resumo?.novosAlunosMes ?? 0}
            </Text>
            <Text style={styles.statLabel}>Novos alunos no mês</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{resumo?.totalAlunos ?? 0}</Text>
            <Text style={styles.statLabel}>Alunos ativos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.statAccent]}>
              {inadimplentes.length}
            </Text>
            <Text style={styles.statLabel}>Alunos inadimplentes</Text>
          </View>
        </View>

        {/* Inadimplentes */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alunos inadimplentes</Text>
          </View>
          {inadimplentes.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum aluno inadimplente no momento.</Text>
          ) : (
            <FlatList
              data={inadimplentes}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.inadimplenteCard}>
                  <View>
                    <Text style={styles.inadimplenteNome}>{item.nome}</Text>
                    <Text style={styles.inadimplenteDias}>
                      {item.diasAtraso} {item.diasAtraso === 1 ? 'dia' : 'dias'} em atraso
                    </Text>
                  </View>
                  <Text style={styles.inadimplenteValor}>{formatarMoeda(item.valor)}</Text>
                </View>
              )}
            />
          )}
        </View>

        {/* Gráfico de alunos por plano */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alunos por plano</Text>
          </View>
          {planosDistribuicao.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum dado de plano disponível.</Text>
          ) : (
            <View style={styles.chartCard}>
              {planosDistribuicao.map((plano) => (
                <View key={plano.nome} style={styles.chartRow}>
                  <View style={styles.chartRowHeader}>
                    <Text style={styles.chartLabel}>{plano.nome}</Text>
                    <Text style={styles.chartValue}>{plano.quantidade}</Text>
                  </View>
                  <View style={styles.chartTrack}>
                    <View
                      style={[
                        styles.chartBar,
                        { width: `${(plano.quantidade / maxPlano) * 100}%` },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Chamados de manutenção */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chamados de manutenção</Text>
            <TouchableOpacity style={styles.addButton} onPress={abrirModal}>
              <Text style={styles.addButtonText}>+ Novo chamado</Text>
            </TouchableOpacity>
          </View>

          {chamados.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum chamado aberto no momento.</Text>
          ) : (
            <FlatList
              data={chamados}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const badge = badgeStyle(item.prioridade);
                return (
                  <View style={styles.chamadoCard}>
                    <View style={styles.chamadoHeader}>
                      <Text style={styles.chamadoEquipamento}>{item.equipamento}</Text>
                      <View style={[styles.badge, badge.box]}>
                        <Text style={[styles.badgeText, badge.text]}>{badge.label}</Text>
                      </View>
                    </View>
                    <Text style={styles.chamadoDescricao}>{item.descricao}</Text>
                    {item.imagemUrl ? (
                      <Image source={{ uri: item.imagemUrl }} style={styles.chamadoThumb} />
                    ) : null}
                    <View style={styles.chamadoFooter}>
                      <Text style={styles.chamadoData}>{item.criadoEm}</Text>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Abrir chamado de manutenção</Text>

            <Text style={styles.label}>Equipamento</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Esteira 3, Leg Press..."
              placeholderTextColor="#777"
              value={equipamento}
              onChangeText={setEquipamento}
            />

            <Text style={styles.label}>Descrição do problema</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o que está acontecendo com o equipamento"
              placeholderTextColor="#777"
              value={descricao}
              onChangeText={setDescricao}
              multiline
            />

            <Text style={styles.label}>Prioridade</Text>
            <View style={styles.prioridadeRow}>
              {(['baixa', 'media', 'alta'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.prioridadeOption,
                    prioridade === p && styles.prioridadeOptionSelected,
                  ]}
                  onPress={() => setPrioridade(p)}
                >
                  <Text
                    style={[
                      styles.prioridadeOptionText,
                      prioridade === p && styles.prioridadeOptionTextSelected,
                    ]}
                  >
                    {p === 'baixa' ? 'Baixa' : p === 'media' ? 'Média' : 'Alta'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Foto do equipamento (opcional)</Text>
            {imagem ? (
              <View style={styles.imagePreviewWrapper}>
                <Image source={{ uri: imagem.uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.imageRemoveButton}
                  onPress={() => setImagem(null)}
                >
                  <Text style={styles.imageRemoveButtonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePickerRow}>
                <TouchableOpacity style={styles.imagePickerButton} onPress={escolherImagem}>
                  <Text style={styles.imagePickerButtonText}>Escolher da galeria</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imagePickerButton} onPress={tirarFoto}>
                  <Text style={styles.imagePickerButtonText}>Tirar foto</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={enviarChamado}
                disabled={enviando}
              >
                {enviando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Abrir chamado</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}