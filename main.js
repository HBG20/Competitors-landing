/**
 * xNova Comparison Landing — Main Script
 * Handles: comparison table, UX slider, scroll animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initLangDropdown();
  initUXSlider();
  initScrollAnimations();
});

// ==========================================================================
// LANGUAGE DROPDOWN
// ==========================================================================

function initLangDropdown() {
  const dropdown = document.querySelector('.lang-dropdown');
  const trigger = document.getElementById('lang-trigger');
  const menu = document.getElementById('lang-menu');
  const langFlag = document.getElementById('lang-flag');
  const langCode = document.getElementById('lang-code');
  const options = document.querySelectorAll('.lang-menu li[role="option"]');

  if (!dropdown || !trigger || !menu) return;

  let currentLang = 'es';
  options.forEach(opt => {
    opt.setAttribute('aria-selected', opt.dataset.lang === currentLang ? 'true' : 'false');
  });

  function closeDropdown() {
    dropdown.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  function openDropdown() {
    dropdown.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function toggleDropdown() {
    if (dropdown.classList.contains('is-open')) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  function selectLanguage(lang, flag, code) {
    currentLang = lang;
    if (langFlag) langFlag.textContent = flag;
    if (langCode) langCode.textContent = code;
    options.forEach(opt => {
      opt.setAttribute('aria-selected', opt.dataset.lang === lang ? 'true' : 'false');
    });
    closeDropdown();
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  options.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      selectLanguage(opt.dataset.lang, opt.dataset.flag, opt.dataset.code);
    });
  });

  document.addEventListener('click', () => closeDropdown());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });
}

// ==========================================================================
// UX SLIDER
// ==========================================================================

const COMPETITOR_SCREENSHOTS = {
  'Panjiva': 'assets/screenshot-panjiva.png',
  'Descartes Datamyne': 'assets/screenshot-descartes-datamyne.png'
};

function initUXSlider() {
  const container = document.getElementById('slider-container');
  const leftPanel = document.getElementById('slider-left');
  const handle = document.getElementById('slider-handle');
  const badgeRight = document.getElementById('slider-badge-right');
  const summaryCompetitorTitle = document.getElementById('summary-competitor-title');

  if (!container || !leftPanel || !handle) return;

  let position = 50; // percentage
  let isDragging = false;
  let rafId = null;

  function updateSlider(pct) {
    position = Math.max(5, Math.min(95, pct));
    leftPanel.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
    handle.style.left = `${position}%`;
  }

  function getPositionFromEvent(e) {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  function onDragStart(e) {
    e.preventDefault();
    isDragging = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }

  function onDragMove(e) {
    if (!isDragging) return;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      updateSlider(getPositionFromEvent(e));
      rafId = null;
    });
  }

  function onDragEnd() {
    isDragging = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  handle.addEventListener('mousedown', onDragStart);
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', onDragEnd);

  handle.addEventListener('touchstart', onDragStart, { passive: false });
  document.addEventListener('touchmove', (e) => {
    if (isDragging) e.preventDefault();
    onDragMove(e);
  }, { passive: false });
  document.addEventListener('touchend', onDragEnd);

  // Competitor dropdown
  const competitorSelect = document.getElementById('competitor-select');
  if (competitorSelect) {
    competitorSelect.addEventListener('change', () => {
      const name = competitorSelect.value;
      if (!name) return;

      if (badgeRight) badgeRight.textContent = name;
      if (summaryCompetitorTitle) summaryCompetitorTitle.textContent = name;

      const rightInner = document.getElementById('slider-right-inner');
      const placeholder = document.getElementById('slider-right-placeholder');
      if (rightInner) {
        const screenshot = COMPETITOR_SCREENSHOTS[name];
        if (screenshot) {
          rightInner.style.backgroundImage = `url('${screenshot}')`;
          if (placeholder) placeholder.style.display = 'none';
        } else {
          rightInner.style.backgroundImage = 'none';
          if (placeholder) {
            placeholder.style.display = 'flex';
            const nameEl = document.getElementById('slider-placeholder-name');
            if (nameEl) nameEl.textContent = name;
          }
        }
      }

      updateSlider(50);
    });
  }

  updateSlider(50);
}

// ==========================================================================
// SCROLL ANIMATIONS
// ==========================================================================

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
}
