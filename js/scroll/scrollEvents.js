$(document).ready(function() {
  var controller = new ScrollMagic.Controller()
  $('.fade-waiting').each(function() {
    var ourScene = new ScrollMagic.Scene({
      triggerElement: this,
      triggerHook: 0.9,
    })
      .setClassToggle(this, 'fade-in')
      // .addIndicators({
      //   name: 'fade in',
      // })
      .addTo(controller)
  })
  $('.count').each(function() {
    var ourScene = new ScrollMagic.Scene({
      triggerElement: this,
      triggerHook: 0.9,
    })
    ourScene.on('count', () => {
      document.getElementById('number1').style.color = 'red'
    })
  })
  $('.wait-fade-arrow').each(function() {
    var ourScene = new ScrollMagic.Scene({
      triggerElement: this,
      reverse: true,
      triggerHook: 0.8,
    })
      .setClassToggle('#arrow-text', 'remove-arrows')
      // .addIndicators({
      //   name: 'wait-fade-arrow',
      // })
      .addTo(controller)
  })
  $('.wait-fade-arrow').each(function() {
    var ourScene = new ScrollMagic.Scene({
      triggerElement: this,
      reverse: true,
      triggerHook: 0.8,
    })
      .setClassToggle('.arrow-up', 'remove-arrows')
      // .addIndicators({
      //   name: 'fade in',
      // })
      .addTo(controller)
  })
})
