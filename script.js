  // ============ CONFIGURAÇÃO ============
  // Troque pelo WhatsApp da empresa: código do país + DDD + número, só dígitos.
  const WHATSAPP_EMPRESA = "5516999999999";

  // ============ BOTÕES "AGENDAR" DOS SERVIÇOS ============
// Ao clicar, o formulário já abre com o serviço escolhido
document.querySelectorAll("[data-servico]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    document.getElementById("servico").value = botao.dataset.servico;
    document.querySelector('input[value="Agendado"]').checked = true;
    document.getElementById("bloco-data").classList.remove("escondido");
  });
});

// ============ ABAS: MISSÃO, VISÃO E VALORES ============
  const abas = document.querySelectorAll(".aba");

  function abrirAba(abaEscolhida) {
    abas.forEach(function (aba) {
      const ativa = aba === abaEscolhida;
      aba.setAttribute("aria-selected", ativa);
      aba.tabIndex = ativa ? 0 : -1;
      document.getElementById(aba.getAttribute("aria-controls")).classList.toggle("escondido", !ativa);
    });
  }

  abas.forEach(function (aba, indice) {
    aba.addEventListener("click", function () { abrirAba(aba); });

    // Setas do teclado trocam de aba
    aba.addEventListener("keydown", function (evento) {
      let destino = null;
      if (evento.key === "ArrowRight") destino = abas[(indice + 1) % abas.length];
      if (evento.key === "ArrowLeft")  destino = abas[(indice - 1 + abas.length) % abas.length];
      if (destino) { abrirAba(destino); destino.focus(); }
    });
  });

  // ============ ELEMENTOS DA PÁGINA ============
  const formulario  = document.getElementById("form-agendamento");
  const blocoData   = document.getElementById("bloco-data");
  const campoData   = document.getElementById("data");
  const campoHora   = document.getElementById("hora");
  const mensagemErro = document.getElementById("erro");

  // Não permite escolher datas passadas
  campoData.min = new Date().toISOString().split("T")[0];

  // Link do telefone no rodapé
  document.getElementById("link-telefone").href = "tel:+" + WHATSAPP_EMPRESA;

  // ============ EMERGÊNCIA x AGENDADO ============
  function emergenciaSelecionada() {
    return formulario.urgencia.value === "Emergência agora";
  }

  // Mostra ou esconde data e horário conforme o tipo de atendimento
  function atualizarBlocoData() {
    blocoData.classList.toggle("escondido", emergenciaSelecionada());
  }

  formulario.querySelectorAll('input[name="urgencia"]').forEach(function (opcao) {
    opcao.addEventListener("change", atualizarBlocoData);
  });

  // O botão "Emergência agora" do topo já marca a opção correta
  document.querySelector("[data-emergencia]").addEventListener("click", function () {
    formulario.querySelector('input[value="Emergência agora"]').checked = true;
    atualizarBlocoData();
  });

  // ============ VALIDAÇÃO ============
  // Devolve um texto de erro, ou "" se estiver tudo certo
  function validar() {
    const camposObrigatorios = ["nome", "telefone", "servico", "animal", "quantidade", "local"];
    for (const nome of camposObrigatorios) {
      if (!formulario[nome].value.trim()) {
        formulario[nome].focus();
        return "Preencha todos os campos obrigatórios.";
      }
    }
    if (!emergenciaSelecionada() && (!campoData.value || !campoHora.value)) {
      return "Escolha a data e o horário do atendimento.";
    }
    return "";
  }

  // ============ MONTAGEM DA MENSAGEM ============
  function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return dia + "/" + mes + "/" + ano;
  }

  function montarMensagem() {
    const f = formulario;
    const linhas = [
      "*Pedido de atendimento – AgroVet*",
      "",
      "Tipo: " + f.urgencia.value,
      "Nome: " + f.nome.value.trim(),
      "Telefone: " + f.telefone.value.trim(),
      "Serviço: " + f.servico.value,
      "Animal: " + f.animal.value + " (" + f.quantidade.value + ")",
      "Local: " + f.local.value.trim()
    ];

    if (!emergenciaSelecionada()) {
      linhas.push("Data: " + formatarData(campoData.value) + " às " + campoHora.value);
    }
    if (f.obs.value.trim()) {
      linhas.push("Observações: " + f.obs.value.trim());
    }
    return linhas.join("\n");
  }

  // ============ ENVIO ============
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const erro = validar();
    mensagemErro.textContent = erro;
    if (erro) return;

    const link = "https://wa.me/" + WHATSAPP_EMPRESA + "?text=" + encodeURIComponent(montarMensagem());
    window.open(link, "_blank", "noopener");
  });


// ============ TRABALHE CONOSCO ============
const formCurriculo = document.getElementById("form-curriculo");
const avisoCurriculo = document.getElementById("cv-erro");

// Botão "Quero me candidatar" já escolhe a vaga no formulário
document.querySelectorAll("[data-vaga]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    formCurriculo.vaga.value = botao.dataset.vaga;
  });
});

function montarMensagemCurriculo() {
  const f = formCurriculo;
  const linhas = [
    "*Candidatura – AgroVet*",
    "",
    "Vaga: " + f.vaga.value,
    "Nome: " + f.nome.value.trim(),
    "Telefone: " + f.telefone.value.trim(),
    "E-mail: " + f.email.value.trim(),
    "Cidade: " + f.cidade.value.trim()
  ];
  if (f.sobre.value.trim()) {
    linhas.push("Sobre mim: " + f.sobre.value.trim());
  }
  linhas.push("", "Vou enviar meu currículo (" + f.arquivo.files[0].name + ") em anexo nesta conversa.");
  return linhas.join("\n");
}

formCurriculo.addEventListener("submit", function (evento) {
  evento.preventDefault();
  avisoCurriculo.classList.remove("ok");

  // Todos os campos, menos "sobre", são obrigatórios
  const obrigatorios = ["vaga", "nome", "telefone", "email", "cidade"];
  for (const nome of obrigatorios) {
    if (!formCurriculo[nome].value.trim()) {
      formCurriculo[nome].focus();
      avisoCurriculo.textContent = "Preencha todos os campos obrigatórios.";
      return;
    }
  }
  if (!formCurriculo.arquivo.files.length) {
    avisoCurriculo.textContent = "Escolha o arquivo do seu currículo.";
    return;
  }

  const link = "https://wa.me/" + WHATSAPP_EMPRESA + "?text=" + encodeURIComponent(montarMensagemCurriculo());
  window.open(link, "_blank", "noopener");

  // O navegador não envia arquivos pelo WhatsApp sozinho, então avisamos a pessoa
  avisoCurriculo.classList.add("ok");
  avisoCurriculo.textContent = "Abrimos o WhatsApp. Anexe o currículo na conversa e envie.";
});

// ============ VACA ANIMADA ============
const vaca        = document.getElementById("vaca");
const desenhoVaca = vaca.querySelector("svg");
let ultimaPosicao = window.scrollY;
let timerParada;
let aguardandoFrame = false;

function moverVaca() {
  // progresso: 0 no topo da página, 1 no final
  const rolagemMaxima = document.documentElement.scrollHeight - window.innerHeight;
  const progresso = rolagemMaxima > 0 ? window.scrollY / rolagemMaxima : 0;
  const espacoLivre = window.innerWidth - vaca.offsetWidth;
  vaca.style.transform = "translateX(" + (progresso * espacoLivre) + "px)";

  // Se a página se moveu, a vaca anda; ao parar de rolar, ela para
  if (window.scrollY !== ultimaPosicao) {
    desenhoVaca.classList.toggle("esquerda", window.scrollY < ultimaPosicao);
    vaca.classList.add("andando");
    clearTimeout(timerParada);
    timerParada = setTimeout(function () { vaca.classList.remove("andando"); }, 150);
  }
  ultimaPosicao = window.scrollY;
  aguardandoFrame = false;
}

// requestAnimationFrame evita recalcular a cada pixel rolado
window.addEventListener("scroll", function () {
  if (!aguardandoFrame) {
    aguardandoFrame = true;
    requestAnimationFrame(moverVaca);
  }
}, { passive: true });
window.addEventListener("resize", moverVaca);
moverVaca();
