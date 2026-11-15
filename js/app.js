// ============================================================================
// Pathox-Micro · Muffin Time Clinical Lesions Edition
// Select Pathogen -> Displays Muffin Time Action Card of Clinical Lesion
// ============================================================================

import { Microbe2DScene } from './scene2d.js';

class PathoxApp {
  constructor() {
    this.microbes = [];
    this.filteredMicrobes = [];
    this.currentMicrobe = null;
    this.currentCategory = 'all';
    this.currentIndex = 0;
    this.scene = null;
    this.isStudyMode = false;

    // DOM Elements
    this.canvasContainer = document.getElementById('canvas-container');
    this.quickPathogensContainer = document.getElementById('quick-pathogens-container');
    this.searchInput = document.getElementById('search-input');
    this.searchSuggestions = document.getElementById('search-suggestions');
    this.btnClearSearch = document.getElementById('btn-clear-search');
    this.medicalDrawer = document.getElementById('medical-drawer');
    this.btnFloatingDrawer = document.getElementById('btn-floating-drawer');
    this.btnOpenDrawer = document.getElementById('btn-open-drawer');
    this.btnCloseDrawer = document.getElementById('btn-close-drawer');
    this.btnDrawRandom = document.getElementById('btn-draw-random');

    // Autocomplete State
    this.suggestedMatches = [];
    this.highlightedIndex = -1;

    // Deck Navigation Elements
    this.btnPrevCard = document.getElementById('btn-prev-card');
    this.btnNextCard = document.getElementById('btn-next-card');
    this.deckCounter = document.getElementById('deck-counter');

    // Controls
    this.btnZoomIn = document.getElementById('btn-zoom-in');
    this.btnZoomOut = document.getElementById('btn-zoom-out');
    this.btnResetView = document.getElementById('btn-reset-view');

    // Tooltip Callout
    this.hudPartCallout = document.getElementById('hud-part-callout');
    this.calloutPartName = document.getElementById('callout-part-name');

    // Drawer Elements
    this.drawerPathogenName = document.getElementById('drawer-pathogen-name');
    this.drawerThaiName = document.getElementById('drawer-thai-name');
    this.tabButtons = document.querySelectorAll('.tab-btn');
    this.tabPanels = document.querySelectorAll('.tab-panel');
    this.studyModeToggle = document.getElementById('study-mode-toggle');

    this.init();
  }

  async init() {
    try {
      // 1. Fetch Pathogen & Lesion Database
      const res = await fetch('data/microbes.json');
      this.microbes = await res.json();
      this.filteredMicrobes = [...this.microbes];

      // 2. Initialize 2D Scene
      this.scene = new Microbe2DScene(this.canvasContainer);

      // Connect 2D Scene callbacks
      this.scene.onHoverPart = this.handleHoverPart.bind(this);
      this.scene.onClickPart = this.handleClickPart.bind(this);

      // 3. Setup UI & Event Listeners
      this.setupEventListeners();
      this.renderQuickPills();

      // 4. Select initial pathogen (Variola Virus)
      if (this.microbes.length > 0) {
        this.selectMicrobe(this.microbes[0].id);
      }
    } catch (err) {
      console.error('Failed to initialize Pathox App:', err);
    }
  }

  setupEventListeners() {
    // Category Filter Buttons (All, Viruses, Bacteria, Fungi)
    const catButtons = document.querySelectorAll('.cat-btn');
    catButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        catButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.dataset.category;
        this.filterDeck();
      });
    });

    // Search Input with Autocomplete & Keyboard Selection
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (this.btnClearSearch) {
          this.btnClearSearch.style.display = val.trim() ? 'flex' : 'none';
        }
        this.handleSearch(val.toLowerCase().trim());
        this.renderSearchSuggestions(val);
      });

      this.searchInput.addEventListener('focus', () => {
        if (this.searchInput.value.trim()) {
          this.renderSearchSuggestions(this.searchInput.value);
        }
      });

      this.searchInput.addEventListener('keydown', (e) => {
        if (!this.searchSuggestions || this.searchSuggestions.style.display === 'none') return;
        const items = this.searchSuggestions.querySelectorAll('.suggestion-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.highlightedIndex = (this.highlightedIndex + 1) % items.length;
          items.forEach((it, idx) => it.classList.toggle('highlighted', idx === this.highlightedIndex));
          items[this.highlightedIndex]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.highlightedIndex = (this.highlightedIndex - 1 + items.length) % items.length;
          items.forEach((it, idx) => it.classList.toggle('highlighted', idx === this.highlightedIndex));
          items[this.highlightedIndex]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (this.highlightedIndex >= 0 && this.suggestedMatches[this.highlightedIndex]) {
            this.selectSuggestedMicrobe(this.suggestedMatches[this.highlightedIndex]);
          } else if (this.suggestedMatches.length > 0) {
            this.selectSuggestedMicrobe(this.suggestedMatches[0]);
          }
        } else if (e.key === 'Escape') {
          this.hideSuggestions();
        }
      });
    }

    // Clear Search Button
    if (this.btnClearSearch) {
      this.btnClearSearch.addEventListener('click', (e) => {
        e.stopPropagation();
        this.searchInput.value = '';
        this.btnClearSearch.style.display = 'none';
        this.hideSuggestions();
        this.handleSearch('');
        this.searchInput.focus();
      });
    }

    // Document click to close autocomplete dropdown
    document.addEventListener('click', (e) => {
      const wrapper = document.getElementById('search-wrapper');
      if (wrapper && !wrapper.contains(e.target)) {
        this.hideSuggestions();
      }
    });

    // Deck Navigation: Prev / Next
    if (this.btnPrevCard) {
      this.btnPrevCard.addEventListener('click', () => this.prevCard());
    }
    if (this.btnNextCard) {
      this.btnNextCard.addEventListener('click', () => this.nextCard());
    }

    // Random Card Draw
    if (this.btnDrawRandom) {
      this.btnDrawRandom.addEventListener('click', () => this.drawRandomCard());
    }

    // Keyboard navigation (Left / Right arrow to flip cards)
    window.addEventListener('keydown', (e) => {
      if (e.target === this.searchInput) return;
      if (e.key === 'ArrowLeft') {
        this.prevCard();
      } else if (e.key === 'ArrowRight') {
        this.nextCard();
      } else if (e.key === 'r' || e.key === 'R') {
        this.drawRandomCard();
      }
    });

    // Drawer Tabs
    this.tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTabId = btn.dataset.tab;
        this.activateTab(targetTabId);
      });
    });

    // Drawer Open / Close
    this.btnCloseDrawer.addEventListener('click', () => this.toggleDrawer(false));
    this.btnOpenDrawer.addEventListener('click', () => this.toggleDrawer(true));
    this.btnFloatingDrawer.addEventListener('click', () => this.toggleDrawer(true));

    // Zoom & Reset buttons
    if (this.btnZoomIn) {
      this.btnZoomIn.addEventListener('click', () => this.scene.zoomIn());
    }
    if (this.btnZoomOut) {
      this.btnZoomOut.addEventListener('click', () => this.scene.zoomOut());
    }
    if (this.btnResetView) {
      this.btnResetView.addEventListener('click', () => this.scene.resetView());
    }

    // Callout click
    this.hudPartCallout.addEventListener('click', () => {
      if (this.currentHoveredPart) {
        this.handleClickPart(this.currentHoveredPart);
      }
    });

    // Study / Flashcard Mode
    this.studyModeToggle.addEventListener('change', (e) => {
      this.isStudyMode = e.target.checked;
      this.updateStudyModeUI();
    });

    // Setup Share & Access Control Modal (Kill Switch)
    this.setupShareAndAccessControl();

    // Clean query token from address bar on load (so guests cannot simply copy & re-share the raw link)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('token')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Start guest heartbeat
    this.startGuestHeartbeat();
  }

  startGuestHeartbeat() {
    setInterval(async () => {
      try {
        const resp = await fetch('/api/guest-status');
        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}));
          this.showGuestRevokedScreen(data.reason);
        }
      } catch (e) {
        // network hiccup
      }
    }, 4000);
  }

  showGuestRevokedScreen(reason) {
    const overlay = document.getElementById('guest-revoked-overlay');
    const msg = document.getElementById('guest-revoked-msg');
    if (overlay) {
      overlay.style.display = 'flex';
      if (reason === 'killed' && msg) {
        msg.textContent = 'เจ้าของระบบได้ทำการตัดสัญญาณ (Kill Switch) การเข้าถึงทั้งหมดถูกระงับชั่วคราว';
      } else if (msg) {
        msg.textContent = 'ช่องทางหรือลิงก์เดิมของคุณถูกรีเซ็ตแล้ว กรุณาสแกน QR Code หรือขอลิงก์ใหม่จากหน้าจอเจ้าของระบบครับ';
      }
    }
  }

  setupShareAndAccessControl() {
    const btnShare = document.getElementById('btn-share-modal');
    const modal = document.getElementById('share-access-modal');
    const btnClose = document.getElementById('btn-close-share-modal');
    const overlay = document.getElementById('share-modal-overlay');
    const checkbox = document.getElementById('public-access-checkbox');
    const banner = document.getElementById('kill-switch-banner');
    const statusText = document.getElementById('kill-status-text');
    const shareDot = document.getElementById('share-dot');
    const shareBtnIcon = document.getElementById('share-btn-icon');
    const btnLockAdmin = document.getElementById('btn-lock-admin');
    const btnRotateToken = document.getElementById('btn-rotate-token');

    // Password Modal Elements
    const passModal = document.getElementById('password-auth-modal');
    const passOverlay = document.getElementById('password-modal-overlay');
    const passForm = document.getElementById('admin-pass-form');
    const passInput = document.getElementById('admin-password-input');
    const passError = document.getElementById('password-error-msg');
    const passClose = document.getElementById('btn-close-pass-modal');
    const passCancel = document.getElementById('btn-cancel-pass');
    const passToggleEye = document.getElementById('btn-toggle-pass-visibility');

    if (!btnShare || !modal) return;

    // Check if session is already unlocked
    this.isAdminUnlocked = sessionStorage.getItem('pathox_admin_auth') === 'true';
    this.adminPassword = sessionStorage.getItem('pathox_admin_pass') || '';
    if (this.isAdminUnlocked && shareBtnIcon) {
      shareBtnIcon.className = 'fa-solid fa-share-nodes';
    }

    // Share Button Click -> If unlocked, open Share Modal; If locked, prompt Password Modal!
    btnShare.addEventListener('click', () => {
      if (this.isAdminUnlocked) {
        modal.classList.add('active');
      } else {
        if (passModal) {
          passModal.style.display = 'flex';
          if (passError) passError.style.display = 'none';
          if (passInput) {
            passInput.value = '';
            setTimeout(() => passInput.focus(), 60);
          }
        }
      }
    });

    const closePassModal = () => {
      if (passModal) passModal.style.display = 'none';
      if (passError) passError.style.display = 'none';
    };

    passClose?.addEventListener('click', closePassModal);
    passCancel?.addEventListener('click', closePassModal);
    passOverlay?.addEventListener('click', closePassModal);

    // Password Visibility Toggle (Eye icon)
    passToggleEye?.addEventListener('click', () => {
      if (!passInput) return;
      const isPassword = passInput.type === 'password';
      passInput.type = isPassword ? 'text' : 'password';
      const eyeIcon = passToggleEye.querySelector('i');
      if (eyeIcon) {
        eyeIcon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      }
    });

    // Password Form Submission
    passForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const entered = passInput ? passInput.value.trim() : '';

      try {
        const resp = await fetch('/api/verify-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: entered })
        });
        const res = await resp.json();

        if (resp.ok && res.authorized) {
          this.isAdminUnlocked = true;
          this.adminPassword = entered;
          sessionStorage.setItem('pathox_admin_auth', 'true');
          sessionStorage.setItem('pathox_admin_pass', entered);

          closePassModal();
          if (shareBtnIcon) shareBtnIcon.className = 'fa-solid fa-share-nodes';
          modal.classList.add('active');

          const shareUrl = res.fullShareUrl || res.tunnelUrl;
          if (shareUrl) {
            const liveText = document.getElementById('live-tunnel-url-text');
            const liveBtn = document.getElementById('btn-copy-live-url');
            if (liveText) liveText.textContent = shareUrl;
            if (liveBtn) liveBtn.dataset.copy = shareUrl;
          }
          if (res.qrCodeDataUrl) {
            const qrImg = document.getElementById('live-qr-image');
            if (qrImg) qrImg.src = res.qrCodeDataUrl;
          }
        } else {
          showPassError();
        }
      } catch (err) {
        // Fallback verification for offline or direct execution
        if (entered === '2549gmail') {
          this.isAdminUnlocked = true;
          this.adminPassword = entered;
          sessionStorage.setItem('pathox_admin_auth', 'true');
          sessionStorage.setItem('pathox_admin_pass', entered);

          closePassModal();
          if (shareBtnIcon) shareBtnIcon.className = 'fa-solid fa-share-nodes';
          modal.classList.add('active');
        } else {
          showPassError();
        }
      }
    });

    const showPassError = () => {
      if (passError) passError.style.display = 'flex';
      if (passInput) {
        passInput.classList.add('input-shake');
        setTimeout(() => passInput.classList.remove('input-shake'), 450);
        passInput.focus();
      }
    };

    // Lock Admin Session Button inside Share Modal
    btnLockAdmin?.addEventListener('click', () => {
      this.isAdminUnlocked = false;
      this.adminPassword = '';
      sessionStorage.removeItem('pathox_admin_auth');
      sessionStorage.removeItem('pathox_admin_pass');
      modal.classList.remove('active');
      if (shareBtnIcon) shareBtnIcon.className = 'fa-solid fa-lock';
    });

    btnClose?.addEventListener('click', () => modal.classList.remove('active'));
    overlay?.addEventListener('click', () => modal.classList.remove('active'));

    const updateUI = (enabled) => {
      if (enabled) {
        banner?.classList.remove('killed');
        if (statusText) statusText.textContent = 'สถานะ: เปิดให้ภายนอกเข้าชมได้ (Active)';
        shareDot?.classList.remove('offline');
      } else {
        banner?.classList.add('killed');
        if (statusText) statusText.textContent = 'สถานะ: ตัดสัญญาณแล้ว (Kill Switch Active)';
        shareDot?.classList.add('offline');
      }
    };

    // Fetch initial status
    fetch('/api/access-control')
      .then(r => r.json())
      .then(d => {
        if (checkbox) checkbox.checked = !!d.enabled;
        updateUI(!!d.enabled);
        const shareUrl = d.fullShareUrl || d.tunnelUrl;
        if (shareUrl) {
          const liveText = document.getElementById('live-tunnel-url-text');
          const liveBtn = document.getElementById('btn-copy-live-url');
          if (liveText) liveText.textContent = shareUrl;
          if (liveBtn) liveBtn.dataset.copy = shareUrl;
        }
        if (d.qrCodeDataUrl) {
          const qrImg = document.getElementById('live-qr-image');
          if (qrImg) qrImg.src = d.qrCodeDataUrl;
        }
      })
      .catch(() => {});

    // Kill switch toggle
    checkbox?.addEventListener('change', async () => {
      const isEnabled = checkbox.checked;
      updateUI(isEnabled);
      const pass = this.adminPassword || sessionStorage.getItem('pathox_admin_pass') || '2549gmail';
      try {
        const resp = await fetch('/api/access-control', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: isEnabled, password: pass })
        });
        const res = await resp.json();
        if (res.fullShareUrl) {
          const liveText = document.getElementById('live-tunnel-url-text');
          const liveBtn = document.getElementById('btn-copy-live-url');
          if (liveText) liveText.textContent = res.fullShareUrl;
          if (liveBtn) liveBtn.dataset.copy = res.fullShareUrl;
        }
        if (res.qrCodeDataUrl) {
          const qrImg = document.getElementById('live-qr-image');
          if (qrImg) qrImg.src = res.qrCodeDataUrl;
        }
      } catch (e) {
        console.error('Failed to update access control:', e);
      }
    });

    // Rotate Token Button (Revoke old links and QR codes)
    btnRotateToken?.addEventListener('click', async () => {
      const pass = this.adminPassword || sessionStorage.getItem('pathox_admin_pass') || '2549gmail';
      const originalHtml = btnRotateToken.innerHTML;
      try {
        btnRotateToken.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>กำลังสร้างรหัสใหม่...</span>';
        btnRotateToken.disabled = true;

        const resp = await fetch('/api/access-control', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rotateToken: true, password: pass })
        });
        const res = await resp.json();

        if (res.success && res.fullShareUrl) {
          const liveText = document.getElementById('live-tunnel-url-text');
          const liveBtn = document.getElementById('btn-copy-live-url');
          const qrImg = document.getElementById('live-qr-image');

          if (liveText) liveText.textContent = res.fullShareUrl;
          if (liveBtn) liveBtn.dataset.copy = res.fullShareUrl;
          if (qrImg && res.qrCodeDataUrl) qrImg.src = res.qrCodeDataUrl;

          if (checkbox) checkbox.checked = true;
          updateUI(true);

          btnRotateToken.innerHTML = '<i class="fa-solid fa-check" style="color: #4ade80;"></i> <span style="color: #4ade80;">ออกรหัสและ QR ใหม่สำเร็จ!</span>';
          setTimeout(() => {
            btnRotateToken.innerHTML = originalHtml;
            btnRotateToken.disabled = false;
          }, 2000);
        } else {
          btnRotateToken.innerHTML = originalHtml;
          btnRotateToken.disabled = false;
        }
      } catch (err) {
        console.error('Rotate token failed:', err);
        btnRotateToken.innerHTML = originalHtml;
        btnRotateToken.disabled = false;
      }
    });

    // Copy to clipboard buttons
    document.querySelectorAll('.btn-copy-code').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.copy;
        if (text) {
          navigator.clipboard.writeText(text);
          const icon = btn.querySelector('i');
          if (icon) {
            icon.className = 'fa-solid fa-check';
            setTimeout(() => icon.className = 'fa-regular fa-copy', 1500);
          }
        }
      });
    });
  }

  filterDeck() {
    this.filteredMicrobes = this.microbes.filter((m) => {
      if (this.currentCategory === 'all') return true;
      return m.category === this.currentCategory;
    });

    this.renderQuickPills();

    // If current microbe is not in the filtered list, select the first one
    if (this.filteredMicrobes.length > 0) {
      const stillInList = this.filteredMicrobes.some((m) => m.id === this.currentMicrobe?.id);
      if (!stillInList) {
        this.selectMicrobe(this.filteredMicrobes[0].id);
      } else {
        this.updateDeckCounter();
      }
    }
  }

  renderQuickPills() {
    this.quickPathogensContainer.innerHTML = '';

    this.filteredMicrobes.forEach((microbe) => {
      const pill = document.createElement('div');
      pill.className = `pathogen-pill ${this.currentMicrobe && this.currentMicrobe.id === microbe.id ? 'active' : ''}`;
      pill.dataset.id = microbe.id;

      const dotColor = microbe.badgeColor || '#00a8e8';
      pill.innerHTML = `
        <span class="pathogen-pill-dot" style="background-color: ${dotColor};"></span>
        <span>${microbe.name}</span>
      `;

      pill.addEventListener('click', () => {
        this.selectMicrobe(microbe.id);
      });

      this.quickPathogensContainer.appendChild(pill);
    });
  }

  handleSearch(query) {
    if (!query) {
      this.filterDeck();
      return;
    }

    this.filteredMicrobes = this.microbes.filter((m) => {
      const nameMatch = m.name.toLowerCase().includes(query);
      const thaiMatch = (m.thaiName || '').toLowerCase().includes(query);
      const sciMatch = (m.scientificName || '').toLowerCase().includes(query);
      const cardMatch = (m.cardTitle || '').toLowerCase().includes(query) || (m.cardSubtitle || '').toLowerCase().includes(query);
      const lesionMatch = (m.lesionTitle || '').toLowerCase().includes(query) || (m.lesionThai || '').toLowerCase().includes(query);
      const buzzMatch = (m.tabs?.clinical?.buzzwords || []).some((b) => b.toLowerCase().includes(query));
      return nameMatch || thaiMatch || sciMatch || cardMatch || lesionMatch || buzzMatch;
    });

    this.renderQuickPills();

    if (this.filteredMicrobes.length > 0) {
      this.selectMicrobe(this.filteredMicrobes[0].id);
    }
  }

  highlightMatch(text, query) {
    if (!query || !text) return text || '';
    const cleanQ = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${cleanQ})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  hideSuggestions() {
    if (this.searchSuggestions) {
      this.searchSuggestions.style.display = 'none';
      this.searchSuggestions.innerHTML = '';
      this.suggestedMatches = [];
      this.highlightedIndex = -1;
    }
  }

  renderSearchSuggestions(query) {
    if (!this.searchSuggestions) return;
    const q = (query || '').toLowerCase().trim();
    if (!q) {
      this.hideSuggestions();
      return;
    }

    // Smart Match: Name, Scientific, Thai Name, Lesion, Buzzwords
    const matches = [];
    this.microbes.forEach((m) => {
      let score = 0;
      let matchedReason = '';

      const nameLower = m.name.toLowerCase();
      const sciLower = (m.scientificName || '').toLowerCase();
      const thaiLower = (m.thaiName || '').toLowerCase();
      const lesionLower = ((m.lesionTitle || '') + ' ' + (m.lesionThai || '')).toLowerCase();
      const buzzwords = m.tabs?.clinical?.buzzwords || [];

      if (nameLower.startsWith(q)) {
        score = 100;
        matchedReason = 'name';
      } else if (nameLower.includes(q)) {
        score = 80;
        matchedReason = 'name';
      } else if (sciLower.startsWith(q)) {
        score = 70;
        matchedReason = 'scientific';
      } else if (sciLower.includes(q)) {
        score = 60;
        matchedReason = 'scientific';
      } else if (thaiLower.includes(q)) {
        score = 50;
        matchedReason = 'thai';
      } else if (lesionLower.includes(q)) {
        score = 40;
        matchedReason = 'lesion';
      } else if (buzzwords.some((b) => b.toLowerCase().includes(q))) {
        score = 30;
        matchedReason = 'buzzword';
      }

      if (score > 0) {
        matches.push({ microbe: m, score, matchedReason });
      }
    });

    matches.sort((a, b) => b.score - a.score);
    this.suggestedMatches = matches.map((item) => item.microbe);
    this.highlightedIndex = -1;

    if (matches.length === 0) {
      this.searchSuggestions.innerHTML = `
        <div class="suggestion-empty">
          <i class="fa-solid fa-circle-question" style="font-size: 1.2rem; color: #64748b; margin-bottom: 6px; display: block;"></i>
          ไม่พบเชื้อหรือรอยโรคที่ตรงกับ "<strong>${query}</strong>"
        </div>
      `;
      this.searchSuggestions.style.display = 'flex';
      return;
    }

    this.searchSuggestions.innerHTML = `
      <div class="suggestion-header">
        <span><i class="fa-solid fa-wand-magic-sparkles"></i> ผลการค้นหาแนะนำ (${matches.length})</span>
        <span>คลิกหรือกด Enter เพื่อเปิด</span>
      </div>
    `;

    matches.slice(0, 8).forEach((item, idx) => {
      const m = item.microbe;
      const el = document.createElement('div');
      el.className = 'suggestion-item';
      el.dataset.index = idx;
      el.dataset.id = m.id;

      // Primary clinical photograph thumbnail or fallback icon
      let thumbHtml = '';
      if (m.clinicalCases && m.clinicalCases[0] && m.clinicalCases[0].image) {
        thumbHtml = `<img src="${m.clinicalCases[0].image}" class="suggestion-thumb" alt="${m.name}" onerror="this.style.display='none'" />`;
      } else {
        const iconClass = m.category === 'virus' ? 'fa-virus' : m.category === 'bacteria' ? 'fa-bacterium' : m.category === 'fungi' ? 'fa-disease' : 'fa-worm';
        thumbHtml = `<div class="suggestion-icon-badge"><i class="fa-solid ${iconClass}"></i></div>`;
      }

      const categoryLabel = m.categoryLabel || m.category?.toUpperCase() || 'PATHOGEN';
      const highlightedName = this.highlightMatch(m.name, q);

      el.innerHTML = `
        ${thumbHtml}
        <div class="suggestion-info">
          <div class="suggestion-title">${highlightedName}</div>
          <div class="suggestion-subtitle">${m.thaiName} · ${m.lesionThai || m.lesionTitle}</div>
        </div>
        <span class="suggestion-badge">${categoryLabel}</span>
      `;

      el.addEventListener('mouseenter', () => {
        this.searchSuggestions.querySelectorAll('.suggestion-item').forEach((i) => i.classList.remove('highlighted'));
        el.classList.add('highlighted');
        this.highlightedIndex = idx;
      });

      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        this.selectSuggestedMicrobe(m);
      });

      this.searchSuggestions.appendChild(el);
    });

    this.searchSuggestions.style.display = 'flex';
  }

  selectSuggestedMicrobe(microbe) {
    if (!microbe) return;
    this.searchInput.value = microbe.name;
    if (this.btnClearSearch) this.btnClearSearch.style.display = 'flex';
    this.hideSuggestions();
    this.selectMicrobe(microbe.id);
    this.toggleDrawer(true);
    this.activateTab('tab-morphology');
  }

  selectMicrobe(microbeId) {
    const found = this.microbes.find((m) => m.id === microbeId);
    if (!found) return;

    this.currentMicrobe = found;
    this.currentIndex = this.filteredMicrobes.findIndex((m) => m.id === microbeId);
    if (this.currentIndex === -1) this.currentIndex = 0;

    // 1. Update Active state on Pills
    const pills = this.quickPathogensContainer.querySelectorAll('.pathogen-pill');
    pills.forEach((p) => {
      p.classList.toggle('active', p.dataset.id === microbeId);
    });

    // 2. Render Clinical Photographs & Stage
    if (this.scene) {
      this.scene.loadModel(found);
    }

    // 3. Update HUD Overlays & Counter
    try {
      this.updateHUD(found);
    } catch (e) {
      console.warn('HUD non-critical update warning:', e);
    }
    this.updateDeckCounter();

    // 4. Update Medical Drawer Content
    this.updateDrawer(found);
  }

  prevCard() {
    if (this.filteredMicrobes.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.filteredMicrobes.length) % this.filteredMicrobes.length;
    this.selectMicrobe(this.filteredMicrobes[this.currentIndex].id);
  }

  nextCard() {
    if (this.filteredMicrobes.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.filteredMicrobes.length;
    this.selectMicrobe(this.filteredMicrobes[this.currentIndex].id);
  }

  drawRandomCard() {
    if (this.filteredMicrobes.length <= 1) return;
    let newIndex = Math.floor(Math.random() * this.filteredMicrobes.length);
    while (newIndex === this.currentIndex && this.filteredMicrobes.length > 1) {
      newIndex = Math.floor(Math.random() * this.filteredMicrobes.length);
    }
    this.currentIndex = newIndex;
    this.selectMicrobe(this.filteredMicrobes[newIndex].id);
  }

  updateDeckCounter() {
    if (this.deckCounter && this.filteredMicrobes.length > 0) {
      this.deckCounter.textContent = `${this.currentIndex + 1} / ${this.filteredMicrobes.length}`;
    }
  }

  updateHUD(microbe) {
    if (this.hudName) this.hudName.textContent = microbe.name;
    if (this.hudThaiName) this.hudThaiName.textContent = `รอยโรค: ${microbe.lesionThai || microbe.lesionTitle}`;
    if (this.hudScientific) this.hudScientific.textContent = `เชื้อต้นเหตุ: ${microbe.scientificName} (${microbe.categoryLabel})`;

    if (this.hudTypeBadge) {
      this.hudTypeBadge.textContent = microbe.cardBadge || microbe.category?.toUpperCase() || 'PATHOGEN';
      this.hudTypeBadge.style.backgroundColor = microbe.badgeColor || '#00a8e8';
    }

    if (this.hudStatSize) this.hudStatSize.textContent = microbe.quickStats?.depth || 'Dermis/Epidermis';
    if (this.hudStatShape) {
      this.hudStatShape.textContent = 
        microbe.quickStats?.morphology || 
        microbe.quickStats?.classicSign || 
        microbe.quickStats?.hallmark || 
        microbe.quickStats?.classicLook || 'Circumscribed';
    }

    if (this.hudStatGenome) {
      this.hudStatGenome.textContent = 
        microbe.quickStats?.palpation || 
        microbe.quickStats?.abscessSign || 
        microbe.quickStats?.pain || 
        microbe.quickStats?.sensation || 'Painless / Indurated';
    }
  }

  updateDrawer(microbe) {
    if (this.drawerPathogenName) this.drawerPathogenName.textContent = microbe.name;
    if (this.drawerThaiName) this.drawerThaiName.textContent = `${microbe.thaiName} · ${microbe.lesionThai || microbe.lesionTitle}`;

    // ------------------------------------------------------------------------
    // Tab 1: Morphological Anatomy & Real Case Photos
    // ------------------------------------------------------------------------
    const partsListContainer = document.getElementById('morphology-parts-list');
    if (partsListContainer) {
      partsListContainer.innerHTML = '';

      // Render Clinical Cases Switcher inside Drawer Tab 1
      if (microbe.clinicalCases && microbe.clinicalCases.length > 0) {
        const casesHeader = document.createElement('div');
        casesHeader.style.cssText = 'font-size: 0.76rem; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: flex-start; gap: 6px; line-height: 1.4; word-break: break-word; overflow-wrap: break-word;';
        casesHeader.innerHTML = '<i class="fa-solid fa-images" style="margin-top: 2px; flex-shrink: 0;"></i> <span style="flex: 1; min-width: 0; word-break: break-word;">ภาพเคสจริงทางการแพทย์ (คลิกเพื่อสลับภาพ):</span>';
        partsListContainer.appendChild(casesHeader);

        microbe.clinicalCases.forEach((c, idx) => {
          const caseItem = document.createElement('div');
          caseItem.className = 'part-interactive-item' + (idx === (this.scene?.activeCaseIndex || 0) ? ' selected' : '');
          caseItem.style.cssText = 'display: flex; gap: 10px; align-items: center; margin-bottom: 8px; cursor: pointer; padding: 8px 10px; border-radius: 10px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); overflow: hidden;';
          caseItem.innerHTML = `
            <img src="${c.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); flex-shrink: 0;" onerror="this.style.display='none'" />
            <div style="flex: 1; min-width: 0; overflow: hidden;">
              <div style="font-size: 0.8rem; font-weight: 700; color: #f8fafc; line-height: 1.35; word-break: break-word; overflow-wrap: break-word; margin-bottom: 2px;">${c.badge || `เคสที่ ${idx+1}`}</div>
              <div style="font-size: 0.7rem; color: #94a3b8; line-height: 1.3; word-break: break-word; overflow-wrap: break-word;"><i class="fa-solid fa-shield-halved"></i> ${c.source}</div>
            </div>
            <i class="fa-solid fa-circle-chevron-right" style="font-size: 0.85rem; color: #38bdf8; flex-shrink: 0; margin-left: 4px;"></i>
          `;
          caseItem.addEventListener('click', () => {
            partsListContainer.querySelectorAll('.part-interactive-item').forEach(el => el.classList.remove('selected'));
            caseItem.classList.add('selected');
            if (this.scene) this.scene.setCaseIndex(idx);
          });
          partsListContainer.appendChild(caseItem);
        });

        const divider = document.createElement('div');
        divider.style.cssText = 'height: 1px; background: rgba(255,255,255,0.08); margin: 12px 0;';
        partsListContainer.appendChild(divider);

        const partsHeader = document.createElement('div');
        partsHeader.style.cssText = 'font-size: 0.76rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: flex-start; gap: 6px; line-height: 1.4; word-break: break-word; overflow-wrap: break-word;';
        partsHeader.innerHTML = '<i class="fa-solid fa-microscope" style="margin-top: 2px; flex-shrink: 0;"></i> <span style="flex: 1; min-width: 0; word-break: break-word;">องค์ประกอบสำคัญของรอยโรค:</span>';
        partsListContainer.appendChild(partsHeader);
      }

      if (microbe.morphologicalParts && microbe.morphologicalParts.length > 0) {
        microbe.morphologicalParts.forEach((part) => {
          const partItem = document.createElement('div');
          partItem.className = 'part-interactive-item';
          partItem.dataset.partId = part.id;

          partItem.innerHTML = `
            <div class="part-item-header">
              <span class="part-item-name">
                <span class="part-color-pill" style="background-color: ${part.color || '#38bdf8'};"></span>
                ${part.name}
              </span>
              <i class="fa-solid fa-crosshairs" style="font-size: 0.75rem; color: var(--accent-cyan);"></i>
            </div>
            <div class="part-item-desc">${part.description}</div>
          `;

          partItem.addEventListener('click', () => {
            partsListContainer.querySelectorAll('.part-interactive-item').forEach((el) => {
              el.classList.remove('selected');
            });
            partItem.classList.add('selected');
            if (this.scene) this.scene.focusOnPart(part.id);
          });

          partsListContainer.appendChild(partItem);
        });
      }
    }

    // Highlights
    const highlightsContainer = document.getElementById('morphology-highlights');
    if (highlightsContainer) {
      highlightsContainer.innerHTML = '';
      const highlights = microbe.tabs?.morphology?.highlights || [];
      highlights.forEach((hl) => {
        const li = document.createElement('li');
        li.textContent = hl;
        highlightsContainer.appendChild(li);
      });
    }

    // ------------------------------------------------------------------------
    // Tab 2: Pathogenesis & Virulence Factors
    // ------------------------------------------------------------------------
    const virulenceContainer = document.getElementById('virulence-factors-container');
    if (virulenceContainer) {
      virulenceContainer.innerHTML = '';
      const vfs = microbe.tabs?.pathogenesis?.virulenceFactors || [];
      vfs.forEach((vf) => {
        const card = document.createElement('div');
        card.style.marginBottom = '10px';
        card.innerHTML = `
          <div style="font-size: 0.82rem; font-weight: 700; color: #f43f5e; margin-bottom: 2px;">
            ✦ ${vf.name}
          </div>
          <div style="font-size: 0.78rem; color: #cbd5e1; line-height: 1.45;">
            ${vf.mechanism}
          </div>
        `;
        virulenceContainer.appendChild(card);
      });
    }

    const transEl = document.getElementById('transmission-text');
    if (transEl) transEl.textContent = microbe.tabs?.pathogenesis?.transmission || 'Direct Contact / Respiratory Droplets';

    // ------------------------------------------------------------------------
    // Tab 3: Lab Diagnosis & Culture
    // ------------------------------------------------------------------------
    const stainsList = document.getElementById('diagnosis-stains');
    if (stainsList) {
      stainsList.innerHTML = '';
      (microbe.tabs?.diagnosis?.stains || []).forEach((s) => {
        const li = document.createElement('li');
        li.textContent = s;
        stainsList.appendChild(li);
      });
    }

    const cultureList = document.getElementById('diagnosis-culture');
    if (cultureList) {
      cultureList.innerHTML = '';
      (microbe.tabs?.diagnosis?.culture || []).forEach((c) => {
        const li = document.createElement('li');
        li.textContent = c;
        cultureList.appendChild(li);
      });
    }

    const biochemicalCard = document.getElementById('biochemical-card');
    const biochemicalList = document.getElementById('diagnosis-biochemical');
    if (biochemicalList) {
      biochemicalList.innerHTML = '';
      const bioData = microbe.tabs?.diagnosis?.biochemical || microbe.tabs?.diagnosis?.serology;
      if (bioData && bioData.length > 0) {
        if (biochemicalCard) biochemicalCard.style.display = 'block';
        bioData.forEach((b) => {
          const li = document.createElement('li');
          li.textContent = b;
          biochemicalList.appendChild(li);
        });
      } else if (biochemicalCard) {
        biochemicalCard.style.display = 'none';
      }
    }

    // ------------------------------------------------------------------------
    // Tab 4: Clinical Vignettes & NL1 Pearls
    // ------------------------------------------------------------------------
    const vignetteEl = document.getElementById('clinical-vignette-text');
    if (vignetteEl) vignetteEl.textContent = microbe.tabs?.clinical?.vignette || 'Clinical presentation vignette pending.';

    const buzzwordsCloud = document.getElementById('clinical-buzzwords');
    if (buzzwordsCloud) {
      buzzwordsCloud.innerHTML = '';
      (microbe.tabs?.clinical?.buzzwords || []).forEach((bw) => {
        const tag = document.createElement('span');
        tag.className = `buzzword-tag ${this.isStudyMode ? 'study-hidden' : ''}`;
        tag.textContent = bw;
        tag.addEventListener('click', () => {
          tag.classList.toggle('revealed');
        });
        buzzwordsCloud.appendChild(tag);
      });
    }

    const noteEl = document.getElementById('clinical-highyield-note');
    if (noteEl) noteEl.textContent = microbe.tabs?.clinical?.highYieldNote || '';

    // ------------------------------------------------------------------------
    // Tab 5: Treatment & Antimicrobials
    // ------------------------------------------------------------------------
    const firstlineEl = document.getElementById('treatment-firstline');
    if (firstlineEl) {
      firstlineEl.textContent = microbe.tabs?.treatment?.firstLine || 'First line antimicrobial regimen';
      firstlineEl.className = this.isStudyMode ? 'study-hidden' : '';
      firstlineEl.onclick = () => {
        firstlineEl.classList.toggle('revealed');
      };
    }

    const secondLineEl = document.getElementById('treatment-resistance');
    if (secondLineEl) {
      secondLineEl.textContent = 
        microbe.tabs?.treatment?.woundCare || 
        microbe.tabs?.treatment?.systemic || 
        microbe.tabs?.treatment?.allergy || 
        microbe.tabs?.treatment?.abscessManagement || 
        microbe.tabs?.treatment?.childrenPregnant || 'Standard wound management protocol';
    }

    const prevEl = document.getElementById('treatment-prevention');
    if (prevEl) {
      prevEl.textContent = 
        microbe.tabs?.treatment?.prevention || 
        microbe.tabs?.treatment?.reaction || 
        microbe.tabs?.treatment?.antitoxin || 
        'Standard clinical infection control protocols';
    }
  }

  activateTab(tabId) {
    this.tabButtons.forEach((b) => b.classList.toggle('active', b.dataset.tab === tabId));
    this.tabPanels.forEach((p) => p.classList.toggle('active', p.id === tabId));
  }

  toggleDrawer(show) {
    if (show) {
      this.medicalDrawer.classList.remove('collapsed');
      this.btnFloatingDrawer.classList.remove('visible');
    } else {
      this.medicalDrawer.classList.add('collapsed');
      this.btnFloatingDrawer.classList.add('visible');
    }
  }

  handleHoverPart(partData) {
    this.currentHoveredPart = partData;
    if (partData) {
      this.calloutPartName.textContent = partData.name;
      this.hudPartCallout.style.display = 'flex';
    } else {
      this.hudPartCallout.style.display = 'none';
    }
  }

  handleClickPart(partData) {
    if (!partData) return;

    this.toggleDrawer(true);
    this.activateTab('tab-morphology');

    const partsContainer = document.getElementById('morphology-parts-list');
    const matchingEl = partsContainer.querySelector(`[data-part-id="${partData.id}"]`);
    if (matchingEl) {
      partsContainer.querySelectorAll('.part-interactive-item').forEach((el) => {
        el.classList.remove('selected');
      });
      matchingEl.classList.add('selected');
      matchingEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  updateStudyModeUI() {
    const buzzwords = document.querySelectorAll('.buzzword-tag');
    buzzwords.forEach((tag) => {
      tag.classList.remove('revealed');
      tag.classList.toggle('study-hidden', this.isStudyMode);
    });

    const firstLine = document.getElementById('treatment-firstline');
    if (firstLine) {
      firstLine.classList.remove('revealed');
      firstLine.classList.toggle('study-hidden', this.isStudyMode);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new PathoxApp();
});
