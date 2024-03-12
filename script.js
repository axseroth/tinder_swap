let isAnimating = false
let pullDeltaX = 0 // disancia que la card se esta arrastrando
const DECISION = 175 // distancia minima para tomar una decision
function starDrag(event){
    if (isAnimating) return

    // coje el primer articulo del elemento

    const actualCard = event.target.closest('article')
    if(!actualCard) return

    // cojemos la posicion inicial de el ratón

    const startX = event.pageX ?? event.touches[0].pageX
    console.log(startX)

    // escuchar cuando el raton se mueve

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)

    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })


    function onMove(event){
        // cojer el current position
    
        const currentX = event.pageX ?? event.touches[0].pageX
    
        //distancia recorrida
    
        pullDeltaX = currentX - startX
        

        //no hay distancia recorrida
        if(pullDeltaX === 0) return
        
        isAnimating = true

        //calcular la rotacion
        const deg = pullDeltaX / 15
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
        
        // actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`
        actualCard.style.cursor = 'grabbing'

        // Cambiar opaicidad de la información

        const opaicidad = Math.abs(pullDeltaX) / 100
        const isRight = pullDeltaX > 0

        const chocieEl = isRight 
            ? actualCard.querySelector('.choice.like')
            : actualCard.querySelector('.choice.nope')

        chocieEl.style.opacity = opaicidad
    }

    function onEnd(event){

        //Limpiar los eventos

        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)

        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('touchend', onEnd)

        //Saber si el user ha tomado una decisión
        const decisionMade = Math.abs(pullDeltaX) >= DECISION

        if(decisionMade){
            const goRight = pullDeltaX >= 0

            //añadir classe acorde a la decision
            actualCard.classList.add(goRight ? 'go-right' : 'go-left')
            actualCard.addEventListener('transitionend', ()=>{
                actualCard.remove()},
                {once: true}
            )
        }
        else{
            actualCard.classList.add('reset')
            actualCard.classList.remove('go-right', 'go-left')
            actualCard.querySelectorAll('.choice').forEach(el => {
                el.style.opacity = 0
            })
        }

        //resetear variables
        actualCard.addEventListener('transitionend', ()=>{
            actualCard.removeAttribute('style')
            actualCard.classList.remove('reset')
            isAnimating = false
            pullDeltaX = 0
            actualCard.style.cursor = 'grab'
            
        })
  
    }


}

document.addEventListener('mousedown', starDrag, { passive: true })
document.addEventListener('touchstart', starDrag, { passive: true })
