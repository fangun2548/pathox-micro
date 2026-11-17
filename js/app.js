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
    this.btnOpenFlashcard = document.getElementById('btn-open-flashcard');

    // Flashcard State (Dynamic NL1 / USMLE Study Decks)
    this.fcCurrentMode = 'symptoms-pathogen';
    this.fcCurrentCategory = 'all';
    this.fcDeck = [];
    this.fcCurrentIndex = 0;
    this.fcIsFlipped = false;

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

    // Setup Interactive Flashcard System
    this.setupFlashcardSystem();

    // Keyboard navigation (Supports both 2D Plates and Flashcard modal)
    window.addEventListener('keydown', (e) => {
      if (e.target === this.searchInput || e.target.tagName === 'INPUT') return;

      const fcModal = document.getElementById('flashcard-modal');
      if (fcModal && fcModal.style.display !== 'none') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prevFlashcard();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextFlashcard();
        } else if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          this.flipFlashcard();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          this.closeFlashcardModal();
        }
        return;
      }

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

  // ==========================================================================
  // Flashcard System (Medical Micro Flashcards for NL1 / USMLE)
  // ==========================================================================
  setupFlashcardSystem() {
    this.fcModal = document.getElementById('flashcard-modal');
    this.fcOverlay = document.getElementById('flashcard-modal-overlay');
    this.fcCloseBtn = document.getElementById('btn-close-flashcard');
    this.fcFlipper = document.getElementById('flashcard-flipper');
    this.fcFront = document.getElementById('flashcard-front');
    this.fcBack = document.getElementById('flashcard-back');
    this.fcCounter = document.getElementById('fc-counter');
    this.fcFlipLabel = document.getElementById('fc-flip-label');
    this.btnFcFlip = document.getElementById('btn-fc-flip');
    this.btnFcPrev = document.getElementById('btn-fc-prev');
    this.btnFcNext = document.getElementById('btn-fc-next');
    this.btnFcShuffle = document.getElementById('btn-fc-shuffle');
    this.btnFcGotoPathogen = document.getElementById('btn-fc-goto-pathogen');

    if (this.btnOpenFlashcard) {
      this.btnOpenFlashcard.addEventListener('click', () => this.openFlashcardModal());
    }
    if (this.fcCloseBtn) {
      this.fcCloseBtn.addEventListener('click', () => this.closeFlashcardModal());
    }
    if (this.fcOverlay) {
      this.fcOverlay.addEventListener('click', () => this.closeFlashcardModal());
    }

    // Mode Selector Buttons (1. Symptoms -> Pathogen, 2. Pathogen -> Treatment, 3. Comprehensive)
    const modeButtons = document.querySelectorAll('.fc-mode-btn');
    modeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        modeButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.fcCurrentMode = btn.dataset.mode;
        this.generateFlashcardDeck();
        this.fcCurrentIndex = 0;
        this.fcIsFlipped = false;
        if (this.fcFlipper) this.fcFlipper.classList.remove('flipped');
        if (this.fcFlipLabel) this.fcFlipLabel.textContent = 'แตะเพื่อดูเฉลย';
        this.renderCurrentFlashcard();
      });
    });

    // Category Filter Pills (All, Bacteria, Fungi, Viruses, Parasites)
    const catPills = document.querySelectorAll('.fc-cat-pill');
    catPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        catPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        this.fcCurrentCategory = pill.dataset.category;
        this.generateFlashcardDeck();
        this.fcCurrentIndex = 0;
        this.fcIsFlipped = false;
        if (this.fcFlipper) this.fcFlipper.classList.remove('flipped');
        if (this.fcFlipLabel) this.fcFlipLabel.textContent = 'แตะเพื่อดูเฉลย';
        this.renderCurrentFlashcard();
      });
    });

    // Flip card button & card surface click
    if (this.btnFcFlip) {
      this.btnFcFlip.addEventListener('click', (e) => {
        e.stopPropagation();
        this.flipFlashcard();
      });
    }
    if (this.fcFlipper) {
      this.fcFlipper.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.fc-action-btn')) return;
        this.flipFlashcard();
      });
    }

    // Prev / Next / Shuffle
    if (this.btnFcPrev) {
      this.btnFcPrev.addEventListener('click', () => this.prevFlashcard());
    }
    if (this.btnFcNext) {
      this.btnFcNext.addEventListener('click', () => this.nextFlashcard());
    }
    if (this.btnFcShuffle) {
      this.btnFcShuffle.addEventListener('click', () => this.shuffleFlashcards());
    }
    if (this.btnFcGotoPathogen) {
      this.btnFcGotoPathogen.addEventListener('click', () => this.goToDrawerFromFlashcard());
    }
  }

  openFlashcardModal() {
    if (!this.fcModal) return;
    this.fcModal.style.display = 'flex';
    this.updateFlashcardCategoryCounts();
    this.generateFlashcardDeck();
    this.fcCurrentIndex = 0;
    this.fcIsFlipped = false;
    if (this.fcFlipper) this.fcFlipper.classList.remove('flipped');
    if (this.fcFlipLabel) this.fcFlipLabel.textContent = 'แตะเพื่อดูเฉลย';
    this.renderCurrentFlashcard();
  }

  closeFlashcardModal() {
    if (!this.fcModal) return;
    this.fcModal.style.display = 'none';
    this.fcIsFlipped = false;
    if (this.fcFlipper) this.fcFlipper.classList.remove('flipped');
  }

  updateFlashcardCategoryCounts() {
    const allEl = document.getElementById('fc-count-all');
    const bacEl = document.getElementById('fc-count-bacteria');
    const funEl = document.getElementById('fc-count-fungi');
    const virEl = document.getElementById('fc-count-virus');
    const parEl = document.getElementById('fc-count-parasite');

    const total = this.microbes.length;
    const bac = this.microbes.filter(m => m.category === 'bacteria').length;
    const fun = this.microbes.filter(m => m.category === 'fungi').length;
    const vir = this.microbes.filter(m => m.category === 'virus').length;
    const par = this.microbes.filter(m => m.category === 'parasite').length;

    if (allEl) allEl.textContent = total;
    if (bacEl) bacEl.textContent = bac;
    if (funEl) funEl.textContent = fun;
    if (virEl) virEl.textContent = vir;
    if (parEl) parEl.textContent = par;
  }

  generateFlashcardDeck() {
    let list = this.microbes || [];
    if (this.fcCurrentCategory && this.fcCurrentCategory !== 'all') {
      list = list.filter(m => m.category === this.fcCurrentCategory);
    }
    this.fcDeck = [...list];
    if (this.fcCurrentIndex >= this.fcDeck.length) {
      this.fcCurrentIndex = 0;
    }
  }

  flipFlashcard() {
    if (this.fcDeck.length === 0) return;
    this.fcIsFlipped = !this.fcIsFlipped;
    if (this.fcFlipper) {
      this.fcFlipper.classList.toggle('flipped', this.fcIsFlipped);
    }
    if (this.fcFlipLabel) {
      this.fcFlipLabel.textContent = this.fcIsFlipped ? 'แตะเพื่อกลับไปโจทย์' : 'แตะเพื่อดูเฉลย';
    }
  }

  prevFlashcard() {
    if (this.fcDeck.length === 0) return;
    this.fcCurrentIndex = (this.fcCurrentIndex - 1 + this.fcDeck.length) % this.fcDeck.length;
    this.fcIsFlipped = false;
    if (this.fcFlipper) this.fcFlipper.classList.remove('flipped');
    if (this.fcFlipLabel) this.fcFlipLabel.textContent = 'แตะเพื่อดูเฉลย';
    this.renderCurrentFlashcard();
  }

  nextFlashcard() {
    if (this.fcDeck.length === 0) return;
    this.fcCurrentIndex = (this.fcCurrentIndex + 1) % this.fcDeck.length;
    this.fcIsFlipped = false;
    if (this.fcFlipper) this.fcFlipper.classList.remove('flipped');
    if (this.fcFlipLabel) this.fcFlipLabel.textContent = 'แตะเพื่อดูเฉลย';
    this.renderCurrentFlashcard();
  }

  shuffleFlashcards() {
    if (this.fcDeck.length <= 1) return;
    for (let i = this.fcDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.fcDeck[i], this.fcDeck[j]] = [this.fcDeck[j], this.fcDeck[i]];
    }
    this.fcCurrentIndex = 0;
    this.fcIsFlipped = false;
    if (this.fcFlipper) this.fcFlipper.classList.remove('flipped');
    if (this.fcFlipLabel) this.fcFlipLabel.textContent = 'แตะเพื่อดูเฉลย';
    this.renderCurrentFlashcard();
  }

  goToDrawerFromFlashcard() {
    if (this.fcDeck.length === 0) return;
    const microbe = this.fcDeck[this.fcCurrentIndex];
    if (microbe) {
      this.closeFlashcardModal();
      this.selectMicrobe(microbe.id);
      this.toggleDrawer(true);
      if (this.fcCurrentMode === 'pathogen-treatment') {
        this.activateTab('tab-treatment');
      } else {
        this.activateTab('tab-pathogenesis');
      }
    }
  }

  renderCurrentFlashcard() {
    if (!this.fcFront || !this.fcBack) return;

    if (this.fcDeck.length === 0) {
      this.fcFront.innerHTML = `
        <div style="margin: auto; text-align: center; color: #94a3b8; padding: 40px 20px;">
          <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; color: #64748b; margin-bottom: 12px;"></i>
          <h4 style="color: #fff; margin-bottom: 8px;">ไม่มีการ์ดในหมวดหมู่นี้</h4>
          <p style="font-size: 0.82rem;">กรุณาเลือกหมวดหมู่อื่นจากแถบด้านบน</p>
        </div>
      `;
      this.fcBack.innerHTML = this.fcFront.innerHTML;
      if (this.fcCounter) this.fcCounter.textContent = 'การ์ดที่ 0 / 0';
      return;
    }

    const microbe = this.fcDeck[this.fcCurrentIndex];
    if (this.fcCounter) {
      this.fcCounter.textContent = `การ์ดที่ ${this.fcCurrentIndex + 1} / ${this.fcDeck.length}`;
    }

    const catLabels = {
      bacteria: 'แบคทีเรีย (Bacteria)',
      fungi: 'เชื้อรา (Fungi)',
      virus: 'ไวรัส (Virus)',
      parasite: 'ปรสิต (Parasites)'
    };
    const categoryThai = catLabels[microbe.category] || microbe.category || 'เชื้อจุลชีพ';

    const imgUrl = (microbe.clinicalCases && microbe.clinicalCases[0] && microbe.clinicalCases[0].image)
      ? microbe.clinicalCases[0].image
      : (microbe.image || '');
    const imgCaption = (microbe.clinicalCases && microbe.clinicalCases[0] && microbe.clinicalCases[0].caption)
      ? microbe.clinicalCases[0].caption
      : (microbe.lesionThai || 'ภาพรอยโรคทางคลินิก (CDC/WHO)');

    const mildText = microbe.quickStats?.morphology || microbe.lesionThai || 'ผื่นเริ่มแรก ตุ่มนูน แผลเฉพาะที่ ระยะเฉียบพลันแรกรับ';
    const severeText = (microbe.quickStats?.depth ? `${microbe.quickStats.depth}${microbe.quickStats.palpation ? ` (${microbe.quickStats.palpation})` : ''}` : '')
      || (microbe.tabs?.pathogenesis?.virulenceFactors?.[0]?.description)
      || 'การลุกลามเข้าสู่เนื้อเยื่อส่วนลึก หรือการกระจายไปตามกระแสเลือด';

    let clues = [];
    if (microbe.tabs?.pathogenesis?.transmission) {
      clues.push(`การติดต่อ: ${microbe.tabs.pathogenesis.transmission}`);
    }
    if (microbe.clinicalCases?.[0]?.keyFindings && Array.isArray(microbe.clinicalCases[0].keyFindings)) {
      clues.push(...microbe.clinicalCases[0].keyFindings);
    }
    const cluesHtml = clues.length ? `
      <div style="font-size: 0.76rem; color: #94a3b8; margin-bottom: 10px; line-height: 1.45;">
        <strong style="color: #cbd5e1;"><i class="fa-solid fa-magnifying-glass"></i> ข้อมูลช่วยวินิจฉัย (Clues):</strong> ${clues.slice(0, 3).join(' • ')}
      </div>
    ` : '';

    const firstLineRx = microbe.tabs?.treatment?.firstLine || 'First-line antimicrobial regimen ตามมาตรฐาน IDSA / Thai CPG';
    const altRx = microbe.tabs?.treatment?.alternative || microbe.tabs?.treatment?.woundCare || microbe.tabs?.treatment?.systemic || 'ยาทางเลือกตามความไวและผลการเพาะเชื้อ';
    const pregRx = microbe.tabs?.treatment?.childrenPregnant || (microbe.category === 'bacteria' ? 'หลีกเลี่ยง Tetracyclines / Fluoroquinolones ในสตรีมีครรภ์' : 'ปรึกษาแพทย์เฉพาะทางก่อนให้ยาในสตรีมีครรภ์');
    const resRx = microbe.tabs?.treatment?.resistance || microbe.tabs?.treatment?.reaction || 'ติดตามผล Antibiogram และการตอบสนองทางคลินิก';

    // ------------------------------------------------------------------------
    // Mode 1: อาการเบา/หนัก (พร้อมรูปรอยโรค) ➜ เชื้อที่ก่อโรค
    // ------------------------------------------------------------------------
    if (this.fcCurrentMode === 'symptoms-pathogen') {
      // Front: Symptoms & Lesion Photo
      this.fcFront.innerHTML = `
        <span class="fc-card-tag question">
          <i class="fa-solid fa-stethoscope"></i> โจทย์อาการและรอยโรค ➜ ทายชื่อเชื้อ
        </span>

        ${imgUrl ? `
        <div class="fc-photo-box">
          <img src="${imgUrl}" alt="${microbe.name}" onerror="this.parentElement.style.display='none';">
          <span class="fc-photo-badge"><i class="fa-solid fa-camera"></i> ${imgCaption}</span>
        </div>` : ''}

        <div class="fc-symptom-grid">
          <div class="fc-symptom-box mild">
            <div class="fc-box-label"><i class="fa-solid fa-circle-check"></i> อาการเบา / ระยะแรก (Mild / Early)</div>
            <div class="fc-box-text">${mildText}</div>
          </div>
          <div class="fc-symptom-box severe">
            <div class="fc-box-label"><i class="fa-solid fa-triangle-exclamation"></i> อาการหนัก / ลุกลาม (Severe / Invasive)</div>
            <div class="fc-box-text">${severeText}</div>
          </div>
        </div>

        ${cluesHtml}

        <div class="fc-question-prompt">
          <i class="fa-regular fa-lightbulb"></i>
          <span>เชื้อก่อโรคชนิดนี้คืออะไร? (คลิกการ์ดหรือเคาะ Spacebar เพื่อดูเฉลย)</span>
        </div>
      `;

      // Back: Pathogen Name & Pathogenesis
      const vfList = (microbe.tabs?.pathogenesis?.virulenceFactors || []).slice(0, 2);
      const vfText = vfList.length 
        ? vfList.map(v => `<strong>${v.name}:</strong> ${v.mechanism || v.desc || v.description}`).join('<br>')
        : (microbe.tabs?.pathogenesis?.transmission || 'กลไกการก่อโรคและสารพิษเฉพาะตัว');

      const diagText = microbe.tabs?.diagnosis?.gramStain 
        || (Array.isArray(microbe.tabs?.diagnosis?.culture) ? microbe.tabs.diagnosis.culture[0] : microbe.tabs?.diagnosis?.culture)
        || 'ลักษณะการตรวจย้อมทางห้องปฏิบัติการ';

      this.fcBack.innerHTML = `
        <span class="fc-card-tag answer">
          <i class="fa-solid fa-circle-check"></i> เฉลยชื่อเชื้อก่อโรค (Pathogen Identification)
        </span>

        <h4 class="fc-answer-title">${microbe.name}</h4>
        <div class="fc-answer-sub">${microbe.thaiName || microbe.nameThai || ''} · กลุ่ม: <span class="category-badge ${microbe.category}">${categoryThai}</span></div>

        <div class="fc-rx-card firstline">
          <div class="fc-rx-title"><i class="fa-solid fa-burst"></i> กลไกการเกิดโรค &amp; สารพิษความรุนแรง</div>
          <div class="fc-rx-desc">${vfText}</div>
        </div>

        <div class="fc-rx-card alternative">
          <div class="fc-rx-title"><i class="fa-solid fa-microscope"></i> จุดเด่นการตรวจวินิจฉัย (Diagnosis Pearls)</div>
          <div class="fc-rx-desc"><strong>Gram/Morphology:</strong> ${diagText}</div>
        </div>

        <div style="margin-top: auto; display: flex; justify-content: flex-end; padding-top: 8px;">
          <button type="button" class="fc-action-btn accent" id="btn-fc-back-goto-drawer" style="font-size: 0.78rem;">
            <i class="fa-solid fa-book-medical"></i> <span>เปิดอ่านข้อมูลเต็มใน Medical Drawer</span>
          </button>
        </div>
      `;

      const backBtn = this.fcBack.querySelector('#btn-fc-back-goto-drawer');
      if (backBtn) {
        backBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.goToDrawerFromFlashcard();
        });
      }
    }

    // ------------------------------------------------------------------------
    // Mode 2: เชื้อก่อโรค ➜ ยารักษา / ยาในบางกรณีเช่นคนท้อง หรือแพ้
    // ------------------------------------------------------------------------
    else if (this.fcCurrentMode === 'pathogen-treatment') {
      // Front: Pathogen + Treatment Challenge
      this.fcFront.innerHTML = `
        <span class="fc-card-tag question">
          <i class="fa-solid fa-pills"></i> โจทย์การรักษา ➜ ทายยาหลัก / คนท้อง / แพ้ยา
        </span>

        <h4 class="fc-answer-title" style="margin-bottom: 4px;">${microbe.name}</h4>
        <div class="fc-answer-sub">${microbe.thaiName || microbe.nameThai || ''} · กลุ่ม: <span class="category-badge ${microbe.category}">${categoryThai}</span></div>

        ${imgUrl ? `
        <div class="fc-photo-box" style="height: 125px; margin-bottom: 12px;">
          <img src="${imgUrl}" alt="${microbe.name}" style="height: 125px;" onerror="this.parentElement.style.display='none';">
          <span class="fc-photo-badge"><i class="fa-solid fa-stethoscope"></i> ${microbe.lesionThai || 'รอยโรคจำเพาะ'}</span>
        </div>` : ''}

        <div style="background: rgba(0,0,0,0.25); border-radius: 12px; padding: 12px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 12px;">
          <div style="font-size: 0.8rem; color: #38bdf8; font-weight: 700; margin-bottom: 6px;"><i class="fa-solid fa-circle-question"></i> คำถามทางคลินิก (Clinical Challenge):</div>
          <div style="font-size: 0.78rem; color: #e2e8f0; line-height: 1.6;">
            1. <strong>First-line DOC:</strong> ยาขนานแรกที่แนะนำตามไกด์ไลน์คือยาใด?<br>
            2. <strong>กรณีพิเศษ:</strong> หากผู้ป่วยเป็นสตรีมีครรภ์ (Pregnancy) หรือแพ้ยาหลัก (Allergy) จะปรับใช้ยาใด?<br>
            3. <strong>ข้อควรระวัง:</strong> มีข้อควรระวังหรือกลไกการดื้อยาสำคัญอย่างไร?
          </div>
        </div>

        <div class="fc-question-prompt">
          <i class="fa-solid fa-rotate"></i>
          <span>แตะการ์ดหรือเคาะ Spacebar เพื่อดูเฉลยสูตรยาและการรักษา</span>
        </div>
      `;

      // Back: First-line, Pregnancy, Allergy, Resistance
      this.fcBack.innerHTML = `
        <span class="fc-card-tag answer">
          <i class="fa-solid fa-clipboard-check"></i> เฉลยแนวทางการรักษา (Antimicrobial Therapy)
        </span>

        <h4 class="fc-answer-title">${microbe.name}</h4>
        <div class="fc-answer-sub">${microbe.thaiName || microbe.nameThai || ''}</div>

        <div class="fc-rx-card firstline">
          <div class="fc-rx-title"><i class="fa-solid fa-trophy"></i> First-line Drug of Choice (ยาหลักขนานแรก)</div>
          <div class="fc-rx-desc"><strong>${firstLineRx}</strong></div>
        </div>

        <div class="fc-rx-card alternative">
          <div class="fc-rx-title"><i class="fa-solid fa-person-pregnant"></i> สตรีมีครรภ์ &amp; ผู้ป่วยแพ้ยา (Pregnancy &amp; Allergy)</div>
          <div class="fc-rx-desc">
            <strong>🤰 ในหญิงตั้งครรภ์:</strong> ${pregRx}<br>
            <strong>⚠️ กรณีแพ้ยา / ยาทางเลือก:</strong> ${altRx}
          </div>
        </div>

        <div class="fc-rx-card resistance">
          <div class="fc-rx-title"><i class="fa-solid fa-shield-virus"></i> ข้อควรระวัง &amp; กลไกการดื้อยา (Resistance)</div>
          <div class="fc-rx-desc">${resRx}</div>
        </div>

        <div style="margin-top: auto; display: flex; justify-content: flex-end; padding-top: 8px;">
          <button type="button" class="fc-action-btn accent" id="btn-fc-back-goto-treatment" style="font-size: 0.78rem;">
            <i class="fa-solid fa-pills"></i> <span>ดูหัวข้อการรักษาใน Drawer</span>
          </button>
        </div>
      `;

      const backBtn = this.fcBack.querySelector('#btn-fc-back-goto-treatment');
      if (backBtn) {
        backBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.goToDrawerFromFlashcard();
        });
      }
    }

    // ------------------------------------------------------------------------
    // Mode 3: แฟลชการ์ดแบบรวม (All-in-One Comprehensive Mode)
    // ------------------------------------------------------------------------
    else {
      // Front: Full Vignette
      this.fcFront.innerHTML = `
        <span class="fc-card-tag question" style="background: rgba(249, 115, 22, 0.18); border-color: rgba(249, 115, 22, 0.4); color: #fb923c;">
          <i class="fa-solid fa-fire"></i> แฟลชการ์ดรวม (All-in-One Board Vignette)
        </span>

        ${imgUrl ? `
        <div class="fc-photo-box" style="height: 140px; margin-bottom: 12px;">
          <img src="${imgUrl}" alt="${microbe.name}" style="height: 140px;" onerror="this.parentElement.style.display='none';">
          <span class="fc-photo-badge"><i class="fa-solid fa-camera"></i> ${imgCaption}</span>
        </div>` : ''}

        <div class="fc-symptom-grid">
          <div class="fc-symptom-box mild">
            <div class="fc-box-label"><i class="fa-solid fa-circle-check"></i> อาการเบา / ระยะแรก (Mild / Early)</div>
            <div class="fc-box-text">${mildText}</div>
          </div>
          <div class="fc-symptom-box severe">
            <div class="fc-box-label"><i class="fa-solid fa-triangle-exclamation"></i> อาการหนัก / ลุกลาม (Severe / Invasive)</div>
            <div class="fc-box-text">${severeText}</div>
          </div>
        </div>

        ${cluesHtml}

        <div class="fc-question-prompt" style="color: #fb923c; border-color: rgba(249, 115, 22, 0.4); background: rgba(249, 115, 22, 0.08);">
          <i class="fa-solid fa-brain"></i>
          <span>จงวินิจฉัยเชื้อก่อโรค และระบุยา First-line DOC พร้อมการดูแลในคนท้อง/แพ้ยา</span>
        </div>
      `;

      // Back: Comprehensive Summary
      this.fcBack.innerHTML = `
        <span class="fc-card-tag answer" style="background: rgba(249, 115, 22, 0.18); border-color: rgba(249, 115, 22, 0.4); color: #fb923c;">
          <i class="fa-solid fa-star"></i> เฉลยสรุปครบวงจร (Full Comprehensive Solution)
        </span>

        <h4 class="fc-answer-title">${microbe.name} <span style="font-size: 0.9rem; font-weight: normal; color: #94a3b8;">(${microbe.thaiName || microbe.nameThai || ''})</span></h4>
        <div class="fc-answer-sub">หมวดหมู่: <span class="category-badge ${microbe.category}">${categoryThai}</span></div>

        <div class="fc-rx-card firstline">
          <div class="fc-rx-title"><i class="fa-solid fa-trophy"></i> 1. ยาหลักขนานแรก (First-line DOC)</div>
          <div class="fc-rx-desc"><strong>${firstLineRx}</strong></div>
        </div>

        <div class="fc-rx-card alternative">
          <div class="fc-rx-title"><i class="fa-solid fa-person-pregnant"></i> 2. สตรีมีครรภ์ &amp; กรณีแพ้ยา (Pregnancy &amp; Allergy)</div>
          <div class="fc-rx-desc">
            <strong>🤰 สตรีมีครรภ์:</strong> ${pregRx}<br>
            <strong>⚠️ กรณีแพ้ยา:</strong> ${altRx}
          </div>
        </div>

        <div class="fc-rx-card resistance">
          <div class="fc-rx-title"><i class="fa-solid fa-shield-virus"></i> 3. กลไกก่อโรค &amp; การดื้อยาสำคัญ (Pearls)</div>
          <div class="fc-rx-desc">
            ${microbe.tabs?.pathogenesis?.transmission ? `<strong>การติดต่อ:</strong> ${microbe.tabs.pathogenesis.transmission}<br>` : ''}
            <strong>ข้อควรระวัง:</strong> ${resRx}
          </div>
        </div>

        <div style="margin-top: auto; display: flex; justify-content: flex-end; padding-top: 8px;">
          <button type="button" class="fc-action-btn accent" id="btn-fc-back-goto-comprehensive" style="font-size: 0.78rem;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> <span>เปิดศึกษาต่อใน Drawer</span>
          </button>
        </div>
      `;

      const backBtn = this.fcBack.querySelector('#btn-fc-back-goto-comprehensive');
      if (backBtn) {
        backBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.goToDrawerFromFlashcard();
        });
      }
    }
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
    this.activateTab('tab-pathogenesis');
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
    if (!microbe) return;

    // Safe helper: Turn any string or array into a safe Array of strings
    const toSafeArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.map(x => typeof x === 'string' ? x : JSON.stringify(x));
      if (typeof val === 'string') return [val];
      return [String(val)];
    };

    if (this.drawerPathogenName) this.drawerPathogenName.textContent = microbe.name;
    if (this.drawerThaiName) this.drawerThaiName.textContent = `${microbe.thaiName} · ${microbe.lesionThai || microbe.lesionTitle}`;

    // ------------------------------------------------------------------------
    // Tab 1: กลไก (Pathogenesis & Virulence Factors)
    // ------------------------------------------------------------------------
    try {
      const virulenceContainer = document.getElementById('virulence-factors-container');
      if (virulenceContainer) {
        virulenceContainer.innerHTML = '';
        const vfs = microbe.tabs?.pathogenesis?.virulenceFactors || [];
        if (vfs.length === 0) {
          virulenceContainer.innerHTML = '<div style="font-size: 0.8rem; color: #94a3b8;">ไม่มีข้อมูลปัจจัยความรุนแรงระบุ</div>';
        } else {
          vfs.forEach((vf) => {
            const card = document.createElement('div');
            card.style.cssText = 'margin-bottom: 12px; padding: 10px 12px; border-radius: 8px; background: rgba(244,63,94,0.06); border: 1px solid rgba(244,63,94,0.18);';
            const mechanismText = vf.mechanism || vf.desc || 'ไม่มีคำอธิบายเพิ่มเติม';
            card.innerHTML = `
              <div style="font-size: 0.84rem; font-weight: 700; color: #f43f5e; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-burst" style="font-size: 0.75rem;"></i>
                <span>${vf.name}</span>
              </div>
              <div style="font-size: 0.8rem; color: #e2e8f0; line-height: 1.5;">
                ${mechanismText}
              </div>
            `;
            virulenceContainer.appendChild(card);
          });
        }
      }

      // Immune Evasion
      const immuneCard = document.getElementById('immune-evasion-card');
      const immuneList = document.getElementById('immune-evasion-list');
      if (immuneList) {
        immuneList.innerHTML = '';
        const immuneItems = toSafeArray(microbe.tabs?.pathogenesis?.immuneEvasion);
        if (immuneItems.length > 0) {
          if (immuneCard) immuneCard.style.display = 'block';
          immuneItems.forEach((item) => {
            const li = document.createElement('li');
            li.style.cssText = 'font-size: 0.8rem; line-height: 1.5; color: #cbd5e1; margin-bottom: 6px;';
            li.innerHTML = `<i class="fa-solid fa-shield-virus" style="color: #38bdf8; margin-right: 6px; font-size: 0.75rem;"></i>${item}`;
            immuneList.appendChild(li);
          });
        } else if (immuneCard) {
          immuneCard.style.display = 'none';
        }
      }

      // Transmission
      const transEl = document.getElementById('transmission-text');
      if (transEl) {
        transEl.textContent = microbe.tabs?.pathogenesis?.transmission || 'การสัมผัสโดยตรง / ละอองฝอยทางเดินหายใจ / พาหะนำโรค';
      }
    } catch (e) {
      console.warn('Pathogenesis tab update error:', e);
    }

    // ------------------------------------------------------------------------
    // Tab 2: วินิจฉัย (Diagnosis & Laboratory)
    // ------------------------------------------------------------------------
    try {
      // Microscopy & Staining
      const stainsList = document.getElementById('diagnosis-stains');
      if (stainsList) {
        stainsList.innerHTML = '';
        const stains = toSafeArray(microbe.tabs?.diagnosis?.stains || microbe.tabs?.diagnosis?.staining);
        if (stains.length === 0) {
          stainsList.innerHTML = '<li style="color: #94a3b8;">ไม่มีข้อมูลการย้อมสี</li>';
        } else {
          stains.forEach((s) => {
            const li = document.createElement('li');
            li.style.cssText = 'font-size: 0.8rem; line-height: 1.5; color: #cbd5e1; margin-bottom: 6px;';
            li.innerHTML = `<i class="fa-solid fa-microscope" style="color: #a855f7; margin-right: 6px; font-size: 0.75rem;"></i>${s}`;
            stainsList.appendChild(li);
          });
        }
      }

      // Culture & Colony Morphology
      const cultureList = document.getElementById('diagnosis-culture');
      if (cultureList) {
        cultureList.innerHTML = '';
        const cultures = toSafeArray(microbe.tabs?.diagnosis?.culture);
        if (cultures.length === 0) {
          cultureList.innerHTML = '<li style="color: #94a3b8;">ไม่สามารถเพาะเชื้อได้ในอาหารสังเคราะห์ทั่วไป หรือไม่มีข้อมูล</li>';
        } else {
          cultures.forEach((c) => {
            const li = document.createElement('li');
            li.style.cssText = 'font-size: 0.8rem; line-height: 1.5; color: #cbd5e1; margin-bottom: 6px;';
            li.innerHTML = `<i class="fa-solid fa-petri-dish" style="color: #10b981; margin-right: 6px; font-size: 0.75rem;"></i>${c}`;
            cultureList.appendChild(li);
          });
        }
      }

      // Biochemical & Confirmatory Tests
      const biochemicalCard = document.getElementById('biochemical-card');
      const biochemicalList = document.getElementById('diagnosis-biochemical');
      if (biochemicalList) {
        biochemicalList.innerHTML = '';
        const bioData = toSafeArray(
          microbe.tabs?.diagnosis?.biochemical || 
          microbe.tabs?.diagnosis?.serology || 
          microbe.tabs?.diagnosis?.tests
        );
        if (bioData.length > 0) {
          if (biochemicalCard) biochemicalCard.style.display = 'block';
          bioData.forEach((b) => {
            const li = document.createElement('li');
            li.style.cssText = 'font-size: 0.8rem; line-height: 1.5; color: #cbd5e1; margin-bottom: 6px;';
            li.innerHTML = `<i class="fa-solid fa-vial" style="color: #f59e0b; margin-right: 6px; font-size: 0.75rem;"></i>${b}`;
            biochemicalList.appendChild(li);
          });
        } else if (biochemicalCard) {
          biochemicalCard.style.display = 'none';
        }
      }
    } catch (e) {
      console.warn('Diagnosis tab update error:', e);
    }

    // ------------------------------------------------------------------------
    // Tab 3: การรักษา (Treatment & Antimicrobials)
    // ------------------------------------------------------------------------
    try {
      const firstlineEl = document.getElementById('treatment-firstline');
      if (firstlineEl) {
        firstlineEl.textContent = microbe.tabs?.treatment?.firstLine || 'First line antimicrobial regimen according to standard clinical guidelines.';
        firstlineEl.className = this.isStudyMode ? 'study-hidden' : '';
        firstlineEl.onclick = () => {
          firstlineEl.classList.toggle('revealed');
        };
      }

      const altEl = document.getElementById('treatment-alternative');
      if (altEl) {
        altEl.textContent = 
          microbe.tabs?.treatment?.alternative || 
          microbe.tabs?.treatment?.woundCare || 
          microbe.tabs?.treatment?.systemic || 
          microbe.tabs?.treatment?.allergy || 
          microbe.tabs?.treatment?.abscessManagement || 
          microbe.tabs?.treatment?.childrenPregnant || 
          'ยาทางเลือกกรณีแพ้กลุ่มหลักหรือผู้ป่วยกลุ่มเฉพาะ (สตรีมีครรภ์/เด็ก)';
      }

      const resEl = document.getElementById('treatment-resistance');
      if (resEl) {
        resEl.textContent = 
          microbe.tabs?.treatment?.resistance || 
          microbe.tabs?.treatment?.prevention || 
          microbe.tabs?.treatment?.reaction || 
          microbe.tabs?.treatment?.antitoxin || 
          'ข้อควรระวังสำคัญและกลไกการดื้อยาตามแนวทางเวชปฏิบัติ';
      }
    } catch (e) {
      console.warn('Treatment tab update error:', e);
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
    this.activateTab('tab-pathogenesis');
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
