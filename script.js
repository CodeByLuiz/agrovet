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
