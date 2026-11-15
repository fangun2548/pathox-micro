// ============================================================================
// Pathox-Micro · Clinical Real Photo Scene Controller
// Renders authentic real clinical case photographs (CDC, WHO, Medical Archives)
// Supports multi-case switching, side-by-side comparison, and high-res lightbox
// ============================================================================

export class Microbe2DScene {
  constructor(container) {
    this.container = container;
    this.currentMicrobe = null;
    this.activeCaseIndex = 0;
    this.isCompareMode = false;
    this.zoomLevel = 1.0;
    this.panX = 0;
    this.panY = 0;

    this.onHoverPart = null;
    this.onClickPart = null;

    this.init();
  }

  init() {
    // Locate or create the stage viewport
    let stage = document.getElementById('card-table-stage');
    if (!stage) {
      stage = document.createElement('div');
      stage.id = 'card-table-stage';
      stage.className = 'card-table-stage';
      this.container.prepend(stage);
    }
    this.stage = stage;
    this.stage.innerHTML = '<div id="clinical-photo-viewport" class="clinical-photo-viewport"></div>';
    this.viewport = this.stage.querySelector('#clinical-photo-viewport');

    // Create lightbox modal if not present
    this.initLightbox();
  }

  initLightbox() {
    let modal = document.getElementById('clinical-lightbox-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'clinical-lightbox-modal';
      modal.className = 'clinical-lightbox-modal';
      modal.innerHTML = `
        <div class="lightbox-overlay" id="lightbox-overlay"></div>
        <div class="lightbox-content">
          <div class="lightbox-header">
            <div class="lightbox-title-area">
              <span class="lightbox-badge" id="lightbox-badge">CLINICAL CASE</span>
              <h3 id="lightbox-title">Real Clinical Photograph</h3>
            </div>
            <button class="lightbox-close-btn" id="lightbox-close-btn" title="ปิดหน้าต่าง">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="lightbox-img-wrapper" id="lightbox-img-wrapper">
            <img id="lightbox-img" src="" alt="High resolution clinical case" />
          </div>
          <div class="lightbox-footer">
            <div class="lightbox-source" id="lightbox-source">Source: CDC Public Health Image Library</div>
            <div class="lightbox-zoom-bar">
              <button id="lb-zoom-out" class="lb-ctrl-btn" title="Zoom Out"><i class="fa-solid fa-minus"></i></button>
              <span id="lb-zoom-level">100%</span>
              <button id="lb-zoom-in" class="lb-ctrl-btn" title="Zoom In"><i class="fa-solid fa-plus"></i></button>
              <button id="lb-zoom-reset" class="lb-ctrl-btn" title="Reset Zoom"><i class="fa-solid fa-arrows-rotate"></i></button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Lightbox events
      let lbZoom = 1.0;
      const lbImg = modal.querySelector('#lightbox-img');
      const lbZoomText = modal.querySelector('#lb-zoom-level');

      const applyLbZoom = () => {
        lbImg.style.transform = `scale(${lbZoom})`;
        lbZoomText.textContent = `${Math.round(lbZoom * 100)}%`;
      };

      modal.querySelector('#lightbox-close-btn').addEventListener('click', () => {
        modal.classList.remove('active');
        lbZoom = 1.0;
        applyLbZoom();
      });

      modal.querySelector('#lightbox-overlay').addEventListener('click', () => {
        modal.classList.remove('active');
        lbZoom = 1.0;
        applyLbZoom();
      });

      modal.querySelector('#lb-zoom-in').addEventListener('click', () => {
        lbZoom = Math.min(3.0, lbZoom + 0.25);
        applyLbZoom();
      });

      modal.querySelector('#lb-zoom-out').addEventListener('click', () => {
        lbZoom = Math.max(0.5, lbZoom - 0.25);
        applyLbZoom();
      });

      modal.querySelector('#lb-zoom-reset').addEventListener('click', () => {
        lbZoom = 1.0;
        applyLbZoom();
      });
    }
    this.lightbox = modal;
  }

  openLightbox(imageSrc, title, source, badge) {
    if (!this.lightbox) return;
    const img = this.lightbox.querySelector('#lightbox-img');
    const titleEl = this.lightbox.querySelector('#lightbox-title');
    const sourceEl = this.lightbox.querySelector('#lightbox-source');
    const badgeEl = this.lightbox.querySelector('#lightbox-badge');

    img.src = imageSrc;
    titleEl.textContent = title || 'Real Clinical Case Photograph';
    sourceEl.innerHTML = `<i class="fa-solid fa-shield-halved"></i> แหล่งที่มาทางการแพทย์: <strong>${source || 'Medical Archive'}</strong>`;
    badgeEl.textContent = badge || 'REAL CLINICAL CASE';

    this.lightbox.classList.add('active');
  }

  loadModel(microbe) {
    this.currentMicrobe = microbe;
    this.activeCaseIndex = 0;
    this.isCompareMode = false;
    this.zoomLevel = 1.0;
    this.render();
  }

  setCaseIndex(index) {
    if (!this.currentMicrobe?.clinicalCases) return;
    if (index >= 0 && index < this.currentMicrobe.clinicalCases.length) {
      this.activeCaseIndex = index;
      this.isCompareMode = false;
      this.render();
    }
  }

  toggleCompareMode() {
    this.isCompareMode = !this.isCompareMode;
    this.render();
  }

  render() {
    if (!this.currentMicrobe) return;

    const cases = this.currentMicrobe.clinicalCases || [];
    if (cases.length === 0) {
      this.viewport.innerHTML = `
        <div class="empty-case-box">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>ไม่พบภาพเคสจริงสำหรับเชื้อนี้</span>
        </div>
      `;
      return;
    }

    // Header switcher tabs if multiple cases
    const hasMultipleCases = cases.length > 1;
    let switcherHTML = '';
    if (hasMultipleCases) {
      switcherHTML = `
        <div class="case-switcher-bar">
          <div class="case-tabs-list">
            ${cases.map((c, i) => `
              <button class="case-tab-pill ${!this.isCompareMode && this.activeCaseIndex === i ? 'active' : ''}" data-case-index="${i}">
                <i class="fa-solid fa-camera-retro"></i>
                <span>${escapeHtml(c.badge || `เคสที่ ${i + 1}`)}</span>
              </button>
            `).join('')}
          </div>
          <button class="compare-toggle-btn ${this.isCompareMode ? 'active' : ''}" id="btn-toggle-compare">
            <i class="fa-solid fa-table-columns"></i>
            <span>${this.isCompareMode ? 'ดูภาพเดี่ยว' : 'เปรียบเทียบ 2 ลักษณะ'}</span>
          </button>
        </div>
      `;
    }

    let mainContentHTML = '';
    if (this.isCompareMode && hasMultipleCases) {
      // Side-by-side comparison view
      mainContentHTML = `
        <div class="compare-stage-grid">
          ${cases.slice(0, 2).map((c, idx) => `
            <div class="clinical-photo-card compare-card" data-case-index="${idx}">
              <div class="card-photo-header">
                <div class="card-badge-row">
                  <span class="clinical-source-badge">
                    <i class="fa-solid fa-building-columns"></i> ${escapeHtml(c.source)}
                  </span>
                  <span class="manifestation-badge">${escapeHtml(c.badge || `ลักษณะที่ ${idx + 1}`)}</span>
                </div>
                <h4 class="card-case-title">${escapeHtml(c.title)}</h4>
              </div>
              <div class="card-photo-frame" data-img-src="${c.image}" data-title="${escapeHtml(c.title)}" data-source="${escapeHtml(c.source)}">
                <img src="${c.image}" alt="${escapeHtml(c.title)}" class="case-main-img" loading="lazy" />
                <div class="photo-expand-overlay" title="คลิกเพื่อขยายภาพ">
                  <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
                  <span>คลิกเพื่อขยายภาพ</span>
                </div>
              </div>
              <div class="card-photo-body">
                <p class="case-description-text">${escapeHtml(c.description)}</p>
                <div class="key-findings-list">
                  <div class="findings-header">
                    <i class="fa-solid fa-list-check"></i>
                    <span>สิ่งที่ตรวจพบสำคัญ (Key Findings):</span>
                  </div>
                  <ul>
                    ${(c.keyFindings || []).map(f => `<li><i class="fa-solid fa-check"></i> <span>${escapeHtml(f)}</span></li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      // Single Case Detailed View
      const activeCase = cases[this.activeCaseIndex] || cases[0];
      mainContentHTML = `
        <div class="clinical-photo-card single-card">
          <div class="card-photo-header">
            <div class="card-badge-row">
              <span class="clinical-source-badge">
                <i class="fa-solid fa-building-columns"></i> ${escapeHtml(activeCase.source)}
              </span>
              <span class="manifestation-badge">${escapeHtml(activeCase.badge || 'เคสจริง')}</span>
              <span class="verified-case-pill"><i class="fa-solid fa-circle-check"></i> Verified Clinical Photo</span>
            </div>
            <h3 class="card-case-title">${escapeHtml(activeCase.title)}</h3>
            <div class="pathogen-subtitle-meta">
              <span><strong>เชื้อก่อโรค:</strong> ${escapeHtml(this.currentMicrobe.name)}</span>
              <span>•</span>
              <span><strong>ชื่อวิทยาศาสตร์:</strong> <em>${escapeHtml(this.currentMicrobe.scientificName)}</em></span>
            </div>
          </div>

          <div class="card-photo-layout">
            <!-- Left: Main Photo Viewport -->
            <div class="photo-viewport-column">
              <div class="card-photo-frame" data-img-src="${activeCase.image}" data-title="${escapeHtml(activeCase.title)}" data-source="${escapeHtml(activeCase.source)}">
                <img src="${activeCase.image}" alt="${escapeHtml(activeCase.title)}" class="case-main-img" id="case-active-img" />
                <div class="photo-expand-overlay" title="คลิกเพื่อขยายภาพ">
                  <i class="fa-solid fa-magnifying-glass-plus"></i>
                  <span>คลิกเพื่อเปิดดูภาพความละเอียดสูง (Enlarge High-Res)</span>
                </div>
              </div>
              <div class="photo-actions-row">
                <button class="action-pill-btn btn-enlarge" id="btn-open-lightbox">
                  <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
                  <span>ขยายภาพความละเอียดสูง</span>
                </button>
                <span class="photo-counter-tag">ภาพเคสที่ ${this.activeCaseIndex + 1} จาก ${cases.length}</span>
              </div>
            </div>

            <!-- Right: Clinical Findings & Case Vignette -->
            <div class="photo-info-column">
              <div class="case-vignette-box">
                <div class="vignette-header">
                  <i class="fa-solid fa-clipboard-user"></i>
                  <span>คำอธิบายเคสและลักษณะทางคลินิก (Clinical Description)</span>
                </div>
                <p class="case-description-text">${escapeHtml(activeCase.description)}</p>
              </div>

              <div class="key-findings-box">
                <div class="findings-header">
                  <i class="fa-solid fa-microscope"></i>
                  <span>จุดสังเกตสำคัญของรอยโรค (Key Diagnostic Pearls)</span>
                </div>
                <ul class="findings-bullet-list">
                  ${(activeCase.keyFindings || []).map(f => `
                    <li class="finding-item interactive-finding">
                      <i class="fa-solid fa-circle-dot finding-dot"></i>
                      <span>${escapeHtml(f)}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>

              <!-- Quick Pathognomonic Clue -->
              <div class="pathognomonic-clue-badge">
                <div class="clue-icon"><i class="fa-solid fa-lightbulb"></i></div>
                <div class="clue-text">
                  <strong>คำบอกใบ้สำคัญ (Board Clue):</strong>
                  <span>${escapeHtml(this.currentMicrobe.quickStats?.morphology || this.currentMicrobe.lesionThai || 'รอยโรคเฉพาะตัว')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    this.viewport.innerHTML = `
      <div class="clinical-stage-container">
        ${switcherHTML}
        ${mainContentHTML}
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // 1. Case Tab Switcher
    const caseTabs = this.viewport.querySelectorAll('.case-tab-pill');
    caseTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.caseIndex, 10);
        this.setCaseIndex(idx);
      });
    });

    // 2. Toggle Compare Button
    const btnCompare = this.viewport.querySelector('#btn-toggle-compare');
    if (btnCompare) {
      btnCompare.addEventListener('click', () => {
        this.toggleCompareMode();
      });
    }

    // 3. Photo Frames click -> open Lightbox
    const photoFrames = this.viewport.querySelectorAll('.card-photo-frame');
    photoFrames.forEach(frame => {
      frame.addEventListener('click', () => {
        const src = frame.dataset.imgSrc;
        const title = frame.dataset.title;
        const source = frame.dataset.source;
        this.openLightbox(src, title, source, 'CLINICAL CASE');
      });
    });

    // 4. Enlarge button
    const btnEnlarge = this.viewport.querySelector('#btn-open-lightbox');
    if (btnEnlarge) {
      btnEnlarge.addEventListener('click', () => {
        const activeCase = this.currentMicrobe.clinicalCases?.[this.activeCaseIndex];
        if (activeCase) {
          this.openLightbox(activeCase.image, activeCase.title, activeCase.source, activeCase.badge);
        }
      });
    }

    // 5. Interactive findings click -> highlight
    const findings = this.viewport.querySelectorAll('.interactive-finding');
    findings.forEach(f => {
      f.addEventListener('click', () => {
        findings.forEach(el => el.classList.remove('selected'));
        f.classList.add('selected');
        const img = this.viewport.querySelector('#case-active-img');
        if (img) {
          img.classList.add('highlight-pulse');
          setTimeout(() => img.classList.remove('highlight-pulse'), 800);
        }
      });
    });
  }

  focusOnPart(partId) {
    const img = this.viewport.querySelector('#case-active-img');
    if (img) {
      img.classList.add('highlight-pulse');
      setTimeout(() => img.classList.remove('highlight-pulse'), 800);
    }
  }

  zoomIn() {
    const img = this.viewport.querySelector('#case-active-img');
    if (img) {
      this.zoomLevel = Math.min(2.0, this.zoomLevel + 0.2);
      img.style.transform = `scale(${this.zoomLevel})`;
    }
  }

  zoomOut() {
    const img = this.viewport.querySelector('#case-active-img');
    if (img) {
      this.zoomLevel = Math.max(1.0, this.zoomLevel - 0.2);
      img.style.transform = `scale(${this.zoomLevel})`;
    }
  }

  resetView() {
    this.zoomLevel = 1.0;
    const img = this.viewport.querySelector('#case-active-img');
    if (img) {
      img.style.transform = 'scale(1)';
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
