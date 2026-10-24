/**
 * BRUNA: Mentoria de Carreira e Executiva
 * Arquivo Central de Configurações v2.0
 *
 * ═══════════════════════════════════════════════════════
 * COMO SUBSTITUIR OS ASSETS DEFINITIVOS:
 *
 * 1. FOTO DA BRUNA:
 *    → Substitua: assets/images/bruna-hero.png
 *    → Ou atualize: mentor.photoUrl abaixo
 *
 * 2. VÍDEO PRINCIPAL (apresentação real da Bruna):
 *    → Atualize: videos.apresentacao.videoUrl
 *    → Exemplo YouTube embed: "https://www.youtube.com/embed/SEU_ID"
 *    → Exemplo arquivo local: "assets/videos/apresentacao.mp4"
 *    → Quando preenchido, o player real substitui automaticamente o demonstrativo.
 *
 * 3. VÍDEOS CURTOS (gravações reais da Bruna):
 *    → Atualize cada videoUrl nos objetos "para-quem", "como-funciona", "primeiro-passo"
 *
 * 4. WHATSAPP:
 *    → Atualize: contact.whatsappNumber (formato internacional, ex: "5511999998888")
 *
 * 5. AVALIAÇÕES GOOGLE:
 *    → Só atualize reputation.rating quando o número for verificado independentemente.
 * ═══════════════════════════════════════════════════════
 */

window.BRUNA_CONFIG = {
  // Informações da Mentora
  mentor: {
    name: "Bruna",
    fullName: "Bruna, Mentoria de Carreira e Executiva",
    title: "Mentora de Carreira & Executiva",
    brandEyebrow: "MENTORIA DE CARREIRA & EXECUTIVA",
    shortBio: "Acompanhamento estratégico para profissionais que querem enxergar novas possibilidades, tomar decisões com mais clareza e construir o próximo capítulo da carreira de forma intencional.",
    // Foto real da Bruna: imagem com fundo transparente e efeitos violeta
    photoUrl: "assets/images/bruna-hero.png",
    photoAlt: "Bruna, Mentora de Carreira & Executiva, em vestido vermelho com microfone"
  },

  // Contatos e Redes Oficiais
  contact: {
    whatsappNumber: null, // ← Preencher apenas com o número oficial validado
    whatsappDefaultMessage: "Olá, Bruna! Gostaria de saber mais sobre a mentoria de carreira e executiva.",
    email: null,
    instagram: null
  },

  // Prova Social / Google Reviews
  reputation: {
    totalReviews: null,
    rating: null, // ← Preencher apenas após verificação no Google
    googlePlaceUrl: null,
    disclaimer: "Avaliações reais serão inseridas somente após validação com a Bruna."
  },

  // ═══════════════════════════════════════════════════════
  // CONFIGURAÇÃO DE VÍDEOS
  //
  // isDemoVideo: true  → indica material ilustrativo (exibe aviso)
  // isDemoVideo: false → produção real da Bruna (sem aviso)
  //
  // Vídeos demo usam CDN do Mixkit (licença gratuita para uso comercial)
  // Fonte: https://mixkit.co/license/ (Mixkit Free License)
  // ═══════════════════════════════════════════════════════
  videos: {
    "apresentacao": {
      title: "Conheça a experiência da mentoria.",
      tag: "VÍDEO DE APRESENTAÇÃO",
      subtitle: "Uma conversa sobre o seu futuro.",
      // ↓ Substitua pela URL ou arquivo real da Bruna quando disponível
      videoUrl: null,
      // Vídeo demo ilustrativo local (Mixkit: licença gratuita)
      demoVideoUrl: "assets/videos/apresentacao-demo.mp4",
      demoPosterUrl: "assets/images/video-posters/apresentacao-demo.jpg",
      sourcePage: "https://mixkit.co/free-stock-video/business-people-at-work-meeting-4809/",
      isDemoVideo: true,
      demoLabel: "Vídeo ilustrativo: apresentação sobre o formato da mentoria.",
      steps: [
        "Apresentação breve da Bruna e da sua experiência.",
        "Quem costuma procurar orientação de carreira e por quê.",
        "O que é conversado no acompanhamento e como ele funciona.",
        "Convite natural para uma conversa inicial, sem promessas exageradas."
      ]
    },
    "para-quem": {
      title: "Será que essa mentoria é para você?",
      tag: "VÍDEO CURTO 01",
      subtitle: "Para quem é a mentoria?",
      videoUrl: null,
      demoVideoUrl: "assets/videos/mentoria-demo-01.mp4",
      demoPosterUrl: "assets/images/video-posters/mentoria-demo-01.jpg",
      sourcePage: "https://mixkit.co/free-stock-video/professional-woman-working-in-an-office-42664/",
      isDemoVideo: true,
      demoLabel: "Vídeo ilustrativo: perfis atendidos pela mentoria executiva.",
      steps: [
        "Situações profissionais em que a mentoria pode ajudar.",
        "Exemplos de desafios recorrentes, sem expor clientes.",
        "Quando outro tipo de acompanhamento pode ser mais indicado."
      ]
    },
    "como-funciona": {
      title: "Um acompanhamento para o seu momento.",
      tag: "VÍDEO CURTO 02",
      subtitle: "Como funciona a mentoria?",
      videoUrl: null,
      demoVideoUrl: "assets/videos/mentoria-demo-02.mp4",
      demoPosterUrl: "assets/images/video-posters/mentoria-demo-02.jpg",
      sourcePage: "https://mixkit.co/free-stock-video/business-partners-meeting-4813/",
      isDemoVideo: true,
      demoLabel: "Vídeo ilustrativo: dinâmica dos encontros e metodologia.",
      steps: [
        "Explicar o formato real dos encontros e a duração.",
        "Mostrar o que acontece antes, durante e depois de cada encontro.",
        "Tirar dúvidas sobre participação e próximos passos."
      ]
    },
    "primeiro-passo": {
      title: "Toda mudança começa com uma decisão.",
      tag: "VÍDEO CURTO 03",
      subtitle: "Qual é o primeiro passo?",
      videoUrl: null,
      demoVideoUrl: "assets/videos/mentoria-demo-03.mp4",
      demoPosterUrl: "assets/images/video-posters/mentoria-demo-03.jpg",
      sourcePage: "https://mixkit.co/free-stock-video/presentation-during-a-work-team-meeting-42666/",
      isDemoVideo: true,
      demoLabel: "Vídeo ilustrativo: primeiros passos do alinhamento.",
      steps: [
        "Convidar a pessoa a contar seu momento de carreira.",
        "Explicar como funciona a conversa inicial e a disponibilidade.",
        "Encerrar com um convite simples para entrar em contato."
      ]
    }
  },

  // Perguntas Frequentes (FAQ)
  faq: [
    {
      question: "Como funciona a mentoria?",
      answer: "A estrutura, duração e frequência dos encontros ainda serão definidas com a Bruna. Antes de contratar, você poderá conhecer o formato e entender se ele faz sentido para seu momento.",
      defaultOpen: true
    },
    {
      question: "Preciso ocupar um cargo de liderança para participar?",
      answer: "O público exato está em definição. A conversa inicial poderá ajudar a avaliar se o acompanhamento é indicado para seus objetivos profissionais.",
      defaultOpen: false
    },
    {
      question: "Os encontros são online ou presenciais?",
      answer: "A modalidade será informada aqui assim que a Bruna confirmar como pretende atender.",
      defaultOpen: false
    },
    {
      question: "Qual é o valor da mentoria?",
      answer: "O investimento e as condições serão apresentados depois que o formato do serviço estiver definido.",
      defaultOpen: false
    },
    {
      question: "Como posso demonstrar interesse?",
      answer: "Basta preencher o formulário logo abaixo. Na versão publicada, o envio será integrado ao canal oficial escolhido pela Bruna.",
      defaultOpen: false
    }
  ],

  // Configuração do Formulário de Qualificação
  form: {
    webhookUrl: null,
    enableDirectWhatsApp: false
  }
};
