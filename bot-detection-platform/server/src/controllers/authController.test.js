import { generateToken } from '../utils/jwt.js';
import { validateRegisterInput } from '../utils/validation.js';

describe('Auth Controller', () => {
  it('should validate register input', async () => {
    const validation = validateRegisterInput('test@example.com', 'password123', 'Test User');
    expect(validation.valid).toBe(true);
  });

  it('should reject invalid email', () => {
    const validation = validateRegisterInput('invalid-email', 'password123', 'Test User');
    expect(validation.valid).toBe(false);
  });

  it('should reject short password', () => {
    const validation = validateRegisterInput('test@example.com', 'pass', 'Test User');
    expect(validation.valid).toBe(false);
  });

  it('should generate JWT token', () => {
    const token = generateToken('user123', 'admin');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });
});
