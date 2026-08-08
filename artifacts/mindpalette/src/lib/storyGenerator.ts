import { v4 as uuidv4 } from "uuid";
import { Story, StoryPage } from "./storyStore";
import { WORLDS } from "./worlds";

interface GenerateParams {
  focus: string;
  world: string;
  drawingDataUrl: string;
  prompt: string;
  // kept optional for API compatibility
  companionName?: string;
  companionType?: string;
  /** If provided, use this text instead of AI/arc generation */
  customStoryText?: string;
}

/* ── World flavor text ── */
const WORLD_FLAVORS: Record<string, string> = {
  forest: "the whispering forest, where ancient trees breathe softly and fireflies dance",
  meadow: "a sunny meadow full of wildflowers and warm golden breezes",
  beach: "a sandy cove where gentle waves keep a steady, soothing rhythm",
  "snowy-valley": "a snowy pine valley where everything is muffled and perfectly still",
  "desert-oasis": "a desert oasis, cool and quiet beside a glittering pond",
  "jungle-canopy": "a lush jungle canopy alive with colour and rustling leaves",
  "cherry-blossom": "a cherry blossom garden where soft pink petals drift like snow",
  "waterfall-grotto": "a hidden grotto behind a waterfall, full of rainbow mist and crystals",
  "cozy-room": "a cozy reading room with a crackling fireplace and shelves full of stories",
  library: "a magical library where books glow softly and a cat sleeps in the corner",
  treehouse: "a treehouse hideout high in the branches, private and peaceful",
  bakery: "a warm bakery morning full of the smell of fresh bread and soft music",
  "blanket-fort": "a blanket fort strung with fairy lights, shut off from the rest of the world",
  "cloud-bedroom": "a bedroom made of clouds floating gently above a sleepy city",
  underwater: "a glowing coral cove where fish drift past like living rainbows",
  "dinosaur-valley": "a dinosaur valley where gentle giants roam through ancient ferns",
  "crystal-cave": "a crystal cave where every wall shimmers in purple, pink and teal",
  "volcano-island": "a dramatic volcano island with warm black sand and bright tropical birds",
  "pirate-ship": "a friendly pirate ship sailing a calm, sparkling ocean",
  submarine: "a cosy deep-sea research pod with big glowing windows and friendly fish outside",
  castle: "a crystal castle with shimmering towers and a sense of magical calm",
  "fairy-garden": "a fairy garden full of giant glowing flowers and fluttering butterflies",
  "rainbow-clouds": "a rainbow cloud kingdom where you can walk on soft, bouncy clouds",
  "mushroom-village": "a glowing mushroom village lit with fireflies and tiny lanterns",
  "dragon-mountain": "a friendly dragon mountain with warm caves and wise, kind dragons",
  "mirror-lake": "a mirror lake so still it reflects the whole sky in perfect silence",
  space: "a starry nebula drifting softly among purple clouds and silver stars",
  "moon-base": "a cosy moon base dome with Earth glowing blue in the dark sky",
  "robot-workshop": "a robot workshop full of friendly machines and softly blinking lights",
  "telescope-tower": "a star observatory with a giant telescope and constellations on every wall",
  "planet-garden": "a space greenhouse where plants from different planets grow and glow",
};

/* ── Story arc library ── */
// Each entry is an array of arcs; each arc is exactly 5 page texts.
// {world} is replaced with the world flavor text.

const STORY_ARCS: Record<string, string[][]> = {
  "Big feelings": [
    [
      "One morning you woke up with a giggle stuck inside you, so you zoomed off to {world} to let it out.",
      "A friendly little creature popped up and said hello with a funny wiggle dance. You wiggled right back!",
      "Together you played hide-and-seek, but your new friend was terrible at hiding. You could see them giggling behind a tiny leaf.",
      "Then the giggle finally burst out of you, and it was so big it made everyone around you laugh too.",
      "You laughed until your tummy hurt, and your new friend said, 'Come back tomorrow and we will do it all again!'",
    ],
    [
      "Today your feelings were as bouncy as popcorn, so you took them on an adventure to {world}.",
      "You found a big bouncy spot and jumped as high as you could. Boing! Boing! Boing!",
      "A silly bird copied your jumps, flapping and flopping around until you both fell over laughing.",
      "You bounced so high you touched a fluffy cloud, and it tickled your nose. Achoo!",
      "When it was time to go, the bird gave you a tiny feather to remember the very best jumping day ever.",
    ],
  ],
  "Sensory overload": [
    [
      "Shhh! You found a super secret hideout in {world}, and no one else knew about it.",
      "Inside your hideout was the comfiest spot in the whole world, just the right size for you.",
      "A quiet little friend tiptoed in and offered you an imaginary cookie. You ate it in one pretend bite. Yum!",
      "You and your friend made up a secret handshake with three wiggles and one pat.",
      "It was the coziest, quietest, best afternoon, and it was all yours.",
    ],
    [
      "You discovered a magic whisper spot in {world}, where even the wind talked softly.",
      "A sleepy snail slid by very, very slowly and whispered, 'No rush, friend.'",
      "You watched the snail win the world's slowest race against a leaf. The leaf never even moved!",
      "You gave the snail a tiny leaf trophy, and it did the world's slowest happy dance.",
      "You smiled all the way home, keeping the whisper spot a special secret between you and the snail.",
    ],
  ],
  "School day": [
    [
      "After school, your backpack turned into a rocket and whooshed you straight to {world}!",
      "There was a school there too, but the only lessons were jumping in puddles and making funny faces.",
      "You got an A+ in silly faces. Your best one made a squirrel drop its acorn from laughing.",
      "At recess, everyone played your favorite game, and you got to make up the rules.",
      "The bell rang bubbles instead of ringing, and you floated home on the biggest bubble of all.",
    ],
    [
      "You found a wobbly door behind the swings, and it opened right into {world}. Sneaky!",
      "A cheerful crew of critters was having a picnic, and they saved the best seat just for you.",
      "You told them about your day, and they cheered at all the good parts. Hooray!",
      "Then everyone shared jellybean sandwiches, which are exactly as silly as they sound.",
      "You promised to come back tomorrow, and the critters promised to save you the last jellybean.",
    ],
  ],
  "Change/transitions": [
    [
      "Today something new was happening, so you packed your bravest socks and headed to {world}.",
      "A little explorer mouse with a tiny map said, 'New places are the best places! Follow me!'",
      "Around the first corner you found a waterfall of sparkles. Around the second, a field of giggling flowers!",
      "The mouse showed you that new things are just adventures you have not met yet.",
      "By the end of the day, the new place felt like your place, and your brave socks did a happy dance.",
    ],
    [
      "Everything felt topsy-turvy today, so you flipped upside down and landed in {world}.",
      "Upside down, the sky was the floor, and puddles hung above you like shiny windows.",
      "A cheerful frog taught you the upside-down hop, which is mostly just falling over with style.",
      "You hopped and flopped and laughed until the world turned right-side up again.",
      "And guess what? Right-side up felt brand new too, in the very best way.",
    ],
  ],
  "Friendship": [
    [
      "You blew a big dandelion puff, made a wish for a friend, and whoosh — you landed in {world}!",
      "A fuzzy little buddy bounced over and asked, 'Do you like snacks and adventures?' You said, 'BOTH!'",
      "So you had a snack adventure, hunting for the sweetest berry in the whole land.",
      "You found it together, split it in half, and it tasted twice as good that way.",
      "Best friends and berry halves — that is how the very best days are made.",
    ],
    [
      "You built a paper boat, and it sailed you all the way to {world} on a river of lemonade.",
      "Waiting on the shore was a friendly otter wearing a captain's hat two sizes too big.",
      "Captain Otter made you first mate, and your first job was splashing. You were amazing at it.",
      "Together you splashed, sailed, and sang a song about cheese for no reason at all.",
      "When you waved goodbye, Captain Otter saluted and said, 'Best first mate ever!'",
    ],
  ],
  "My strengths": [
    [
      "The friendly folk of {world} needed a hero today, and guess who showed up? YOU!",
      "A tiny dragon had lost its favorite shiny pebble, and no one else could find it.",
      "But you noticed things nobody else did — and there it was, twinkling under a mushroom!",
      "The tiny dragon did three backflips of joy and declared you the official Finder of Lost Things.",
      "Everyone cheered, and you got a crown made of flowers that smelled like cookies.",
    ],
    [
      "You woke up feeling extra super today, so you took your super self to {world}.",
      "The creatures there were having a talent show, and they saved you a spot on stage.",
      "You did your special thing — the thing only YOU can do — and the crowd went wild!",
      "A star fell from the sky just to see it, and asked for your autograph.",
      "You signed it with a squiggle, took a bow, and everyone shouted, 'Encore! Encore!'",
    ],
  ],
  "Custom": [
    [
      "One perfectly ordinary day turned extraordinary the moment you skipped into {world}.",
      "Something rustled, something sparkled, and something definitely giggled behind you.",
      "You spun around and found a brand-new friend playing peek-a-boo with you!",
      "You played every game you could think of, and then invented three brand-new ones.",
      "It was the kind of day you would tell stories about forever — and now you have!",
    ],
    [
      "You found a mysterious ticket under your pillow. It said: ADMIT ONE to {world}!",
      "The moment you held it up, whoosh — you were there, and a marching band of bugs was playing your song.",
      "You joined the parade, banging a drum made of a shiny acorn.",
      "The parade ended at a party, and the party ended in cake. The very best kind of ending!",
      "You saved a crumb for your pocket, so a little bit of the adventure could come home with you.",
    ],
  ],
};

/* ── Title generator ── */
const TITLE_TEMPLATES = [
  "The Light in {world}",
  "A Day in {world}",
  "Finding Calm in {world}",
  "The Quiet of {world}",
  "My {world} Story",
  "When I Went to {world}",
  "The Heart of {world}",
  "Safe in {world}",
];

function pickTitle(worldId: string): string {
  const world = WORLDS.find((w) => w.id === worldId);
  const worldName = world?.name ?? worldId;
  const template = TITLE_TEMPLATES[Math.floor(Math.random() * TITLE_TEMPLATES.length)];
  return template.replace("{world}", worldName);
}

/* ── Text fill helper ── */
function fillText(template: string, worldId: string, userPrompt: string): string {
  const flavor = WORLD_FLAVORS[worldId] ?? worldId;
  let result = template.replace(/{world}/g, flavor);
  if (userPrompt && result.includes("{prompt}")) {
    result = result.replace(/{prompt}/g, userPrompt);
  }
  return result;
}

/* ── Image generation/editing via API server ── */
async function generatePageImage(
  prompt: string,
  drawingDataUrl?: string,
): Promise<string | undefined> {
  try {
    const base = import.meta.env.BASE_URL ?? "/";
    const url = `${base}api/generate-image`.replace(/\/\//g, "/");
    const body: Record<string, string> = { prompt };
    if (drawingDataUrl) body.drawingDataUrl = drawingDataUrl;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return undefined;
    const data = (await res.json()) as { b64_json?: string };
    if (!data.b64_json) return undefined;
    return `data:image/png;base64,${data.b64_json}`;
  } catch {
    return undefined;
  }
}

/* ── AI page text via API server ── */
async function generatePageTexts(params: GenerateParams): Promise<string[]> {
  try {
    const base = import.meta.env.BASE_URL ?? "/";
    const url = `${base}api/generate-story-text`.replace(/\/\//g, "/");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { pages?: string[] };
    const pages = Array.isArray(data.pages) ? data.pages : [];
    // Strip any "Page N:" / "Page N." / "Page N " prefixes the model might have added
    const cleaned = pages.map(p => p.replace(/^page\s*\d+\s*[:.]\s*/i, "").trim());
    return cleaned.length >= 5 ? cleaned : [];
  } catch {
    return [];
  }
}

/* ── Per-page scene variation to keep illustrations distinct ──
   Each page places the child's character in a DIFFERENT concrete setting/activity. */
const PAGE_SCENE_HINTS = [
  "the character arriving in the world — wide establishing shot, walking in or peeking out, soft morning light",
  "the character in a cozy resting spot — lying on a soft bed, hammock, or leaf pile, warm midday light, medium shot",
  "the character inside a secret hideout — a hidden nook, blanket fort, cave, or hollow tree, cozy lantern glow, intimate close-up",
  "the character mid-adventure — jumping, climbing, splashing, or discovering something exciting, dynamic angle, golden light",
  "the character celebrating with new friends — a picnic, party, or waving goodbye, wide panoramic sunset glow",
];

/* ── Build per-page illustration prompt from the actual page text ── */
function buildPageImagePrompt(
  pageText: string,
  worldId: string,
  hasDrawing: boolean,
  pageIndex: number,
): string {
  const world = WORLD_FLAVORS[worldId] ?? worldId;
  const style = "soft watercolor children's book illustration, pastel palette, gentle and warm, no text, no words";
  const sceneHint = PAGE_SCENE_HINTS[pageIndex] ?? PAGE_SCENE_HINTS[0];

  if (hasDrawing) {
    // Edit-mode: extract ONLY the character from the child's drawing and
    // place it into a brand-new environment built for this specific page.
    return (
      `Look at this child's drawing and identify its main character or creature. ` +
      `IGNORE and DISCARD the drawing's original background entirely. ` +
      `Paint a completely new scene as a ${style}: ${sceneHint}. ` +
      `The overall world is ${world}. ` +
      `This is page ${pageIndex + 1} of 5, showing the story moment: "${pageText.slice(0, 110)}". ` +
      `Redraw the child's character in the illustration style, keeping its recognizable shape, ` +
      `colors, and personality, but give it a new pose and activity that fits this scene. ` +
      `The environment, props, camera angle, and lighting must be different from every other page.`
    );
  }

  // Generate-mode: create from scratch with scene-specific composition
  return (
    `${style}. Setting: ${world}. ` +
    `Story moment: "${pageText.slice(0, 110)}". ` +
    `Composition: ${sceneHint}.`
  );
}

/* ── Cover illustration prompt ── */
function buildCoverImagePrompt(worldId: string, title: string, hasDrawing: boolean): string {
  const world = WORLD_FLAVORS[worldId] ?? worldId;
  const style = "soft watercolor children's book cover illustration, pastel palette, magical and inviting, no text";

  if (hasDrawing) {
    return (
      `Transform this child's drawing into a ${style}. ` +
      `The setting is ${world}. ` +
      `Make it feel like the cover of a beautiful storybook called "${title}". ` +
      `Keep the child's characters and shapes as the central subject.`
    );
  }
  return `${style}. The setting is ${world}. Book title: "${title}". Wide establishing scene, warm glow.`;
}

/* ── Split a freeform story into exactly 5 page texts ── */
function splitCustomStory(text: string): string[] {
  // Try paragraph split first (blank-line separated)
  const paras = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  if (paras.length >= 5) return paras.slice(0, 5);

  if (paras.length >= 2) {
    // Fewer than 5 paragraphs — pad by repeating the last one
    const result = [...paras];
    while (result.length < 5) result.push(result[result.length - 1]);
    return result.slice(0, 5);
  }

  // Single block — split by sentences and group into 5 chunks
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  const chunkSize = Math.ceil(sentences.length / 5);
  const pages: string[] = [];
  for (let i = 0; i < 5; i++) {
    const chunk = sentences.slice(i * chunkSize, (i + 1) * chunkSize).join(" ").trim();
    pages.push(chunk || sentences[sentences.length - 1] || text);
  }
  return pages;
}

/* ── Main export ── */
export async function generateStory(params: GenerateParams): Promise<Story> {
  const { focus, world, drawingDataUrl, prompt } = params;
  const companionName = params.companionName ?? "";
  const companionType = params.companionType ?? "";
  const hasDrawing = !!drawingDataUrl;

  // ── Step 1: Generate story text (and pick title) ──
  // We await text first so we can use the actual page sentences as image prompts.

  let pageTexts: string[];

  if (params.customStoryText?.trim()) {
    // User supplied their own story — split it into pages
    pageTexts = splitCustomStory(params.customStoryText.trim());
  } else {
    const aiPages = await generatePageTexts(params);

    if (aiPages.length >= 5) {
      pageTexts = aiPages.slice(0, 5);
    } else {
      const arcs = STORY_ARCS[focus] ?? STORY_ARCS["Custom"];
      const arc = arcs[Math.floor(Math.random() * arcs.length)];
      pageTexts = arc.map((text, i) => {
        let filled = fillText(text, world, prompt);
        if (i === 3 && prompt.trim()) {
          filled += ` You told a story: "${prompt.trim()}."`;
        }
        return filled;
      });
    }
  }

  const title = pickTitle(world);

  // ── Step 2: Generate cover + 5 page illustrations in parallel ──
  // Cover uses a wide establishing shot; each page uses its own sentence as the prompt.
  const [coverImageUrl, ...pageImages] = await Promise.all([
    generatePageImage(buildCoverImagePrompt(world, title, hasDrawing), drawingDataUrl || undefined),
    ...pageTexts.map((text, i) =>
      generatePageImage(buildPageImagePrompt(text, world, hasDrawing, i), drawingDataUrl || undefined)
    ),
  ]);

  const LAYOUTS: StoryPage["layout"][] = ["scene", "inset", "full", "inset", "scene"];

  const pages: StoryPage[] = pageTexts.map((text, i) => ({
    text,
    layout: LAYOUTS[i] ?? "scene",
    aiImageUrl: pageImages[i] ?? undefined,
  }));

  return {
    id: uuidv4(),
    title,
    createdAt: Date.now(),
    focus,
    world,
    companionName,
    companionType,
    drawingDataUrl,
    prompt,
    coverImageUrl: coverImageUrl ?? undefined,
    pages,
  };
}
