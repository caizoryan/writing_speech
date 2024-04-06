
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

  const gainNode = audioContext.createGain();
  gainNode.gain.value = .7;

  source.playbackRate.value = calculate_playback();
  source.buffer = audioBuffer;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
  source.start();
}

const to_type = [
  { word: "a" },
  { word: "already" },
  { word: "be" },
  { word: "bibliography" },
  { word: "collage" },
  { word: "construction" },
  { word: "do" },
  { word: "except" },
  { word: "existing" },
  { word: "hello" },
  { word: "here" },
  { word: "is" },
  { word: "must" },
  { word: "memory" },
  { word: "nothing" },
  { word: "original" },
  { word: "place" },
  { word: "take" },
  { word: "think" },
  { word: "this" },
  { word: "to" },
  { word: "viewed" },
  { word: "website" },
  { word: "will" },
  { word: "work" },
  { word: "world" },
  { word: "you" },
  { word: "with" },
  { word: "what" },
  { word: "storage" },
  { word: "speech" },
  { word: "software" },
  { word: "permanence" },
  { word: "logic" },
  { word: "ephemeral" },
  { word: "enduring" },
  { word: "enables" },
  { word: "conflates" },
  { word: "but" },
  { word: "onlv" },
  { word: "machine" },
  { word: "in" },
  { word: "image" },
  { word: "human" },
  { word: "frozen" },
  { word: "front" },
  { word: "freezes" },
  { word: "eyes" },
  { word: "words" },
  { word: "wisdom" },
  { word: "which" },
  { word: "vibrate" },
  { word: "unities" },
  { word: "timeless" },
  { word: "they" },
  { word: "their" },
  { word: "the" },
  { word: "that" },
  { word: "rythms" },
  { word: "roots" },
  { word: "own" },
  { word: "of" },
  { word: "melodies" },
  { word: "history" },
  { word: "heir" },
  { word: "have" },
  { word: "harmonies" },
  { word: "conceal" },
  { word: "and" },
  { word: "also" },
  { word: "walk" },
  { word: "taken" },
  { word: "life" },
  { word: "trace" },
  { word: "slowly" },
  { word: "dissipates" },
  { word: "endure" },
  { word: "it" },
  { word: "held" },
  { word: "together" },
  { word: "action" },
  { word: "has" },
  { word: "been" },
  { word: "conflated" },
  { word: "conceals" },
  { word: "its" },
  { word: "source" },
  { word: "through" },
  { word: "execution" },
  { word: "doing" },
  { word: "labour" },
  { word: "organises" },
  { word: "structures" },
  { word: "more" },
  { word: "importantly" },
  { word: "macro" },
  { word: "sense" },
  { word: "power" },
  { word: "society" },
]


to_type.forEach(async (x) => {
  x.audio = await get_file(`./audio_files/${x.word}.mp3`)
})



function calculate_playback() {
  let playback_offset = map_value(since_last_word, 0, 3500, 0, .7)
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
