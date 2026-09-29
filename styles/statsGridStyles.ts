import { StyleSheet } from 'react-native';

export const statsGridStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
  },
  groupBlock: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E63030',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '31.5%',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 12,
    marginBottom: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8A8F98',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  value: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 11,
    color: '#666666',
  },
});

// Cores de identificação dos ícones, saturadas o bastante para
// se destacarem sobre o fundo escuro dos cards.
export const CARD_COLORS = {
  blue: '#4C7DFF',
  green: '#20C97A',
  purple: '#9B5CF6',
  yellow: '#F2B33D',
  orange: '#F2903D',
  red: '#E63030',
  teal: '#1FCBAA',
  pink: '#F0508C',
  gray: '#6B7280',
};