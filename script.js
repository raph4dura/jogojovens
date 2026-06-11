import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ---------------- FIREBASE ---------------- */

const firebaseConfig = {
  apiKey: "AIzaSyCv8m3MdhaBTLKht62ek85Gb6l2TwlOt2w",
  authDomain: "quiz-c8ddf.firebaseapp.com",
  projectId: "quiz-c8ddf",
  storageBucket: "quiz-c8ddf.appspot.com",
  messagingSenderId: "308135121789",
  appId: "1:308135121789:web:5e6b75c6e3ae9c40343214"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("🔥 Firebase conectado");

/* ---------------- QUIZ ---------------- */

const perguntas = [
  { pergunta: "Quem construiu a arca?", opcoes: ["Moisés","Abraão","Noé","Davi"], resposta: "Noé" },
  { pergunta: "Quem abriu o Mar Vermelho?", opcoes: ["Josué","Moisés","Pedro","Elias"], resposta: "Moisés" },
  { pergunta: "Quem derrotou Golias?", opcoes: ["Saul","Samuel","Davi","Salomão"], resposta: "Davi" },
  { pergunta: "Quantos discípulos Jesus escolheu?", opcoes: ["10","11","12","13"], resposta: "12" },
  { pergunta: "Quem foi lançado na cova dos leões?", opcoes: ["José","Daniel","Jeremias","Elias"], resposta: "Daniel" }
];

let perguntaAtual = 0;
let pontuacao = 0;
let respostaSelecionada = null;
let tempo = 10;
let intervalo;

/* ---------------- INICIAR ---------------- */

function comecarQuiz() {
  perguntas.sort(() => Math.random() - 0.5);

  const nome = document.getElementById("nome").value.trim();

  if (!nome) {
    alert("Digite seu nome!");
    return;
  }

  localStorage.setItem("nomeJogador", nome);

  mostrarPergunta();
}

/* ---------------- PERGUNTAS ---------------- */

function mostrarPergunta() {
  document.body.classList.remove("acertou", "errou");

  const p = perguntas[perguntaAtual];

  document.querySelector(".container").innerHTML = `
    <h2>Pergunta ${perguntaAtual + 1}/${perguntas.length}</h2>

    <p>⏱️ Tempo: <span id="tempo">${tempo}</span>s</p>

    <h3>${p.pergunta}</h3>

    <div class="opcoes">
      ${p.opcoes.map(opcao => `
        <button class="opcao" onclick="responder('${opcao}')">
          ${opcao}
        </button>
      `).join("")}
    </div>
  `;

  tempo = 10;

  clearInterval(intervalo);

  intervalo = setInterval(() => {
    tempo--;
    const el = document.getElementById("tempo");

    if (el) el.textContent = tempo;

    if (tempo <= 0) {
      clearInterval(intervalo);
      mostrarCorrecao();
    }
  }, 1000);
}

/* ---------------- RESPOSTA ---------------- */

function responder(opcao) {
  respostaSelecionada = opcao;

  document.querySelectorAll(".opcao").forEach(btn => {
    btn.classList.remove("selecionada");

    if (btn.textContent.trim() === opcao) {
      btn.classList.add("selecionada");
    }
  });
}

/* ---------------- CORREÇÃO ---------------- */

function mostrarCorrecao() {
  const p = perguntas[perguntaAtual];
  const acertou = respostaSelecionada === p.resposta;

  document.body.classList.remove("acertou", "errou");

  if (acertou) {
    pontuacao++;
    document.body.classList.add("acertou");
  } else {
    document.body.classList.add("errou");
  }

  setTimeout(() => {
    mostrarResultado(acertou, respostaSelecionada || "Nenhuma resposta");
    respostaSelecionada = null;
  }, 500);
}

/* ---------------- RESULTADO ---------------- */

function mostrarResultado(acertou, respostaEscolhida) {
  const p = perguntas[perguntaAtual];

  let contador = 3;

  document.querySelector(".container").innerHTML = `
    <h1>${acertou ? "✅ Acertou!" : "❌ Errou!"}</h1>

    <p>Sua resposta: ${respostaEscolhida}</p>
    <p>Correta: ${p.resposta}</p>

    <h3>Pontos: ${pontuacao}</h3>

    <p>Próxima em <span id="contador">${contador}</span>...</p>
  `;

  const interval = setInterval(() => {
    contador--;
    const el = document.getElementById("contador");

    if (el) el.textContent = contador;

    if (contador <= 0) {
      clearInterval(interval);

      perguntaAtual++;

      if (perguntaAtual < perguntas.length) {
        mostrarPergunta();
      } else {
        finalizarQuiz();
      }
    }
  }, 1000);
}

/* ---------------- FINAL ---------------- */

async function finalizarQuiz() {
  const nome = localStorage.getItem("nomeJogador");

  await addDoc(collection(db, "ranking"), {
    nome: nome,
    pontos: pontuacao,
    data: new Date()
  });

  mostrarRanking();
}

/* ---------------- RANKING ---------------- */

async function mostrarRanking() {
  const q = query(collection(db, "ranking"), orderBy("pontos", "desc"));
  const snapshot = await getDocs(q);

  let rankingHTML = "";
  let i = 0;

  snapshot.forEach(doc => {
    const j = doc.data();

    let medalha = "";
    if (i === 0) medalha = "🥇";
    else if (i === 1) medalha = "🥈";
    else if (i === 2) medalha = "🥉";

    if (i < 10) {
      rankingHTML += `<p>${medalha} ${i + 1}º - ${j.nome} (${j.pontos})</p>`;
    }

    i++;
  });

  document.querySelector(".container").innerHTML = `
    <h1>🎉 Resultado Final</h1>

    <h2>${localStorage.getItem("nomeJogador")}</h2>

    <p>Você fez ${pontuacao} pontos!</p>

    <hr>

    <h2>🏆 Ranking</h2>

    ${rankingHTML}

    <br>

    <button onclick="location.reload()">Jogar novamente</button>
  `;
}

/* ---------------- EXPORT ---------------- */

window.comecarQuiz = comecarQuiz;
window.responder = responder;

/* ---------------- BOTÃO ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnComecar");

  if (btn) {
    btn.addEventListener("click", comecarQuiz);
  }
});
