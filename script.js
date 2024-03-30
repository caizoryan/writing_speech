import { h, render, $, div, h1, inn, sig, eff_on } from "./solid_monke/solid_monke.js";

// basic stuff right, lets think through this
// -> a variable that holds what needs to be typed
// -> another one that holds what is being typed
//
// -> each word that needs to be typed has a time and audio file attatched to it
// -> each time space bar is hit and it is the word that needs to be typed, the audio file is played

const audioContext = new AudioContext();

const get_file = async (path) => {
  const response = await fetch(path);

  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await new AudioContext().decodeAudioData(arrayBuffer);
  return audioBuffer;
}

const play_sample = (audioBuffer) => {
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();
}

const to_type = [
  {
    word: "Hello",
    audio: await get_file("./audio_files/1_hello.mp3"),
  },
  {
    word: "World",
    audio: await get_file("./audio_files/2_world.mp3"),
  },
  {
    word: "Do",
    audio: await get_file("./audio_files/3_do.mp3"),
  },

  {
    word: "you",
    audio: await get_file("./audio_files/4_you.mp3"),
  },

  {
    word: "think",
    audio: await get_file("./audio_files/5_think.mp3"),
  },

  {
    word: "this",
    audio: await get_file("./audio_files/6_this.mp3"),
  }
  ,
  {
    word: "will",
    audio: await get_file("./audio_files/7_will.mp3"),
  }
  ,
  {
    word: "work",
    audio: await get_file("./audio_files/8_work.mp3"),
  }
]
let typed = sig("")
let update = false

eff_on(typed.is, () => {
  update = true
})


function checkLastWord() {
  let len = typed.is().split(" ").length
  if (typed.is().split(" ")[len - 1].toLowerCase() === to_type[len - 1].word.toLowerCase()) {
    play_sample(to_type[len - 1].audio);
    console.log("playing", to_type[len - 1].word);
  }
  update = false
}

function animate(deltaTime) {
  if (update) checkLastWord();

  requestAnimationFrame(animate);
}

animate();

const Test = () => {
  return div(
    h1(to_type.map((x) => x.word).join(" ")),
    h("input", { type: "text", oninput: (e) => typed.set(e.target.value) })
  );
};

render(Test, $("#root"));
