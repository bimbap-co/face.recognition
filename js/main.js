const contentsLinks = [...document.querySelectorAll('.contents a')];
const sections = [...document.querySelectorAll('main section[id]')];
const backTop = document.querySelector('.back-top');

function updateNavigation() {
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  const active = atBottom ? sections.at(-1) : [...sections].reverse().find(section => section.getBoundingClientRect().top <= 140) || sections[0];
  for (const link of contentsLinks) {
    if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  if (backTop) backTop.hidden = window.scrollY < 450;
}
let scheduled = false;
window.addEventListener('scroll', () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => { updateNavigation(); scheduled = false; });
}, { passive: true });
updateNavigation();
window.addEventListener('resize', updateNavigation);

for (const link of contentsLinks) link.addEventListener('click', () => {
  const menu = link.closest('.mobile-nav');
  if (menu) {
    menu.open = false;
    const target = document.querySelector(link.hash);
    if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
  }
});

const dialog = document.querySelector('#link-status');
if (dialog) {
  const title = dialog.querySelector('h2');
  const message = dialog.querySelector('p');
  const printButton = dialog.querySelector('[data-print]');
  for (const link of document.querySelectorAll('[data-placeholder], [data-cv]')) {
    link.addEventListener('click', event => {
      event.preventDefault();
      const isCV = link.hasAttribute('data-cv');
      title.textContent = isCV ? 'Your CV, in progress.' : `${link.dataset.placeholder} — coming soon.`;
      message.textContent = isCV
        ? 'The career-focused CV PDF will be prepared separately, selecting the experience, qualifications and achievements relevant to hiring. Printing this page saves the full portfolio, including the wider education and learning history; it is not the job-search CV.'
        : 'This link is waiting for a verified profile, repository or write-up. No external account is connected yet.';
      printButton.hidden = !isCV;
      dialog.showModal();
    });
  }
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  printButton.addEventListener('click', () => { dialog.close(); window.print(); });
}

const filterButtons = document.querySelectorAll('.filter-btn');
const projectEntries = document.querySelectorAll('.project-entry');
if (filterButtons.length && projectEntries.length) {
  for (const btn of filterButtons) {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      for (const b of filterButtons) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      }
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      for (const entry of projectEntries) {
        if (filter === 'all' || entry.dataset.domain === filter) {
          entry.style.display = '';
          entry.classList.remove('is-animating');
          void entry.offsetWidth;
          entry.classList.add('is-animating');
        } else {
          entry.style.display = 'none';
          entry.classList.remove('is-animating');
        }
      }
    });
  }
}

const copyBtn = document.querySelector('.copy-url-btn');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const copyText = copyBtn.querySelector('.copy-text');
    const originalText = copyText ? copyText.textContent : 'Copy portfolio link';
    try {
      await navigator.clipboard.writeText(window.location.href);
      copyBtn.classList.add('is-copied');
      if (copyText) copyText.textContent = 'Link copied to clipboard ✓';
      setTimeout(() => {
        copyBtn.classList.remove('is-copied');
        if (copyText) copyText.textContent = originalText;
      }, 2500);
    } catch {
      if (copyText) copyText.textContent = 'Press Ctrl+C to copy URL';
      setTimeout(() => {
        if (copyText) copyText.textContent = originalText;
      }, 2500);
    }
  });
}
