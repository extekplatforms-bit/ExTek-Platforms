/* script.js
   Funções:
   - mantém a estrutura original do teu script
   - adiciona carrossel com autoplay + pause on interaction + dots
   - toggle de tema com label dinâmico
   - filtros dinâmicos (preservando lógica)
   - envio de formulários via WhatsApp
   - compartilhamento nativo e preview modal
   - animação de parallax simples no header
*/

window.onload = function () {
  console.log("Script carregado com sucesso!");

  /* ---------------- Tema (toggle + label) ---------------- */
  const themeBtn = document.querySelector('.toggle-theme');
  if (themeBtn) {
    const atualizarIconeTema = () => {
      themeBtn.textContent = document.body.classList.contains('dark-mode') ? "🌙 Modo Escuro" : "☀️ Modo Claro";
    };
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      atualizarIconeTema();
    });
    atualizarIconeTema();
  }

  /* ---------------- Menu móvel ---------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => menu.classList.toggle('oculto'));
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.classList.add('oculto')));
  }

  /* ---------------- Carrossel com autoplay e dots ---------------- */
  const slides = document.querySelectorAll('.slide');
  const btnAnterior = document.getElementById('anterior');
  const btnProximo = document.getElementById('proximo');
  const dotsContainer = document.getElementById('dots');
  let slideAtual = 0;
  let intervalo;

  // cria dots dinamicamente
  function criarDots() {
    if (!dotsContainer || slides.length === 0) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => {
        mostrarSlide(i); reiniciarCarrossel();
      });
      dotsContainer.appendChild(d);
    });
  }

  function atualizarDots(index) {
    const dots = dotsContainer?.querySelectorAll('.dot') || [];
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  function mostrarSlide(index) {
    if (slides.length === 0) return;
    slideAtual = index % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('ativo', i === slideAtual));
    atualizarDots(slideAtual);
  }

  function proximoSlide() { mostrarSlide((slideAtual + 1) % slides.length); }
  function anteriorSlide() { mostrarSlide((slideAtual - 1 + slides.length) % slides.length); }

  if (slides.length > 0) {
    criarDots();
    mostrarSlide(0);

    if (btnAnterior && btnProximo) {
      btnAnterior.addEventListener('click', () => { anteriorSlide(); reiniciarCarrossel(); });
      btnProximo.addEventListener('click', () => { proximoSlide(); reiniciarCarrossel(); });
    }

    function iniciarCarrossel() { intervalo = setInterval(proximoSlide, 5000); }
    function reiniciarCarrossel() { clearInterval(intervalo); iniciarCarrossel(); }

    // pause on hover/touch
    const carrosselEl = document.querySelector('.carrossel');
    carrosselEl?.addEventListener('mouseenter', () => clearInterval(intervalo));
    carrosselEl?.addEventListener('mouseleave', iniciarCarrossel);
    carrosselEl?.addEventListener('touchstart', () => clearInterval(intervalo), {passive:true});
    carrosselEl?.addEventListener('touchend', iniciarCarrossel);

    iniciarCarrossel();
  }

  /* ---------------- Filtros de veículos (mantém tua lógica) ---------------- */
  const modeloInput = document.getElementById('buscaModelo');
  const combustivelSelect = document.getElementById('filtroCombustivel');
  const transmissaoSelect = document.getElementById('filtroTransmissao');
  const cards = document.querySelectorAll('.card-carro');

  function filtrarVeiculos() {
    const modelo = (modeloInput?.value || '').toLowerCase();
    const combustivel = (combustivelSelect?.value || '').toLowerCase();
    const transmissao = (transmissaoSelect?.value || '').toLowerCase();

    cards.forEach(card => {
      const modeloCard = (card.dataset.modelo || '').toLowerCase();
      const combustivelCard = (card.dataset.combustivel || '').toLowerCase();
      const transmissaoCard = (card.dataset.transmissao || '').toLowerCase();

      const okModelo = modelo === '' || modeloCard.includes(modelo);
      const okComb = combustivel === '' || combustivelCard === combustivel;
      const okTrans = transmissao === '' || transmissaoCard === transmissao;

      card.style.display = (okModelo && okComb && okTrans) ? 'flex' : 'none';
    });
  }

  [modeloInput, combustivelSelect, transmissaoSelect].forEach(el => {
    if (!el) return;
    el.addEventListener('input', filtrarVeiculos);
    el.addEventListener('change', filtrarVeiculos);
  });

  /* ---------------- Ações principais do header ---------------- */
  const btnProcurar = document.getElementById('btn-procurar');
  const btnVender = document.getElementById('btn-vender');
  const btnWhatsapp = document.getElementById('btn-whatsapp');

  btnProcurar?.addEventListener('click', () => document.getElementById('veiculos')?.scrollIntoView({behavior:'smooth'}));
  btnVender?.addEventListener('click', () => mostrarFormularioVenda());
  btnWhatsapp?.addEventListener('click', () => window.open('https://wa.me/244975956274', '_blank'));

  /* ---------------- Formulários -> WhastApp ---------------- */
  function enviarWhatsApp(form, prefixoMsg) {
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const dados = new FormData(form);
      const mensagem = [...dados.entries()].map(([k,v]) => `${k.toUpperCase()}: ${v}`).join('\n');
      const url = `https://wa.me/244975956274?text=${encodeURIComponent(prefixoMsg + "\n" + mensagem)}`;
      window.open(url, '_blank');
    });
  }

  enviarWhatsApp(document.getElementById('form-venda'), "Cadastro de Veículo:");
  enviarWhatsApp(document.getElementById('form-contato'), "Contato via site:");

  /* cancelar form venda */
  document.getElementById('btn-cancelar-venda')?.addEventListener('click', ocultarFormularioVenda);

  /* mostrar/ocultar formulario venda (exposto globalmente) */
  function mostrarFormularioVenda() {
    const el = document.getElementById('vender');
    if (!el) return;
    el.classList.remove('oculto');
    el.setAttribute('aria-hidden','false');
    el.scrollIntoView({behavior:'smooth'});
  }
  function ocultarFormularioVenda() {
    const el = document.getElementById('vender');
    if (!el) return;
    el.classList.add('oculto');
    el.setAttribute('aria-hidden','true');
  }
  window.mostrarFormularioVenda = mostrarFormularioVenda;
  window.ocultarFormularioVenda = ocultarFormularioVenda;

  /* ---------------- Interesse e Compartilhar ---------------- */
  window.demonstrarInteresse = function (modelo, preco, telefone) {
    const mensagem = `Tenho interesse no veículo ${modelo} com preço Kz ${preco}`;
    window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`, "_blank");
  };

  window.compartilharVeiculo = function (modelo, preco) {
    if (navigator.share) {
      navigator.share({ title:`Veículo: ${modelo}`, text:`${modelo} - ${preco} via ExTek Platforms`, url: window.location.href });
    } else {
      // fallback: copia para clipboard
      const texto = `Veículo: ${modelo} — ${preco} — ${window.location.href}`;
      navigator.clipboard?.writeText(texto).then(()=> alert('Link copiado para partilha!'), ()=> alert('Partilha não suportada.'));
    }
  };

  /* ---------------- Preview modal (visualização do anúncio) ---------------- */
  const previewModal = document.getElementById('previewModal');
  const previewBody = previewModal?.querySelector('.modal-body');
  const previewClose = previewModal?.querySelector('.modal-close');

  window.abrirPreview = function(button){
    // encontra a imagem do card correspondente
    const card = button.closest('.card-carro');
    if(!card) return;
    const img = card.querySelector('img')?.cloneNode();
    const titulo = card.querySelector('h3')?.textContent || '';
    const preco = card.querySelector('.preco')?.textContent || '';
    previewBody && (previewBody.innerHTML = `<h3 style="color:var(--accent)">${titulo} — ${preco}</h3>`);
    if(img && previewBody) previewBody.appendChild(img);
    previewModal?.classList.remove('oculto');
    previewModal?.setAttribute('aria-hidden','false');
  };

  previewClose?.addEventListener('click', () => {
    previewModal.classList.add('oculto');
    previewModal.setAttribute('aria-hidden','true');
  });
  previewModal?.addEventListener('click', (e)=> {
    if(e.target === previewModal){ previewModal.classList.add('oculto'); previewModal.setAttribute('aria-hidden','true'); }
  });

  /* ---------------- Parallax suave no header ---------------- */
  const heroDecor = document.querySelector('.hero-decor');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if(heroDecor) heroDecor.style.transform = `translateY(${scrolled * 0.12}px)`;
  }, {passive:true});

  /* Accessibility: enable keyboard to close modal */
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal && !previewModal.classList.contains('oculto')) {
      previewModal.classList.add('oculto');
      previewModal.setAttribute('aria-hidden','true');
    }
  });
};