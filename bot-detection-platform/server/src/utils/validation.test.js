import { validateEmail, validatePassword, validateRegisterInput } from './validation.js';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user@botguard.pk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('password123');
      expect(result.valid).toBe(true);
    });

    it('should reject short passwords', () => {
      const result = validatePassword('pass');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateRegisterInput', () => {
    it('should validate complete input', () => {
      const result = validateRegisterInput('test@example.com', 'password123', 'Test User');
      expect(result.valid).toBe(true);
    });

    it('should reject empty name', () => {
      const result = validateRegisterInput('test@example.com', 'password123', '');
      expect(result.valid).toBe(false);
    });
  });
});
