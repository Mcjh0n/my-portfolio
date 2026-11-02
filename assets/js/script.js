const apiBase = '';
const socialProfiles = { facebook: '', linkedin: '', github: '', discord: '' };
const socialIcons = {
  facebook: '<path d="M13.6 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.5V13h2.7v8z"/>',
  linkedin: '<path d="M5.2 8.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM3.7 10h3v10h-3zm5 0h2.9v1.4h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.7 2 3.7 4.6V20h-3v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V20h-3z"/>',
  github: '<path d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7 2.5 4.1 1.8.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.6-2.8 5.6-5.4 5.9.4.3.8 1 .8 2v2.9c0 .3.2.7.8.6A11.1 11.1 0 0 0 12 .9Z"/>',
  discord: '<path d="M19.7 5.2a18 18 0 0 0-4.4-1.4l-.5 1a16 16 0 0 0-5.6 0l-.5-1a18 18 0 0 0-4.4 1.4C1.5 9.3.7 13.3 1.1 17.2a18 18 0 0 0 5.4 2.7l1.2-2a11 11 0 0 1-1.9-.9l.5-.4a13 13 0 0 0 11.4 0l.5.4a11 11 0 0 1-1.9.9l1.2 2a18 18 0 0 0 5.4-2.7c.5-4.5-.8-8.4-3.2-12Zm-11 9.7c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"/>',
};
const socialRow = document.querySelector('.social-row') || (() => {
  const row = document.createElement('div');
  row.className = 'social-row';
  row.setAttribute('aria-label', 'Social profiles');
  document.querySelector('.visit-line')?.after(row);
  return row;
})();
if (socialRow) {
  socialRow.replaceChildren();
  Object.entries(socialIcons).forEach(([platform, icon]) => {
    const profileUrl = socialProfiles[platform];
    let control;
    try {
      const parsedUrl = new URL(profileUrl);
      control = parsedUrl.protocol === 'https:' ? document.createElement('a') : document.createElement('button');
    } catch {
      control = document.createElement('button');
    }
    control.className = 'social-link';
    control.setAttribute('aria-label', profileUrl && control.tagName === 'A' ? `${platform} profile (opens in a new tab)` : `${platform} profile link not configured`);
    control.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg>`;
    if (control.tagName === 'A') {
      control.href = profileUrl;
      control.target = '_blank';
      control.rel = 'noopener noreferrer';
    } else {
      control.type = 'button';
      control.disabled = true;
      control.title = 'Add your profile URL in assets/js/script.js';
    }
    socialRow.append(control);
  });
}
const counter = document.querySelector('#visit-count');

if (counter && !apiBase) {
  counter.textContent = 'Visit count setup pending';
} else if (counter) {
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
if (form) {
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
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: document.documentElement.dataset.reduceMotion === 'true' ? 'auto' : 'smooth' });
  });
});

const accessibilityStorageKey = 'john-mark-portfolio-accessibility';
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const defaultAccessibilitySettings = () => ({
  textSize: 'default',
  highContrast: false,
  reduceMotion: null,
  underlineLinks: false,
});

const loadAccessibilitySettings = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(accessibilityStorageKey) || 'null');
    if (!saved || typeof saved !== 'object') return defaultAccessibilitySettings();
    return {
      textSize: ['default', 'large', 'larger'].includes(saved.textSize) ? saved.textSize : 'default',
      highContrast: saved.highContrast === true,
      reduceMotion: typeof saved.reduceMotion === 'boolean' ? saved.reduceMotion : null,
      underlineLinks: saved.underlineLinks === true,
    };
  } catch {
    return defaultAccessibilitySettings();
  }
};

let accessibilitySettings = loadAccessibilitySettings();
const accessibilityWidget = document.createElement('div');
accessibilityWidget.className = 'accessibility-widget';
accessibilityWidget.innerHTML = `
  <button class="accessibility-trigger" type="button" aria-label="Open accessibility settings" aria-controls="accessibility-panel" aria-expanded="false">
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="4.25" r="2.15" fill="currentColor"></circle><path d="M5 9.2 12 8l7 1.2M12 8.3v5.2m0 0-3.6 6.1M12 13.5l3.6 6.1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
  </button>
  <aside class="accessibility-panel" id="accessibility-panel" role="region" aria-labelledby="accessibility-title" hidden>
    <div class="accessibility-panel__header"><div><h2 id="accessibility-title">Accessibility</h2><p>Adjust the page for easier reading.</p></div><button class="accessibility-close" type="button" aria-label="Close accessibility settings">×</button></div>
    <section class="accessibility-setting" aria-labelledby="text-size-title"><h3 id="text-size-title">Text size</h3><p>Choose a comfortable reading size.</p><div class="text-size-options" role="group" aria-labelledby="text-size-title"><button class="text-size-option" type="button" data-text-size-option="default" aria-label="Default text size">A</button><button class="text-size-option" type="button" data-text-size-option="large" aria-label="Larger text">A+</button><button class="text-size-option" type="button" data-text-size-option="larger" aria-label="Extra large text">A++</button></div></section>
    <section class="accessibility-setting"><div class="accessibility-setting__heading"><div><h3 id="contrast-title">High contrast</h3><p>Strengthen text and surface contrast.</p></div><button class="accessibility-switch" type="button" role="switch" aria-labelledby="contrast-title" data-accessibility-toggle="highContrast" aria-checked="false"></button></div></section>
    <section class="accessibility-setting"><div class="accessibility-setting__heading"><div><h3 id="motion-title">Reduce motion</h3><p>Limit smooth scrolling and transitions.</p></div><button class="accessibility-switch" type="button" role="switch" aria-labelledby="motion-title" data-accessibility-toggle="reduceMotion" aria-checked="false"></button></div></section>
    <section class="accessibility-setting"><div class="accessibility-setting__heading"><div><h3 id="underline-title">Underline links</h3><p>Make clickable text easier to spot.</p></div><button class="accessibility-switch" type="button" role="switch" aria-labelledby="underline-title" data-accessibility-toggle="underlineLinks" aria-checked="false"></button></div></section>
    <button class="accessibility-reset" type="button">Reset to default</button>
  </aside>`;
document.body.append(accessibilityWidget);

const accessibilityTrigger = accessibilityWidget.querySelector('.accessibility-trigger');
const accessibilityPanel = accessibilityWidget.querySelector('.accessibility-panel');
const accessibilityClose = accessibilityWidget.querySelector('.accessibility-close');

const effectiveReducedMotion = () => accessibilitySettings.reduceMotion ?? reducedMotionQuery.matches;

const saveAccessibilitySettings = () => {
  try {
    localStorage.setItem(accessibilityStorageKey, JSON.stringify(accessibilitySettings));
  } catch {
    // Settings still apply for this page view if browser storage is unavailable.
  }
};

const applyAccessibilitySettings = () => {
  const root = document.documentElement;
  root.dataset.textSize = accessibilitySettings.textSize;
  root.dataset.highContrast = String(accessibilitySettings.highContrast);
  root.dataset.underlineLinks = String(accessibilitySettings.underlineLinks);
  root.dataset.reduceMotion = String(effectiveReducedMotion());

  accessibilityWidget.querySelectorAll('[data-text-size-option]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.textSizeOption === accessibilitySettings.textSize));
  });
  accessibilityWidget.querySelectorAll('[data-accessibility-toggle]').forEach(button => {
    const setting = button.dataset.accessibilityToggle;
    const checked = setting === 'reduceMotion' ? effectiveReducedMotion() : accessibilitySettings[setting];
    button.setAttribute('aria-checked', String(checked));
  });
};

accessibilityTrigger.addEventListener('click', () => {
  const opening = accessibilityPanel.hidden;
  accessibilityPanel.hidden = !opening;
  accessibilityTrigger.setAttribute('aria-expanded', String(opening));
  if (opening) accessibilityClose.focus();
});

const closeAccessibilityPanel = () => {
  accessibilityPanel.hidden = true;
  accessibilityTrigger.setAttribute('aria-expanded', 'false');
  accessibilityTrigger.focus();
};

accessibilityClose.addEventListener('click', closeAccessibilityPanel);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !accessibilityPanel.hidden) closeAccessibilityPanel();
});

accessibilityWidget.querySelectorAll('[data-text-size-option]').forEach(button => {
  button.addEventListener('click', () => {
    accessibilitySettings.textSize = button.dataset.textSizeOption;
    saveAccessibilitySettings();
    applyAccessibilitySettings();
  });
});

accessibilityWidget.querySelectorAll('[data-accessibility-toggle]').forEach(button => {
  button.addEventListener('click', () => {
    const setting = button.dataset.accessibilityToggle;
    const current = setting === 'reduceMotion' ? effectiveReducedMotion() : accessibilitySettings[setting];
    accessibilitySettings[setting] = !current;
    saveAccessibilitySettings();
    applyAccessibilitySettings();
  });
});

accessibilityWidget.querySelector('.accessibility-reset').addEventListener('click', () => {
  accessibilitySettings = defaultAccessibilitySettings();
  try {
    localStorage.removeItem(accessibilityStorageKey);
  } catch {
    // Defaults still apply for this page view if browser storage is unavailable.
  }
  applyAccessibilitySettings();
});

reducedMotionQuery.addEventListener?.('change', () => {
  if (accessibilitySettings.reduceMotion === null) applyAccessibilitySettings();
});
applyAccessibilitySettings();
