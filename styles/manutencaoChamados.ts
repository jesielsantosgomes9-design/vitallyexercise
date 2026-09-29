import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 13, color: '#AAAAAA', marginTop: 4 },

  filterRow: { flexDirection: 'row', marginBottom: 18 },
  filterChip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterChipSelected: { borderColor: '#E63030', backgroundColor: '#2A1414' },
  filterChipText: { color: '#AAAAAA', fontSize: 13, fontWeight: '600' },
  filterChipTextSelected: { color: '#FFFFFF' },

  emptyText: { color: '#777777', fontSize: 13, textAlign: 'center', marginTop: 24 },

  chamadoCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 14,
    marginBottom: 10,
  },
  chamadoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  chamadoEquipamento: { color: '#FFFFFF', fontWeight: '700', fontSize: 14, flex: 1, marginRight: 8 },
  chamadoDescricao: { color: '#AAAAAA', fontSize: 13, marginTop: 6 },
  chamadoThumb: { width: '100%', height: 140, borderRadius: 8, marginTop: 10, backgroundColor: '#0D0D0D' },
  chamadoFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  chamadoData: { color: '#666666', fontSize: 11 },

  statusAtual: { fontSize: 11, fontWeight: '700' },
  statusAtualAberto: { color: '#FF5555' },
  statusAtualAndamento: { color: '#FFB800' },
  statusAtualFinalizado: { color: '#4CD964' },

  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  badgeCritica: { backgroundColor: '#4A1010' },
  badgeCriticaText: { color: '#FF2C2C' },
  badgeAlta: { backgroundColor: '#3A1414' },
  badgeAltaText: { color: '#FF5555' },
  badgeMedia: { backgroundColor: '#3A2E14' },
  badgeMediaText: { color: '#FFB800' },
  badgeBaixa: { backgroundColor: '#14301A' },
  badgeBaixaText: { color: '#4CD964' },

  statusRow: { flexDirection: 'row', marginTop: 12 },
  statusOption: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingVertical: 8,
    alignItems: 'center',
    marginRight: 6,
  },
  statusOptionSelected: { borderColor: '#E63030', backgroundColor: '#2A1414' },
  statusOptionText: { color: '#AAAAAA', fontSize: 11, fontWeight: '600' },
  statusOptionTextSelected: { color: '#FFFFFF' },
});