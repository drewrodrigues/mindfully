const confetti = require('canvas-confetti')

const confettiCanvas = document.createElement('canvas')
confettiCanvas.style.position = 'fixed'
document.body.appendChild(confettiCanvas)

const confettiAnimate = confetti.create(confettiCanvas, {
  resize: true,
  useWorker: true,
})
confettiAnimate({
  colors: ['#ccff3a', '#61ff00', '#ccc'],
  particleCount: 100,
  spread: 160,
})

// close tab after congrats message
// TODO: add message about closing in n seconds
// setInterval(() => {
//   chrome.tabs.getCurrent().then((tab) => {
//     chrome.tabs.remove(tab.id)
//   })
// }, 3_000)
