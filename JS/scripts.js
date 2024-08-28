// Função para calcular o resultado com base em dois números e um operador
const calculate = (n1, operator, n2) => {
    // Converte os números de string para float
    const firstNum = parseFloat(n1)
    const secondNum = parseFloat(n2)
    
    // Verifica o operador e realiza a operação matemática correspondente
    if (operator === 'add') return firstNum + secondNum
    if (operator === 'subtract') return firstNum - secondNum
    if (operator === 'multiply') return firstNum * secondNum
    if (operator === 'divide') return firstNum / secondNum
}

// Função para determinar o tipo de tecla com base no atributo data-action
const getKeyType = key => {
    // Obtém o valor do atributo data-action da tecla clicada
    const { action } = key.dataset
    
    // Se o atributo data-action não estiver definido, a tecla é considerada um número
    if (!action) return 'number'
    
    // Se o atributo data-action corresponder a uma operação, retorna 'operator'
    if (
      action === 'add' ||
      action === 'subtract' ||
      action === 'multiply' ||
      action === 'divide'
    ) return 'operator'
    
    // Para todos os outros casos, retorna o valor do atributo data-action
    return action
}

// Função para criar a string de resultado a ser exibida na tela da calculadora
const createResultString = (key, displayedNum, state) => {
    // Obtém o conteúdo da tecla e o tipo da tecla clicada
    const keyContent = key.textContent
    const keyType = getKeyType(key)
    
    // Desestrutura o estado atual da calculadora
    const {
      firstValue,
      operator,
      modValue,
      previousKeyType
    } = state
  
    // Se a tecla é um número
    if (keyType === 'number') {
      // Se a tela exibe '0', ou a última tecla foi um operador ou 'calcular', substitui o número atual
      return displayedNum === '0' ||
        previousKeyType === 'operator' ||
        previousKeyType === 'calculate'
        ? keyContent
        : displayedNum + keyContent
    }
  
    // Se a tecla é um ponto decimal
    if (keyType === 'decimal') {
      // Adiciona o ponto decimal se não estiver presente na tela
      if (!displayedNum.includes('.')) return displayedNum + '.'
      // Se a última tecla foi um operador ou 'calcular', exibe '0.'
      if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.'
      // Caso contrário, retorna o número atual
      return displayedNum
    }
  
    // Se a tecla é um operador
    if (keyType === 'operator') {
      // Se há um valor inicial, um operador e a última tecla não foi um operador ou 'calcular', realiza a operação
      return firstValue &&
        operator &&
        previousKeyType !== 'operator' &&
        previousKeyType !== 'calculate'
        ? calculate(firstValue, operator, displayedNum)
        : displayedNum
    }
  
    // Se a tecla é 'clear' (limpar)
    if (keyType === 'clear') return 0
  
    // Se a tecla é 'calculate' (calcular)
    if (keyType === 'calculate') {
      // Se há um valor inicial
      return firstValue
        ? previousKeyType === 'calculate'
          // Se a última tecla foi 'calcular', realiza a operação com o valor modValue
          ? calculate(displayedNum, operator, modValue)
          // Caso contrário, realiza a operação com o valor exibido atualmente
          : calculate(firstValue, operator, displayedNum)
        : displayedNum
    }
}

// Função para atualizar o estado da calculadora com base na tecla pressionada
const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
    // Obtém o tipo da tecla pressionada
    const keyType = getKeyType(key)
    
    // Desestrutura o estado atual da calculadora
    const {
      firstValue,
      operator,
      modValue,
      previousKeyType
    } = calculator.dataset
  
    // Atualiza o tipo da última tecla pressionada
    calculator.dataset.previousKeyType = keyType
  
    // Se a tecla é um operador
    if (keyType === 'operator') {
      // Atualiza o operador e o valor inicial
      calculator.dataset.operator = key.dataset.action
      calculator.dataset.firstValue = firstValue &&
        operator &&
        previousKeyType !== 'operator' &&
        previousKeyType !== 'calculate'
        ? calculatedValue
        : displayedNum
    }
  
    // Se a tecla é 'calculate'
    if (keyType === 'calculate') {
      // Atualiza o valor modValue se a última tecla foi 'calcular'
      calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
        ? modValue
        : displayedNum
    }
  
    // Se a tecla é 'clear' e o texto da tecla é 'AC'
    if (keyType === 'clear' && key.textContent === 'AC') {
      // Reseta todos os valores e estado da calculadora
      calculator.dataset.firstValue = ''
      calculator.dataset.modValue = ''
      calculator.dataset.operator = ''
      calculator.dataset.previousKeyType = ''
    }
}

// Função para atualizar a aparência visual da tecla pressionada
const updateVisualState = (key, calculator) => {
    // Obtém o tipo da tecla pressionada
    const keyType = getKeyType(key)
    
    // Remove a classe 'is-depressed' de todas as teclas
    Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))
  
    // Adiciona a classe 'is-depressed' à tecla se for um operador
    if (keyType === 'operator') key.classList.add('is-depressed')
    
    // Se a tecla for 'clear' e não exibir 'AC', altera o texto para 'AC'
    if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC'
    
    // Se a tecla não for 'clear', altera o texto da tecla de limpar para 'CE'
    if (keyType !== 'clear') {
      const clearButton = calculator.querySelector('[data-action=clear]')
      clearButton.textContent = 'CE'
    }
}

// Seleciona a calculadora e seus componentes do DOM
const calculator = document.querySelector('.calculator')
const display = calculator.querySelector('.calculator__display')
const keys = calculator.querySelector('.calculator__keys')

// Adiciona um ouvinte de evento ao contêiner de teclas para lidar com cliques
keys.addEventListener('click', e => {
    // Verifica se o alvo do clique é um botão
    if (!e.target.matches('button')) return
    
    // Obtém a tecla clicada e o número exibido atualmente
    const key = e.target
    const displayedNum = display.textContent
    
    // Cria a nova string de resultado com base na tecla clicada e no estado atual
    const resultString = createResultString(key, displayedNum, calculator.dataset)
  
    // Atualiza o display da calculadora com a nova string de resultado
    display.textContent = resultString
    
    // Atualiza o estado da calculadora
    updateCalculatorState(key, calculator, resultString, displayedNum)
    
    // Atualiza a aparência visual da tecla pressionada
    updateVisualState(key, calculator)
})
