// Seleciona elementos da interface
const grid = document.querySelector(".grid");             // Grade onde as cartas serão exibidas
const spanPlayer = document.querySelector('.player');     // Elemento que mostra o nome do jogador
const timer = document.querySelector('.timer');           // Elemento que mostra o tempo decorrido

// --- Configuração baseada na dificuldade selecionada ---
let dificuldade = localStorage.getItem('dificuldade') || 'facil';
let pares, tempoLimite;

switch (dificuldade) {
    case 'facil':
        pares = 5;
        tempoLimite = 180; // 3 minutos
        break;
    case 'media':
        pares = 10;
        tempoLimite = 120; // 2 minutos
        break;
    case 'dificil':
        pares = 12;
        tempoLimite = 60; // 1 minuto
        break;
    default:
        pares = 5;
        tempoLimite = 180;
}

let totalCartas = pares * 2;

// Objeto com os nomes dos personagens e suas respectivas extensões de imagem
const characters = {
    dente_podre: "png",
    dentista: "avif",
    enxaguante: "jpg",
    escova_de_dente: "png",
    espelho: "png",
    ferramenta: "png",
    fiodental: "jpg",
    front: "jpeg",
    pasta: "jpg",
    seringa: "avif",
    raioX: "jpg",
    implante: "png"
};

// Array com os nomes dos personagens
const characterNames = Object.keys(characters);

// Função auxiliar para criar elementos HTML com classe
const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
};

let firstCard = '';    // Armazena a primeira carta selecionada
let secondCard = '';   // Armazena a segunda carta selecionada

// Verifica se o jogo terminou (todas as cartas foram reveladas)
const checkEndGame = () => {
    const disabledCards = document.querySelectorAll('.disabled-card');

    if (disabledCards.length == totalCartas) {
        clearInterval(this.loop); // Para o timer
        alert(`Parabéns, ${spanPlayer.innerHTML}! Você venceu! Seu tempo foi: ${timer.innerHTML} segundos!`);
    }
};

// Verifica se as duas cartas selecionadas são iguais
const checkCards = () => {
    const firstCharacter = firstCard.getAttribute('data-character');
    const secondCharacter = secondCard.getAttribute('data-character');

    if (firstCharacter == secondCharacter) {
        // Se for par, adiciona classe para desativar as cartas
        firstCard.firstChild.classList.add('disabled-card');
        secondCard.firstChild.classList.add('disabled-card');

        firstCard = '';
        secondCard = '';

        checkEndGame(); // Verifica se o jogo acabou
    } else {
        // Se não for par, esconde as cartas novamente após 500ms
        setTimeout(() => {
            firstCard.classList.remove("reveal-card");
            secondCard.classList.remove("reveal-card");

            firstCard = '';
            secondCard = '';
        }, 500);
    }
};

// Função para mostrar o verso da carta ao clicar
const revealCard = ({ target }) => {
    if (target.parentNode.className.includes('reveal-card')) {
        return; // Impede que a carta seja clicada duas vezes
    }

    if (firstCard == '') {
        target.parentNode.classList.add('reveal-card');
        firstCard = target.parentNode;
    } else if (secondCard == '') {
        target.parentNode.classList.add('reveal-card');
        secondCard = target.parentNode;

        checkCards(); // Verifica se as cartas combinam
    }
};

// Cria uma carta com frente e verso
const createCard = (character) => {
    const card = createElement("div", "card");
    const front = createElement("div", "face front");
    const back = createElement("div", "face back");

    // Define a imagem da frente da carta com base no nome e extensão
    const extension = characters[character];
    front.style.backgroundImage = `url('${character}.${extension}')`;

    card.setAttribute("data-character", character);
    card.appendChild(front);
    card.appendChild(back);

    // Adiciona o evento de clique para revelar a carta
    card.addEventListener('click', revealCard);

    return card;
};

// Carrega o jogo embaralhando e exibindo as cartas no grid
const loadGame = () => {
    grid.innerHTML = ""; // Limpa as cartas antes de adicionar novas

    // Seleciona somente os pares necessários e duplica para criar os pares
    const selectedCharacters = characterNames.slice(0, pares);
    const duplicatedCharacters = [...selectedCharacters, ...selectedCharacters];
    const shuffledArray = duplicatedCharacters.sort(() => Math.random() - 0.5);

    // Cria e adiciona cada carta ao grid
    shuffledArray.forEach((character) => {
        const card = createCard(character);
        grid.appendChild(card);
    });
};

// Inicia o cronômetro com tempo limite
const startTimer = () => {
    let currentTime = 0;

    this.loop = setInterval(() => {
        currentTime++;
        timer.innerHTML = currentTime;

        if (currentTime >= tempoLimite) {
            clearInterval(this.loop);
            alert(`Tempo esgotado, ${spanPlayer.innerHTML}!`);
            location.reload(); // reinicia o jogo
        }
    }, 1000);
};

// Inicializa o jogo ao carregar a página
window.onload = () => {
    spanPlayer.innerHTML = localStorage.getItem('player'); // Exibe o nome do jogador
    startTimer(); // Inicia o cronômetro
    loadGame();   // Carrega as cartas no tabuleiro
};