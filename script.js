import { p, h, simple_dukan, render, $, div, each, sig, eff_on, eff, hogaya, mem, inn } from "./solid_monke/solid_monke.js";
import { check_last_word } from "./speech_engine.js";
import { map_value, find_sequence } from "./utils.js";
import { sequence_library, phrase_library } from "./sequence_library.js";

let lastTime, ctx, canvas;

const background = new Audio("./soundtrack.mp3")
background.volume = 0.5
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
    let is_clickable = model.onclick ? true : false
    return h("span", {
      id: "highlight",
      class: is_clickable ? "clickable" : "hoverable",
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

export let video_library = [
  {
    sign: "construction",
    src: "./video/p1.mp4",
    timer_normal: 3000,
    timer: 3000,
  },
]

function tick(delta) {
  play_video(ctx, this.video)
  this.timer -= delta
  if (this.timer <= 0) {
    this.video.pause()
    this.timer = this.timer_normal
    video_queue.shift()
  }
}

export function transition(video_item) {
  video_queue.push(video_item)
  document.querySelector(".interaction-layer").style.opacity = "0"
  inn(video_item.timer, () => {
    document.querySelector(".interaction-layer").style.opacity = "1"
  })
}

video_library.forEach(async (x) => {
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


