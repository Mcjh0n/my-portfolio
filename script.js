const apiBase = document.documentElement.dataset.apiBase?.trim() || '';
const counter = document.querySelector('#visit-count');

if (!apiBase) {
  counter.textContent = 'Visit count setup pending';
} else {
  const countVisits = async () => {
    try {
      const seen = sessionStorage.getItem('portfolio-visit-recorded');
      if (!seen) {
        await fetch(`${apiBase}/visits`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: location.pathname }),
        });
        sessionStorage.setItem('portfolio-visit-recorded', 'yes');
      }
      const response = await fetch(`${apiBase}/visits`);
      if (!response.ok) throw new Error('Counter unavailable');
      const data = await response.json();
      counter.textContent = `${Number(data.visits).toLocaleString()} visits`;
    } catch {
      counter.textContent = 'Visit count unavailable';
    }
  };
  countVisits();
}

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const messageFields = document.querySelector('#message-fields');
const verifyFields = document.querySelector('#verification-fields');
const stepLabel = document.querySelector('#form-step-label');
let pendingMessage = null;

const setStatus = (message, kind = '') => {
  status.textContent = message;
  status.dataset.kind = kind;
};

const startVerification = async () => {
  if (!form.reportValidity()) return;
  if (!apiBase) {
    setStatus('Email verification is not connected yet. Please email me directly at johnmarkfuentes8@gmail.com.', 'error');
    return;
  }
  const values = Object.fromEntries(new FormData(form).entries());
  pendingMessage = { name: values.name, email: values.email, subject: values.subject, message: values.message };
  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  setStatus('Sending a verification code…');
  try {
    const response = await fetch(`${apiBase}/contact/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pendingMessage),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not send a verification code.');
    messageFields.hidden = true;
    verifyFields.hidden = false;
    stepLabel.textContent = 'STEP 02 / 02';
    setStatus(data.message || 'Verification code sent. Check your email.', 'success');
    verifyFields.querySelector('[name="code"]').focus();
  } catch (error) {
    setStatus(error.message || 'Could not send the code. Please try again.', 'error');
  } finally {
    button.disabled = false;
  }
};

const sendVerifiedMessage = async () => {
  const codeInput = verifyFields.querySelector('[name="code"]');
  if (!/^\d{6}$/.test(codeInput.value)) {
    codeInput.setCustomValidity('Enter the 6-digit code from your email.');
    codeInput.reportValidity();
    codeInput.setCustomValidity('');
    return;
  }
  const button = document.querySelector('#verify-button');
  button.disabled = true;
  setStatus('Checking your code and sending the message…');
  try {
    const response = await fetch(`${apiBase}/contact/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...pendingMessage, code: codeInput.value }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'The code could not be verified.');
    form.reset();
    pendingMessage = null;
    messageFields.hidden = false;
    verifyFields.hidden = true;
    stepLabel.textContent = 'STEP 01 / 02';
    setStatus(data.message || 'Email verified—your message has been sent. Thank you!', 'success');
  } catch (error) {
    setStatus(error.message || 'Could not verify the code. Please try again.', 'error');
  } finally {
    button.disabled = false;
  }
};

form.addEventListener('submit', event => {
  event.preventDefault();
  startVerification();
});
document.querySelector('#verify-button').addEventListener('click', sendVerifiedMessage);
document.querySelector('#resend-button').addEventListener('click', startVerification);
document.querySelector('#message-button').addEventListener('click', () => {
  document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => form.querySelector('[name="name"]').focus(), 450);
});

const links = document.querySelectorAll('.nav-link');
const sections = [...document.querySelectorAll('main section[id]')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) links.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
