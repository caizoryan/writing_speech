import { eff, hogaya, mem } from "./solid_monke/solid_monke.js";
import { each } from "./solid_monke/solid_monke.js";
import { p, h, render, $, div, h1, inn, sig, eff_on } from "./solid_monke/solid_monke.js";
import { to_type, get_audio, play_sample, check_last_word } from "./speech_engine.js";
import { map_value, find_sequence } from "./utils.js";

// basic stuff right, lets think through this
// -> a variable that holds what needs to be typed
// -> another one that holds what is being typed
//
// -> each word that needs to be typed has a time and audio file attatched to it
// -> each time space bar is hit and it is the word that needs to be typed, the audio file is played
//
const background = new Audio("./soundtrack.mp3")
background.volume = 0.5
background.loop = true
const r = document.querySelector(':root');

export const updated = () => update = false
export const reset_last_word = () => since_last_word = 0


export let typed = sig("")
let typed_words = mem(() => typed.is().split(" "))
let update = false
export let since_last_word = 0;
let lastTime, ctx, canvas;

eff_on(typed.is, () => {
  if (background.paused) background.play()
  update = true
})

const fade_colors = (val) => {
  let color = map_value(val, 0, 10, 1, 0);
  let as_155 = map_value(color, 0, 1, 155, 0);
  r.style.setProperty('--base-color', `rgba(255, 255, 255, ${color})`);
  r.style.setProperty('--base-shadow-color', `rgba(255, 255, 255, ${color / 100})`);
  r.style.setProperty('--secondary-color', `rgb(${as_155}, ${as_155}, ${as_155})`);
}

const scene_reset = () => {
  typed.set("")
  background.playbackRate = 1
  reset_last_word()
}

const sequence_library = [
  {
    sign: "works",
    sequence: ["will", "work"],
    onclick: () => {
      // change the layout a bit
      // play a transition image sequence
      text_to_type.set("hello world!")
      scene_reset()
    },
    hover_in: () => {
      // display text in background
    },
    hover_out: () => {
      // remove text from background
    }
  },
  {
    sign: "entry",
    sequence: ["hello", "world"],
  }
]

let found = mem(() => {
  let finds = []

  for (const seq of sequence_library) {
    let s = seq.sequence
    let f = find_sequence(typed_words(), s)
    if (f !== -1) finds.push({ sign: seq.sign, i: f, sequence: s })
  }

  return finds
})

let safe = (fun) => (fun) ? fun() : null

const word = (word, i) => {
  let sign
  for (const find of found()) {
    let f = find.i
    let len = find.sequence.length
    if (i >= f && i < f + len) sign = find.sign
  }

  if (sign) {
    let model = sequence_library.find((s) => s.sign === sign)
    return h("span", {
      id: "highlight",
      onmouseenter: () => { safe(model.hover_in); background.playbackRate = 5 },
      onmouseleave: () => { safe(model.hover_out); background.playbackRate = 1 },
      onclick: () => {
        model.onclick()
      }
    }, word + " ")
  }
  else return h("span", word + " ")

}
const typed_dom = () => div({ class: "typed" }, () => each(typed_words(), (w, i) => word(w, i())))


const text_to_type = sig("This will work")

const canvas_renderer = () => {
  hogaya(() => {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  })
  return h("canvas", { id: "canvas" })
}

function animate(time) {
  if (!lastTime) lastTime = time;
  let deltaTime = time - lastTime;
  lastTime = time;
  if (update) check_last_word();
  if (deltaTime) since_last_word += deltaTime;

  fade_colors(since_last_word / 1000)

  requestAnimationFrame(animate);
}

animate();

const Mother = () => {
  return div(
    div({ class: "canvas-layer" }, canvas_renderer),
    div({ class: "text-layer" }),
    div(
      { class: "interaction-layer" },
      p({ class: "to-type" }, text_to_type.is),
      typed_dom,
      h("input", { class: "bar", type: "text", value: typed.is, oninput: (e) => typed.set(e.target.value) })
    ),
  );
};

render(Mother, $("#root"));


