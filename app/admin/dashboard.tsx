import { DashboardStatsGrid } from '@/components/DashboardStatsGrid';
import { styles } from '@/styles/dashboardStyles';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Ajuste para o IP da sua máquina na rede local.
// O backend roda na porta 8080 (com.belval.academia).
const API_URL = 'http://192.168.1.7:8080/api';

// ===== Tipos batendo com as entidades reais do backend =====

type Equipamento = {
  id: number;
  nome: string;
  marca?: string;
  localizacao?: string;
  situacao: 'ATIVO' | 'MANUTENCAO' | 'INATIVO';
};

type Prioridade = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
type StatusChamado = 'ABERTO' | 'EM_ANDAMENTO' | 'FINALIZADO';

type Chamado = {
  id: number;
  equipamento: Equipamento;
  problema: string;
  fotoBase64?: string;
  data: string;
  hora?: string;
  prioridade: Prioridade;
  responsavel?: string;
  status: StatusChamado;
  observacoes?: string;
};

type Aluno = {
  id: number;
  nome: string;
  plano?: string;
  situacao: string;
};

type Mensalidade = {
  id: number;
  aluno: { id: number; nome: string };
  dataVencimento: string;
  dataPagamento?: string;
  valor: number;
  status: 'PENDENTE' | 'PAGA' | 'ATRASADA';
};

// Exatamente os campos devolvidos por GET /api/dashboard
type DashboardIndicadores = {
  totalAlunos: number;
  alunosAtivos: number;
  alunosInadimplentes: number;
  mensalidadesPendentes: number;
  mensalidadesAVencer: number;
  aReceber: number;
  receitaMes: number;
  despesaMes: number;
  saldoMes: number;
  manutencoesPendentes: number;
  frequenciaHoje: number;
};

export default function DashboardScreen() {
  const router = useRouter();

  const [indicadores, setIndicadores] = useState<DashboardIndicadores | null>(null);
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState<Equipamento | null>(null);
  const [problema, setProblema] = useState('');
  const [prioridade, setPrioridade] = useState<Prioridade>('MEDIA');
  const [imagem, setImagem] = useState<{ uri: string; base64: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    try {
      const [dashRes, chamadosRes, alunosRes, mensalidadesRes, equipamentosRes] = await Promise.all([
        fetch(`${API_URL}/dashboard`),
        fetch(`${API_URL}/manutencao/chamados`),
        fetch(`${API_URL}/aluno`),
        fetch(`${API_URL}/mensalidade`),
        fetch(`${API_URL}/manutencao/equipamentos`),
      ]);

      setIndicadores(await dashRes.json());
      setChamados(await chamadosRes.json());
      setAlunos(await alunosRes.json());
      setMensalidades(await mensalidadesRes.json());
      setEquipamentos(await equipamentosRes.json());
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados da academia.');
    } finally {
      setCarregando(false);
    }
  }

  // ===== Inadimplentes: calculado a partir de /api/mensalidade =====
  // (não existe endpoint pronto pra isso no backend)
  const hoje = new Date();
  const inadimplentes = mensalidades
    .filter((m) => m.status !== 'PAGA' && new Date(m.dataVencimento) < hoje)
    .map((m) => ({
      id: m.id,
      nome: m.aluno?.nome ?? 'Aluno não identificado',
      diasAtraso: Math.floor((hoje.getTime() - new Date(m.dataVencimento).getTime()) / 86400000),
      valor: m.valor,
    }))
    .sort((a, b) => b.diasAtraso - a.diasAtraso);

  // ===== Alunos por plano: calculado a partir de /api/aluno =====
  // (não existe endpoint pronto pra isso no backend)
  const planosMap = new Map<string, number>();
  alunos.forEach((a) => {
    const plano = a.plano?.trim() || 'Sem plano definido';
    planosMap.set(plano, (planosMap.get(plano) ?? 0) + 1);
  });
  const planosDistribuicao = Array.from(planosMap.entries()).map(([nome, quantidade]) => ({
    nome,
    quantidade,
  }));
  const maxPlano = planosDistribuicao.length
    ? Math.max(...planosDistribuicao.map((p) => p.quantidade))
    : 1;

  function abrirModal() {
    setEquipamentoSelecionado(null);
    setProblema('');
    setPrioridade('MEDIA');
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
      quality: 0.5,
      allowsEditing: true,
      base64: true, // o backend guarda a foto como texto base64 (fotoBase64)
    });

    if (!resultado.canceled && resultado.assets.length > 0 && resultado.assets[0].base64) {
      setImagem({ uri: resultado.assets[0].uri, base64: resultado.assets[0].base64 });
    }
  }

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar a foto.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      allowsEditing: true,
      base64: true,
    });

    if (!resultado.canceled && resultado.assets.length > 0 && resultado.assets[0].base64) {
      setImagem({ uri: resultado.assets[0].uri, base64: resultado.assets[0].base64 });
    }
  }

  async function enviarChamado() {
    if (!equipamentoSelecionado || !problema) {
      Alert.alert('Atenção', 'Selecione o equipamento e descreva o problema.');
      return;
    }

    setEnviando(true);
    try {
      const agora = new Date();
      const response = await fetch(`${API_URL}/manutencao/chamados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipamento: { id: equipamentoSelecionado.id },
          problema,
          prioridade,
          data: agora.toISOString().split('T')[0], // yyyy-MM-dd
          hora: agora.toTimeString().split(' ')[0], // HH:mm:ss
          tipo: 'CORRETIVA',
          fotoBase64: imagem?.base64 ?? null,
        }),
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

  function badgeStyle(p: Prioridade) {
    if (p === 'CRITICA') return { box: styles.badgeCritica, text: styles.badgeCriticaText, label: 'Crítica' };
    if (p === 'ALTA') return { box: styles.badgeAlta, text: styles.badgeAltaText, label: 'Alta' };
    if (p === 'BAIXA') return { box: styles.badgeBaixa, text: styles.badgeBaixaText, label: 'Baixa' };
    return { box: styles.badgeMedia, text: styles.badgeMediaText, label: 'Média' };
  }

  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

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

        {/* Botões de acesso rápido */}
        <View style={{ flexDirection: 'row', marginBottom: 24 }}>
          <TouchableOpacity
            style={[styles.addButton, { flex: 1, marginRight: 8, alignItems: 'center' }]}
            onPress={() => router.push('/manutencao/chamados')}
          >
            <Text style={styles.addButtonText}>Tela de Manutenção</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addButton, { flex: 1, alignItems: 'center' }]}
            onPress={() => router.push('/admin/cadastro-manutencao')}
          >
            <Text style={styles.addButtonText}>Cadastrar Manutenção</Text>
          </TouchableOpacity>
        </View>

        {/* Grade de indicadores — vem 100% de GET /api/dashboard */}
        {indicadores && <DashboardStatsGrid data={indicadores}/>}

        {/* Inadimplentes (calculado a partir de /api/mensalidade) */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alunos inadimplentes</Text>
          </View>
          {inadimplentes.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum aluno inadimplente no momento.</Text>
          ) : (
            <FlatList
              data={inadimplentes}
              keyExtractor={(item) => String(item.id)}
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

        {/* Alunos por plano (calculado a partir de /api/aluno) */}
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
                      style={[styles.chartBar, { width: `${(plano.quantidade / maxPlano) * 100}%` }]}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Chamados de manutenção — GET/POST /api/manutencao/chamados */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chamados de manutenção</Text>
            <TouchableOpacity style={styles.addButton} onPress={abrirModal}>
              <Text style={styles.addButtonText}>+ Novo chamado</Text>
            </TouchableOpacity>
          </View>

          {chamados.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum chamado registrado no momento.</Text>
          ) : (
            <FlatList
              data={chamados}
              keyExtractor={(item) => String(item.id)}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const badge = badgeStyle(item.prioridade);
                return (
                  <View style={styles.chamadoCard}>
                    <View style={styles.chamadoHeader}>
                      <Text style={styles.chamadoEquipamento}>{item.equipamento?.nome}</Text>
                      <View style={[styles.badge, badge.box]}>
                        <Text style={[styles.badgeText, badge.text]}>{badge.label}</Text>
                      </View>
                    </View>
                    <Text style={styles.chamadoDescricao}>{item.problema}</Text>
                    {item.fotoBase64 ? (
                      <Image
                        source={{ uri: `data:image/jpeg;base64,${item.fotoBase64}` }}
                        style={styles.chamadoThumb}
                      />
                    ) : null}
                    <View style={styles.chamadoFooter}>
                      <Text style={styles.chamadoData}>
                        {item.data} {item.hora ? `· ${item.hora}` : ''}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>
      </ScrollView>

      {/* Modal: abrir chamado */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Abrir chamado de manutenção</Text>

              <Text style={styles.label}>Equipamento</Text>
              {equipamentos.length === 0 ? (
                <Text style={styles.emptyText}>
                  Nenhum equipamento cadastrado ainda. Cadastre um equipamento antes de abrir um chamado.
                </Text>
              ) : (
                <View style={styles.chipsRow}>
                  {equipamentos.map((eq) => (
                    <TouchableOpacity
                      key={eq.id}
                      style={[
                        styles.chip,
                        equipamentoSelecionado?.id === eq.id && styles.chipSelected,
                      ]}
                      onPress={() => setEquipamentoSelecionado(eq)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          equipamentoSelecionado?.id === eq.id && styles.chipTextSelected,
                        ]}
                      >
                        {eq.nome}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={styles.label}>Descrição do problema</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva o que está acontecendo com o equipamento"
                placeholderTextColor="#777"
                value={problema}
                onChangeText={setProblema}
                multiline
              />

              <Text style={styles.label}>Prioridade</Text>
              <View style={styles.prioridadeRow}>
                {(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'] as Prioridade[]).map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.prioridadeOption, prioridade === p && styles.prioridadeOptionSelected]}
                    onPress={() => setPrioridade(p)}
                  >
                    <Text
                      style={[
                        styles.prioridadeOptionText,
                        prioridade === p && styles.prioridadeOptionTextSelected,
                      ]}
                    >
                      {p === 'BAIXA' ? 'Baixa' : p === 'MEDIA' ? 'Média' : p === 'ALTA' ? 'Alta' : 'Crítica'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Foto do equipamento (opcional)</Text>
              {imagem ? (
                <View style={styles.imagePreviewWrapper}>
                  <Image source={{ uri: imagem.uri }} style={styles.imagePreview} />
                  <TouchableOpacity style={styles.imageRemoveButton} onPress={() => setImagem(null)}>
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
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={enviarChamado} disabled={enviando}>
                  {enviando ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Abrir chamado</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}