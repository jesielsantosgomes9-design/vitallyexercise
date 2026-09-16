import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { styles } from '@/styles/manutencaoChamados';

// Ajuste para o IP da sua máquina na rede local
const API_URL = 'http://SEU_IP:8080/api';

type StatusChamado = 'aberto' | 'em_andamento' | 'resolvido';

type Chamado = {
  id: string;
  equipamento: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta';
  status: StatusChamado;
  criadoEm: string;
  imagemUrl?: string;
};

const FILTROS: { label: string; value: StatusChamado | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Abertos', value: 'aberto' },
  { label: 'Em andamento', value: 'em_andamento' },
  { label: 'Resolvidos', value: 'resolvido' },
];

const STATUS_LABEL: Record<StatusChamado, string> = {
  aberto: 'Aberto',
  em_andamento: 'Em andamento',
  resolvido: 'Resolvido',
};

export default function ManutencaoChamadosScreen() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState<StatusChamado | 'todos'>('todos');
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);

  useEffect(() => {
    carregarChamados();
  }, []);

  async function carregarChamados() {
    setCarregando(true);
    try {
      const response = await fetch(`${API_URL}/chamados`);
      const data = await response.json();
      setChamados(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os chamados.');
    } finally {
      setCarregando(false);
    }
  }

  async function atualizarStatus(id: string, novoStatus: StatusChamado) {
    setAtualizandoId(id);
    try {
      const response = await fetch(`${API_URL}/chamados/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar status');
      }

      setChamados((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: novoStatus } : c))
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status do chamado.');
    } finally {
      setAtualizandoId(null);
    }
  }

  function badgeStyle(p: Chamado['prioridade']) {
    if (p === 'alta') return { box: styles.badgeAlta, text: styles.badgeAltaText, label: 'Alta' };
    if (p === 'baixa') return { box: styles.badgeBaixa, text: styles.badgeBaixaText, label: 'Baixa' };
    return { box: styles.badgeMedia, text: styles.badgeMediaText, label: 'Média' };
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
              <Text
                style={[
                  styles.filterChipText,
                  filtro === f.value && styles.filterChipTextSelected,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {chamadosFiltrados.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum chamado nessa categoria.</Text>
        ) : (
          <FlatList
            data={chamadosFiltrados}
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

                  <View style={styles.statusRow}>
                    {(['aberto', 'em_andamento', 'resolvido'] as StatusChamado[]).map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[
                          styles.statusOption,
                          item.status === s && styles.statusOptionSelected,
                        ]}
                        onPress={() => atualizarStatus(item.id, s)}
                        disabled={atualizandoId === item.id}
                      >
                        {atualizandoId === item.id ? (
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