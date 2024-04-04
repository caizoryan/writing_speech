import { p, h, simple_dukan, render, $, div, each, sig, eff_on, eff, hogaya, mem, inn } from "./solid_monke/solid_monke.js";
import { check_last_word, get_audio, to_type } from "./speech_engine.js";
import { map_value, find_sequence } from "./utils.js";
import { sequence_library, phrase_library } from "./sequence_library.js";

let lastTime, ctx, canvas;

let memory_library = [
  {
    sign: "walk",
    src: "./memory/memory1.mp4",
    timer_normal: 1400,
    timer: 1400,
  },
  {
    sign: "memory",
    src: "./memory/memory3.mp4",
    timer_normal: 4500,
    timer: 4500,
  },

  {
    sign: "labour",
    src: "./memory/memory4.mp4",
    timer_normal: 4000,
    timer: 4000,
  },
]

const background = new Audio("./soundtrack.mp3")
background.volume = 0.6
background.loop = true

export const r = document.querySelector(':root');

export const subtext = simple_dukan([
  {
    text: "",
    visible: false
  },
  {
    text: "",
    visible: false
  }

])

export const updated = () => update = false
export const reset_last_word = () => since_last_word = 0
let safe = (fun) => (fun) ? fun() : null

let entry_text = phrase_library.find((p) => p.sign === "entry").phrase
export let text_to_type = sig(entry_text)


export let typed = sig("")
export let since_last_word = 0;

let typed_words = mem(() => typed.is().split(" "))
let update = false

eff_on(typed.is, () => {
  if (background.paused) background.play()
  update = true
})

export const scene_reset = () => {
  typed.set("")
  background.playbackRate = 1
  subtext.forEach((s) => { s.text = ""; s.visible = false })
  reset_last_word()
}

const fade_colors = (val) => {
  let color = map_value(val, 0, 10, 1, 0);
  let as_155 = map_value(color, 0, 1, 155, 0);
  r.style.setProperty('--base-color', `rgba(255, 255, 255, ${color})`);
  r.style.setProperty('--base-shadow-color', `rgba(255, 255, 255, ${color / 100})`);
  r.style.setProperty('--secondary-color', `rgb(${as_155}, ${as_155}, ${as_155})`);
}


let found = mem(() => {
  let finds = []

  for (const seq of sequence_library) {
    let s = seq.sequence
    let f = find_sequence(typed_words(), s)
    if (f !== -1) finds.push({ sign: seq.sign, i: f, sequence: s })
  }

  return finds
})


const word = (word, i) => {
  let sign

  for (const find of found()) {
    let f = find.i
    let len = find.sequence.length
    if (i >= f && i < f + len) sign = find.sign
  }

  if (sign) {
    let model = sequence_library.find((s) => s.sign === sign)
    let is_clickable = model.destination ? true : false
    return h("span", {
      id: "highlight",
      class: is_clickable ? "clickable" : "hoverable",
      onmouseenter: () => {
        if (model.subtext[0]) { subtext[0].text = model.subtext[0]; subtext[0].visible = true }
        if (model.subtext[1]) { subtext[1].text = model.subtext[1]; subtext[1].visible = true }
        shuffle_subtext();
        background.playbackRate = 5
      },
      onmouseleave: () => {
        subtext.forEach((s) => s.visible = false)
        background.playbackRate = 1
      },
      onclick: () => {
        if (model.destination) {
          let phrase = phrase_library.find((p) => p.sign === model.destination)
          text_to_type.set(phrase.phrase)
          if (phrase.log) console.log(phrase.log)
          if (model.memory) {
            let obj = memory_library.find((v) => v.sign === model.memory)
            if (obj) transition(obj)
          }
          scene_reset()
        }
      }
    }, word + " ")
  }
  else return h("span", word + " ")

}

const typed_dom = () => div({ class: "typed" }, () => each(typed_words(), (w, i) => word(w, i())))

function remove_duplicates(arr) {
  return [...new Set(arr)]
}

let all_words = phrase_library.map((p) => p.phrase.split(" ")).flat()
all_words = remove_duplicates(all_words)

console.log(all_words)
console.log(to_type.map((x) => x.word))

let not_there = []
for (const w of all_words) {
  let found = to_type.find((x) => x.word.toLowerCase() === w.toLowerCase())
  if (!found) not_there.push(w)
}

console.log(not_there)


function shuffle_subtext() {

  let w1 = map_value(Math.random(), 0, 1, 30, 50)
  let w2 = map_value(Math.random(), 0, 1, 30, 50)

  let left1 = Math.floor(Math.random() * 100)
  let left2 = Math.floor(Math.random() * 100)

  if (left1 + w1 > 100) left1 -= w1
  if (left2 + w2 > 100) left2 -= w2

  r.style.setProperty('--subtext-1-left', `${left1}vw`);
  r.style.setProperty('--subtext-2-left', `${left2}vw`);

  r.style.setProperty('--subtext-1-width', `${w1}vw`);
  r.style.setProperty('--subtext-2-width', `${w2}vw`);
}

function tick(delta) {
  play_video(ctx, this.video)
  this.timer -= delta
  if (this.timer <= 0) {
    this.video.pause()
    this.timer = this.timer_normal
    video_queue.shift()
  }
}

function transition(video_item) {

  video_item.video.currentTime = 0
  video_queue.push(video_item)
  document.querySelector(".interaction-layer").style.opacity = "0"
  setTimeout(() => {
    document.querySelector(".interaction-layer").style.opacity = "1"
  }, video_item.timer)
}

memory_library.forEach(async (x) => {
  var video = document.createElement("video");
  video.setAttribute("src", x.src);
  x.video = video
})

let video_queue = []

function play_video(ctx, video) {
  video.play()

  let w = canvas.width
  let h = canvas.height
  ctx.drawImage(video, w / 4, h / 4, w / 2, h / 2)
}

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

  if (video_queue[0]) {
    tick.call(video_queue[0], deltaTime)
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  requestAnimationFrame(animate);
}


const sub_text_dom = () => {
  return div(
    { class: "subtext-layer" },
    () => each(subtext, (s, i) => {
      return p({ id: "subtext-" + (parseInt(i()) + 1), class: () => s.visible ? "subtext" : "subtext hidden" }, () => s.text)
    })
  )
}

const Mother = () => {
  return div(
    div({ class: "canvas-layer" }, canvas_renderer),
    div({ class: "text-layer" }, sub_text_dom),
    div(
      { class: "interaction-layer" },
      p({ class: "to-type" }, text_to_type.is),
      typed_dom,
      h("input", { class: "bar", type: "text", value: typed.is, oninput: (e) => typed.set(e.target.value) })
    ),
  );
};

render(Mother, $("#root"));
animate();


