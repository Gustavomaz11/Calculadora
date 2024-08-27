const calculator = document.querySelector('.calculator')
const keys = calculator.querySelector('.calculator__keys')
const display = document.querySelector('.calculator__display')

keys.addEventListener('click', (e) => {

    if(e.target.matches('button')) {

        const key = e.target
        const action = key.dataset.action

        const keyContent = key.textContent
        const displayedNum = display.textContent

        if(!action) {

            if(displayedNum === '0') {
                display.textContent = keyContent
            } else {
                display.textContent = displayedNum + keyContent
            }
        }
    
        if(
            action === 'add' ||
            action === 'subtract' ||
            action === 'multiply' ||
            action === 'divide'
        ) {
            console.log('É um operador')
        }
        
        if(action === 'decimal') {
            console.log('Aqui é para decimal')
        }

        if(action === 'clear') {
            display.textContent = '0'
        }

        if(action === 'calculate') {
            console.log('Realizar Calculo')
        }

    }

    
})