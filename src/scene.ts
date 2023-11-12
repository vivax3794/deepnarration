type Sentence = { type: "Adjective" | "Character" | "Location" | "Action" | "Object" | "Emotion" } | string;


const Adjective = ["Colorful", "Large", "Strange", "Burning", "Happy", "Sad",
  "Mysterious", "Ancient", "Sparkling", "Gloomy",
  "Whispering", "Frozen", "Enchanted", "Radiant", "Shadowy",
  "Invisible", "Electric", "Timeless", "Rustic", "Celestial"];

const Character = ["Dragon", "Wizard", "Dog", "Warrior", "Viking",
  "Streamer", "Programmer", "Rubber Duck", "Alien", "Ghost",
  "Sorcerer", "Knight", "Mermaid", "Cyborg", "Detective",
  "Princess", "Pirate", "Zombie", "Elf", "Giant"];

const Location = ["City", "Tavern", "Landscape", "River", "Outer Space",
  "Forest", "Desert", "Castle", "Underwater City",
  "Volcano", "Dungeon", "Palace", "Laboratory", "Haunted House",
  "Island", "Mountain Peak", "Abandoned Station", "Dream World",
  "Parallel Universe"];

const Action = ["Hugging", "Dancing with", "Punching", "Kissing",
  "Running from", "Building", "Exploring", "Observing",
  "Searching for", "Transforming into", "Battling", "Rescuing",
  "Discovering", "Escaping from", "Decoding", "Summoning",
  "Inventing", "Dreaming of"];

const Object = ["Sword", "Potion", "Book", "Gemstone", "Spaceship",
  "Treasure Chest", "Lantern", "Scroll", "Robot",
  "Amulet", "Time Machine", "Crystal Ball", "Flying Carpet",
  "Map", "Crown", "Wand", "Portal", "Excalibur", "Spacesuit"];

const Emotion = ["Joyful", "Furious", "Curious", "Terrified", "Excited",
  "Confused", "Amused", "Nostalgic",
  "Astonished", "Hopeful", "Anxious", "Overwhelmed",
  "Inspired", "Distracted", "Determined", "Relieved",
  "Skeptical", "Overjoyed"];

const Sentences: Sentence[][] = [
  [{ type: "Adjective" }, { type: "Character" }, "in", { type: "Adjective" }, { type: "Location" }],
  [{ type: "Character" }, { type: "Action" }, { type: "Character" }, "in", { type: "Location" }],
  [{ type: "Character" }, "looking at a", { type: "Adjective" }, "picture of", { type: "Location" }],
  [{ type: "Character" }, { type: "Action" }, { type: "Object" }],
  ["A", { type: "Adjective" }, { type: "Object" }, "that causes", { type: "Emotion" }],
  ["The", { type: "Adjective" }, { type: "Location" }, "where", { type: "Character" }, "found the", { type: "Object" }],
  [{ type: "Character" }, "feeling", { type: "Emotion" }, "while", { type: "Action" }, "in the", { type: "Location" }],
  [{ type: "Character" }, "and", { type: "Character" }, "facing a", { type: "Adjective" }, { type: "Object" }],
  ["In the", { type: "Adjective" }, { type: "Location" }, ", a", { type: "Object" }, "reveals a", { type: "Emotion" }, { type: "Object" }],
  ["A", { type: "Adjective" }, { type: "Character" }, "on a quest to", { type: "Action" }, "a", { type: "Adjective" }, { type: "Object" }]
];

function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export class Scene {
  text: string;
  id: number;

  constructor() {
    this.text = "";
    this.id = Math.floor(Math.random() * 100);
  }

  random() {
    let sentence = sample(Sentences);
    let text = "";

    for (let part of sentence) {
      if (typeof part === "string") {
        text += part;
      } else {
        text += sample({
          "Adjective": Adjective,
          "Character": Character,
          "Location": Location,
          "Action": Action,
          "Object": Object,
          "Emotion": Emotion,
        }[part.type]);
      }
      text += " ";
    }

    this.text = text;
  }
}
