/**
 * BRUNA — Mentoria de Carreira e Executiva
 * JavaScript Principal: Interações, Modais, Accordion, Mobile Menu e Validação
 */

(() => {
  'use strict';

  // Carrega configurações com fallback seguro
  const cfg = window.BRUNA_CONFIG || {
    contact: { whatsappNumber: null },
    form: { enableDirectWhatsApp: false },
    videos: {}
  };

  const body = document.body;
  let previousFocus = null;

  /* ==========================================================================
     0. Assets centralizados (foto, capas e metadados)
     ========================================================================== */
  const heroPhoto = document.querySelector('.bruna-photo');
  if (heroPhoto && cfg.mentor) {
    if (cfg.mentor.photoUrl) heroPhoto.src = cfg.mentor.photoUrl;
    if (cfg.mentor.photoAlt) heroPhoto.alt = cfg.mentor.photoAlt;
  }

  const mainPoster = document.getElementById('mainVideoPoster');
  const presentationVideo = cfg.videos && cfg.videos.apresentacao;
  if (mainPoster && presentationVideo && presentationVideo.demoPosterUrl) {
    mainPoster.src = presentationVideo.demoPosterUrl;
  }

  document.querySelectorAll('.media-card[data-video]').forEach((card) => {
    const data = cfg.videos && cfg.videos[card.dataset.video];
    const poster = card.querySelector('.media-card__poster');
    if (poster && data && data.demoPosterUrl) poster.src = data.demoPosterUrl;
  });

  /* ==========================================================================
     1. Navegação Mobile & Header
     ========================================================================== */
  const navToggle = document.getElementById('navtoggle');
  const navLinks = document.getElementById('navlinks');

  if (navToggle && navLinks) {
    const toggleMenu = (forceState) => {
      const willOpen = typeof forceState === 'boolean' 
        ? forceState 
        : !navLinks.classList.contains('open');

      navLinks.classList.toggle('open', willOpen);
      navToggle.setAttribute('aria-expanded', String(willOpen));
      navToggle.setAttribute('aria-label', willOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Fechar ao clicar em qualquer link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Fechar ao clicar fora do menu
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== navToggle) {
        toggleMenu(false);
      }
    });
  }

  /* ==========================================================================
     2. FAQ Accordion com Acessibilidade
     ========================================================================== */
  const faqButtons = document.querySelectorAll('.faq-item button');

  faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const currentItem = button.parentElement;
      const isOpen = currentItem.hasAttribute('open') || currentItem.classList.contains('is-open');

      // Fecha todos os outros itens para manter o accordion limpo e focado
      document.querySelectorAll('.faq-item').forEach((item) => {
        item.removeAttribute('open');
        item.classList.remove('is-open');
        const btn = item.querySelector('button');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Abre o clicado se estava fechado
      if (!isOpen) {
        currentItem.setAttribute('open', '');
        currentItem.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==========================================================================
     3. Sistema de Modais (Vídeos e Mensagem)
     ========================================================================== */
  const videoOverlay = document.getElementById('videoOverlay');
  const formOverlay = document.getElementById('formOverlay');

  const openModal = (overlay) => {
    if (!overlay) return;
    previousFocus = document.activeElement;
    overlay.hidden = false;
    overlay.classList.add('visible');
    body.classList.add('modal-open');

    // Foca o botão fechar para acessibilidade
    const closeBtn = overlay.querySelector('[data-close]');
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = (overlay) => {
    if (!overlay) return;
    overlay.classList.remove('visible');
    overlay.hidden = true;
    body.classList.remove('modal-open');

    // Limpa possível player de vídeo ao fechar
    const playerContainer = overlay.querySelector('#modalVideoPlayer');
    if (playerContainer) playerContainer.innerHTML = '';

    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
  };

  // Fechamento genérico via botão [data-close] e clique no backdrop
  [videoOverlay, formOverlay].forEach((overlay) => {
    if (!overlay) return;

    overlay.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(overlay);

        // Se o botão for um link âncora, navega suavemente
        const href = btn.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    overlay.addEventListener('mousedown', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  // Fechamento com tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (videoOverlay && !videoOverlay.hidden) closeModal(videoOverlay);
      if (formOverlay && !formOverlay.hidden) closeModal(formOverlay);
    }
  });

  /* ==========================================================================
     4. Controle de Vídeos (Player real, Demo ou Estrutura Editorial)
     ========================================================================== */
  const videoCards = document.querySelectorAll('[data-video]');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoScript = document.getElementById('videoScript');
  const videoBox = document.getElementById('videoBox');
  const modalVideoPlayer = document.getElementById('modalVideoPlayer');
  const videoDemoLabel = document.getElementById('videoDemoLabel');

  videoCards.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.video;
      const data = (cfg.videos && cfg.videos[key]) || {
        title: 'Apresentação da mentoria',
        steps: ['Conteúdo em produção.']
      };

      if (videoModalTitle) videoModalTitle.textContent = data.title;

      // Qual URL usar: real > demo > nenhuma
      const activeUrl = data.videoUrl || data.demoVideoUrl || null;
      const isDemo = !data.videoUrl && !!data.demoVideoUrl;

      // Atualiza label de demonstração
      if (videoDemoLabel) {
        if (isDemo && data.demoLabel) {
          videoDemoLabel.textContent = '⚡ ' + data.demoLabel;
          videoDemoLabel.style.display = 'block';
        } else {
          videoDemoLabel.style.display = 'none';
        }
      }

      if (activeUrl && modalVideoPlayer) {
        // Exibe player funcional
        modalVideoPlayer.style.display = 'block';
        if (videoBox) videoBox.style.display = 'none';

        if (activeUrl.includes('youtube.com') || activeUrl.includes('youtu.be') || activeUrl.includes('vimeo.com')) {
          // Embed iframe
          modalVideoPlayer.innerHTML = `
            <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:14px 0;">
              <iframe
                src="${activeUrl}"
                style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                loading="lazy"
              ></iframe>
            </div>
          `;
        } else {
          // Arquivo MP4 (local ou CDN)
          const posterAttr = data.demoPosterUrl ? ` poster="${data.demoPosterUrl}"` : '';
          modalVideoPlayer.innerHTML = `
            <video
              controls
              preload="metadata"
              playsinline
              ${posterAttr}
              style="width:100%;border-radius:12px;margin:14px 0;background:#0a0a14;max-height:60vh;"
              aria-label="${data.title}"
            >
              <source src="${activeUrl}" type="video/mp4">
              Seu navegador não suporta a reprodução deste vídeo.
            </video>
          `;
        }
      } else {
        // Sem vídeo: exibe estrutura editorial sugerida
        if (modalVideoPlayer) modalVideoPlayer.style.display = 'none';
        if (videoBox) videoBox.style.display = 'block';

        if (videoScript) {
          videoScript.replaceChildren(
            ...(data.steps || []).map((step) => {
              const li = document.createElement('li');
              li.textContent = step;
              return li;
            })
          );
        }
      }

      openModal(videoOverlay);
    });
  });

  // "Assistir apresentação" na Hero → abre o player principal
  const watchHeroLink = document.getElementById('watchHeroLink');
  if (watchHeroLink) {
    watchHeroLink.addEventListener('click', (e) => {
      e.preventDefault();
      const heroVideoBtn = document.getElementById('mainVideoButton');
      if (heroVideoBtn) heroVideoBtn.click();
    });
  }


  /* ==========================================================================
     5. Formulário de Qualificação & Integração WhatsApp
     ========================================================================== */
  const interestForm = document.getElementById('interestForm');
  const messagePreview = document.getElementById('messagePreview');
  const copyMessageBtn = document.getElementById('copyMessage');
  const sendWhatsAppBtn = document.getElementById('sendWhatsApp');

  let currentGeneratedMessage = '';

  if (interestForm) {
    interestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!interestForm.reportValidity()) return;

      const nameInput = document.getElementById('personName');
      const momentInput = document.getElementById('personMoment');
      const messageInput = document.getElementById('personMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const moment = momentInput ? momentInput.value : '';
      const msg = messageInput ? messageInput.value.trim() : '';

      if (!name) return;

      currentGeneratedMessage = `Olá, Bruna! Meu nome é ${name}. Gostaria de conhecer melhor sua mentoria de carreira e executiva.\n\nMeu momento atual: ${moment}.${msg ? '\n\nGostaria de conversar sobre: ' + msg : ''}\n\nPodemos conversar sobre como funciona o acompanhamento?`;

      if (messagePreview) messagePreview.textContent = currentGeneratedMessage;
      if (copyMessageBtn) copyMessageBtn.textContent = 'Copiar mensagem ↗';

      // Atualiza o link direto para o WhatsApp
      if (sendWhatsAppBtn) {
        const phone = cfg.contact && cfg.contact.whatsappNumber;
        const canUseWhatsApp = Boolean(cfg.form && cfg.form.enableDirectWhatsApp && /^\d{10,15}$/.test(phone || ''));
        sendWhatsAppBtn.hidden = !canUseWhatsApp;
        if (canUseWhatsApp) {
          const encoded = encodeURIComponent(currentGeneratedMessage);
          sendWhatsAppBtn.href = `https://wa.me/${phone}?text=${encoded}`;
        } else {
          sendWhatsAppBtn.removeAttribute('href');
        }
      }

      openModal(formOverlay);
    });
  }

  // Copiar para a área de transferência
  if (copyMessageBtn) {
    copyMessageBtn.addEventListener('click', async () => {
      if (!currentGeneratedMessage) return;

      try {
        await navigator.clipboard.writeText(currentGeneratedMessage);
        copyMessageBtn.textContent = 'Mensagem copiada ✓';
      } catch (err) {
        // Fallback para seleção manual caso permissão seja negada
        if (messagePreview) {
          const range = document.createRange();
          range.selectNodeContents(messagePreview);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        copyMessageBtn.textContent = 'Texto selecionado (Ctrl+C)';
      }
    });
  }

  /* ==========================================================================
     6. Controle do CTA Fixo Mobile (Evita cobrir o formulário)
     ========================================================================== */
  const mobileSticky = document.querySelector('.mobile-sticky');
  const leadSection = document.getElementById('aplicar');

  if (mobileSticky && leadSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Quando a seção do formulário estiver visível, recolhe a barra fixa
          if (entry.isIntersecting) {
            mobileSticky.classList.add('is-hidden');
          } else {
            mobileSticky.classList.remove('is-hidden');
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(leadSection);
  }

  console.log('Landing page Bruna — Mentoria de Carreira carregada com sucesso.');
})();
