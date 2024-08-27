// Seleciona o elemento da calculadora no DOM
const calculator = document.querySelector('.calculator');

// Seleciona o contêiner de teclas dentro da calculadora
const keys = calculator.querySelector('.calculator__keys');

// Seleciona o display onde os números e resultados serão mostrados
const display = document.querySelector('.calculator__display');

// Função para calcular o resultado baseado nos números e operador
const calculate = (n1, operator, n2) => {
    let result = ''; // Variável para armazenar o resultado da operação

    // Verifica qual operador foi selecionado e realiza a operação correspondente
    if (operator === 'add') {
        result = parseFloat(n1) + parseFloat(n2); // Soma
    } else if (operator === 'subtract') {
        result = parseFloat(n1) - parseFloat(n2); // Subtração
    } else if (operator === 'multiply') {
        result = parseFloat(n1) * parseFloat(n2); // Multiplicação
    } else if (operator === 'divide') {
        result = parseFloat(n1) / parseFloat(n2); // Divisão
    }

    return result; // Retorna o resultado da operação
}

// Adiciona um ouvinte de evento de clique para o contêiner de teclas
keys.addEventListener('click', (e) => {
    // Verifica se o elemento clicado é um botão
    if (e.target.matches('button')) {
        const key = e.target; // O botão clicado
        const action = key.dataset.action; // A ação associada ao botão (por exemplo, 'add', 'clear')
        const keyContent = key.textContent; // O conteúdo do botão (o número ou símbolo)
        const displayedNum = display.textContent; // O número atualmente exibido no display
        const previousKeyType = calculator.dataset.previousKeyType; // Tipo da última tecla pressionada

        // Se não houver ação definida, trata o botão como um número
        if (!action) {
            // Se o display exibe '0' ou a última tecla foi um operador, substitui o número atual
            if (displayedNum === '0' || previousKeyType === 'operator') {
                display.textContent = keyContent;
            } else {
                // Adiciona o número ao final do display
                display.textContent = displayedNum + keyContent;
            }
            calculator.dataset.previousKeyType = 'number'; // Atualiza o tipo da última tecla pressionada
        }

        // Se a ação for um dos operadores
        if (
            action === 'add' ||
            action === 'subtract' ||
            action === 'multiply' ||
            action === 'divide'
        ) {
            key.classList.add('is-depressed'); // Adiciona uma classe para indicar que a tecla está pressionada
            calculator.dataset.previousKeyType = 'operator'; // Atualiza o tipo da última tecla pressionada
            calculator.dataset.firstValue = displayedNum; // Armazena o valor atual para a operação
            calculator.dataset.operator = action; // Armazena o operador selecionado
        }

        // Se a ação for decimal (ponto)
        if (action === 'decimal') {
            // Adiciona um ponto ao display apenas se ele ainda não contiver um
            if (!displayedNum.includes('.')) {
                display.textContent = displayedNum + '.';
            }
            calculator.dataset.previousKeyType = 'decimal'; // Atualiza o tipo da última tecla pressionada
        }

        // Se a ação for limpar
        if (action === 'clear') {
            display.textContent = '0'; // Reseta o display para '0'
            calculator.dataset.previousKeyType = 'clear'; // Atualiza o tipo da última tecla pressionada
        }

        // Se a ação for calcular (resultado)
        if (action === 'calculate') {
            const firstValue = calculator.dataset.firstValue; // O primeiro valor para a operação
            const operator = calculator.dataset.operator; // O operador selecionado
            const secondValue = displayedNum; // O segundo valor para a operação

            // Calcula o resultado e exibe no display
            display.textContent = calculate(firstValue, operator, secondValue);
            calculator.dataset.previousKeyType = 'calculate'; // Atualiza o tipo da última tecla pressionada
        }

        // Remove a classe 'is-depressed' de todas as teclas, indicando que nenhuma tecla está pressionada
        Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'));
    }
});
