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

    const applySharePayload = (enabled, shareUrl, qrDataUrl) => {
      if (checkbox) checkbox.checked = !!enabled;
      updateUI(!!enabled);

      const liveText = document.getElementById('live-tunnel-url-text');
      const liveBtn = document.getElementById('btn-copy-live-url');
      const qrImg = document.getElementById('live-qr-image');

      if (enabled && shareUrl) {
        if (liveText) liveText.textContent = shareUrl;
        if (liveBtn) liveBtn.dataset.copy = shareUrl;
        if (qrImg && qrDataUrl) {
          qrImg.src = qrDataUrl;
          qrImg.style.opacity = '1';
        }
      } else {
        if (liveText) liveText.textContent = '🔒 ตัดสัญญาณแล้ว (เปิดสวิตช์ด้านบนเพื่อสุ่มลิงก์ & QR ใหม่)';
        if (liveBtn) liveBtn.dataset.copy = '';
        if (qrImg) qrImg.style.opacity = '0.15';
      }
    };

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

          applySharePayload(res.enabled !== false, res.fullShareUrl, res.qrCodeDataUrl);
        } else {
          showPassError();
        }
      } catch (err) {
        showPassError();
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

    // Fetch initial status (Guests only see status dot; Share URL & QR are only fetched with Admin password)
    const savedPass = this.adminPassword || sessionStorage.getItem('pathox_admin_pass') || '';
    fetch('/api/access-control', {
      headers: savedPass ? { 'x-admin-password': savedPass } : {}
    })
      .then(r => r.json())
      .then(d => {
        if (d.fullShareUrl || !d.enabled) {
          applySharePayload(!!d.enabled, d.fullShareUrl, d.qrCodeDataUrl);
        } else {
          if (checkbox) checkbox.checked = !!d.enabled;
          updateUI(!!d.enabled);
        }
      })
      .catch(() => {});

    // Kill switch toggle
    checkbox?.addEventListener('change', async () => {
      const isEnabled = checkbox.checked;
      updateUI(isEnabled);
      const pass = this.adminPassword || sessionStorage.getItem('pathox_admin_pass') || '';
      try {
        const resp = await fetch('/api/access-control', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: isEnabled, password: pass })
        });
        const res = await resp.json();
        if (resp.ok) {
          applySharePayload(!!res.enabled, res.fullShareUrl, res.qrCodeDataUrl);
        }
      } catch (e) {
        console.error('Failed to update access control:', e);
      }
    });

    // Rotate Token Button (Revoke old links and QR codes)
    btnRotateToken?.addEventListener('click', async () => {
      const pass = this.adminPassword || sessionStorage.getItem('pathox_admin_pass') || '';
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

        if (resp.ok && res.success && res.fullShareUrl) {
          applySharePayload(true, res.fullShareUrl, res.qrCodeDataUrl);

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
        this.updateFlashcardCategoryCounts();
        this.generateFlashcardDeck();
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
    this.renderCurrentFlashcard();
  }

  closeFlashcardModal() {
    if (!this.fcModal) return;
    this.fcModal.style.display = 'none';
    this.fcIsFlipped = false;
    if (this.fcFlipper) this.fcFlipper.classList.remove('flipped');
  }

  getConciseDoc(m) {
    const map = {
      'variola-virus': 'Tecovirimat (TPOXX) · ทางเลือก: Brincidofovir / Cidofovir',
      'staphylococcus-aureus': '• MSSA: Cloxacillin / Cefazolin (Oral: Dicloxacillin)\n• MRSA: Vancomycin หรือ Daptomycin',
      'bacillus-anthracis': 'Ciprofloxacin หรือ Doxycycline (รายรุนแรง: ร่วมกับ Meropenem + Antitoxin)',
      'treponema-pallidum': 'Benzathine Penicillin G 2.4 ล้านยูนิต IM (Neurosyphilis: Penicillin G IV)',
      'varicella-zoster': 'Acyclovir หรือ Valacyclovir (เด็กสุขภาพดี: รักษาตามอาการ)',
      'borrelia-burgdorferi': 'Doxycycline 100 mg bid (ทางเลือก: Amoxicillin หรือ Cefuroxime)',
      'candida-albicans': 'Fluconazole (Oral Thrush: Nystatin / Clotrimazole; Invasive: Caspofungin)',
      'clostridioides-difficile': 'Oral Fidaxomicin หรือ Oral Vancomycin (ห้ามใช้ยากดการบีบตัวลำไส้)',
      'entamoeba-histolytica': 'Metronidazole หรือ Tinidazole ตามด้วย Paromomycin',
      'streptococcus-pyogenes': 'Penicillin V หรือ Amoxicillin หรือ Benzathine Penicillin G IM',
      'neisseria-gonorrhoeae': 'Ceftriaxone 500 mg IM (+ Doxycycline หากยังไม่ตัด Chlamydia)',
      'burkholderia-pseudomallei': '• Induction (10-14 วัน): IV Ceftazidime หรือ Meropenem\n• Eradication (12-20 สัปดาห์): Oral Co-trimoxazole (TMP-SMX)',
      'streptococcus-pneumoniae': '• เชื้อไวต่อยา: Amoxicillin หรือ Penicillin G\n• ดื้อยา / Meningitis: Ceftriaxone + Vancomycin',
      'escherichia-coli': '• กระเพาะปัสสาวะอักเสบ: Fosfomycin หรือ Nitrofurantoin หรือ TMP-SMX\n• กรวยไตอักเสบ / Sepsis: Ceftriaxone หรือ Carbapenem (กรณี ESBL)',
      'shigella-dysenteriae': 'Azithromycin หรือ Ciprofloxacin หรือ Ceftriaxone',
      'chlamydia-trachomatis': 'Doxycycline 100 mg bid 7 วัน (ทางเลือก: Azithromycin 1 g single dose)',
      'leptospira-interrogans': '• รุนแรง (Weil): IV Penicillin G หรือ Ceftriaxone\n• ไม่รุนแรง: Oral Doxycycline หรือ Amoxicillin',
      'orientia-tsutsugamushi': 'Doxycycline 100 mg bid 7 วัน (ทางเลือก: Azithromycin)',
      'salmonella-typhi': 'Ceftriaxone หรือ Azithromycin (หรือ Ciprofloxacin หากเชื้อไวต่อยา)',
      'cryptococcus-neoformans': 'Amphotericin B + Flucytosine อย่างน้อย 2 สัปดาห์ ตามด้วย Fluconazole',
      'histoplasma-capsulatum': '• ปานกลาง-รุนแรง: Liposomal Amphotericin B ตามด้วย Itraconazole\n• ไม่รุนแรง: Oral Itraconazole',
      'talaromyces-marneffei': 'IV Liposomal Amphotericin B 2 สัปดาห์ ตามด้วย Oral Itraconazole',
      'aspergillus-fumigatus': 'Voriconazole (ทางเลือก: Isavuconazole หรือ Liposomal Amphotericin B)',
      'rhizopus-arrhizus': 'Surgical Debridement ด่วนที่สุด + IV Liposomal Amphotericin B ขนาดสูง',
      'pseudomonas-aeruginosa': 'Piperacillin-Tazobactam (Tazocin) หรือ Cefepime หรือ Ceftazidime หรือ Meropenem',
      'vibrio-vulnificus': 'Surgical Debridement ด่วน + IV Ceftriaxone + Doxycycline',
      'neisseria-meningitidis': 'Ceftriaxone หรือ Cefotaxime (+ Dexamethasone ก่อนหรือพร้อมยาเข็มแรก)'
    };
    if (map[m.id]) return map[m.id];
    const raw = m.tabs?.treatment?.firstLine || '';
    const firstSentence = raw.split(';')[0]?.split('.')[0] || raw;
    return firstSentence.trim() || 'First-line antimicrobial regimen ตามมาตรฐาน';
  }

  getConciseSpecial(m) {
    const map = {
      'variola-virus': {
        preg: 'Tecovirimat ยังคงเป็นยาหลักในหญิงตั้งครรภ์หากติดเชื้อรุนแรง',
        alt: 'Brincidofovir หรือ Cidofovir (+ Probenecid)'
      },
      'staphylococcus-aureus': {
        preg: 'Cefazolin หรือ Cloxacillin ปลอดภัย (Cat B)',
        alt: 'แพ้ Penicillin ไม่รุนแรง: Cefazolin; แพ้รุนแรง (Anaphylaxis): Vancomycin หรือ Daptomycin'
      },
      'bacillus-anthracis': {
        preg: 'Ciprofloxacin ยังคงเป็นยาหลักในหญิงตั้งครรภ์ (ผลจากโรคร้ายแรงถึงชีวิต; หลีกเลี่ยง Doxycycline)',
        alt: 'Levofloxacin หรือ Doxycycline หรือ Clindamycin'
      },
      'treponema-pallidum': {
        preg: 'Benzathine Penicillin G เท่านั้น! (หากแพ้ต้องทำ Penicillin Desensitization *ห้ามใช้ Doxycycline ในคนท้อง*)',
        alt: 'ผู้ป่วยทั่วไปที่แพ้ Penicillin (ไม่ใช่คนท้อง): Doxycycline 100 mg bid 14 วัน หรือ Ceftriaxone'
      },
      'varicella-zoster': {
        preg: 'Acyclovir ปลอดภัยในสตรีมีครรภ์; ให้ VariZIG ภายใน 10 วันหลังสัมผัสโรค',
        alt: 'กรณีดื้อ Acyclovir: Foscarnet หรือ Cidofovir'
      },
      'borrelia-burgdorferi': {
        preg: 'Amoxicillin 500 mg tid หรือ Cefuroxime (ห้ามใช้ Doxycycline เด็ดขาด)',
        alt: 'Cefuroxime axetil หรือ Azithromycin'
      },
      'candida-albicans': {
        preg: 'Topical Clotrimazole / Nystatin หรือ IV Amphotericin B (หลีกเลี่ยง Fluconazole oral ในไตรมาสแรก)',
        alt: 'Echinocandins (Caspofungin / Micafungin) หรือ Amphotericin B'
      },
      'clostridioides-difficile': {
        preg: 'Oral Vancomycin ปลอดภัย (ยาไม่ดูดซึมเข้ากระแสเลือด)',
        alt: 'Oral Fidaxomicin หรือ Bezlotoxumab'
      },
      'entamoeba-histolytica': {
        preg: 'Paromomycin (ดูดซึมต่ำ ปลอดภัยในไตรมาสแรก); หากรุนแรงให้ Metronidazole ได้',
        alt: 'Tinidazole หรือ Nitazoxanide'
      },
      'streptococcus-pyogenes': {
        preg: 'Penicillin V, Amoxicillin, Cefazolin ปลอดภัยในคนท้อง',
        alt: 'แพ้ Penicillin ไม่รุนแรง: Cephalexin; แพ้รุนแรง (Anaphylaxis): Clindamycin หรือ Azithromycin'
      },
      'neisseria-gonorrhoeae': {
        preg: 'Ceftriaxone 500 mg IM (+ Azithromycin 1 g หากสงสัย Chlamydia; ห้ามใช้ Doxycycline)',
        alt: 'แพ้ Cephalosporin รุนแรง: Gentamicin 240 mg IM + Oral Azithromycin 2 g'
      },
      'burkholderia-pseudomallei': {
        preg: 'Ceftazidime หรือ Meropenem; ในระยะ Eradication ให้ใช้ Co-amoxiclav แทน TMP-SMX',
        alt: 'กรณีแพ้ TMP-SMX: Co-amoxiclav (Augmentin)'
      },
      'streptococcus-pneumoniae': {
        preg: 'Amoxicillin หรือ Ceftriaxone ปลอดภัย',
        alt: 'Respiratory Fluoroquinolones (Levofloxacin/Moxifloxacin) หรือ Vancomycin'
      },
      'escherichia-coli': {
        preg: 'Fosfomycin หรือ Cefpodoxime หรือ Amoxicillin-Clavulanate (ห้าม Fluoroquinolones)',
        alt: 'Ciprofloxacin หรือ Levofloxacin หรือ Meropenem (กรณี ESBL)'
      },
      'shigella-dysenteriae': {
        preg: 'Ceftriaxone หรือ Azithromycin (หลีกเลี่ยง Ciprofloxacin ในคนท้อง)',
        alt: 'Azithromycin หรือ Ceftriaxone หรือ TMP-SMX'
      },
      'chlamydia-trachomatis': {
        preg: 'Azithromycin 1 g single dose หรือ Amoxicillin 500 mg tid 7 วัน (ห้ามใช้ Doxycycline)',
        alt: 'Levofloxacin 500 mg วันละครั้ง 7 วัน'
      },
      'leptospira-interrogans': {
        preg: 'Penicillin G หรือ Ceftriaxone หรือ Amoxicillin (ห้าม Doxycycline)',
        alt: 'Azithromycin หรือ Ceftriaxone'
      },
      'orientia-tsutsugamushi': {
        preg: 'Azithromycin 500 mg วันแรก แล้ว 250 mg วันละครั้ง (ห้ามใช้ Doxycycline)',
        alt: 'Rifampicin ร่วมกับยาอื่น หรือ Chloramphenicol'
      },
      'salmonella-typhi': {
        preg: 'Ceftriaxone หรือ Azithromycin (ห้าม Fluoroquinolones ในคนท้อง)',
        alt: 'Azithromycin หรือ Meropenem (กรณี XDR Typhoid)'
      },
      'cryptococcus-neoformans': {
        preg: 'Amphotericin B deoxycholate + Flucytosine (หลีกเลี่ยง Fluconazole ในไตรมาสแรก)',
        alt: 'Amphotericin B ร่วมกับ Fluconazole ขนาดสูง'
      },
      'histoplasma-capsulatum': {
        preg: 'Liposomal Amphotericin B (หลีกเลี่ยง Itraconazole ในคนท้อง)',
        alt: 'Voriconazole หรือ Posaconazole'
      },
      'talaromyces-marneffei': {
        preg: 'Amphotericin B จนคลอด แล้วจึงให้ Itraconazole',
        alt: 'Voriconazole'
      },
      'aspergillus-fumigatus': {
        preg: 'Liposomal Amphotericin B (Voriconazole เป็น Category D ห้ามใช้ในคนท้อง)',
        alt: 'Isavuconazole หรือ Liposomal Amphotericin B'
      },
      'rhizopus-arrhizus': {
        preg: 'Surgical Debridement ด่วน + Liposomal Amphotericin B',
        alt: 'Posaconazole หรือ Isavuconazole'
      },
      'pseudomonas-aeruginosa': {
        preg: 'Ceftazidime หรือ Piperacillin-Tazobactam หรือ Meropenem',
        alt: 'Aztreonam (กรณีแพ้ Penicillin ชนิด Anaphylaxis) หรือ Ciprofloxacin'
      },
      'vibrio-vulnificus': {
        preg: 'Ceftriaxone + Ciprofloxacin หรือ Cefotaxime (หลีกเลี่ยง Doxycycline ในหญิงตั้งครรภ์)',
        alt: 'Levofloxacin หรือ Moxifloxacin ร่วมกับ Cefotaxime'
      },
      'neisseria-meningitidis': {
        preg: 'Ceftriaxone ปลอดภัยในคนท้อง; ป้องกันสัมผัสโรคใช้ Ceftriaxone IM หรือ Azithromycin',
        alt: 'Chloramphenicol หรือ Meropenem (กรณีแพ้ Cephalosporin รุนแรง)'
      }
    };
    if (map[m.id]) return map[m.id];
    return {
      preg: m.tabs?.treatment?.childrenPregnant || (m.category === 'bacteria' ? 'หลีกเลี่ยง Tetracyclines / Fluoroquinolones ในสตรีมีครรภ์' : 'ระมัดระวังการใช้ยาในสตรีมีครรภ์'),
      alt: m.tabs?.treatment?.alternative || m.tabs?.treatment?.woundCare || 'ยาทางเลือกตามความไวและผลการเพาะเชื้อ'
    };
  }

  generateAllAtomicCards() {
    const cards = [];
    const catLabels = {
      bacteria: 'แบคทีเรีย (Bacteria)',
      fungi: 'เชื้อรา (Fungi)',
      virus: 'ไวรัส (Virus)',
      parasite: 'ปรสิต (Parasites)'
    };

    (this.microbes || []).forEach((m) => {
      const categoryThai = catLabels[m.category] || m.category || 'เชื้อจุลชีพ';
      const imgUrl = (m.clinicalCases && m.clinicalCases[0] && m.clinicalCases[0].image)
        ? m.clinicalCases[0].image
        : (m.image || '');
      const imgCaption = (m.clinicalCases && m.clinicalCases[0] && m.clinicalCases[0].caption)
        ? m.clinicalCases[0].caption
        : (m.lesionThai || 'ภาพรอยโรคทางคลินิก (CDC/WHO)');

      const mildText = m.quickStats?.morphology || m.lesionThai;
      const severeText = (m.quickStats?.depth ? `${m.quickStats.depth}${m.quickStats.palpation ? ` (${m.quickStats.palpation})` : ''}` : '')
        || (m.tabs?.pathogenesis?.virulenceFactors?.[0]?.description);
      const transmissionText = m.tabs?.pathogenesis?.transmission || '';

      const cleanDoc = this.getConciseDoc(m);
      const cleanSpecial = this.getConciseSpecial(m);

      // Card 1: Image only (Full view without crop)
      if (imgUrl) {
        cards.push({
          id: `${m.id}-photo`,
          microbeId: m.id,
          microbe: m,
          type: 'photo',
          category: m.category,
          categoryThai: categoryThai,
          modes: ['symptoms-pathogen', 'comprehensive'],
          question: 'รอยโรคในภาพนี้ เกิดจากการติดเชื้อก่อโรคใด?',
          imgUrl: imgUrl,
          imgCaption: imgCaption,
          answerTitle: m.name,
          answerSub: `${m.thaiName || m.nameThai || ''} · กลุ่ม ${categoryThai}`,
          keyPoint: m.lesionThai || m.quickStats?.morphology || 'รอยโรคจำเพาะทางคลินิก'
        });
      }

      // Card 2: Mild symptoms description
      if (mildText) {
        cards.push({
          id: `${m.id}-mild`,
          microbeId: m.id,
          microbe: m,
          type: 'mild',
          category: m.category,
          categoryThai: categoryThai,
          modes: ['symptoms-pathogen', 'comprehensive'],
          question: 'ผู้ป่วยมีรอยโรคและอาการระยะแรกตามที่ระบุ เกิดจากเชื้อใด?',
          vignette: mildText,
          clue: transmissionText ? `การติดต่อ: ${transmissionText}` : '',
          answerTitle: m.name,
          answerSub: `${m.thaiName || m.nameThai || ''} · กลุ่ม ${categoryThai}`,
          keyPoint: m.quickStats?.distribution ? `การกระจาย: ${m.quickStats.distribution}` : (m.lesionThai || 'อาการเบา/ระยะเริ่มแรก')
        });
      }

      // Card 3: Severe symptoms description
      if (severeText) {
        cards.push({
          id: `${m.id}-severe`,
          microbeId: m.id,
          microbe: m,
          type: 'severe',
          category: m.category,
          categoryThai: categoryThai,
          modes: ['symptoms-pathogen', 'comprehensive'],
          question: 'การติดเชื้อที่ลุกลามและแสดงอาการรุนแรงนี้ เกิดจากเชื้อใด?',
          vignette: severeText,
          answerTitle: m.name,
          answerSub: `${m.thaiName || m.nameThai || ''} · กลุ่ม ${categoryThai}`,
          keyPoint: m.tabs?.pathogenesis?.virulenceFactors?.[0]?.name 
            ? `${m.tabs.pathogenesis.virulenceFactors[0].name}: ${m.tabs.pathogenesis.virulenceFactors[0].mechanism || m.tabs.pathogenesis.virulenceFactors[0].desc || m.tabs.pathogenesis.virulenceFactors[0].description || ''}`
            : 'การลุกลามเข้าสู่กระแสเลือดหรืออวัยวะส่วนลึก'
        });
      }

      // Card 4: First-line Drug of Choice
      cards.push({
        id: `${m.id}-doc`,
        microbeId: m.id,
        microbe: m,
        type: 'doc',
        category: m.category,
        categoryThai: categoryThai,
        modes: ['pathogen-treatment', 'comprehensive'],
        question: 'ยาขนานแรกที่เป็น Drug of Choice (First-line DOC) คือยาใด?',
        pathogenName: m.name,
        pathogenThai: m.thaiName || m.nameThai || '',
        answerTitle: m.name,
        docText: cleanDoc
      });

      // Card 5: Pregnancy & Allergy
      cards.push({
        id: `${m.id}-special`,
        microbeId: m.id,
        microbe: m,
        type: 'special',
        category: m.category,
        categoryThai: categoryThai,
        modes: ['pathogen-treatment', 'comprehensive'],
        question: 'หากผู้ป่วยตั้งครรภ์ (Pregnancy) หรือแพ้ยาหลัก ควรปรับใช้ยาใด?',
        pathogenName: m.name,
        pathogenThai: m.thaiName || m.nameThai || '',
        answerTitle: m.name,
        pregText: cleanSpecial.preg,
        altText: cleanSpecial.alt
      });
    });

    return cards;
  }

  generateFlashcardDeck() {
    const allCards = this.generateAllAtomicCards();
    
    // 1. Filter by current mode
    let filtered = allCards.filter(c => c.modes.includes(this.fcCurrentMode));

    // 2. Filter by current category
    if (this.fcCurrentCategory && this.fcCurrentCategory !== 'all') {
      filtered = filtered.filter(c => c.category === this.fcCurrentCategory);
    }

    // 3. ALWAYS SHUFFLE THE DECK (สุ่มเสมอทุกครั้ง ไม่เรียงซ้ำ!)
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }

    this.fcDeck = filtered;
    this.fcCurrentIndex = 0;
    this.fcIsFlipped = false;
    if (this.fcFlipper) this.fcFlipper.classList.remove('flipped');
    if (this.fcFlipLabel) this.fcFlipLabel.textContent = 'แตะเพื่อดูเฉลย';
  }

  updateFlashcardCategoryCounts() {
    const allCards = this.generateAllAtomicCards();
    const modeCards = allCards.filter(c => c.modes.includes(this.fcCurrentMode));

    const allEl = document.getElementById('fc-count-all');
    const bacEl = document.getElementById('fc-count-bacteria');
    const funEl = document.getElementById('fc-count-fungi');
    const virEl = document.getElementById('fc-count-virus');
    const parEl = document.getElementById('fc-count-parasite');

    const total = modeCards.length;
    const bac = modeCards.filter(c => c.category === 'bacteria').length;
    const fun = modeCards.filter(c => c.category === 'fungi').length;
    const vir = modeCards.filter(c => c.category === 'virus').length;
    const par = modeCards.filter(c => c.category === 'parasite').length;

    if (allEl) allEl.textContent = total;
    if (bacEl) bacEl.textContent = bac;
    if (funEl) funEl.textContent = fun;
    if (virEl) virEl.textContent = vir;
    if (parEl) parEl.textContent = par;
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
    const card = this.fcDeck[this.fcCurrentIndex];
    const microbe = card?.microbe || card;
    if (microbe) {
      this.closeFlashcardModal();
      this.selectMicrobe(microbe.id);
      this.toggleDrawer(true);
      if (card.type === 'doc' || card.type === 'special') {
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

    const card = this.fcDeck[this.fcCurrentIndex];
    if (this.fcCounter) {
      this.fcCounter.textContent = `การ์ดที่ ${this.fcCurrentIndex + 1} / ${this.fcDeck.length}`;
    }

    // ------------------------------------------------------------------------
    // Case 1: Image only (Card Type: 'photo')
    // ------------------------------------------------------------------------
    if (card.type === 'photo') {
      this.fcFront.innerHTML = `
        <span class="fc-card-tag question">
          <i class="fa-solid fa-camera"></i> ภาพรอยโรค ➜ ทายชื่อเชื้อ
        </span>

        <div class="fc-photo-box">
          <img src="${card.imgUrl}" alt="${card.answerTitle}" onerror="this.parentElement.style.display='none';">
          <span class="fc-photo-badge"><i class="fa-solid fa-camera"></i> ${card.imgCaption}</span>
        </div>

        <div class="fc-single-question">
          <i class="fa-solid fa-circle-question"></i>
          <span>${card.question}</span>
        </div>

        <div class="fc-question-prompt">
          <i class="fa-solid fa-rotate"></i>
          <span>แตะการ์ดหรือเคาะ Spacebar เพื่อดูเฉลยชื่อเชื้อ</span>
        </div>
      `;

      this.fcBack.innerHTML = `
        <span class="fc-card-tag answer">
          <i class="fa-solid fa-circle-check"></i> เฉลยชื่อเชื้อก่อโรค
        </span>

        <h4 class="fc-answer-title">${card.answerTitle}</h4>
        <div class="fc-answer-sub">${card.answerSub}</div>

        <div class="fc-concise-box highlight">
          <div class="fc-concise-label"><i class="fa-solid fa-lightbulb"></i> จุดสังเกตรอยโรค (Clinical Pearl):</div>
          <div class="fc-concise-text" style="font-size: 0.95rem; color: #fff; line-height: 1.5;">${card.keyPoint}</div>
        </div>

        <div style="margin-top: auto; display: flex; justify-content: flex-end; padding-top: 8px;">
          <button type="button" class="fc-action-btn accent" id="btn-fc-back-goto" style="font-size: 0.78rem;">
            <i class="fa-solid fa-book-medical"></i> <span>เปิดอ่านข้อมูลเต็มใน Medical Drawer</span>
          </button>
        </div>
      `;
    }

    // ------------------------------------------------------------------------
    // Case 2: Mild symptoms description (Card Type: 'mild')
    // ------------------------------------------------------------------------
    else if (card.type === 'mild') {
      this.fcFront.innerHTML = `
        <span class="fc-card-tag question">
          <i class="fa-solid fa-notes-medical"></i> อาการระยะแรก (Mild / Early) ➜ ทายชื่อเชื้อ
        </span>

        <div class="fc-vignette-box mild">
          <div class="fc-vignette-label"><i class="fa-solid fa-circle-check"></i> อาการเบา / รอยโรคระยะแรก:</div>
          <div class="fc-vignette-text">${card.vignette}</div>
          ${card.clue ? `<div class="fc-vignette-sub">🔍 <strong>ข้อสังเกต:</strong> ${card.clue}</div>` : ''}
        </div>

        <div class="fc-single-question">
          <i class="fa-solid fa-circle-question"></i>
          <span>${card.question}</span>
        </div>

        <div class="fc-question-prompt">
          <i class="fa-solid fa-rotate"></i>
          <span>แตะการ์ดหรือเคาะ Spacebar เพื่อดูเฉลยชื่อเชื้อ</span>
        </div>
      `;

      this.fcBack.innerHTML = `
        <span class="fc-card-tag answer">
          <i class="fa-solid fa-circle-check"></i> เฉลยชื่อเชื้อก่อโรค
        </span>

        <h4 class="fc-answer-title">${card.answerTitle}</h4>
        <div class="fc-answer-sub">${card.answerSub}</div>

        <div class="fc-concise-box highlight">
          <div class="fc-concise-label"><i class="fa-solid fa-stethoscope"></i> ลักษณะจำเพาะทางคลินิก (Key Feature):</div>
          <div class="fc-concise-text" style="font-size: 0.95rem; color: #fff; line-height: 1.5;">${card.keyPoint}</div>
        </div>

        <div style="margin-top: auto; display: flex; justify-content: flex-end; padding-top: 8px;">
          <button type="button" class="fc-action-btn accent" id="btn-fc-back-goto" style="font-size: 0.78rem;">
            <i class="fa-solid fa-book-medical"></i> <span>เปิดอ่านข้อมูลเต็มใน Medical Drawer</span>
          </button>
        </div>
      `;
    }

    // ------------------------------------------------------------------------
    // Case 3: Severe symptoms description (Card Type: 'severe')
    // ------------------------------------------------------------------------
    else if (card.type === 'severe') {
      this.fcFront.innerHTML = `
        <span class="fc-card-tag question" style="border-color: rgba(244,63,94,0.4); color: #fb7185;">
          <i class="fa-solid fa-triangle-exclamation"></i> อาการรุนแรง (Severe / Invasive) ➜ ทายชื่อเชื้อ
        </span>

        <div class="fc-vignette-box severe">
          <div class="fc-vignette-label"><i class="fa-solid fa-radiation"></i> อาการหนัก / ภาวะแทรกซ้อนลุกลาม:</div>
          <div class="fc-vignette-text">${card.vignette}</div>
        </div>

        <div class="fc-single-question">
          <i class="fa-solid fa-circle-question"></i>
          <span>${card.question}</span>
        </div>

        <div class="fc-question-prompt">
          <i class="fa-solid fa-rotate"></i>
          <span>แตะการ์ดหรือเคาะ Spacebar เพื่อดูเฉลยชื่อเชื้อ</span>
        </div>
      `;

      this.fcBack.innerHTML = `
        <span class="fc-card-tag answer">
          <i class="fa-solid fa-circle-check"></i> เฉลยชื่อเชื้อก่อโรค
        </span>

        <h4 class="fc-answer-title">${card.answerTitle}</h4>
        <div class="fc-answer-sub">${card.answerSub}</div>

        <div class="fc-concise-box highlight" style="border-left-color: #f43f5e; background: rgba(244,63,94,0.08);">
          <div class="fc-concise-label" style="color: #fb7185;"><i class="fa-solid fa-burst"></i> กลไกความรุนแรงสำคัญ (Virulence Factor):</div>
          <div class="fc-concise-text" style="font-size: 0.95rem; color: #fff; line-height: 1.5;">${card.keyPoint}</div>
        </div>

        <div style="margin-top: auto; display: flex; justify-content: flex-end; padding-top: 8px;">
          <button type="button" class="fc-action-btn accent" id="btn-fc-back-goto" style="font-size: 0.78rem;">
            <i class="fa-solid fa-book-medical"></i> <span>เปิดอ่านข้อมูลเต็มใน Medical Drawer</span>
          </button>
        </div>
      `;
    }

    // ------------------------------------------------------------------------
    // Case 4: First-line Drug of Choice (Card Type: 'doc')
    // ------------------------------------------------------------------------
    else if (card.type === 'doc') {
      this.fcFront.innerHTML = `
        <span class="fc-card-tag question">
          <i class="fa-solid fa-pills"></i> เชื้อก่อโรค ➜ ทายยาขนานแรก (First-line DOC)
        </span>

        <h4 class="fc-answer-title" style="margin-bottom: 4px;">${card.pathogenName}</h4>
        <div class="fc-answer-sub" style="margin-bottom: 16px;">${card.pathogenThai} · <span class="category-badge ${card.category}">${card.categoryThai}</span></div>

        <div class="fc-vignette-box treatment">
          <div class="fc-vignette-label"><i class="fa-solid fa-trophy"></i> คำถามทางคลินิก (Board Question):</div>
          <div class="fc-vignette-text" style="font-size: 1.05rem; font-weight: 700; color: #fff;">ยาขนานแรกที่เป็น Drug of Choice (First-line DOC) ตามมาตรฐานคือยาใด?</div>
        </div>

        <div class="fc-question-prompt">
          <i class="fa-solid fa-rotate"></i>
          <span>แตะการ์ดหรือกด Spacebar เพื่อดูเฉลยตัวยา DOC</span>
        </div>
      `;

      this.fcBack.innerHTML = `
        <span class="fc-card-tag answer">
          <i class="fa-solid fa-clipboard-check"></i> เฉลย First-line Drug of Choice
        </span>

        <h4 class="fc-answer-title" style="margin-bottom: 4px;">${card.pathogenName}</h4>
        <div class="fc-answer-sub" style="margin-bottom: 14px;">${card.pathogenThai}</div>

        <div class="fc-concise-box doc">
          <div class="fc-concise-label"><i class="fa-solid fa-trophy"></i> First-line Drug of Choice (ยาหลักขนานแรก):</div>
          <div class="fc-concise-doc-text">${card.docText}</div>
        </div>

        <div style="margin-top: auto; display: flex; justify-content: flex-end; padding-top: 8px;">
          <button type="button" class="fc-action-btn accent" id="btn-fc-back-goto" style="font-size: 0.78rem;">
            <i class="fa-solid fa-pills"></i> <span>ดูหัวข้อการรักษาใน Drawer</span>
          </button>
        </div>
      `;
    }

    // ------------------------------------------------------------------------
    // Case 5: Pregnancy & Allergy (Card Type: 'special')
    // ------------------------------------------------------------------------
    else if (card.type === 'special') {
      this.fcFront.innerHTML = `
        <span class="fc-card-tag question" style="border-color: rgba(245, 158, 11, 0.4); color: #fde68a;">
          <i class="fa-solid fa-person-pregnant"></i> เชื้อก่อโรค ➜ ยาในคนท้อง &amp; กรณีแพ้ยา
        </span>

        <h4 class="fc-answer-title" style="margin-bottom: 4px;">${card.pathogenName}</h4>
        <div class="fc-answer-sub" style="margin-bottom: 16px;">${card.pathogenThai} · <span class="category-badge ${card.category}">${card.categoryThai}</span></div>

        <div class="fc-vignette-box warning">
          <div class="fc-vignette-label"><i class="fa-solid fa-triangle-exclamation"></i> คำถามกรณีพิเศษ:</div>
          <div class="fc-vignette-text" style="font-size: 1rem; font-weight: 700; color: #fff;">หากผู้ป่วยตั้งครรภ์ (Pregnancy) หรือแพ้ยาหลัก ควรปรับใช้ยาใด หรือมีข้อควรระวังอย่างไร?</div>
        </div>

        <div class="fc-question-prompt">
          <i class="fa-solid fa-rotate"></i>
          <span>แตะการ์ดหรือกด Spacebar เพื่อดูแนวทางการให้ยา</span>
        </div>
      `;

      this.fcBack.innerHTML = `
        <span class="fc-card-tag answer" style="border-color: rgba(245, 158, 11, 0.4); color: #fde68a;">
          <i class="fa-solid fa-clipboard-check"></i> เฉลยสตรีมีครรภ์ &amp; กรณีแพ้ยา
        </span>

        <h4 class="fc-answer-title" style="margin-bottom: 4px;">${card.pathogenName}</h4>
        <div class="fc-answer-sub" style="margin-bottom: 14px;">${card.pathogenThai}</div>

        <div class="fc-concise-box special">
          <div class="fc-special-item">
            <div class="fc-special-label"><i class="fa-solid fa-person-pregnant"></i> ในสตรีมีครรภ์ (Pregnancy):</div>
            <div class="fc-special-text">${card.pregText}</div>
          </div>
          <div class="fc-special-item" style="margin-top: 12px;">
            <div class="fc-special-label"><i class="fa-solid fa-triangle-exclamation"></i> กรณีแพ้ยา / ยาทางเลือก (Allergy &amp; Alternatives):</div>
            <div class="fc-special-text">${card.altText}</div>
          </div>
        </div>

        <div style="margin-top: auto; display: flex; justify-content: flex-end; padding-top: 8px;">
          <button type="button" class="fc-action-btn accent" id="btn-fc-back-goto" style="font-size: 0.78rem;">
            <i class="fa-solid fa-pills"></i> <span>ดูหัวข้อการรักษาใน Drawer</span>
          </button>
        </div>
      `;
    }

    // Attach click to "ดูใน Drawer" on back face
    const backGotoBtn = this.fcBack.querySelector('#btn-fc-back-goto');
    if (backGotoBtn) {
      backGotoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.goToDrawerFromFlashcard();
      });
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
