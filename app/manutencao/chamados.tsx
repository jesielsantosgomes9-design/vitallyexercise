import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { styles } from '@/styles/manutencaoChamados';

// Troque SEU_IP pelo IPv4 do seu PC (o backend roda na porta 8080)
const API_URL = 'http://192.168.1.7:8080/api';

type Prioridade = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
type StatusChamado = 'ABERTO' | 'EM_ANDAMENTO' | 'FINALIZADO';

type Chamado = {
  id: number;
  equipamento: { id: number; nome: string } | null;
  problema: string;
  fotoBase64?: string;
  data: string;
  hora?: string;
  prioridade: Prioridade;
  responsavel?: string;
  status: StatusChamado;
  observacoes?: string;
  tipo?: string;
  slaDias?: number;
  dataConclusao?: string | null;
};

const FILTROS: { label: string; value: StatusChamado | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Abertos', value: 'ABERTO' },
  { label: 'Em andamento', value: 'EM_ANDAMENTO' },
  { label: 'Finalizados', value: 'FINALIZADO' },
];

const STATUS_LABEL: Record<StatusChamado, string> = {
  ABERTO: 'Aberto',
  EM_ANDAMENTO: 'Em andamento',
  FINALIZADO: 'Finalizado',
};

function statusAtualStyle(status: StatusChamado) {
  if (status === 'ABERTO') return styles.statusAtualAberto;
  if (status === 'EM_ANDAMENTO') return styles.statusAtualAndamento;
  return styles.statusAtualFinalizado;
}

function badgeStyle(p: Prioridade) {
  if (p === 'CRITICA') return { box: styles.badgeCritica, text: styles.badgeCriticaText, label: 'Crítica' };
  if (p === 'ALTA') return { box: styles.badgeAlta, text: styles.badgeAltaText, label: 'Alta' };
  if (p === 'BAIXA') return { box: styles.badgeBaixa, text: styles.badgeBaixaText, label: 'Baixa' };
  return { box: styles.badgeMedia, text: styles.badgeMediaText, label: 'Média' };
}

export default function ManutencaoChamadosScreen() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [filtro, setFiltro] = useState<StatusChamado | 'todos'>('todos');
  const [alterandoId, setAlterandoId] = useState<number | null>(null);

  const carregar = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/manutencao/chamados`);
      if (!res.ok) throw new Error(String(res.status));
      const data: Chamado[] = await res.json();
      data.sort((a, b) => (b.data ?? '').localeCompare(a.data ?? ''));
      setChamados(data);
    } catch (e) {
      console.log('ERRO CHAMADOS:', e);
      Alert.alert('Erro', 'Não foi possível carregar os chamados.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function atualizarStatus(chamado: Chamado, novoStatus: StatusChamado) {
    if (chamado.status === novoStatus) return;

    setAlterandoId(chamado.id);
    try {
      // Só os campos que a entidade realmente grava — reenviar os campos
      // calculados que a API devolve (prazo, slaStatus) quebraria o PUT.
      const payload = {
        equipamento: chamado.equipamento ? { id: chamado.equipamento.id } : null,
        problema: chamado.problema,
        fotoBase64: chamado.fotoBase64 ?? null,
        data: chamado.data,
        hora: chamado.hora ?? null,
        prioridade: chamado.prioridade,
        responsavel: chamado.responsavel ?? null,
        status: novoStatus,
        observacoes: chamado.observacoes ?? null,
        tipo: chamado.tipo ?? 'CORRETIVA',
        slaDias: chamado.slaDias ?? null,
        dataConclusao: chamado.dataConclusao ?? null,
      };

      const res = await fetch(`${API_URL}/manutencao/chamados/${chamado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));

      const atualizado: Chamado = await res.json();
      setChamados((prev) => prev.map((c) => (c.id === chamado.id ? atualizado : c)));
    } catch (e) {
      console.log('ERRO STATUS:', e);
      Alert.alert('Erro', 'Não foi possível atualizar o status do chamado.');
    } finally {
      setAlterandoId(null);
    }
  }

  const chamadosFiltrados =
    filtro === 'todos' ? chamados : chamados.filter((c) => c.status === filtro);

  if (carregando) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#E63030" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => {
              setAtualizando(true);
              carregar();
            }}
            tintColor="#E63030"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chamados de Manutenção</Text>
          <Text style={styles.headerSubtitle}>Acompanhe e atualize os reparos</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {FILTROS.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.filterChip, filtro === f.value && styles.filterChipSelected]}
              onPress={() => setFiltro(f.value)}
            >
              <Text style={[styles.filterChipText, filtro === f.value && styles.filterChipTextSelected]}>
                {f.label} {f.value !== 'todos' ? `(${chamados.filter((c) => c.status === f.value).length})` : `(${chamados.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {chamadosFiltrados.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum chamado nessa categoria.</Text>
        ) : (
          <FlatList
            data={chamadosFiltrados}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const badge = badgeStyle(item.prioridade);
              return (
                <View style={styles.chamadoCard}>
                  <View style={styles.chamadoHeader}>
                    <Text style={styles.chamadoEquipamento}>
                      {item.equipamento?.nome ?? 'Equipamento não informado'}
                    </Text>
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
                    <Text style={[styles.statusAtual, statusAtualStyle(item.status)]}>
                      {STATUS_LABEL[item.status]}
                    </Text>
                  </View>

                  <View style={styles.statusRow}>
                    {(['ABERTO', 'EM_ANDAMENTO', 'FINALIZADO'] as StatusChamado[]).map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[styles.statusOption, item.status === s && styles.statusOptionSelected]}
                        onPress={() => atualizarStatus(item, s)}
                        disabled={alterandoId === item.id}
                      >
                        {alterandoId === item.id ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <Text
                            style={[
                              styles.statusOptionText,
                              item.status === s && styles.statusOptionTextSelected,
                            ]}
                          >
                            {STATUS_LABEL[s]}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            }}
          />
        )}
      </ScrollView>
    </View>
  );
}