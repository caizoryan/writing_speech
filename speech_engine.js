
import { map_value } from "./utils.js"
import { since_last_word, reset_last_word, typed, updated } from "./script.js"

const audioContext = new AudioContext();

const get_file = async (path) => {
  const response = await fetch(path);

  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await new AudioContext().decodeAudioData(arrayBuffer);
  return audioBuffer;
}

const play_sample = (audioBuffer) => {
  const source = audioContext.createBufferSource();
  source.playbackRate.value = calculate_playback();
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



function calculate_playback() {
  let playback_offset = map_value(since_last_word, 0, 2500, 0, .5)
  return 1.25 - playback_offset
}

function get_audio(word) {
  let found = to_type.find((x) => x.word.toLowerCase() === word);

  if (found) return found.audio
  else return undefined;
}

function check_last_word() {
  let len = typed.is().split(" ").length
  let last_word = typed.is().split(" ")[len - 1]
  let last_audio = get_audio(last_word.toLowerCase())

  if (last_audio) {
    play_sample(last_audio);
    reset_last_word()
  }
  updated()
}

export { get_audio, play_sample, to_type, calculate_playback, get_file, check_last_word }
