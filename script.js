// Variáveis globais para controle da navegação
let currentPage = "home"
const pages = ["home", "sobre", "formacao", "portfolio", "contato"]

// Função principal para mostrar páginas - evita uso do botão voltar
function showPage(pageName) {
  // Verifica se a página existe
  if (!pages.includes(pageName)) {
    console.error("Página não encontrada:", pageName)
    return
  }

  // Remove classe active de todas as páginas
  pages.forEach((page) => {
    const pageElement = document.getElementById(page)
    if (pageElement) {
      pageElement.classList.remove("active")
    }
  })

  // Remove classe active de todos os links de navegação
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.classList.remove("active")
  })

  // Mostra a página selecionada
  const targetPage = document.getElementById(pageName)
  if (targetPage) {
    targetPage.classList.add("active")
    currentPage = pageName
  }

  // Adiciona classe active ao link correspondente
  const activeLink = document.querySelector(`[onclick="showPage('${pageName}')"]`)
  if (activeLink) {
    activeLink.classList.add("active")
  }

  // Fecha o menu mobile se estiver aberto
  closeMobileMenu()

  // Rola para o topo da página suavemente
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Função para controlar o menu hambúrguer em dispositivos móveis
function toggleMobileMenu() {
  const navMenu = document.getElementById("nav-menu")
  const hamburger = document.getElementById("hamburger")

  // Alterna as classes para mostrar/esconder menu
  navMenu.classList.toggle("active")
  hamburger.classList.toggle("active")
}

// Função para fechar o menu mobile
function closeMobileMenu() {
  const navMenu = document.getElementById("nav-menu")
  const hamburger = document.getElementById("hamburger")

  navMenu.classList.remove("active")
  hamburger.classList.remove("active")
}

// Função para validar e processar o formulário de contato
function handleContactForm(event) {
  event.preventDefault() // Previne o envio padrão do formulário

  // Captura os dados do formulário
  const formData = new FormData(event.target)
  const nome = formData.get("nome").trim()
  const email = formData.get("email").trim()
  const assunto = formData.get("assunto").trim()
  const mensagem = formData.get("mensagem").trim()
  const github = formData.get("github")?.trim() || "" // Campo GitHub opcional

  // Validação básica dos campos obrigatórios
  if (!nome || !email || !mensagem) {
    alert("Por favor, preencha todos os campos obrigatórios.")
    return
  }

  // Validação simples de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    alert("Por favor, insira um email válido.")
    return
  }

  // Simulação de envio (em um projeto real, aqui seria feita a requisição para o servidor)
  const submitButton = event.target.querySelector(".submit-button")
  const originalText = submitButton.textContent

  // Feedback visual durante o "envio"
  submitButton.textContent = "Enviando..."
  submitButton.disabled = true

  // Simula delay de envio
  setTimeout(() => {
    alert(`Obrigado, ${nome}! Sua mensagem foi enviada com sucesso. Retornarei o contato em breve. - Diogenes`)

    // Reset do formulário
    event.target.reset()

    // Restaura o botão
    submitButton.textContent = originalText
    submitButton.disabled = false
  }, 2000)
}

// Função para animar as barras de progresso dos idiomas
function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress")

  skillBars.forEach((bar) => {
    const width = bar.style.width
    bar.style.width = "0%"

    // Anima a barra após um pequeno delay
    setTimeout(() => {
      bar.style.width = width
    }, 500)
  })
}

// Event listeners que são executados quando o DOM está carregado
document.addEventListener("DOMContentLoaded", () => {
  // Configura o evento de clique para o menu hambúrguer
  const hamburger = document.getElementById("hamburger")
  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileMenu)
  }

  // Configura o formulário de contato
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm)
  }

  // Fecha o menu mobile quando clicar fora dele
  document.addEventListener("click", (event) => {
    const navMenu = document.getElementById("nav-menu")
    const hamburger = document.getElementById("hamburger")

    // Verifica se o clique foi fora do menu e do botão hambúrguer
    if (navMenu && hamburger && !navMenu.contains(event.target) && !hamburger.contains(event.target)) {
      closeMobileMenu()
    }
  })

  // Anima as barras de progresso quando a página de formação for mostrada
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class" &&
        mutation.target.id === "formacao" &&
        mutation.target.classList.contains("active")
      ) {
        // Delay para permitir que a animação de fade-in termine
        setTimeout(animateSkillBars, 300)
      }
    })
  })

  // Observa mudanças na página de formação
  const formacaoPage = document.getElementById("formacao")
  if (formacaoPage) {
    observer.observe(formacaoPage, { attributes: true })
  }

  // Configura navegação por teclado (acessibilidade)
  document.addEventListener("keydown", (event) => {
    // Navegação com teclas numéricas (1-5)
    if (event.key >= "1" && event.key <= "5") {
      const pageIndex = Number.parseInt(event.key) - 1
      if (pages[pageIndex]) {
        showPage(pages[pageIndex])
      }
    }

    // Fecha menu mobile com Escape
    if (event.key === "Escape") {
      closeMobileMenu()
    }
  })

  // Smooth scroll para links internos (se houver)
  const internalLinks = document.querySelectorAll('a[href^="#"]')
  internalLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  console.log("Portfólio de Diogenes Santos carregado com sucesso!")
  console.log("Navegação disponível:", pages)
  console.log("Use as teclas 1-5 para navegação rápida")
})

// Função utilitária para debug (pode ser removida em produção)
function getCurrentPage() {
  return currentPage
}

// Função para redimensionamento da janela (otimização)
let resizeTimer
window.addEventListener("resize", () => {
  // Debounce para evitar muitas execuções
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    // Fecha menu mobile em redimensionamento
    closeMobileMenu()

    // Reajusta elementos se necessário
    console.log("Janela redimensionada")
  }, 250)
})

// Previne comportamentos indesejados do navegador
window.addEventListener("beforeunload", () => {
  // Salva a página atual no sessionStorage (opcional)
  sessionStorage.setItem("currentPage", currentPage)
})

// Restaura a página ao recarregar (opcional)
window.addEventListener("load", () => {
  const savedPage = sessionStorage.getItem("currentPage")
  if (savedPage && pages.includes(savedPage)) {
    showPage(savedPage)
  }
})
