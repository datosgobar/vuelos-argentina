$(document).ready(function() {
  const internacional = document.getElementById('internacional')
  const cabotaje = document.getElementById('cabotaje')
  const todos = document.getElementById('todos')
  const txtNumber = document.getElementById('footer-number')
  const txtRutas = document.getElementById('footer-rutas')
  const txt = document.getElementById('footer-text')

  const content = [
    {
      route: todos,
      number: '206.963',
      coloredText: 'Vuelos totales entre sep17-sep18.',
      text: '',
    },
    {
      route: internacional,
      number: '117.463',
      coloredText: 'Vuelos internacionales entre sep17-sep18.',
      text: 'Un 10% más de vuelos que en el período anterior.',
    },
    {
      route: cabotaje,
      number: '235.145',
      coloredText: 'Vuelos de cabotaje entre sep17-sep18.',
      text: 'Un 6% más de vuelos que en el período anterior.',
    },
  ]

  content.forEach(({ route, number, coloredText, text }) => {
    route.addEventListener('click', () => {
      setButtons(route)
      // Text
      txtNumber.innerHTML = number
      txtRutas.innerHTML = coloredText
      txt.innerHTML = text
      // Color
      setNumberColor(route)
    })
  })

  // Set active buttons on click
  setButtons = button => {
    // Reset buttons
    todos.classList.remove('button-active')
    internacional.classList.remove('button-active')
    cabotaje.classList.remove('button-active')
    // Add active class
    button.classList.add('button-active')
  }
  // Set footer colors on click
  setNumberColor = route => {
    txtNumber.classList.remove('number-color-internacionales', 'number-color-locales')
    txtRutas.classList.remove('number-color-internacionales', 'number-color-locales')

    if (route === internacional) {
      txtNumber.classList.add('number-color-internacionales')
      txtRutas.classList.add('number-color-internacionales')
    } else if (route === cabotaje) {
      txtNumber.classList.add('number-color-locales')
      txtRutas.classList.add('number-color-locales')
    }
  }
})
