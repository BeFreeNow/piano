'use strict';
const PATH = "./piano/"
const EXTENSTION = ".mp3"
const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const OCTAVS_COUNT = 7
const keyboard = []
const keyboardSounds = []
const keyboardElements = []

const elMelody = document.querySelector('.melody')
const elClear = document.querySelector('.clear')
const elReset = document.querySelector('.reset')
const elSave = document.querySelector('.save')
const elStart = document.querySelector('.start')
const elKeyboard = document.querySelector('.keyboard')
const elPlay = document.querySelector('.play')
const elBody = document.body

elClear.addEventListener('click', handleClear)
elReset.addEventListener('click', handleReset)
elSave.addEventListener('click', handleSave)
elStart.addEventListener('click', handleStart)
elBody.addEventListener('keydown', handleKeyDown)
elBody.addEventListener('keyup', handleKeyUp)
elPlay.addEventListener('click', handlePlayButtonClick)

let defaultMelody = [
    { "keyboardIndex": "34", "key": "B5" }, { "keyboardIndex": "33", "key": "A5" }, { "keyboardIndex": "30", "key": "E5" },
    { "keyboardIndex": "28", "key": "C5" }, { "keyboardIndex": "34", "key": "B5" }, { "keyboardIndex": "33", "key": "A5" },
    { "keyboardIndex": "30", "key": "E5" }, { "keyboardIndex": "32", "key": "G5" }, { "keyboardIndex": "31", "key": "F5" },
    { "keyboardIndex": "28", "key": "C5" }, { "keyboardIndex": "26", "key": "A4" }, { "keyboardIndex": "32", "key": "G5" },
    { "keyboardIndex": "31", "key": "F5" }, { "keyboardIndex": "28", "key": "C5" }, { "keyboardIndex": "31", "key": "F5" },
    { "keyboardIndex": "30", "key": "E5" }, { "keyboardIndex": "28", "key": "C5" }, { "keyboardIndex": "26", "key": "A4" },
    { "keyboardIndex": "24", "key": "F4" }, { "keyboardIndex": "23", "key": "E4" }, { "keyboardIndex": "24", "key": "F4" },
    { "keyboardIndex": "25", "key": "G4" }, { "keyboardIndex": "26", "key": "A4" }, { "keyboardIndex": "27", "key": "B4" },
    { "keyboardIndex": "28", "key": "C5" }, { "keyboardIndex": "29", "key": "D5" }, { "keyboardIndex": "30", "key": "E5" }
]
let melodyIndex = 0
let lastKey
let prevSound
let savedMelody = localStorage.getItem('melody')
savedMelody = JSON.parse(savedMelody)
let userMelody = savedMelody?.length ? savedMelody : defaultMelody
let elUserNotes

function generateMelodyHtml() {
    elMelody.innerHTML = userMelody.map(({ key }, index) =>
        `<span data-keyboard-index="${index}" class= "user-note ">${key}</span>`).join(' ')
    elUserNotes = document.querySelectorAll('span[data-keyboard-index]')
}
generateMelodyHtml()

function generateSoundsAndButtons() {
    let keyboardIndex = 0
    let keyBoardHtml = ''
    for (let i = 1; i <= OCTAVS_COUNT; i++) {
        NOTES.forEach(note => {
            const key = note + i
            const sound = new Audio(PATH + key + EXTENSTION)
            keyboardSounds.push(sound)
            keyboard.push(key)
            keyBoardHtml += `<button class="keyboard-key" data-key="${key}"
                 data-idx=${keyboardIndex} onclick="handleKeyboardClick(this)">${key}</button>\n`
            keyboardIndex++
        })
    }
    elKeyboard.innerHTML = keyBoardHtml
}
generateSoundsAndButtons()

function handleClear() {
    userMelody.pop()
    generateMelodyHtml()
    elClear.blur()
    melodyIndex = 0
}

function handleReset() {
    userMelody = []
    elMelody.innerHTML = ''
    melodyIndex = 0
    prevSound = null
    elReset.blur()
}

function handleSave() {
    localStorage.setItem('melody', JSON.stringify(userMelody))
    elSave.blur()
    melodyIndex = 0
}

function handleStart() {
    melodyIndex = 0
    elUserNotes.forEach(el => el.classList.remove('played'))
    elStart.blur()
}

function handleKeyboardClick(button) {
    const keyboardIndex = button.getAttribute('data-idx')
    const key = button.getAttribute('data-key')
    const sound = keyboardSounds[keyboardIndex]
    playSound(sound)
    userMelody.push({ keyboardIndex, key })
    generateMelodyHtml()
    button.blur()
    melodyIndex = 0
}

function handlePlaySound() {
    const sound = getSound();
    playSound(sound)
    prevSound = sound;
    if (melodyIndex === 0) resetPlayedMarks()
    markPlayed(melodyIndex)
    melodyIndex++;
    if (melodyIndex === userMelody.length) melodyIndex = 0
}

function handleKeyDown({ key }) {
    preventPlayOnKeyHold(key)
    handlePlaySound()
}

function preventPlayOnKeyHold(key) {
    if (lastKey === key) {
        elBody.removeEventListener('keydown', handleKeyDown)
    }
    setLastKey(key)
}

function handleKeyUp({ key }) {
    elBody.addEventListener('keydown', handleKeyDown)
    resetLastKey(key)
}

function setLastKey(key) {
    lastKey = key
}

function resetLastKey(key) {
    if (lastKey === key) lastKey = null
}

function handlePlayButtonClick() {
    handlePlaySound()
}

function markPlayed(index) {
    const elUserMelodyKey = document.querySelector(`[data-keyboard-index="${index}"]`)
    elUserMelodyKey?.classList?.add('played')
}

function resetPlayedMarks() {
    elUserNotes.forEach(el => el.classList.remove('played'))
}

function playSound(sound) {
    if (!sound) return
    sound.currentTime = 0
    sound.play();
}

function getSound() {
    if (!userMelody.length) return
    const { keyboardIndex } = userMelody[melodyIndex]
    return keyboardSounds[keyboardIndex]
}

function stopSound(sound) {
    if (!sound) return
    sound.pause()
    sound.currentTime = 0
}