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
     4. Sistema de Vídeo VSL (Player Inline na Apresentação e Modal nos Curtos)
        Anti-Avanço / Anti-Download / Anti-Velocidade (Retenção Máxima)
     ========================================================================== */

  // Formata segundos em MM:SS
  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds) || !isFinite(timeInSeconds)) return '00:00';
    const totalSecs = Math.floor(timeInSeconds);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  /**
   * Inicializa os controles e proteções de retenção VSL em um player
   * @param {Object} options
   * @param {HTMLElement} options.container Container .vsl-player
   * @param {HTMLVideoElement} options.video Elemento <video>
   * @param {boolean} options.allowRewind Se permite voltar (false no principal, true nos curtos)
   */
  const initVslController = ({ container, video, allowRewind = false }) => {
    if (!container || !video) return null;

    let maxWatchedTime = 0;
    let lastReportedTime = 0;

    // Referências aos controles
    const playBtn = container.querySelector('.vsl-btn--play');
    const volBtn = container.querySelector('.vsl-btn--vol');
    const volSlider = container.querySelector('.vsl-volume-slider');
    const fsBtn = container.querySelector('.vsl-btn--fullscreen');
    const rewindBtn = container.querySelector('.vsl-btn--rewind');
    const timeCurrent = container.querySelector('.vsl-time__current');
    const timeDuration = container.querySelector('.vsl-time__duration');
    const progressBar = container.querySelector('.vsl-progress__bar');
    const progressBuffer = container.querySelector('.vsl-progress__buffer');
    const progressContainer = container.querySelector('.vsl-progress');

    // 1. Proteção: Travar velocidade em 1x e impedir download
    video.playbackRate = 1.0;
    video.controls = false;
    video.setAttribute('disablepictureinpicture', '');
    video.setAttribute('controlslist', 'nodownload noplaybackrate nofullscreen');

    // Desativa menu de contexto (botão direito) para não exibir "Salvar vídeo" ou velocidade
    container.addEventListener('contextmenu', (e) => e.preventDefault());
    video.addEventListener('contextmenu', (e) => e.preventDefault());

    // 2. Play / Pause
    const togglePlay = () => {
      if (video.paused || video.ended) {
        container.classList.add('is-active');
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    if (playBtn) playBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
    video.addEventListener('click', togglePlay);

    video.addEventListener('play', () => {
      container.classList.add('is-playing', 'is-active');
      container.classList.remove('is-paused');
    });

    video.addEventListener('pause', () => {
      container.classList.remove('is-playing');
      container.classList.add('is-paused');
    });

    video.addEventListener('ended', () => {
      container.classList.remove('is-playing');
      container.classList.add('is-paused');
    });

    // 3. Bloqueio estrito de avanço (Anti-Skip) e monitoramento de tempo
    video.addEventListener('timeupdate', () => {
      const current = video.currentTime;
      const duration = video.duration || 0;

      // Atualiza o progresso assistido legítimo
      if (current > maxWatchedTime && Math.abs(current - maxWatchedTime) < 2.5) {
        maxWatchedTime = current;
      }
      lastReportedTime = current;

      if (timeCurrent) timeCurrent.textContent = formatTime(current);
      if (timeDuration && duration) timeDuration.textContent = formatTime(duration);

      if (progressBar && duration) {
        const pct = Math.min(100, Math.max(0, (current / duration) * 100));
        progressBar.style.width = pct + '%';
      }

      // Buffer
      if (progressBuffer && duration && video.buffered.length > 0) {
        try {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          progressBuffer.style.width = Math.min(100, (bufferedEnd / duration) * 100) + '%';
        } catch (_) {}
      }
    });

    // Se o navegador ou usuário tentar pular para a frente: BLOQUEIA
    video.addEventListener('seeking', () => {
      if (video.currentTime > maxWatchedTime + 0.3) {
        video.currentTime = maxWatchedTime;
      } else if (!allowRewind && video.currentTime < lastReportedTime - 0.5) {
        // No principal, se não permitir voltar, mantém
        video.currentTime = lastReportedTime;
      }
    });

    // Impede alterar taxa de velocidade (2x, etc.)
    video.addEventListener('ratechange', () => {
      if (video.playbackRate !== 1.0) {
        video.playbackRate = 1.0;
      }
    });

    // 4. Barra de progresso interativa
    if (progressContainer) {
      if (allowRewind) {
        progressContainer.classList.add('can-rewind');
        progressContainer.addEventListener('click', (e) => {
          e.stopPropagation();
          const rect = progressContainer.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
          const targetTime = ratio * (video.duration || 0);

          // Apenas permite voltar para trás de onde já assistiu
          if (targetTime <= maxWatchedTime) {
            video.currentTime = targetTime;
          } else {
            // Tentativa de pular pra frente: ignora e trava no tempo atual
            video.currentTime = Math.min(video.currentTime, maxWatchedTime);
          }
        });
      } else {
        // No principal: barra apenas informativa, cliques não pulam
        progressContainer.addEventListener('click', (e) => e.stopPropagation());
      }
    }

    // 5. Botão de Voltar 10s (quando permitido)
    if (rewindBtn && allowRewind) {
      rewindBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.currentTime = Math.max(0, video.currentTime - 10);
      });
    }

    // 6. Volume e Mute
    if (volBtn) {
      volBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        container.classList.toggle('is-muted', video.muted);
        if (volSlider) volSlider.value = video.muted ? 0 : (video.volume || 1);
      });
    }

    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        const val = parseFloat(volSlider.value);
        video.volume = val;
        video.muted = (val === 0);
        container.classList.toggle('is-muted', video.muted);
      });
      volSlider.addEventListener('click', (e) => e.stopPropagation());
    }

    // 7. Tela Cheia (Fullscreen cross-browser)
    const toggleFullscreen = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (container.requestFullscreen) {
          container.requestFullscreen().catch(() => {
            if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
          });
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    };

    if (fsBtn) fsBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleFullscreen(); });

    const handleFsChange = () => {
      const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      container.classList.toggle('is-fullscreen', isFs);
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);

    // 8. Atalhos de Teclado no Player (bloqueia avanço)
    container.addEventListener('keydown', (e) => {
      // Bloqueia teclas de pular para frente
      if (['ArrowRight', 'KeyL', 'PageDown'].includes(e.code) || e.key === '>') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (e.code === 'Space' || e.code === 'KeyK') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        if (volBtn) volBtn.click();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'ArrowLeft' && allowRewind) {
        e.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 10);
      }
    });

    return {
      play: () => {
        container.classList.add('is-active');
        return video.play();
      },
      pause: () => video.pause(),
      togglePlay
    };
  };

  // --------------------------------------------------------------------------
  // A. Inicializa o Player Inline da Apresentação (direto no site)
  // --------------------------------------------------------------------------
  const mainWrapper = document.getElementById('mainVideoPlayerWrapper');
  const mainVideo = document.getElementById('mainInlineVideo');
  const mainCoverBtn = document.getElementById('mainVideoButton');
  const watchHeroLink = document.getElementById('watchHeroLink');

  if (mainWrapper && mainVideo) {
    const mainData = (cfg.videos && cfg.videos.apresentacao) || {};
    const mainActiveUrl = mainData.videoUrl || mainData.demoVideoUrl || 'assets/videos/apresentacao-demo.mp4';
    
    mainVideo.src = mainActiveUrl;
    if (mainData.demoPosterUrl) mainVideo.poster = mainData.demoPosterUrl;

    const mainController = initVslController({
      container: mainWrapper,
      video: mainVideo,
      allowRewind: false // Não pode voltar nem avançar (passa o vídeo continuamente)
    });

    // Clique na capa do vídeo inicia diretamente no site
    if (mainCoverBtn) {
      mainCoverBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        mainWrapper.classList.add('is-active');
        if (mainController) mainController.play();
      });
    }

    // Link da Hero "Assistir apresentação" rola até a seção e dá play inline
    if (watchHeroLink) {
      watchHeroLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = document.getElementById('presentation');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        mainWrapper.classList.add('is-active');
        setTimeout(() => {
          if (mainController) mainController.play();
        }, 400);
      });
    }
  }

  // --------------------------------------------------------------------------
  // B. Seção "Conteúdos em Vídeo" (Vídeos Curtos com abertura em Janela Modal)
  // --------------------------------------------------------------------------
  const mediaCards = document.querySelectorAll('.media-card[data-video]');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoScript = document.getElementById('videoScript');
  const videoBox = document.getElementById('videoBox');
  const modalVideoPlayer = document.getElementById('modalVideoPlayer');
  const videoDemoLabel = document.getElementById('videoDemoLabel');

  mediaCards.forEach((card) => {
    card.addEventListener('click', () => {
      const key = card.dataset.video;
      const data = (cfg.videos && cfg.videos[key]) || {
        title: 'Conteúdo da mentoria',
        steps: ['Gravação em produção.']
      };

      if (videoModalTitle) videoModalTitle.textContent = data.title;

      const activeUrl = data.videoUrl || data.demoVideoUrl || null;
      const isDemo = !data.videoUrl && !!data.demoVideoUrl;

      if (videoDemoLabel) {
        if (isDemo && data.demoLabel) {
          videoDemoLabel.textContent = '⚡ ' + data.demoLabel;
          videoDemoLabel.style.display = 'block';
        } else {
          videoDemoLabel.style.display = 'none';
        }
      }

      if (activeUrl && modalVideoPlayer) {
        modalVideoPlayer.style.display = 'block';
        if (videoBox) videoBox.style.display = 'none';

        if (activeUrl.includes('youtube.com') || activeUrl.includes('youtu.be') || activeUrl.includes('vimeo.com')) {
          modalVideoPlayer.innerHTML = `
            <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:14px;margin:14px 0;">
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
          // Injeta player VSL customizado no modal (com botão -10s, sem avançar, sem download, sem 2x)
          const posterAttr = data.demoPosterUrl ? `poster="${data.demoPosterUrl}"` : '';
          modalVideoPlayer.innerHTML = `
            <div class="vsl-player vsl-player--modal is-active" id="modalVslPlayer">
              <video
                class="vsl-video"
                id="modalVslVideo"
                src="${activeUrl}"
                ${posterAttr}
                playsinline
                webkit-playsinline
                preload="metadata"
                disablepictureinpicture
                controlslist="nodownload noplaybackrate nofullscreen"
                aria-label="${data.title}"
              ></video>

              <div class="vsl-controls" aria-hidden="true">
                <!-- Barra de progresso VSL: permite voltar, bloqueia pular para frente -->
                <div class="vsl-progress can-rewind" title="Clique para voltar">
                  <div class="vsl-progress__buffer"></div>
                  <div class="vsl-progress__bar"></div>
                </div>

                <div class="vsl-controls__bar">
                  <div class="vsl-controls__left">
                    <button type="button" class="vsl-btn vsl-btn--play" aria-label="Reproduzir ou pausar">
                      <svg class="vsl-icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5 20 12 7 19.5z"/></svg>
                      <svg class="vsl-icon-pause" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
                    </button>

                    <button type="button" class="vsl-btn vsl-btn--rewind" aria-label="Voltar 10 segundos">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
                      10s
                    </button>

                    <div class="vsl-time">
                      <span class="vsl-time__current">00:00</span>
                      <span class="vsl-time__sep">/</span>
                      <span class="vsl-time__duration">--:--</span>
                    </div>
                  </div>

                  <div class="vsl-controls__right">
                    <div class="vsl-volume-wrap">
                      <button type="button" class="vsl-btn vsl-btn--vol" aria-label="Silenciar">
                        <svg class="vsl-icon-vol-high" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                        <svg class="vsl-icon-vol-mute" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/></svg>
                      </button>
                      <input type="range" class="vsl-volume-slider" min="0" max="1" step="0.05" value="1" aria-label="Ajustar volume">
                    </div>

                    <button type="button" class="vsl-btn vsl-btn--fullscreen" aria-label="Ver em tela cheia">
                      <svg class="vsl-icon-fs-enter" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                      <svg class="vsl-icon-fs-exit" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6m0 0v6m0-6-7 7m17-11h-6m0 0V4m0 6 7-7m-7 17v-6m0 0h6m-6 0 7 7M10 4v6m0 0H4m6 0L3 3"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="vsl-center-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5 20 12 7 19.5z"/></svg>
              </div>
            </div>
          `;

          const modalContainer = modalVideoPlayer.querySelector('#modalVslPlayer');
          const modalVid = modalVideoPlayer.querySelector('#modalVslVideo');
          
          const modalCtrl = initVslController({
            container: modalContainer,
            video: modalVid,
            allowRewind: true // Nos vídeos curtos: pode voltar (botão 10s e barra)
          });

          // Inicia a reprodução
          setTimeout(() => {
            if (modalCtrl) modalCtrl.play().catch(() => {});
          }, 200);
        }
      } else {
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

  /* ==========================================================================
     7. Carrossel Horizontal de Avaliações do Google
     ========================================================================== */
  const reviewsTrack = document.getElementById('reviewsTrack');
  const reviewSlides = document.querySelectorAll('.review-card');
  const prevReviewBtn = document.getElementById('reviewsPrevBtn');
  const nextReviewBtn = document.getElementById('reviewsNextBtn');
  const reviewsCounter = document.getElementById('reviewsCounter');
  const reviewDots = document.querySelectorAll('.carousel-dot');
  const reviewsContainer = document.querySelector('.reviews-carousel');

  if (reviewsTrack && reviewSlides.length > 0) {
    let currentSlide = 0;
    const totalSlides = reviewSlides.length;

    const updateCarouselHeight = (index) => {
      if (reviewsContainer && reviewSlides[index]) {
        const slideH = reviewSlides[index].offsetHeight;
        if (slideH > 0) {
          reviewsContainer.style.height = `${slideH}px`;
        }
      }
    };

    const goToSlide = (index) => {
      currentSlide = (index + totalSlides) % totalSlides;
      reviewsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

      if (reviewsCounter) {
        reviewsCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
      }

      reviewDots.forEach((dot, idx) => {
        const isActive = idx === currentSlide;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });

      updateCarouselHeight(currentSlide);
    };

    // Ajusta a altura inicial e em redimensionamentos de tela
    window.addEventListener('load', () => updateCarouselHeight(currentSlide));
    window.addEventListener('resize', () => updateCarouselHeight(currentSlide));
    setTimeout(() => updateCarouselHeight(0), 150);

    if (prevReviewBtn) {
      prevReviewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentSlide - 1);
      });
    }

    if (nextReviewBtn) {
      nextReviewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentSlide + 1);
      });
    }

    reviewDots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetIndex = Number(dot.dataset.index || 0);
        goToSlide(targetIndex);
      });
    });

    // Touch swipe navigation for mobile
    if (reviewsContainer) {
      let touchStartX = 0;
      let touchEndX = 0;

      reviewsContainer.addEventListener(
        'touchstart',
        (e) => {
          touchStartX = e.changedTouches[0].clientX;
        },
        { passive: true }
      );

      reviewsContainer.addEventListener(
        'touchend',
        (e) => {
          touchEndX = e.changedTouches[0].clientX;
          const diff = touchStartX - touchEndX;
          if (Math.abs(diff) > 40) {
            if (diff > 0) {
              goToSlide(currentSlide + 1);
            } else {
              goToSlide(currentSlide - 1);
            }
          }
        },
        { passive: true }
      );
    }
  }

  console.log('Landing page Bruna — Mentoria de Carreira carregada com sucesso.');
})();
