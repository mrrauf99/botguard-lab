import { login, register } from './auth.js';

const showFormMessage = (form, message, isError = false) => {
  let el = form.querySelector('.form-message');
  if (!el) {
    el = document.createElement('p');
    el.className = 'form-message';
    el.style.marginTop = '1rem';
    el.style.fontSize = '0.875rem';
    form.appendChild(el);
  }
  el.textContent = message;
  el.style.color = isError ? 'var(--coral)' : 'var(--emerald)';
};

export const setupLoginForm = () => {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('#email')?.value?.trim();
    const password = form.querySelector('#password')?.value;

    try {
      await login(email, password);
      showFormMessage(form, 'Login successful. Redirecting...', false);
      window.location.href = '/dashboard';
    } catch (err) {
      showFormMessage(form, err.message, true);
    }
  });
};

export const setupRegisterForm = () => {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.querySelector('#name')?.value?.trim();
    const email = form.querySelector('#email')?.value?.trim();
    const password = form.querySelector('#password')?.value;
    const confirm = form.querySelector('#confirm-password')?.value;

    if (password !== confirm) {
      showFormMessage(form, 'Passwords do not match', true);
      return;
    }

    try {
      await register(name, email, password);
      showFormMessage(form, 'Account created. Redirecting...', false);
      window.location.href = '/dashboard';
    } catch (err) {
      showFormMessage(form, err.message, true);
    }
  });
};

export const setupContactForm = () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showFormMessage(form, 'Thank you! Your message has been received.', false);
    form.reset();
  });
};

export const setupPageHandlers = (pathname) => {
  if (pathname.includes('/login')) {
    setupLoginForm();
  } else if (pathname.includes('/register')) {
    setupRegisterForm();
  } else if (pathname.includes('/contact')) {
    setupContactForm();
  }
};
