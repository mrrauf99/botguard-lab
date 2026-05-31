export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true };
};

export const validateRegisterInput = (email, password, name) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: 'Name is required' };
  }

  if (!email || !validateEmail(email)) {
    return { valid: false, message: 'Valid email is required' };
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }

  return { valid: true };
};
