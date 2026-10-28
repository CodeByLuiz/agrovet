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
