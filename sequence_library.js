import { text_to_type, scene_reset, subtext, transition, video_library } from "./script.js"
export const sequence_library = [
  {
    sign: "entry",
    sequence: ["walk", "that", "must", "be", "taken"],
    destination: "walk",
    subtext: [
      `I talk of multiple walks here, one of speech, of words, of elements that produce the semantic meaning, but also another. The walk, that is taken by the electricity around the circuit, in cycles for this page to be rendered, held together, as a place for our memory to harbor as we subordinate our cognition to it.`
    ],
  },
  {
    sign: "speech",
    sequence: ["what", "of", "speech?"],
    subtext: []
  },
  {
    sign: "memory",
    sequence: ["memory", "of", "the", "machine"],
    destination: "memory",
    subtext: [
      `Today ’s RAM (Random Access Memory) is mostly volatile and based on flip-flop circuits
      and transistors and capacitors, which require a steady electrical current. Although we do
      have forms of nonvolatile memory, such as flash memory, made possible by better-insulated capacitors,
      they have a limited read-write cycle. Memory traces, to repeat Derrida’s formulation, “produce the space 
      of their inscription only by acceding to the period of their erasure.”`
    ]
  },
  {
    sign: "ephemeral",
    sequence: ["ephemeral", "with", "enduring"],
    // destination: "ephemeral",
    subtext: [
      ` Software — as instructions and information (the difference between the two being
        erased by and in memory)— not only embodies the always already there, it also
        grounds it. It enables a logic of “ permanence ” that conflates memory with storage,
        the ephemeral with the enduring. Through a process of constant regeneration, of
        constant “ reading, ” it creates an enduring ephemeral that promises to last forever,
        even as it marches toward obsolescence/stasis. `,
      ` The paradox: what does not change
        does not endure, yet change —progress (endless upgrades)— ensures that what endures
        will fade. Another paradox: digital media’s memory operates by annihilating memory.
        If our machines’ memories are more permanent, if they enable a permanence that we seem to lack, it is because they are constantly refreshed— rewritten — so that their ephemerality endures, so that they may “ store ” the programs that seem to drive them. (check memory of the machine) `
    ],

  },
]

export const phrase_library = [
  {
    sign: "entry",
    phrase: ` This website is a collage, a bibliography, of the already existing.
    Nothing here is original except the walk that must be taken for this work to be viewed.`,
  },
  {
    sign: "walk",
    phrase: `Memory of the machine freezes the image in front of you, frozen for human eyes only.`

  },
  {
    sign: "speech",
    phrase: `Speech software works onlv in the world of the machine, in the image that the human eye freezes.`
  },
  {
    sign: "memory",
    phrase: "Software enables a logic of “permanence” that conflates memory with storage, ephemeral with enduring."
  }
]
