/* Drawing guidance: world + feeling-specific suggestions, and AI image prompt builder */

const WORLD_NAMES: Record<string, string> = {
  forest: "Whispering Forest", meadow: "Sunny Meadow", beach: "Sandy Beach Cove",
  "snowy-valley": "Snowy Pine Valley", "desert-oasis": "Desert Oasis",
  "jungle-canopy": "Jungle Canopy", "cherry-blossom": "Cherry Blossom Garden",
  "waterfall-grotto": "Waterfall Grotto", "cozy-room": "Cozy Reading Room",
  library: "Magical Library", treehouse: "Treehouse Hideout",
  bakery: "Warm Bakery", "blanket-fort": "Blanket Fort",
  "cloud-bedroom": "Cloud Bedroom", underwater: "Coral Cove",
  "dinosaur-valley": "Dinosaur Valley", "crystal-cave": "Crystal Cave",
  "volcano-island": "Volcano Island", "pirate-ship": "Friendly Pirate Ship",
  submarine: "Deep Sea Research Pod", castle: "Crystal Castle",
  "fairy-garden": "Fairy Garden", "rainbow-clouds": "Rainbow Cloud Kingdom",
  "mushroom-village": "Glowing Mushroom Village", "dragon-mountain": "Friendly Dragon Mountain",
  "mirror-lake": "Mirror Lake", space: "Starry Nebula",
  "moon-base": "Moon Base", "robot-workshop": "Robot Workshop",
  "telescope-tower": "Star Observatory", "planet-garden": "Planet Garden",
};

/* Feeling-based drawing suggestions (world name injected at runtime) */
const FOCUS_DRAWING_IDEAS: Record<string, ((worldName: string) => string)[]> = {
  "Big feelings": [
    w => `Draw what your big feeling looks like as a colour or shape in the ${w}`,
    _ => "Draw a creature that holds your heavy feelings so you don't have to",
    w => `Draw the quietest, softest spot in the ${w}`,
    _ => "Draw your feeling as weather — is it a storm, or a gentle rain?",
  ],
  "Sensory overload": [
    w => `Draw the calmest, most muffled part of the ${w}`,
    _ => "Draw a pair of magic headphones that block out everything loud",
    w => `Draw one beautiful thing you can see from inside the ${w}`,
    _ => "Draw what silence looks like as a colour or a shape",
  ],
  "School day": [
    _ => "Draw your favourite quiet spot — real or imaginary",
    w => `Draw yourself arriving at the ${w} after a long day`,
    _ => "Draw something you are secretly really good at",
    _ => "Draw what a perfect school break time would look like",
  ],
  "Friendship": [
    w => `Draw a kind friend you could meet in the ${w}`,
    _ => "Draw what being a good friend looks like as a picture",
    _ => "Draw two different creatures who become friends anyway",
    w => `Draw a game you and a friend could play in the ${w}`,
  ],
  "Change/transitions": [
    w => `Draw yourself stepping into the ${w} for the very first time`,
    _ => "Draw something new that turned out to be okay",
    _ => "Draw what change looks like — a door, a path, a new season?",
    w => `Draw the old and the new side-by-side in the ${w}`,
  ],
  "My strengths": [
    _ => "Draw your superpower — what does it look like?",
    w => `Draw yourself feeling proud in the ${w}`,
    _ => "Draw something you made, fixed, or figured out",
    _ => "Draw your brain as a machine — what does it do brilliantly?",
  ],
  "Custom": [
    w => `Draw your favourite thing about the ${w}`,
    _ => "Draw a character who goes on a big adventure",
    _ => "Draw the most interesting thing you can imagine",
    w => `Draw what happens when you first arrive at the ${w}`,
  ],
};

/* Visual style matching each world for DALL-E */
const WORLD_VISUAL_MOOD: Record<string, string> = {
  forest: "ancient glowing forest with fireflies, dappled light through towering trees",
  meadow: "sunny rolling meadow with wildflowers and warm golden light",
  beach: "calm sandy cove with gentle waves and a soft sunset sky",
  "snowy-valley": "quiet snowy valley with soft pine silhouettes and falling snowflakes",
  "desert-oasis": "golden sand dunes with a shimmering blue oasis and palm trees",
  "jungle-canopy": "lush tropical jungle canopy with bright parrots and filtered light",
  "cherry-blossom": "cherry blossom garden with pink petals floating on the breeze",
  "waterfall-grotto": "secret cave behind a waterfall with rainbow mist and crystals",
  "cozy-room": "warm cozy reading room with fireplace glow, soft blankets, and bookshelves",
  library: "magical library with glowing bookshelves reaching the ceiling and a sleeping cat",
  treehouse: "treehouse high in the branches with rope ladders and a cozy window",
  bakery: "warm bakery at dawn with fresh bread in the window and steam rising",
  "blanket-fort": "fairy-light blanket fort with pillows and a tiny glowing lantern inside",
  "cloud-bedroom": "bedroom made of soft clouds floating above a sleepy city at night",
  underwater: "glowing coral reef with colourful fish, sea anemones and gentle currents",
  "dinosaur-valley": "misty prehistoric valley with giant friendly dinosaurs and ferns",
  "crystal-cave": "underground cave of glowing purple and teal crystals in the dark",
  "volcano-island": "dramatic tropical island with a distant glowing volcano and warm black sand",
  "pirate-ship": "friendly wooden pirate ship with full white sails on a calm sparkling ocean",
  submarine: "cosy deep-sea research submarine with glowing portholes and bioluminescent fish outside",
  castle: "shimmering crystal castle with pink towers and sparkles in the sky",
  "fairy-garden": "tiny fairy garden with giant glowing flowers and butterflies",
  "rainbow-clouds": "rainbow cloud kingdom where you can walk on soft bouncy clouds",
  "mushroom-village": "glowing mushroom village at night with fireflies and tiny lantern-lit windows",
  "dragon-mountain": "warm dragon mountain cave with friendly sleeping dragons and golden glow",
  "mirror-lake": "perfectly still silver mirror lake reflecting willow trees and the sky",
  space: "soft purple nebula drifting among silver stars and glowing cosmic clouds",
  "moon-base": "cosy dome on the moon with Earth glowing blue through the window",
  "robot-workshop": "friendly robot workshop with glowing gears, blinking lights and helpful machines",
  "telescope-tower": "tall observatory tower at night with a giant telescope and constellations above",
  "planet-garden": "space greenhouse with plants from different planets glowing and gently rustling",
};

const FOCUS_VISUAL_ELEMENT: Record<string, string> = {
  "Big feelings": "a small child sitting peacefully with a warm glowing light around them, calm expression",
  "Sensory overload": "a child sitting in a quiet corner, eyes closed, looking peaceful and safe",
  "School day": "a child exploring with curiosity and wonder, looking happy and brave",
  "Friendship": "two small creatures or children sitting together, sharing a friendly moment",
  "Change/transitions": "a child stepping forward on a new path, looking hopeful",
  "My strengths": "a child standing confidently, surrounded by a soft magical glow",
  "Custom": "a small curious child discovering something beautiful",
};

/* ── Public API ── */

export function getDrawingSuggestions(focus: string, worldId: string): string[] {
  const worldName = WORLD_NAMES[worldId] ?? worldId;
  const ideas = FOCUS_DRAWING_IDEAS[focus] ?? FOCUS_DRAWING_IDEAS["Custom"];
  return ideas.map(fn => fn(worldName));
}

export function buildAiDrawingPrompt(focus: string, worldId: string): string {
  const worldMood = WORLD_VISUAL_MOOD[worldId] ?? `a beautiful ${worldId}`;
  const focusElement = FOCUS_VISUAL_ELEMENT[focus] ?? FOCUS_VISUAL_ELEMENT["Custom"];
  return [
    "Soft watercolor children's book illustration, pastel colours, gentle and dreamy.",
    `Scene: ${worldMood}.`,
    `Include: ${focusElement}.`,
    "Style: warm, calming, safe, whimsical. No text. No harsh lines. Painterly texture.",
  ].join(" ");
}
