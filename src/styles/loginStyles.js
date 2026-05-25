import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },

  logo: {
    width: 280,
    height: 160,
  },

  formContainer: {
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    marginBottom: 32,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  input: {
    flex: 1,
    height: 56,
    marginLeft: 12,
    color: '#111',
  },

  buttonGradient: {
    borderRadius: 12,
    marginTop: 8,
  },

  button: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  linkPrefix: {
    color: '#666',
  },

  linkText: {
    color: '#2563eb',
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },

  modalSubtitle: {
    textAlign: 'center',
    marginTop: 12,
    color: '#666',
  },

  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginTop: 24,
    height: 56,
    textAlign: 'center',
    fontSize: 22,
    letterSpacing: 10,
  },

  verifyButton: {
    backgroundColor: '#2563eb',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
