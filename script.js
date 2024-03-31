import { eff, mem } from "./solid_monke/solid_monke.js";
import { each } from "./solid_monke/solid_monke.js";
import { p, h, render, $, div, h1, inn, sig, eff_on } from "./solid_monke/solid_monke.js";
import { to_type, get_audio, play_sample, check_last_word } from "./speech_engine.js";
import { map_value } from "./utils.js";

// basic stuff right, lets think through this
// -> a variable that holds what needs to be typed
// -> another one that holds what is being typed
//
// -> each word that needs to be typed has a time and audio file attatched to it
// -> each time space bar is hit and it is the word that needs to be typed, the audio file is played
const r = document.querySelector(':root');

const fade = (val) => {
  // map val from 0 to 10 to 0 to 255
  let color = map_value(val, 0, 10, 0, 1);
  let as_255 = map_value(color, 0, 1, 0, 255);
  let inverse = 255 - as_255;
  let as_155 = map_value(color, 0, 1, 0, 155);
  let inverse_155 = 155 - as_155;
  r.style.setProperty('--base-color', `rgba(255, 255, 255, ${1 - color})`);
  r.style.setProperty('--highlight-color', `rgb(${inverse_155}, ${inverse_155}, ${inverse_155})`);
  r.style.setProperty('--secondary-color', `rgb(${as_155}, ${as_155}, ${as_155})`);
}


const background = new Audio("./soundtrack.mp3")
background.volume = 0.5
background.loop = true

function findSequenceIndex(arr, sequence) {
  for (let i = 0; i <= arr.length - sequence.length; i++) {
    let found = true;
    for (let j = 0; j < sequence.length; j++) {
      if (arr[i + j] !== sequence[j]) {
        found = false;
        break;
      }
    }
    if (found) {
      return i;
    }
  }
  return -1;
}

export const updated = () => update = false
export const reset_last_word = () => since_last_word = 0

export let typed = sig("")
let typed_words = mem(() => typed.is().split(" "))
let update = false
export let since_last_word = 0;
let lastTime;

eff_on(typed.is, () => {
  if (background.paused) background.play()
  update = true
  let arr = typed.is().split(" ").map((w) => w.toLowerCase())

})


function animate(time) {
  if (!lastTime) lastTime = time;
  let deltaTime = time - lastTime;
  lastTime = time;
  if (update) check_last_word();
  if (deltaTime) since_last_word += deltaTime;

  fade(since_last_word / 1000)

  requestAnimationFrame(animate);
}

animate();

const typed_dom = () => {
  let seq = ["hello", "world"]
  let len = seq.length
  let found = mem(() => {
    let f = findSequenceIndex(typed_words(), seq)
    return f
  })

  eff(() => {
    if (found() !== -1) {
      console.log("found", found())
    }
  })

  let in_range_of = (i) => {
    if (found() === -1) return false
    if (i >= found() && i < found() + len) return true
    return false
  }

  return div({ class: "typed" }, () => each(typed_words(), (word, i) => {
    if (in_range_of(i())) return h("span", {
      id: "highlight", onmouseenter: () => {
        background.playbackRate = 5
      }, onmouseleave: () => {
        background.playbackRate = 1
      }
    }, word + " ")
    else return h("span", word + " ")
  }))
}

const Mother = () => {
  return div(
    p({ class: "to-type" }, to_type.map((x) => x.word).join(" ")),
    typed_dom,
    h("input", { type: "text", oninput: (e) => typed.set(e.target.value) })
  );
};

render(Mother, $("#root"));

