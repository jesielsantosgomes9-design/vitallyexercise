import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  scrollContent: { padding: 20, paddingBottom: 48 },
  header: { marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 13, color: '#AAAAAA', marginTop: 4 },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E63030',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 24,
  },

  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  label: { color: '#CCCCCC', fontSize: 13, marginBottom: 6, marginTop: 14 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, marginTop: 14 },
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
  inputInvalido: {
    borderColor: '#E63030',
  },
  fieldError: {
    color: '#FF5555',
    fontSize: 12,
    marginTop: 6,
  },
  fieldInfo: {
    color: '#8A8F98',
    fontSize: 12,
    marginTop: 6,
  },
  fieldWarning: {
    color: '#FFB800',
    fontSize: 12,
    marginTop: 6,
  },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { borderColor: '#E63030', backgroundColor: '#2A1414' },
  chipText: { color: '#AAAAAA', fontSize: 13, fontWeight: '600' },
  chipTextSelected: { color: '#FFFFFF' },

  button: {
    marginTop: 28,
    backgroundColor: '#E63030',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#5C2020',
  },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15, letterSpacing: 0.5 },

  // Lista da equipe
  listTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginTop: 36, marginBottom: 12 },
  emptyText: { color: '#777777', fontSize: 13, textAlign: 'center', marginTop: 8 },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardNome: { color: '#FFFFFF', fontWeight: '700', fontSize: 15, flex: 1, marginRight: 8 },
  cardLinha: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  cardLinhaTexto: { color: '#AAAAAA', fontSize: 13, marginLeft: 8, flexShrink: 1 },

  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  badgeAtivo: { backgroundColor: '#14301A' },
  badgeAtivoText: { color: '#4CD964' },
  badgeAfastado: { backgroundColor: '#3A2E14' },
  badgeAfastadoText: { color: '#FFB800' },
  badgeInativo: { backgroundColor: '#3A1414' },
  badgeInativoText: { color: '#FF5555' },
});