import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase conectado!");

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const perguntas = [
    {
        pergunta: "Quem construiu a arca?",
        opcoes: ["Moisés", "Abraão", "Noé", "Davi"],
        resposta: "Noé"
    },
    {
        pergunta: "Quem abriu o Mar Vermelho?",
        opcoes: ["Josué", "Moisés", "Pedro", "Elias"],
        resposta: "Moisés"
    },
    {
        pergunta: "Quem derrotou Golias?",
        opcoes: ["Saul", "Samuel", "Davi", "Salomão"],
        resposta: "Davi"
    },
    {
        pergunta: "Quantos discípulos Jesus escolheu?",
        opcoes: ["10", "11", "12", "13"],
        resposta: "12"
    },
    {
        pergunta: "Quem foi lançado na cova dos leões?",
        opcoes: ["José", "Daniel", "Jeremias", "Elias"],
        resposta: "Daniel"
    },
    {
        pergunta: "Quem era o pai de Isaque?",
        opcoes: ["Jacó", "Abraão", "José", "Moisés"],
        resposta: "Abraão"
    },
    {
        pergunta: "Quem interpretou os sonhos do faraó?",
        opcoes: ["Davi", "Daniel", "José", "Samuel"],
        resposta: "José"
    },
    {
        pergunta: "Quem traiu Jesus?",
        opcoes: ["Pedro", "João", "Judas", "Tomé"],
        resposta: "Judas"
    },
    {
        pergunta: "Onde Jesus nasceu?",
        opcoes: ["Nazaré", "Jerusalém", "Belém", "Egito"],
        resposta: "Belém"
    },
    {
        pergunta: "Quem batizou Jesus?",
        opcoes: ["Pedro", "João Batista", "Tiago", "André"],
        resposta: "João Batista"
    },
    {
        pergunta: "Quantos dias durou o dilúvio?",
        opcoes: ["30", "40", "50", "70"],
        resposta: "40"
    },
    {
        pergunta: "Qual era a profissão de Pedro?",
        opcoes: ["Carpinteiro", "Pescador", "Pastor", "Soldado"],
        resposta: "Pescador"
    },
    {
        pergunta: "Quem escreveu muitos Salmos?",
        opcoes: ["Salomão", "Isaías", "Davi", "Moisés"],
        resposta: "Davi"
    },
    {
        pergunta: "Qual foi o primeiro milagre de Jesus?",
        opcoes: ["Multiplicar pães", "Andar sobre as águas", "Transformar água em vinho", "Curar um cego"],
        resposta: "Transformar água em vinho"
    },
    {
        pergunta: "Quem foi engolido por um grande peixe?",
        opcoes: ["Elias", "Jonas", "Jeremias", "Amós"],
        resposta: "Jonas"
    },
    {
        pergunta: "Qual discípulo andou sobre as águas com Jesus?",
        opcoes: ["Pedro", "João", "Tomé", "Mateus"],
        resposta: "Pedro"
    },
    {
        pergunta: "Quem recebeu os Dez Mandamentos?",
        opcoes: ["Abraão", "Josué", "Moisés", "Arão"],
        resposta: "Moisés"
    },
    {
        pergunta: "Quem era a mãe de Jesus?",
        opcoes: ["Marta", "Maria", "Isabel", "Ana"],
        resposta: "Maria"
    },
    {
        pergunta: "Qual gigante foi derrotado por Davi?",
        opcoes: ["Golias", "Saul", "Absalão", "Nabucodonosor"],
        resposta: "Golias"
    },
    {
        pergunta: "Qual livro é o último da Bíblia?",
        opcoes: ["Judas", "Apocalipse", "Hebreus", "Malaquias"],
        resposta: "Apocalipse"
    }
    ];

let respostaSelecionada = null;
let respondeu = false;
let tempoResultado = 5;
let tempo = 10;
let intervalo;
let perguntaAtual = 0;
let pontuacao = 0;

function comecarQuiz() {

    perguntas.sort(() => Math.random() - 0.5);

    const nome = document.getElementById("nome").value.trim();

    if (nome === "") {
        alert("Digite seu nome!");
        return;
    }

    localStorage.setItem("nomeJogador", nome);

    mostrarPergunta();
}

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

        document.getElementById("tempo").textContent = tempo;

        if (tempo <= 0) {

            clearInterval(intervalo);
        
            mostrarCorrecao();
        
        }

    }, 1000);
}

function mostrarResultado(acertou, respostaEscolhida) {

    const pergunta = perguntas[perguntaAtual];

    let contador = 5;

    document.querySelector(".container").innerHTML = `
        <h1>${acertou ? "✅ Acertou!" : "❌ Errou!"}</h1>

        <p><strong>Sua resposta:</strong></p>
        <p>${respostaEscolhida}</p>

        <br>

        <p><strong>Resposta correta:</strong></p>
        <p>${pergunta.resposta}</p>

        <br>

        <h3>⭐ Pontuação atual: ${pontuacao}</h3>

        <br>

        <p>Próxima pergunta em <span id="contador">${contador}</span>...</p>
    `;

    const intervaloResultado = setInterval(() => {

        contador--;

        document.getElementById("contador").textContent = contador;

        if (contador <= 0) {

            clearInterval(intervaloResultado);

            perguntaAtual++;

            if (perguntaAtual < perguntas.length) {
                mostrarPergunta();
            } else {
                finalizarQuiz();
            }

        }

    }, 1000);

}

function responder(opcaoEscolhida) {

    respostaSelecionada = opcaoEscolhida;

    const botoes = document.querySelectorAll(".opcao");

    botoes.forEach(botao => {
        botao.classList.remove("selecionada");

        if (botao.textContent.trim() === opcaoEscolhida) {
            botao.classList.add("selecionada");
        }
    });
}

function mostrarCorrecao() {

    const pergunta = perguntas[perguntaAtual];

    const acertou =
        respostaSelecionada === pergunta.resposta;

    document.body.classList.remove(
        "acertou",
        "errou"
    );

    if (respostaSelecionada === null) {

        document.body.classList.add("errou");

    } else if (acertou) {

        pontuacao++;
        document.body.classList.add("acertou");

    } else {

        document.body.classList.add("errou");

    }

    setTimeout(() => {

        mostrarResultado(
            acertou,
            respostaSelecionada || "Nenhuma resposta"
        );

        respostaSelecionada = null;
        respondeu = false;

    }, 500);
}

async function finalizarQuiz() {

    const nome = localStorage.getItem("nomeJogador");

    // SALVA NO FIREBASE
    await addDoc(collection(db, "ranking"), {
        nome: nome,
        pontos: pontuacao,
        data: new Date()
    });

    mostrarRanking();
}
    document.querySelector(".container").innerHTML = `
        <h1>🎉 Resultado</h1>

        <h2>${nome}</h2>

        <p>Você acertou ${pontuacao} de ${perguntas.length} perguntas!</p>

        <hr>

        <h2>🏆 Ranking</h2>

        ${rankingHTML}

        <br>

        <button onclick="location.reload()">
            Jogar Novamente
        </button>
    `;
}

function limparRanking() {
    localStorage.removeItem("ranking");
    alert("Ranking apagado!");
}
