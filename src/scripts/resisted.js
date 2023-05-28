const confetti = require('canvas-confetti')

const confettiCanvas = document.createElement('canvas')
confettiCanvas.style.position = 'fixed'
document.body.appendChild(confettiCanvas)

confetti.Promise = () => {
  console.log('confetti done')
}

const confettiAnimate = confetti.create(confettiCanvas, {
  resize: true,
  useWorker: true,
})
confettiAnimate({
  particleCount: 100,
  spread: 160,
})

// close tab after congrats message
setInterval(() => {
  chrome.tabs.getCurrent().then((tab) => {
    chrome.tabs.remove(tab.id)
  })
}, 3_000)
