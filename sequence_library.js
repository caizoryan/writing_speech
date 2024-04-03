import { text_to_type, scene_reset, subtext, transition, video_library } from "./script.js"
export const sequence_library = [
  {
    sign: "works",
    sequence: ["will", "work"],
    onclick: () => {
      text_to_type.set("hello world!")
      scene_reset()
    },
    hover_in: () => { },
    hover_out: () => { }
  },
  {
    sign: "entry",
    sequence: ["construction", "that", "must", "take", "place"],
    onclick: () => {
      text_to_type.set(phrase_library.find((p) => p.sign === "construction").phrase)
      transition(video_library.find((v) => v.sign === "construction"))
      scene_reset()
    },
    hover_in: () => { },
    hover_out: () => { }
  },
  {
    sign: "speech",
    sequence: ["what", "of", "speech?"],
    onclick: () => {
      text_to_type.set(phrase_library.find((p) => p.sign === "speech").phrase)
      scene_reset()
    },
    hover_in: () => {
      subtext[0].text = "Speech software works only in the world of the machine, in the image that the human eye freezes."
      subtext[0].visible = true
    },
    hover_out: () => {
      subtext[0].visible = false
    }
  },
  {
    sign: "ephemeral",
    sequence: ["ephemeral", "with", "enduring"],
    onclick: () => {
    },
    hover_in: () => {
      subtext[0].text = `
        Software — as instructions and information (the difference between the two being
        erased by and in memory)— not only embodies the always already there, it also
        grounds it. It enables a logic of “ permanence ” that conflates memory with storage,
        the ephemeral with the enduring. Through a process of constant regeneration, of
        constant “ reading, ” it creates an enduring ephemeral that promises to last forever,
        even as it marches toward obsolescence/stasis. `
      subtext[1].text = `
        The paradox: what does not change
        does not endure, yet change —progress (endless upgrades)— ensures that what endures
        will fade. Another paradox: digital media’s memory operates by annihilating memory.
        If our machines’ memories are more permanent, if they enable a permanence that we seem to lack, it is because they are constantly refreshed— rewritten — so that their ephemerality endures, so that they may “ store ” the programs that seem to drive them. (check memory of the machine)
      `
      subtext[0].visible = true
      subtext[1].visible = true
    },
    hover_out: () => {
      subtext[0].visible = false
      subtext[1].visible = false
    }

  },
]

export const phrase_library = [
  {
    sign: "entry",
    phrase: ` This website
              is a collage, a bibliography, of the already existing. Nothing here is original except the construction that must take place for this work to be viewed.`,
  },
  {
    sign: "construction",
    phrase: ` Memory of the machine freezes the image in front of you, frozen for human eyes only. 
              Software enables a logic of “ permanence ” that conflates memory with storage,
              ephemeral with enduring but what of speech?`
  },
  {
    sign: "speech",
    phrase: `Speech software works onlv in the world of the machine, in the image that the human eye freezes.`
  },
]
