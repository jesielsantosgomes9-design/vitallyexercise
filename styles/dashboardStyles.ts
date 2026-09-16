import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#AAAAAA',
    marginTop: 4,
  },

  // Cards de resumo
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 14,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 4,
  },
  statAccent: {
    color: '#e94545',
  },
  statPositive: {
    color: '#4CD964',
  },

  // Seções gerais
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionBlock: {
    marginBottom: 28,
  },
  addButton: {
    backgroundColor: '#ee1d1d',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  emptyText: {
    color: '#777777',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
  },

  // Inadimplentes
  inadimplenteCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  inadimplenteNome: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  inadimplenteDias: {
    color: '#777777',
    fontSize: 12,
    marginTop: 2,
  },
  inadimplenteValor: {
    color: '#ee0a0a',
    fontWeight: '700',
    fontSize: 14,
  },

  // Gráfico de barras (alunos por plano)
  chartCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 16,
  },
  chartRow: {
    marginBottom: 14,
  },
  chartRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  chartLabel: {
    color: '#CCCCCC',
    fontSize: 13,
  },
  chartValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  chartTrack: {
    height: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  chartBar: {
    height: 8,
    backgroundColor: '#E63030',
    borderRadius: 4,
  },

  // Chamados
  chamadoCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 14,
    marginBottom: 10,
  },
  chamadoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chamadoEquipamento: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  chamadoDescricao: {
    color: '#AAAAAA',
    fontSize: 13,
    marginTop: 6,
  },
  chamadoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  chamadoData: {
    color: '#666666',
    fontSize: 11,
  },
  chamadoThumb: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: '#0D0D0D',
  },

  // Imagem no formulário de chamado
  imagePickerRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  imagePickerButton: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderStyle: 'dashed',
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  imagePickerButtonText: {
    color: '#AAAAAA',
    fontSize: 13,
    fontWeight: '600',
  },
  imagePreviewWrapper: {
    marginTop: 6,
  },
  imagePreview: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    backgroundColor: '#0D0D0D',
  },
  imageRemoveButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  imageRemoveButtonText: {
    color: '#FF5555',
    fontSize: 13,
    fontWeight: '600',
  },

  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeAlta: {
    backgroundColor: '#3A1414',
  },
  badgeAltaText: {
    color: '#FF5555',
  },
  badgeMedia: {
    backgroundColor: '#3A2E14',
  },
  badgeMediaText: {
    color: '#FFB800',
  },
  badgeBaixa: {
    backgroundColor: '#14301A',
  },
  badgeBaixaText: {
    color: '#4CD964',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#141414',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  label: {
    color: '#CCCCCC',
    fontSize: 13,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  prioridadeRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  prioridadeOption: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  prioridadeOptionSelected: {
    borderColor: '#922606',
    backgroundColor: '#2A1414',
  },
  prioridadeOptionText: {
    color: '#AAAAAA',
    fontSize: 13,
    fontWeight: '600',
  },
  prioridadeOptionTextSelected: {
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#CCCCCC',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#2f0664',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});