import React, { useEffect, useState } from "react";

// ====== CONFIG DATA ======

const RACES = [
  "Human",
  "Elf",
  "Half-Elf",
  "Dwarf",
  "Halfling",
  "Tiefling",
  "Dragonborn",
  "Half-Orc",
  "Gnome"
];

const CLASSES = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
  "Artificer"
];

const ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil"
];

const PERSONALITY_TRAITS = [
  "Always quick with a joke, even in dire situations.",
  "Keeps a meticulous journal of every encounter.",
  "Trusts animals more than people.",
  "Sees omens and signs in everyday events.",
  "Collects small trinkets from every place they visit.",
  "Never backs down from a challenge.",
  "Has an infectious, booming laugh.",
  "Speaks in a soft whisper, even when angry.",
  "Always offers help to strangers.",
  "Is obsessed with discovering forgotten lore."
];

const IDEALS = [
  "Freedom. Chains are meant to be broken.",
  "Knowledge. The path to power lies in understanding.",
  "Justice. The guilty must face consequences.",
  "Glory. I will carve my name into history.",
  "Compassion. No one deserves to suffer alone.",
  "Balance. Nature and civilization must coexist.",
  "Redemption. Anyone can be forgiven… maybe even me.",
  "Power. Only the strong decide what is right."
];

const BONDS = [
  "Sworn to protect a particular village or town.",
  "Owes a life debt to a mysterious stranger.",
  "Seeks the truth about a lost relative.",
  "Is bound to an ancient artifact they barely understand.",
  "Defends a nearly forgotten temple.",
  "Promised to return a keepsake to its rightful heir.",
  "Haunted by a ghost that only they can see.",
  "Member of a secretive order with hidden goals."
];

const FLAWS = [
  "Gambles recklessly and hides the habit.",
  "Holds grudges far longer than they should.",
  "Can’t resist showing off, even when subtlety is needed.",
  "Terrified of deep water.",
  "Quick to anger when questioned or doubted.",
  "Trusts the wrong people far too easily.",
  "Is secretly convinced they are doomed to fail.",
  "Has a hard time refusing a plea for help, even when it’s a trap."
];

// Rough, flavorful gear pools by class archetype
const GEAR_POOLS = {
  martial: [
    "longsword",
    "greatsword",
    "battleaxe",
    "warhammer",
    "shield",
    "chain mail",
    "javelins",
    "crossbow with bolts",
    "traveler's clothes",
    "backpack with rations",
    "whetstone",
    "inscribed family crest",
    "trophy taken from a fallen foe"
  ],
  stealthy: [
    "shortsword",
    "daggers",
    "shortbow with arrows",
    "leather armor",
    "thieves’ tools",
    "dark hooded cloak",
    "set of weighted dice",
    "lockpicks wrapped in cloth",
    "soft-soled boots",
    "small vial of poison",
    "ring of unknown origin"
  ],
  caster: [
    "spellbook",
    "arcane focus",
    "component pouch",
    "simple dagger",
    "scholar's robes",
    "ink and quill",
    "bundle of candles",
    "mysterious scroll",
    "tiny crystal vial of starlight",
    "charred fragment of an old grimoire"
  ],
  divine: [
    "holy symbol",
    "mace",
    "shield embossed with a symbol of faith",
    "chain shirt",
    "prayer book",
    "incense and censer",
    "vestments",
    "bottle of blessed water",
    "wooden charm from a grateful villager"
  ],
  nature: [
    "quarterstaff",
    "scimitar",
    "leather armor",
    "herbalism kit",
    "druidic totem",
    "bundle of dried herbs",
    "cloak smelling faintly of pine",
    "animal-bone necklace",
    "small carved wooden animal"
  ]
};

// Hit dice by class
const HIT_DICE = {
  Barbarian: 12,
  Fighter: 10,
  Paladin: 10,
  Ranger: 10,
  Bard: 8,
  Cleric: 8,
  Druid: 8,
  Monk: 8,
  Rogue: 8,
  Warlock: 8,
  Artificer: 8,
  Sorcerer: 6,
  Wizard: 6
};

// Primary stat by class
const PRIMARY_STAT = {
  Barbarian: "STR",
  Bard: "CHA",
  Cleric: "WIS",
  Druid: "WIS",
  Fighter: "STR",
  Monk: "DEX",
  Paladin: "STR",
  Ranger: "DEX",
  Rogue: "DEX",
  Sorcerer: "CHA",
  Warlock: "CHA",
  Wizard: "INT",
  Artificer: "INT"
};

// ====== UTILS ======

const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const abilityMod = (score) => Math.floor((score - 10) / 2);

const formatMod = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

const getProficiencyBonus = (level) => {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
};

const rollD = (sides) => Math.floor(Math.random() * sides) + 1;

const roll4d6DropLowest = () => {
  const rolls = [rollD(6), rollD(6), rollD(6), rollD(6)].sort((a, b) => a - b);
  return rolls.slice(1).reduce((a, b) => a + b, 0); // drop lowest
};

const generateBaseAbilities = () => {
  return {
    STR: roll4d6DropLowest(),
    DEX: roll4d6DropLowest(),
    CON: roll4d6DropLowest(),
    INT: roll4d6DropLowest(),
    WIS: roll4d6DropLowest(),
    CHA: roll4d6DropLowest()
  };
};

const applyRacialBonuses = (abilities, race) => {
  const a = { ...abilities };
  switch (race) {
    case "Human":
      Object.keys(a).forEach((k) => (a[k] += 1));
      break;
    case "Elf":
      a.DEX += 2;
      break;
    case "Half-Elf":
      a.CHA += 2;
      a.DEX += 1;
      a.WIS += 1;
      break;
    case "Dwarf":
      a.CON += 2;
      break;
    case "Halfling":
      a.DEX += 2;
      break;
    case "Tiefling":
      a.CHA += 2;
      a.INT += 1;
      break;
    case "Dragonborn":
      a.STR += 2;
      a.CHA += 1;
      break;
    case "Half-Orc":
      a.STR += 2;
      a.CON += 1;
      break;
    case "Gnome":
      a.INT += 2;
      break;
    default:
      break;
  }
  return a;
};

const applyASI = (abilities, clazz, level) => {
  const asiLevels = [4, 8, 12, 16, 19];
  const numAsi = asiLevels.filter((l) => level >= l).length;
  if (numAsi === 0) return abilities;

  const result = { ...abilities };
  const primary = PRIMARY_STAT[clazz] || "STR";

  for (let i = 0; i < numAsi; i++) {
    if (result[primary] < 20) {
      result[primary] += 2;
    } else {
      // If primary capped, boost highest other stat
      const otherKeys = Object.keys(result).filter((k) => k !== primary);
      const highestOther = otherKeys.reduce((best, cur) =>
        result[cur] > result[best] ? cur : best
      , otherKeys[0]);
      if (result[highestOther] < 20) {
        result[highestOther] += 2;
      }
    }
  }

  return result;
};

const calculateHP = (clazz, level, conMod) => {
  const hitDie = HIT_DICE[clazz] || 8;
  if (level <= 0) return hitDie + conMod;

  const firstLevel = hitDie + conMod;
  if (level === 1) return Math.max(1, firstLevel);

  const avgPerLevel = Math.floor(hitDie / 2) + 1 + conMod;
  const total = firstLevel + (level - 1) * avgPerLevel;
  return Math.max(1, total);
};

const generateGear = (clazz) => {
  let pool;
  switch (clazz) {
    case "Barbarian":
    case "Fighter":
    case "Paladin":
    case "Ranger":
      pool = GEAR_POOLS.martial;
      break;
    case "Rogue":
    case "Monk":
      pool = GEAR_POOLS.stealthy;
      break;
    case "Wizard":
    case "Sorcerer":
    case "Warlock":
    case "Artificer":
      pool = GEAR_POOLS.caster;
      break;
    case "Cleric":
      pool = GEAR_POOLS.divine;
      break;
    case "Druid":
      pool = GEAR_POOLS.nature;
      break;
    case "Bard":
      // Bard is a hybrid: caster + stealthy
      pool = [...GEAR_POOLS.caster, ...GEAR_POOLS.stealthy];
      break;
    default:
      pool = [...GEAR_POOLS.martial];
  }

  const gearCount = 5 + Math.floor(Math.random() * 4); // 5–8 items
  const chosen = new Set();
  while (chosen.size < gearCount) {
    chosen.add(randItem(pool));
  }
  return Array.from(chosen);
};

const generateBackstory = ({ name, race, clazz, level, alignment, hometown }) => {
  const hooks = [
    `${name} grew up in ${hometown}, a place now spoken of only in hushed tones.`,
    `Once a simple child of ${hometown}, ${name} has walked a path few dare to tread.`,
    `${name}'s early years in ${hometown} were marked by strange omens and whispered prophecies.`
  ];

  const incitingEvents = [
    "A tragic betrayal shattered the life they once knew.",
    "A chance encounter with a dying mentor changed their destiny forever.",
    "An ancient relic called to them in restless dreams.",
    "A monster attack left scars that never truly healed."
  ];

  const motivations = [
    "Now, they seek answers in forgotten ruins and dangerous wilds.",
    "They wander from town to town, trading skill for rumors of a looming darkness.",
    "Their journey is driven by a quiet hope that redemption still lies ahead.",
    "They hunger for glory, but fear becoming the very monster they fight."
  ];

  const roleFlavor = `${name} is a level ${level} ${alignment} ${race} ${clazz}, whose skills have been tempered by hardship and hard-won victories.`;

  const hook = randItem(hooks);
  const event = randItem(incitingEvents);
  const motive = randItem(motivations);

  return `${hook} ${event} ${motive} ${roleFlavor}`;
};

// Generate a flavor hometown
const randomHometown = () =>
  randItem([
    "the misty port of Grayharbor",
    "the mountain hold of Stonegate",
    "the forest village of Everleaf",
    "the desert city of Sunspire",
    "the frozen outpost of Frostwatch",
    "the cramped streets of Ashmarket",
    "the riverside town of Whiteford"
  ]);

// ====== MAIN APP ======

export default function App() {
  const [namesPool, setNamesPool] = useState([]);
  const [loadingNames, setLoadingNames] = useState(true);
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Load names on mount (and subtract used names from localStorage)
  useEffect(() => {
    const loadNames = async () => {
      try {
        const res = await fetch("/names-extra.txt");
        if (!res.ok) throw new Error("Could not load names-extra.txt");
        const text = await res.text();
        const allNames = text
          .split("\n")
          .map((n) => n.trim())
          .filter(Boolean);

        const used = JSON.parse(
          localStorage.getItem("usedNames") || "[]"
        );
        const remaining = allNames.filter((n) => !used.includes(n));

        setNamesPool(remaining);
        setLoadingNames(false);
      } catch (e) {
        console.error(e);
        setError(
          "Error loading names-extra.txt. Make sure it exists in the public folder."
        );
        setLoadingNames(false);
      }
    };

    loadNames();
  }, []);

  const getUniqueFirstName = () => {
    if (namesPool.length === 0) {
      setError(
        "You are out of unused names! Clear used names in localStorage or add more to names-extra.txt."
      );
      return null;
    }
    const index = Math.floor(Math.random() * namesPool.length);
    const name = namesPool[index];

    const newPool = [...namesPool];
    newPool.splice(index, 1);
    setNamesPool(newPool);

    const used = JSON.parse(localStorage.getItem("usedNames") || "[]");
    used.push(name);
    localStorage.setItem("usedNames", JSON.stringify(used));

    return name;
  };

  const generateSurname = () => {
    const prefixes = [
      "Storm",
      "Shadow",
      "Iron",
      "Dawn",
      "Night",
      "Bright",
      "Raven",
      "Silver",
      "Blood",
      "Star",
      "Wind",
      "Stone",
      "Oak",
      "Ash"
    ];
    const suffixes = [
      "born",
      "song",
      "blade",
      "walker",
      "ward",
      "bane",
      "weaver",
      "crest",
      "run",
      "fall",
      "brook",
      "stride"
    ];
    return randItem(prefixes) + randItem(suffixes);
  };

  const handleGenerate = () => {
    setError("");
    setBusy(true);

    // Simulate “unique enough” randomness; all logic is local
    setTimeout(() => {
      const firstName = getUniqueFirstName();
      if (!firstName) {
        setBusy(false);
        return;
      }
      const surname = generateSurname();
      const fullName = `${firstName} ${surname}`;

      const race = randItem(RACES);
      const clazz = randItem(CLASSES);
      const level = Math.floor(Math.random() * 20) + 1;
      const alignment = randItem(ALIGNMENTS);
      const hometown = randomHometown();

      // Abilities
      const baseAbilities = generateBaseAbilities();
      const racialAbilities = applyRacialBonuses(baseAbilities, race);
      const finalAbilities = applyASI(racialAbilities, clazz, level);

      const mods = Object.fromEntries(
        Object.entries(finalAbilities).map(([k, v]) => [k, abilityMod(v)])
      );

      const hp = calculateHP(clazz, level, mods.CON);
      const proficiencyBonus = getProficiencyBonus(level);

      const gear = generateGear(clazz);
      const personality = randItem(PERSONALITY_TRAITS);
      const ideal = randItem(IDEALS);
      const bond = randItem(BONDS);
      const flaw = randItem(FLAWS);

      const backstory = generateBackstory({
        name: fullName,
        race,
        clazz,
        level,
        alignment,
        hometown
      });

      const newCharacter = {
        name: fullName,
        race,
        clazz,
        level,
        alignment,
        abilities: finalAbilities,
        mods,
        hp,
        proficiencyBonus,
        traits: { personality, ideal, bond, flaw },
        gear,
        backstory,
        hometown
      };

      setCharacter(newCharacter);
      setBusy(false);
    }, 300); // tiny delay for UI feel
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-slate-800/80 border border-slate-700 rounded-2xl shadow-xl p-6 md:p-8">
        <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-300 tracking-wide">
              Arcane Character Forge
            </h1>
            <p className="text-sm md:text-base text-slate-300 mt-1">
              Generate completely random, non-repeating D&D characters with
              stats, traits, gear, and a short backstory.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loadingNames || busy}
            className={`px-4 py-2 rounded-lg text-sm md:text-base font-semibold transition
              ${
                loadingNames || busy
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-amber-400 hover:bg-amber-300 text-slate-900"
              }`}
          >
            {loadingNames
              ? "Loading names..."
              : busy
              ? "Conjuring character..."
              : "Generate Character"}
          </button>
        </header>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-900/40 border border-red-600 text-sm">
            {error}
          </div>
        )}

        {!character && !error && !loadingNames && (
          <p className="text-sm text-slate-300 mb-4">
            Click <span className="font-semibold">Generate Character</span> to
            create a unique hero. First names are consumed from{" "}
            <code className="bg-slate-900 px-1 py-0.5 rounded">
              names-extra.txt
            </code>{" "}
            and never reused in this browser.
          </p>
        )}

        {character && (
          <main className="space-y-6">
            {/* Identity */}
            <section className="bg-slate-900/60 rounded-xl border border-slate-700 p-4 md:p-5">
              <h2 className="text-lg font-semibold text-amber-200 mb-2">
                {character.name}
              </h2>
              <div className="text-sm md:text-base text-slate-200 space-y-1">
                <p>
                  <span className="font-semibold">Race:</span> {character.race}
                </p>
                <p>
                  <span className="font-semibold">Class:</span>{" "}
                  {character.clazz}
                </p>
                <p>
                  <span className="font-semibold">Level:</span>{" "}
                  {character.level}
                </p>
                <p>
                  <span className="font-semibold">Alignment:</span>{" "}
                  {character.alignment}
                </p>
                <p>
                  <span className="font-semibold">Hometown:</span>{" "}
                  {character.hometown}
                </p>
              </div>
            </section>

            {/* Stats */}
            <section className="bg-slate-900/60 rounded-xl border border-slate-700 p-4 md:p-5">
              <h3 className="text-md font-semibold text-amber-200 mb-3">
                Ability Scores & Combat
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm md:text-base mb-3">
                {["STR", "DEX", "CON", "INT", "WIS", "CHA"].map((stat) => (
                  <div
                    key={stat}
                    className="bg-slate-800/80 rounded-lg px-3 py-2 flex items-center justify-between"
                  >
                    <span className="font-semibold">{stat}</span>
                    <span>
                      {character.abilities[stat]}{" "}
                      <span className="text-xs text-slate-300">
                        ({formatMod(character.mods[stat])})
                      </span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-sm md:text-base">
                <div>
                  <span className="font-semibold">HP:</span>{" "}
                  {character.hp}
                </div>
                <div>
                  <span className="font-semibold">Proficiency Bonus:</span>{" "}
                  {formatMod(character.proficiencyBonus)}
                </div>
                {/* You can add AC, initiative, etc. if you want */}
              </div>
            </section>

            {/* Traits */}
            <section className="bg-slate-900/60 rounded-xl border border-slate-700 p-4 md:p-5">
              <h3 className="text-md font-semibold text-amber-200 mb-3">
                Traits
              </h3>
              <div className="space-y-2 text-sm md:text-base">
                <p>
                  <span className="font-semibold">Personality:</span>{" "}
                  {character.traits.personality}
                </p>
                <p>
                  <span className="font-semibold">Ideal:</span>{" "}
                  {character.traits.ideal}
                </p>
                <p>
                  <span className="font-semibold">Bond:</span>{" "}
                  {character.traits.bond}
                </p>
                <p>
                  <span className="font-semibold">Flaw:</span>{" "}
                  {character.traits.flaw}
                </p>
              </div>
            </section>

            {/* Gear */}
            <section className="bg-slate-900/60 rounded-xl border border-slate-700 p-4 md:p-5">
              <h3 className="text-md font-semibold text-amber-200 mb-3">
                Starting Gear
              </h3>
              <ul className="list-disc list-inside text-sm md:text-base space-y-1">
                {character.gear.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Backstory */}
            <section className="bg-slate-900/60 rounded-xl border border-slate-700 p-4 md:p-5">
              <h3 className="text-md font-semibold text-amber-200 mb-3">
                Backstory
              </h3>
              <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                {character.backstory}
              </p>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}
// Paste your App.jsx code here
