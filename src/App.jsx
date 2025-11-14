import React, { useEffect, useState } from "react";

// ====== CONFIG DATA ======

// All common 5e-style races & subraces + a few popular extras
const RACES = [
  "Any Race",
  "Human",
  "Variant Human",
  "Elf (High)",
  "Elf (Wood)",
  "Elf (Drow)",
  "Elf (Eladrin)",
  "Half-Elf",
  "Dwarf (Hill)",
  "Dwarf (Mountain)",
  "Dwarf (Duergar)",
  "Halfling (Lightfoot)",
  "Halfling (Stout)",
  "Dragonborn",
  "Gnome (Forest)",
  "Gnome (Rock)",
  "Half-Orc",
  "Tiefling",
  "Aarakocra",
  "Aasimar",
  "Firbolg",
  "Genasi (Air)",
  "Genasi (Earth)",
  "Genasi (Fire)",
  "Genasi (Water)",
  "Goliath",
  "Kenku",
  "Kobold",
  "Lizardfolk",
  "Orc",
  "Tabaxi",
  "Triton",
  "Tortle",
  "Yuan-ti Pureblood"
];

const CLASSES = [
  "Any Class",
  "Artificer",
  "Barbarian",
  "Bard",
  "Blood Hunter",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard"
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

const GENDERS = [
  "Any",
  "Female",
  "Male",
  "Non-binary",
  "Other"
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
  "Blood Hunter": 10,
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
  Artificer: "INT",
  "Blood Hunter": "DEX"
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

const normalizeRaceForBonuses = (race) => {
  if (!race) return "";
  if (race.includes("Human")) return "Human";
  if (race.startsWith("Elf")) return "Elf";
  if (race.startsWith("Dwarf")) return "Dwarf";
  if (race.startsWith("Halfling")) return "Halfling";
  if (race.startsWith("Gnome")) return "Gnome";
  if (race.includes("Half-Elf")) return "Half-Elf";
  if (race.includes("Half-Orc")) return "Half-Orc";
  if (race.includes("Dragonborn")) return "Dragonborn";
  if (race.includes("Tiefling")) return "Tiefling";
  if (race.includes("Genasi")) return "Genasi";
  return race;
};

const applyRacialBonuses = (abilities, raceRaw) => {
  const a = { ...abilities };
  const race = normalizeRaceForBonuses(raceRaw);

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
    case "Aasimar":
      a.CHA += 2;
      break;
    case "Genasi":
      a.CON += 2;
      break;
    case "Goliath":
      a.STR += 2;
      a.CON += 1;
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
    case "Blood Hunter":
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

const genderToPronouns = (gender) => {
  switch (gender) {
    case "Female":
      return { subj: "she", obj: "her", poss: "her", possPron: "hers" };
    case "Male":
      return { subj: "he", obj: "him", poss: "his", possPron: "his" };
    case "Non-binary":
      return { subj: "they", obj: "them", poss: "their", possPron: "theirs" };
    default:
      return { subj: "they", obj: "them", poss: "their", possPron: "theirs" };
  }
};

const generateBackstory = ({ name, race, clazz, level, alignment, hometown, gender }) => {
  const p = genderToPronouns(gender);

  const hooks = [
    `${name} grew up in ${hometown}, a place now spoken of only in hushed tones.`,
    `Once a simple child of ${hometown}, ${name} has walked a path few dare to tread.`,
    `${name}'s early years in ${hometown} were marked by strange omens and whispered prophecies.`
  ];

  const incitingEvents = [
    `A tragic betrayal shattered the life ${p.subj} once knew.`,
    `A chance encounter with a dying mentor changed ${p.poss} destiny forever.`,
    `An ancient relic called to ${p.obj} in restless dreams.`,
    `A monster attack left scars on ${p.obj} that never truly healed.`
  ];

  const motivations = [
    `Now, ${p.subj} seeks answers in forgotten ruins and dangerous wilds.`,
    `${p.subj.charAt(0).toUpperCase() + p.subj.slice(1)} wanders from town to town, trading skill for rumors of a looming darkness.`,
    `${p.poss.charAt(0).toUpperCase() + p.poss.slice(1)} journey is driven by a quiet hope that redemption still lies ahead.`,
    `${p.subj.charAt(0).toUpperCase() + p.subj.slice(1)} hungers for glory, but fears becoming the very monster ${p.subj} fights.`
  ];

  const roleFlavor = `${name} is a level ${level} ${alignment} ${race} ${clazz}, whose skills have been tempered by hardship and hard-won victories.`;

  const hook = randItem(hooks);
  const event = randItem(incitingEvents);
  const motive = randItem(motivations);

  return `${hook} ${event} ${motive} ${roleFlavor}`;
};

// ====== MAIN APP ======

export default function App() {
  const [namesPool, setNamesPool] = useState([]);
  const [loadingNames, setLoadingNames] = useState(true);
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // User options
  const [selectedGender, setSelectedGender] = useState("Any");
  const [selectedRace, setSelectedRace] = useState("Any Race");
  const [selectedClass, setSelectedClass] = useState("Any Class");
  const [selectedLevel, setSelectedLevel] = useState("Random");

  // Load names on mount
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

  const resolveOptions = () => {
    const race =
      selectedRace === "Any Race" ? randItem(RACES.slice(1)) : selectedRace;
    const clazz =
      selectedClass === "Any Class" ? randItem(CLASSES.slice(1)) : selectedClass;
    const level =
      selectedLevel === "Random"
        ? Math.floor(Math.random() * 20) + 1
        : parseInt(selectedLevel, 10);
    const gender =
      selectedGender === "Any" ? randItem(GENDERS.slice(1)) : selectedGender;

    return { race, clazz, level, gender };
  };

  const buildCharacter = ({ keepName = false } = {}) => {
    setError("");
    setBusy(true);

    setTimeout(() => {
      let fullName;
      if (keepName && character) {
        fullName = character.name;
      } else {
        const firstName = getUniqueFirstName();
        if (!firstName) {
          setBusy(false);
          return;
        }
        const surname = generateSurname();
        fullName = `${firstName} ${surname}`;
      }

      const { race, clazz, level, gender } = resolveOptions();
      const alignment = randItem(ALIGNMENTS);
      const hometown = randomHometown();

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
        hometown,
        gender
      });

      const newCharacter = {
        name: fullName,
        gender,
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
    }, 250);
  };

  const handleFullyRandom = () => {
    // Temporarily ignore user filters by randomizing them all
    const randomRace = randItem(RACES.slice(1));
    const randomClass = randItem(CLASSES.slice(1));
    const randomGender = randItem(GENDERS.slice(1));
    const randomLevel = (Math.floor(Math.random() * 20) + 1).toString();

    setSelectedRace(randomRace);
    setSelectedClass(randomClass);
    setSelectedGender(randomGender);
    setSelectedLevel(randomLevel);
    buildCharacter();
  };

  const handleUseSettings = () => {
    buildCharacter();
  };

  const handleRerollKeepingName = () => {
    if (!character) return;
    buildCharacter({ keepName: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-amber-300 drop-shadow-md">
            The Guild Scribe&apos;s Character Scroll
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            A minimalist D&D name & character generator. Each hero is forged from a
            unique name, accurate stats, and a short tale of adventure.
          </p>
        </header>

        <div className="grid gap-4 md:gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)]">
          {/* Left: Control panel on a scroll */}
          <section className="relative">
            <div className="absolute -top-3 left-6 w-6 h-6 rounded-full bg-red-900 shadow-lg border border-red-700" />
            <div className="absolute -top-3 right-6 w-6 h-6 rounded-full bg-red-900 shadow-lg border border-red-700" />

            <div className="bg-gradient-to-b from-amber-100/90 via-amber-50/95 to-amber-100/90 text-slate-900 border border-amber-500/70 rounded-xl shadow-xl shadow-amber-900/30 px-4 py-5 md:px-5 md:py-6 relative overflow-hidden">
              <div className="absolute inset-x-6 top-0 h-1 border-b border-amber-700/50" />
              <div className="absolute inset-x-4 bottom-0 h-1 border-t border-amber-700/40" />
              <div className="absolute inset-y-4 left-2 w-px bg-amber-700/40" />
              <div className="absolute inset-y-4 right-2 w-px bg-amber-700/40" />

              <h2 className="relative text-lg font-semibold text-amber-900 mb-3">
                Summoning Ritual
              </h2>

              {error && (
                <div className="relative mb-3 rounded-lg border border-red-500/70 bg-red-50/90 px-3 py-2 text-xs text-red-900">
                  {error}
                </div>
              )}

              <div className="space-y-3 text-xs md:text-sm relative">
                {/* Gender */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-amber-900/90">
                    Gender
                  </label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="rounded-md border border-amber-400/70 bg-amber-50/80 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs md:text-sm"
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Race */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-amber-900/90">
                    Race
                  </label>
                  <select
                    value={selectedRace}
                    onChange={(e) => setSelectedRace(e.target.value)}
                    className="rounded-md border border-amber-400/70 bg-amber-50/80 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs md:text-sm"
                  >
                    {RACES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-amber-900/90">
                    Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="rounded-md border border-amber-400/70 bg-amber-50/80 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs md:text-sm"
                  >
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-amber-900/90 flex items-center justify-between">
                    <span>Level</span>
                    {selectedLevel !== "Random" && (
                      <span className="text-[10px] md:text-xs text-amber-800/80">
                        {selectedLevel}
                      </span>
                    )}
                  </label>
                  <div className="flex gap-2 items-center">
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-24 rounded-md border border-amber-400/70 bg-amber-50/80 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs md:text-sm"
                    >
                      <option value="Random">Random (1–20)</option>
                      {Array.from({ length: 20 }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] md:text-xs text-amber-800/80">
                      Higher levels gain ASIs and more HP.
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-2 border-t border-amber-400/60 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleFullyRandom}
                    disabled={loadingNames || busy}
                    className={`w-full rounded-md px-3 py-1.5 text-xs md:text-sm font-semibold tracking-wide uppercase
                      ${
                        loadingNames || busy
                          ? "bg-amber-300/70 text-amber-900/60 cursor-not-allowed"
                          : "bg-amber-600 text-amber-50 hover:bg-amber-500 shadow-md shadow-amber-900/40"
                      }`}
                  >
                    {loadingNames
                      ? "Loading Names..."
                      : busy
                      ? "Conjuring Hero..."
                      : "Fully Random Hero"}
                  </button>

                  <button
                    type="button"
                    onClick={handleUseSettings}
                    disabled={loadingNames || busy}
                    className={`w-full rounded-md px-3 py-1.5 text-xs md:text-sm font-semibold
                      ${
                        loadingNames || busy
                          ? "bg-amber-200/80 text-amber-900/60 cursor-not-allowed"
                          : "bg-amber-100/90 text-amber-900 border border-amber-400/80 hover:bg-amber-50"
                      }`}
                  >
                    Use My Settings
                  </button>

                  <button
                    type="button"
                    onClick={handleRerollKeepingName}
                    disabled={!character || busy}
                    className={`w-full rounded-md px-3 py-1.5 text-[11px] md:text-xs font-medium
                      ${
                        !character || busy
                          ? "bg-amber-50/60 text-amber-900/40 cursor-not-allowed"
                          : "bg-transparent border border-amber-400/70 text-amber-900 hover:bg-amber-100/80"
                      }`}
                  >
                    Re-roll Stats & Story (Keep Name)
                  </button>
                </div>

                <p className="text-[10px] md:text-xs text-amber-800/80 pt-1">
                  Each first name is consumed from <code>names-extra.txt</code>{" "}
                  and never reused in this browser, keeping every hero distinct.
                </p>
              </div>
            </div>
          </section>

          {/* Right: Character sheet card */}
          <section className="bg-slate-900/70 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/60 backdrop-blur-sm p-4 md:p-6">
            {!character ? (
              <div className="h-full flex items-center justify-center text-center text-sm md:text-base text-slate-300">
                Use the scroll to the left to summon your first hero.
              </div>
            ) : (
              <div className="space-y-5">
                {/* Identity */}
                <div className="border-b border-slate-700 pb-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-amber-200">
                      {character.name}
                    </h2>
                    <span className="text-xs md:text-sm uppercase tracking-wide text-amber-400">
                      Level {character.level} {character.race} {character.clazz}
                    </span>
                  </div>
                  <div className="mt-2 text-xs md:text-sm text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      <span className="font-semibold text-slate-100">Gender:</span>{" "}
                      {character.gender}
                    </span>
                    <span>
                      <span className="font-semibold text-slate-100">Alignment:</span>{" "}
                      {character.alignment}
                    </span>
                    <span>
                      <span className="font-semibold text-slate-100">Hometown:</span>{" "}
                      {character.hometown}
                    </span>
                  </div>
                </div>

                {/* Stats & combat */}
                <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-4">
                  <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 md:p-4">
                    <h3 className="text-sm md:text-base font-semibold text-amber-200 mb-2">
                      Ability Scores
                    </h3>
                    <div className="grid grid-cols-3 gap-2 text-xs md:text-sm">
                      {["STR", "DEX", "CON", "INT", "WIS", "CHA"].map((stat) => (
                        <div
                          key={stat}
                          className="bg-slate-800/80 rounded-lg px-2.5 py-2 flex flex-col items-center justify-center border border-slate-700/80"
                        >
                          <span className="text-[11px] font-semibold text-slate-300">
                            {stat}
                          </span>
                          <span className="text-sm md:text-base font-bold text-amber-100">
                            {character.abilities[stat]}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatMod(character.mods[stat])}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 md:p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm md:text-base font-semibold text-amber-200 mb-2">
                        Combat Summary
                      </h3>
                      <div className="space-y-1 text-xs md:text-sm text-slate-200">
                        <p>
                          <span className="font-semibold">Hit Points:</span>{" "}
                          {character.hp}
                        </p>
                        <p>
                          <span className="font-semibold">Proficiency Bonus:</span>{" "}
                          {formatMod(character.proficiencyBonus)}
                        </p>
                        <p className="text-slate-400 text-[11px] md:text-xs">
                          HP and proficiency are calculated from class, level, and
                          Constitution modifier using standard 5e-style rules
                          (max at 1st, average thereafter).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Traits */}
                <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 md:p-4">
                  <h3 className="text-sm md:text-base font-semibold text-amber-200 mb-2">
                    Traits
                  </h3>
                  <div className="space-y-1 text-xs md:text-sm text-slate-200">
                    <p>
                      <span className="font-semibold text-slate-100">
                        Personality:
                      </span>{" "}
                      {character.traits.personality}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">
                        Ideal:
                      </span>{" "}
                      {character.traits.ideal}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">Bond:</span>{" "}
                      {character.traits.bond}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">Flaw:</span>{" "}
                      {character.traits.flaw}
                    </p>
                  </div>
                </div>

                {/* Gear */}
                <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 md:p-4">
                  <h3 className="text-sm md:text-base font-semibold text-amber-200 mb-2">
                    Starting Gear
                  </h3>
                  <ul className="list-disc list-inside text-xs md:text-sm text-slate-200 space-y-0.5">
                    {character.gear.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Backstory */}
                <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 md:p-4">
                  <h3 className="text-sm md:text-base font-semibold text-amber-200 mb-2">
                    Backstory
                  </h3>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                    {character.backstory}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
