const apiBase = '';
const themeStorageKey = 'john-mark-portfolio-theme';
const savedTheme = (() => {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch {
    return null;
  }
})();
const themePreference = window.matchMedia('(prefers-color-scheme: dark)');
const initialTheme = savedTheme === 'light' || savedTheme === 'dark'
  ? savedTheme
  : (themePreference.matches ? 'dark' : 'light');
document.documentElement.dataset.theme = initialTheme;

const sidebar = document.querySelector('.sidebar');
const sideNavigation = sidebar?.querySelector('.side-nav');
const mobileMenu = document.createElement('div');
mobileMenu.className = 'mobile-menu';
const resourcesLink = [...(sideNavigation?.querySelectorAll('.nav-link') || [])]
  .find(link => link.textContent.trim().startsWith('Free Resources'));
const toolsLink = [...(sideNavigation?.querySelectorAll('.nav-link') || [])]
  .find(link => link.textContent.trim().startsWith('Tools'));
const contactLink = [...(sideNavigation?.querySelectorAll('.nav-link') || [])]
  .find(link => link.textContent.trim().startsWith('Contact'));
mobileMenu.innerHTML = `
  <button class="mobile-menu-trigger" type="button" aria-label="Open menu" aria-controls="mobile-menu-panel" aria-expanded="false">
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
  </button>
  <aside class="mobile-menu-panel" id="mobile-menu-panel" aria-label="Quick settings and links" hidden>
    <div class="mobile-menu-theme"><span>Dark theme</span><button class="mobile-theme-switch" type="button" role="switch" aria-label="Dark theme" aria-checked="false"></button></div>
    <button class="mobile-menu-link mobile-menu-accessibility" type="button"><span class="menu-link-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="4.5" r="2"/><path d="m5 9 7-1 7 1M12 8v5m0 0-3.5 6M12 13l3.5 6"/></svg></span><span>Accessibility</span><span class="menu-chevron" aria-hidden="true">›</span></button>
    <a class="mobile-menu-link mobile-menu-tools" href="${toolsLink?.getAttribute('href') || '#'}"><span class="menu-link-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg></span><span>Tools</span><span class="menu-chevron" aria-hidden="true">›</span></a>
    <a class="mobile-menu-link mobile-menu-resources" href="${resourcesLink?.getAttribute('href') || '#'}"><span class="menu-link-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20M8 7h8"/></svg></span><span>Free resources</span><span class="menu-chevron" aria-hidden="true">›</span></a>
  </aside>`;
const mobileContactLink = document.createElement('a');
mobileContactLink.className = 'mobile-menu-link mobile-menu-contact';
mobileContactLink.href = contactLink?.getAttribute('href') || '#contact';
mobileContactLink.innerHTML = '<span class="menu-link-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 5h18v14H3z"/><path d="m3 7 9 7 9-7"/></svg></span><span>Contact</span><span class="menu-chevron" aria-hidden="true">›</span>';
mobileMenu.querySelector('.mobile-menu-panel')?.append(mobileContactLink);
sidebar?.append(mobileMenu);

const mobileMenuTrigger = mobileMenu.querySelector('.mobile-menu-trigger');
const mobileMenuPanel = mobileMenu.querySelector('.mobile-menu-panel');
const mobileThemeSwitch = mobileMenu.querySelector('.mobile-theme-switch');
const mobileAccessibilityLink = mobileMenu.querySelector('.mobile-menu-accessibility');
const mobileMenuTools = mobileMenu.querySelector('.mobile-menu-tools');
const mobileMenuResources = mobileMenu.querySelector('.mobile-menu-resources');
const mobileMenuContact = mobileMenu.querySelector('.mobile-menu-contact');
let sidebarThemeToggle;
const applyTheme = (theme, persist = true) => {
  document.documentElement.dataset.theme = theme;
  mobileThemeSwitch?.setAttribute('aria-checked', String(theme === 'dark'));
  if (sidebarThemeToggle) {
    const dark = theme === 'dark';
    sidebarThemeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    sidebarThemeToggle.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
    sidebarThemeToggle.innerHTML = dark
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.8 8.8 0 1 0 20.5 15.2Z"/></svg>';
  }
  if (!persist) return;
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // The theme remains active for this page view if storage is unavailable.
  }
};
applyTheme(initialTheme, false);

const navigationIcons = {
  Home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  Projects: '<path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H10l2 2h7.5A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/><path d="M3 10h18"/>',
  Services: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18m-11 0v2h4v-2"/>',
  Tools: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  'Free Resources': '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20M8 7h8"/>',
  About: '<circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2z"/>',
  Contact: '<path d="M3 5h18v14H3z"/><path d="m3 7 9 7 9-7"/>',
};
sideNavigation?.querySelectorAll('.nav-link').forEach(link => {
  const label = link.textContent.trim();
  if (!navigationIcons[label] || link.querySelector('.nav-link-icon')) return;
  const icon = document.createElement('span');
  icon.className = 'nav-link-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = `<svg viewBox="0 0 24 24">${navigationIcons[label]}</svg>`;
  link.prepend(icon);
});

const closeMobileMenu = () => {
  if (!mobileMenuPanel || mobileMenuPanel.hidden) return;
  mobileMenuPanel.hidden = true;
  mobileMenuTrigger.setAttribute('aria-expanded', 'false');
};
mobileMenuTrigger?.addEventListener('click', () => {
  const opening = mobileMenuPanel.hidden;
  mobileMenuPanel.hidden = !opening;
  mobileMenuTrigger.setAttribute('aria-expanded', String(opening));
});
mobileThemeSwitch?.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});
mobileMenuResources?.addEventListener('click', closeMobileMenu);
mobileMenuTools?.addEventListener('click', closeMobileMenu);
mobileMenuContact?.addEventListener('click', closeMobileMenu);
document.addEventListener('click', event => {
  if (mobileMenuPanel && !mobileMenu.contains(event.target)) closeMobileMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMobileMenu();
});

const socialProfiles = {
  facebook: 'https://www.facebook.com/Mcjh0n1',
  linkedin: 'https://www.linkedin.com/in/john-mark-fuentes-7160b6311/',
  github: 'https://github.com/Mcjh0n',
  discord: 'https://discord.com/channels/@me',
};
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
  sidebarThemeToggle = document.createElement('button');
  sidebarThemeToggle.className = 'social-link theme-toggle';
  sidebarThemeToggle.type = 'button';
  applyTheme(document.documentElement.dataset.theme, false);
  sidebarThemeToggle.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  socialRow.append(sidebarThemeToggle);
}
const counter = document.querySelector('#visit-count');

if (counter && !apiBase) {
  counter.textContent = 'Page under development';
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
let accessibilityReturnFocus = null;

mobileAccessibilityLink?.addEventListener('click', () => {
  accessibilityReturnFocus = mobileMenuTrigger;
  closeMobileMenu();
  accessibilityTrigger.click();
});

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
  (accessibilityReturnFocus || accessibilityTrigger).focus();
  accessibilityReturnFocus = null;
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
