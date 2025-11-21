import React, { useEffect, useState } from "react";

// ====== CONFIG DATA (FALLBACKS) ======

// Races & classes (with "Any" options)
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

const GENDERS = ["Any", "Female", "Male", "Non-binary", "Other"];

// Fallback backstory pools
const FALLBACK_ADJECTIVES = [
  "stoic",
  "reckless",
  "brooding",
  "soft-spoken",
  "quick-witted",
  "superstitious",
  "vengeful",
  "hopeful"
];

const FALLBACK_LIFE_EVENTS = [
  "survived a dragon attack",
  "lost their mentor in a mysterious fire",
  "discovered an ancient ruin",
  "escaped captivity from a shadow cult",
  "witnessed forbidden magic"
];

const FALLBACK_VILLAINS = [
  "a shadow cult",
  "an exiled warlock",
  "a corrupted noble",
  "a rampaging dragon",
  "a rogue artificer"
];

const FALLBACK_PROFESSIONS = [
  "apprentice blacksmith",
  "street-level fortune teller",
  "wandering minstrel",
  "temple archivist",
  "failed squire",
  "runaway noble"
];

const FALLBACK_MOTIVATIONS = [
  "seek redemption",
  "uncover forbidden secrets",
  "restore their family honor",
  "avenge past wrongs",
  "stop an incoming catastrophe"
];

const FALLBACK_MAGICAL_EFFECTS = [
  "glows faintly during moonlight",
  "whispers fragments of forgotten runes",
  "emits sparks when danger is near",
  "grows cold in the presence of evil",
  "hums softly when a spell is cast"
];

// Fallback backstory templates (single template used per character)
const FALLBACK_TEMPLATES = [
  `{name} was a {adjective} {race} {clazz} from {hometown}, once known only as a humble {profession}. 
Long before {p_subj} reached level {level}, {p_subj} {lifeEvent}, leaving {p_obj} forever changed. 
Since then, {p_subj} has wandered the realm to {motivation}, with rumors whispering that {p_poss} gear sometimes {magicalEffect}. 
Now, as a {alignment} soul, {name} walks a path few dare to follow.`,
  `In the quiet days of {hometown}, {name} lived as a {profession}, a life too small for a {adjective} spirit. 
Everything shifted when {p_subj} {lifeEvent}, drawing the ire of {villain}. 
Taking up the mantle of a level {level} {race} {clazz}, {name} set out to {motivation}, even as {p_poss} shadowed past clings tightly to {p_possPron}.`,
  `{name} was never meant to be ordinary. Born in {hometown} and known as a {profession}, 
{p_subj} carried a {adjective} determination that others overlooked. 
After {p_subj} {lifeEvent}, the road ahead bent sharply toward danger and destiny. 
Now a level {level} {race} {clazz}, {name} seeks to {motivation}, while whispers claim that something {magicalEffect} surrounds {p_obj} whenever steel and sorcery clash.`
];

// Fallback surnames
const FALLBACK_SURNAME_PREFIXES = [
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

const FALLBACK_SURNAME_SUFFIXES = [
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

const FALLBACK_SURNAME_NATURAL = [
  "Riverbrook",
  "Thornweave",
  "Mossbriar",
  "Hillford",
  "Oakborne",
  "Greenmantle",
  "Briarcrest"
];

const FALLBACK_SURNAME_ELEMENTAL = [
  "Flamewhisper",
  "Stormwatcher",
  "Frostmantle",
  "Stonebreaker",
  "Windshadow",
  "Emberfield"
];

const FALLBACK_SURNAME_NOBLE = [
  "the Third",
  "of Highcourt",
  "the Unbroken",
  "of Dawnspire",
  "of Blackstone Keep"
];

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

// Gear fallback pools (used if external files are missing)
const FALLBACK_GEAR = {
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
  stealth: [
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
  ],
  trinkets: [
    "lucky coin",
    "feather charm",
    "broken compass",
    "engraved locket"
  ]
};

// ====== UTILITIES ======

const randItem = (arr) =>
  arr && arr.length > 0
    ? arr[Math.floor(Math.random() * arr.length)]
    : undefined;

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
  return rolls.slice(1).reduce((a, b) => a + b, 0);
};

const generateBaseAbilities = () => ({
  STR: roll4d6DropLowest(),
  DEX: roll4d6DropLowest(),
  CON: roll4d6DropLowest(),
  INT: roll4d6DropLowest(),
  WIS: roll4d6DropLowest(),
  CHA: roll4d6DropLowest()
});

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
  const firstLevel = hitDie + conMod;
  if (level <= 1) return Math.max(1, firstLevel);

  const avgPerLevel = Math.floor(hitDie / 2) + 1 + conMod;
  const total = firstLevel + (level - 1) * avgPerLevel;
  return Math.max(1, total);
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
      return {
        subj: "they",
        obj: "them",
        poss: "their",
        possPron: "theirs"
      };
    default:
      return {
        subj: "they",
        obj: "them",
        poss: "their",
        possPron: "theirs"
      };
  }
};

// Generic helper: load lines from a public file
const loadTextLines = async (path) => {
  try {
    const res = await fetch(path);
    if (!res.ok) return [];
    const text = await res.text();
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
};

// Pick from external pool or fallback
const pickFromPool = (external, fallback) => {
  const source =
    external && external.length > 0 ? external : fallback && fallback.length > 0 ? fallback : [];
  return source.length ? randItem(source) : "";
};

// ====== BACKSTORY & GEAR BUILDERS ======

const generateSurname = (
  ctx,
  surnamePools
) => {
  const {
    surnamePrefixes,
    surnameSuffixes,
    surnameNatural,
    surnameElemental,
    surnameNoble
  } = surnamePools;

  const prefixes = surnamePrefixes.length
    ? surnamePrefixes
    : FALLBACK_SURNAME_PREFIXES;
  const suffixes = surnameSuffixes.length
    ? surnameSuffixes
    : FALLBACK_SURNAME_SUFFIXES;
  const natural = surnameNatural.length
    ? surnameNatural
    : FALLBACK_SURNAME_NATURAL;
  const elemental = surnameElemental.length
    ? surnameElemental
    : FALLBACK_SURNAME_ELEMENTAL;
  const noblePieces = surnameNoble.length
    ? surnameNoble
    : FALLBACK_SURNAME_NOBLE;

  const methods = ["natural", "elemental", "composite", "noble", "origin"];
  const method = randItem(methods);

  switch (method) {
    case "natural":
      return randItem(natural);
    case "elemental":
      return randItem(elemental);
    case "noble": {
      const base = randItem([...natural, ...elemental, ...prefixes]);
      const title = randItem(noblePieces);
      return `${base} ${title}`;
    }
    case "origin":
      if (ctx.hometown) {
        const townName = ctx.hometown
          .replace("the ", "")
          .replace("city of ", "")
          .replace("village of ", "")
          .split(" ")[0];
        return `${townName}born`;
      }
      // fallthrough to composite
    case "composite":
    default: {
      const pre = randItem(prefixes);
      const suf = randItem(suffixes);
      return pre + suf;
    }
  }
};

const generateGear = (clazz, gearPools, magicalEffects) => {
  const pickPool = (external, fallbackKey) => {
    const fallback = FALLBACK_GEAR[fallbackKey] || [];
    return external && external.length ? external : fallback;
  };

  let basePoolKey = "martial";
  switch (clazz) {
    case "Barbarian":
    case "Fighter":
    case "Paladin":
    case "Ranger":
    case "Blood Hunter":
      basePoolKey = "martial";
      break;
    case "Rogue":
    case "Monk":
      basePoolKey = "stealth";
      break;
    case "Wizard":
    case "Sorcerer":
    case "Warlock":
    case "Artificer":
      basePoolKey = "caster";
      break;
    case "Cleric":
      basePoolKey = "divine";
      break;
    case "Druid":
      basePoolKey = "nature";
      break;
    case "Bard":
      basePoolKey = "caster";
      break;
    default:
      basePoolKey = "martial";
  }

  const martial = pickPool(gearPools.martial, "martial");
  const stealth = pickPool(gearPools.stealth, "stealth");
  const caster = pickPool(gearPools.caster, "caster");
  const divine = pickPool(gearPools.divine, "divine");
  const nature = pickPool(gearPools.nature, "nature");
  const trinkets = pickPool(gearPools.trinkets, "trinkets");

  let classPool = martial;
  if (basePoolKey === "stealth") classPool = stealth;
  if (basePoolKey === "caster") classPool = caster;
  if (basePoolKey === "divine") classPool = divine;
  if (basePoolKey === "nature") classPool = nature;

  const gearSet = new Set();
  const mainCount = 3 + Math.floor(Math.random() * 2); // 3–4
  while (gearSet.size < mainCount && classPool.length) {
    gearSet.add(randItem(classPool));
  }

  const trinketCount = 1 + Math.floor(Math.random() * 2); // 1–2
  while (gearSet.size < mainCount + trinketCount && trinkets.length) {
    gearSet.add(randItem(trinkets));
  }

  const mixedPool = [
    ...martial,
    ...caster,
    ...stealth,
    ...divine,
    ...nature,
    ...trinkets
  ];
  if (mixedPool.length) {
    gearSet.add(randItem(mixedPool));
  }

  const gear = Array.from(gearSet);

  const effectSource =
    magicalEffects && magicalEffects.length
      ? magicalEffects
      : FALLBACK_MAGICAL_EFFECTS;
  if (gear.length && effectSource.length) {
    const idx = Math.floor(Math.random() * gear.length);
    const effect = randItem(effectSource);
    gear[idx] = `${gear[idx]} (which sometimes ${effect})`;
  }

  return gear;
};

const buildBackstory = (context, pools) => {
  const {
    adjectives,
    lifeEvents,
    villains,
    professions,
    motivations,
    magicalEffects,
    templates
  } = pools;

  const adjectivesSrc = adjectives.length ? adjectives : FALLBACK_ADJECTIVES;
  const lifeEventsSrc = lifeEvents.length ? lifeEvents : FALLBACK_LIFE_EVENTS;
  const villainsSrc = villains.length ? villains : FALLBACK_VILLAINS;
  const professionsSrc = professions.length
    ? professions
    : FALLBACK_PROFESSIONS;
  const motivationsSrc = motivations.length
    ? motivations
    : FALLBACK_MOTIVATIONS;
  const magicalSrc = magicalEffects.length
    ? magicalEffects
    : FALLBACK_MAGICAL_EFFECTS;

  const templatesSrc = templates.length ? templates : FALLBACK_TEMPLATES;
  const template = randItem(templatesSrc);

  const pronouns = genderToPronouns(context.gender);
  const p_subj = pronouns.subj;
  const p_obj = pronouns.obj;
  const p_poss = pronouns.poss;
  const p_possPron = pronouns.possPron;
  const p_subj_cap = p_subj.charAt(0).toUpperCase() + p_subj.slice(1);

  const replacements = {
    name: context.name,
    race: context.race,
    clazz: context.clazz,
    level: String(context.level),
    gender: context.gender,
    hometown: context.hometown,
    alignment: context.alignment,

    profession: randItem(professionsSrc),
    lifeEvent: randItem(lifeEventsSrc),
    motivation: randItem(motivationsSrc),
    villain: randItem(villainsSrc),
    adjective: randItem(adjectivesSrc),
    magicalEffect: randItem(magicalSrc),

    p_subj,
    p_obj,
    p_poss,
    p_possPron,
    p_subj_cap
  };

  return template.replace(/\{(\w+)\}/g, (_, key) => replacements[key] || "");
};

// ====== MAIN APP COMPONENT ======

export default function App() {
  const [namesPool, setNamesPool] = useState([]);
  const [loadingNames, setLoadingNames] = useState(true);
  const [loadingRandomData, setLoadingRandomData] = useState(true);
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // User options
  const [selectedGender, setSelectedGender] = useState("Any");
  const [selectedRace, setSelectedRace] = useState("Any Race");
  const [selectedClass, setSelectedClass] = useState("Any Class");
  const [selectedLevel, setSelectedLevel] = useState("Random");

  // External random data pools
  const [adjectives, setAdjectives] = useState([]);
  const [lifeEvents, setLifeEvents] = useState([]);
  const [villains, setVillains] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [motivations, setMotivations] = useState([]);
  const [magicalEffects, setMagicalEffects] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [surnamePrefixes, setSurnamePrefixes] = useState([]);
  const [surnameSuffixes, setSurnameSuffixes] = useState([]);
  const [surnameNatural, setSurnameNatural] = useState([]);
  const [surnameElemental, setSurnameElemental] = useState([]);
  const [surnameNoble, setSurnameNoble] = useState([]);

  const [gearMartial, setGearMartial] = useState([]);
  const [gearCaster, setGearCaster] = useState([]);
  const [gearStealth, setGearStealth] = useState([]);
  const [gearDivine, setGearDivine] = useState([]);
  const [gearNature, setGearNature] = useState([]);
  const [gearTrinkets, setGearTrinkets] = useState([]);

  // Load names from names-extra.txt
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

        const used = JSON.parse(localStorage.getItem("usedNames") || "[]");
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

  // Load random data from /public/random/...
  useEffect(() => {
    const loadRandomData = async () => {
      setLoadingRandomData(true);
      try {
        const [
          adj,
          le,
          vil,
          profs,
          motivs,
          mag,
          // backstory templates file (optional, multiple templates separated by "---" lines)
          templatesRaw,
          sPre,
          sSuf,
          sNat,
          sElem,
          sNob,
          gMartial,
          gCaster,
          gStealth,
          gDivine,
          gNature,
          gTrinkets
        ] = await Promise.all([
          loadTextLines("/random/backstory/adjectives.txt"),
          loadTextLines("/random/backstory/life-events.txt"),
          loadTextLines("/random/backstory/villains.txt"),
          loadTextLines("/random/backstory/professions.txt"),
          loadTextLines("/random/backstory/motivations.txt"),
          loadTextLines("/random/backstory/magical-effects.txt"),
          (async () => {
            try {
              const res = await fetch("/random/backstory/templates.txt");
              if (!res.ok) return [];
              const text = await res.text();
              // Split templates by blank line or --- separator
              return text
                .split(/\n-{3,}\n|\n\s*\n/g)
                .map((t) => t.trim())
                .filter(Boolean);
            } catch {
              return [];
            }
          })(),
          loadTextLines("/random/surnames/prefixes.txt"),
          loadTextLines("/random/surnames/suffixes.txt"),
          loadTextLines("/random/surnames/natural.txt"),
          loadTextLines("/random/surnames/elemental.txt"),
          loadTextLines("/random/surnames/noble.txt"),
          loadTextLines("/random/gear/martial.txt"),
          loadTextLines("/random/gear/caster.txt"),
          loadTextLines("/random/gear/stealth.txt"),
          loadTextLines("/random/gear/divine.txt"),
          loadTextLines("/random/gear/nature.txt"),
          loadTextLines("/random/gear/trinkets.txt")
        ]);

        setAdjectives(adj);
        setLifeEvents(le);
        setVillains(vil);
        setProfessions(profs);
        setMotivations(motivs);
        setMagicalEffects(mag);
        setTemplates(templatesRaw);

        setSurnamePrefixes(sPre);
        setSurnameSuffixes(sSuf);
        setSurnameNatural(sNat);
        setSurnameElemental(sElem);
        setSurnameNoble(sNob);

        setGearMartial(gMartial);
        setGearCaster(gCaster);
        setGearStealth(gStealth);
        setGearDivine(gDivine);
        setGearNature(gNature);
        setGearTrinkets(gTrinkets);
      } finally {
        setLoadingRandomData(false);
      }
    };

    loadRandomData();
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
      let firstName = null;
      let fullName = character?.name || "";

      if (!keepName) {
        firstName = getUniqueFirstName();
        if (!firstName) {
          setBusy(false);
          return;
        }
      }

      const { race, clazz, level, gender } = resolveOptions();
      const alignment = randItem(ALIGNMENTS);
      const hometown = randomHometown();

      if (!keepName) {
        const surname = generateSurname(
          { race, clazz, hometown },
          {
            surnamePrefixes,
            surnameSuffixes,
            surnameNatural,
            surnameElemental,
            surnameNoble
          }
        );
        fullName = `${firstName} ${surname}`;
      }

      const baseAbilities = generateBaseAbilities();
      const racialAbilities = applyRacialBonuses(baseAbilities, race);
      const finalAbilities = applyASI(racialAbilities, clazz, level);

      const mods = Object.fromEntries(
        Object.entries(finalAbilities).map(([k, v]) => [k, abilityMod(v)])
      );

      const hp = calculateHP(clazz, level, mods.CON);
      const proficiencyBonus = getProficiencyBonus(level);

      const gear = generateGear(
        clazz,
        {
          martial: gearMartial,
          caster: gearCaster,
          stealth: gearStealth,
          divine: gearDivine,
          nature: gearNature,
          trinkets: gearTrinkets
        },
        magicalEffects
      );

      const backstory = buildBackstory(
        { name: fullName, race, clazz, level, gender, hometown, alignment },
        {
          adjectives,
          lifeEvents,
          villains,
          professions,
          motivations,
          magicalEffects,
          templates
        }
      );

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
        gear,
        backstory,
        hometown
      };

      setCharacter(newCharacter);
      setBusy(false);
    }, 250);
  };

  const handleFullyRandom = () => {
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

  const anyLoading = loadingNames || loadingRandomData;

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-amber-100 via-amber-100 to-amber-200 text-stone-900 flex items-center justify-center p-4 md:p-6"
      style={{ fontFamily: '"Crimson Pro", system-ui, -apple-system, serif' }}
    >
      <div className="max-w-6xl w-full border border-amber-800/40 rounded-2xl shadow-[0_0_0_1px_rgba(120,53,15,0.45),0_18px_40px_rgba(88,28,13,0.45)] bg-amber-50/70 backdrop-blur-sm px-3 py-4 md:px-6 md:py-6">
        {/* Header */}
        <header className="mb-5 text-center border-b border-amber-900/40 pb-3">
          <h1
            className="text-3xl md:text-4xl font-bold tracking-widest text-amber-900 drop-shadow-sm"
            style={{ fontFamily: '"Uncial Antiqua", system-ui, serif' }}
          >
            The Guild Scribe&apos;s Character Scroll
          </h1>
          <p className="mt-2 text-xs md:text-sm text-stone-800/80 max-w-2xl mx-auto leading-relaxed">
            A fantasy name & character generator forged in digital parchment:
            unique Dungeons & Dragons heroes, complete with names, accurate
            stats, gear, and lore-friendly backstories.
          </p>
        </header>

        <div className="grid gap-4 md:gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.65fr)]">
          {/* Left: Control scroll */}
          <section className="relative">
            {/* &quot;Old internet&quot; tack pins */}
            <div className="absolute -top-3 left-6 w-6 h-6 rounded-full bg-amber-900 shadow-md border border-amber-700/90" />
            <div className="absolute -top-3 right-6 w-6 h-6 rounded-full bg-amber-900 shadow-md border border-amber-700/90" />

            <div className="bg-gradient-to-b from-amber-50 via-amber-100/95 to-amber-50 text-stone-900 border border-amber-800/70 rounded-xl shadow-[0_8px_0_rgba(120,53,15,0.55)] px-4 py-5 md:px-5 md:py-6 relative overflow-hidden">
              {/* Faux scroll edges */}
              <div className="absolute inset-x-6 top-0 h-1 border-b border-amber-900/50" />
              <div className="absolute inset-x-4 bottom-0 h-1 border-t border-amber-900/40" />
              <div className="absolute inset-y-4 left-2 w-px bg-amber-900/30" />
              <div className="absolute inset-y-4 right-2 w-px bg-amber-900/30" />

              <h2
                className="relative text-base md:text-lg font-semibold text-amber-900 mb-3 tracking-wide"
                style={{ fontFamily: '"Uncial Antiqua", system-ui, serif' }}
              >
                Summoning Ritual
              </h2>

              {error && (
                <div className="relative mb-3 rounded-lg border border-red-700/80 bg-red-50/95 px-3 py-2 text-xs text-red-900 shadow-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3 text-xs md:text-sm relative">
                {/* Gender */}
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-amber-950/90">
                    Gender
                  </label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="rounded-[3px] border border-amber-800/60 bg-amber-50/90 px-2 py-1 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-900 shadow-inner"
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
                  <label className="font-semibold text-amber-950/90">
                    Race
                  </label>
                  <select
                    value={selectedRace}
                    onChange={(e) => setSelectedRace(e.target.value)}
                    className="rounded-[3px] border border-amber-800/60 bg-amber-50/90 px-2 py-1 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-900 shadow-inner"
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
                  <label className="font-semibold text-amber-950/90">
                    Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="rounded-[3px] border border-amber-800/60 bg-amber-50/90 px-2 py-1 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-900 shadow-inner"
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
                  <label className="font-semibold text-amber-950/90 flex items-center justify-between">
                    <span>Level</span>
                    {selectedLevel !== "Random" && (
                      <span className="text-[10px] md:text-xs text-amber-900/80">
                        {selectedLevel}
                      </span>
                    )}
                  </label>
                  <div className="flex gap-2 items-center">
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-28 rounded-[3px] border border-amber-800/60 bg-amber-50/90 px-2 py-1 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-900 shadow-inner"
                    >
                      <option value="Random">Random (1–20)</option>
                      {Array.from({ length: 20 }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] md:text-xs text-amber-900/70">
                      Higher levels gain ASIs and more HP.
                    </span>
                  </div>
                </div>

                {/* Buttons (updated order & labels) */}
                <div className="pt-2 mt-1 border-t border-amber-800/60 flex flex-col gap-2">
                  {/* Primary: Generate (Use My Settings) */}
                  <button
                    type="button"
                    onClick={handleUseSettings}
                    disabled={anyLoading || busy}
                    className={`w-full rounded-md px-3 py-1.5 text-xs md:text-sm font-semibold tracking-wide uppercase border
                      ${
                        anyLoading || busy
                          ? "bg-amber-300/70 text-amber-950/60 border-amber-700/60 cursor-not-allowed"
                          : "bg-amber-800 text-amber-50 border-amber-950 hover:bg-amber-700 hover:shadow-md hover:shadow-amber-900/50 transition"
                      }`}
                  >
                    {anyLoading
                      ? "Loading scrolls..."
                      : busy
                      ? "Inscribing hero..."
                      : "Generate"}
                  </button>

                  {/* Secondary: Randomize (Fully Random Hero) */}
                  <button
                    type="button"
                    onClick={handleFullyRandom}
                    disabled={anyLoading || busy}
                    className={`w-full rounded-md px-3 py-1.5 text-xs md:text-sm font-semibold tracking-wide uppercase border
                      ${
                        anyLoading || busy
                          ? "bg-amber-100/80 text-amber-900/50 border-amber-400/80 cursor-not-allowed"
                          : "bg-amber-50/95 text-amber-950 border-amber-700/70 hover:bg-amber-100/95 hover:shadow-sm"
                      }`}
                  >
                    Randomize
                  </button>

                  {/* Re-roll stats keep name */}
                  <button
                    type="button"
                    onClick={handleRerollKeepingName}
                    disabled={!character || busy}
                    className={`w-full rounded-md px-3 py-1.5 text-[11px] md:text-xs font-medium border
                      ${
                        !character || busy
                          ? "bg-amber-50/60 text-amber-900/35 border-amber-300/80 cursor-not-allowed"
                          : "bg-transparent border-amber-500/70 text-amber-900 hover:bg-amber-50/80"
                      }`}
                  >
                    Re-roll Stats &amp; Story (Keep Name)
                  </button>
                </div>

                <p className="text-[10px] md:text-xs text-amber-900/80 pt-1 border-t border-dotted border-amber-800/60 mt-1 pt-2 leading-snug">
                  First names are consumed from{" "}
                  <code className="px-1 rounded bg-amber-200/80 border border-amber-700/60 text-[10px]">
                    names-extra.txt
                  </code>{" "}
                  and never reused in this browser. Backstories, surnames, and
                  gear pull from{" "}
                  <code className="px-1 rounded bg-amber-200/80 border border-amber-700/60 text-[10px]">
                    /public/random
                  </code>{" "}
                  when available, with lore-friendly fallbacks.
                </p>
              </div>
            </div>
          </section>

          {/* Right: Character sheet */}
          <section className="bg-amber-50/80 border border-amber-800/60 rounded-2xl shadow-[0_10px_0_rgba(120,53,15,0.55)] px-4 py-4 md:px-6 md:py-5 relative overflow-hidden">
            {/* Faint &quot;old net&quot; grid overlay */}
            <div className="pointer-events-none absolute inset-3 border border-amber-800/20 rounded-xl" />
            {!character ? (
              <div className="h-full flex items-center justify-center text-center text-sm md:text-base text-stone-800/80 relative">
                Use the ritual scroll to the left to summon your first hero.
              </div>
            ) : (
              <div className="space-y-5 relative">
                {/* Identity */}
                <div className="border-b border-amber-900/50 pb-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2
                      className="text-2xl md:text-3xl font-bold text-amber-950 drop-shadow-sm"
                      style={{
                        fontFamily: '"Uncial Antiqua", system-ui, serif'
                      }}
                    >
                      {character.name}
                    </h2>
                    <span className="text-xs md:text-sm uppercase tracking-wide text-amber-900/90 text-right bg-amber-200/70 px-2 py-0.5 rounded border border-amber-800/70">
                      Level {character.level} {character.race}{" "}
                      {character.clazz}
                    </span>
                  </div>
                  <div className="mt-2 text-xs md:text-sm text-stone-900 flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      <span className="font-semibold text-amber-950">
                        Gender:
                      </span>{" "}
                      {character.gender}
                    </span>
                    <span>
                      <span className="font-semibold text-amber-950">
                        Alignment:
                      </span>{" "}
                      {character.alignment}
                    </span>
                    <span>
                      <span className="font-semibold text-amber-950">
                        Hometown:
                      </span>{" "}
                      {character.hometown}
                    </span>
                  </div>
                </div>

                {/* Stats & combat */}
                <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-4">
                  <div className="bg-amber-50/90 border border-amber-800/60 rounded-xl px-3 py-3 md:px-4 md:py-4 shadow-sm">
                    <h3
                      className="text-sm md:text-base font-semibold text-amber-950 mb-2 tracking-wide"
                      style={{
                        fontFamily: '"Uncial Antiqua", system-ui, serif'
                      }}
                    >
                      Ability Scores
                    </h3>
                    <div className="grid grid-cols-3 gap-2 text-xs md:text-sm">
                      {["STR", "DEX", "CON", "INT", "WIS", "CHA"].map((stat) => (
                        <div
                          key={stat}
                          className="bg-amber-100/90 rounded-lg px-2.5 py-2 flex flex-col items-center justify-center border border-amber-800/60 shadow-inner"
                        >
                          <span className="text-[11px] font-semibold text-amber-950 tracking-wide">
                            {stat}
                          </span>
                          <span className="text-sm md:text-base font-bold text-stone-900">
                            {character.abilities[stat]}
                          </span>
                          <span className="text-[10px] text-amber-900/80">
                            {formatMod(character.mods[stat])}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50/90 border border-amber-800/60 rounded-xl px-3 py-3 md:px-4 md:py-4 flex flex-col justify-between shadow-sm">
                    <div>
                      <h3
                        className="text-sm md:text-base font-semibold text-amber-950 mb-2 tracking-wide"
                        style={{
                          fontFamily: '"Uncial Antiqua", system-ui, serif'
                        }}
                      >
                        Combat Summary
                      </h3>
                      <div className="space-y-1 text-xs md:text-sm text-stone-900">
                        <p>
                          <span className="font-semibold text-amber-950">
                            Hit Points:
                          </span>{" "}
                          {character.hp}
                        </p>
                        <p>
                          <span className="font-semibold text-amber-950">
                            Proficiency Bonus:
                          </span>{" "}
                          {formatMod(character.proficiencyBonus)}
                        </p>
                        <p className="text-amber-900/80 text-[11px] md:text-xs mt-1 leading-snug">
                          HP and proficiency follow 5e-style rules:
                          max at 1st level, average per level thereafter,
                          plus Constitution modifier.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gear */}
                <div className="bg-amber-50/90 border border-amber-800/60 rounded-xl px-3 py-3 md:px-4 md:py-4 shadow-sm">
                  <h3
                    className="text-sm md:text-base font-semibold text-amber-950 mb-2 tracking-wide"
                    style={{ fontFamily: '"Uncial Antiqua", system-ui, serif' }}
                  >
                    Starting Gear
                  </h3>
                  <ul className="list-disc list-inside text-xs md:text-sm text-stone-900 space-y-0.5">
                    {character.gear.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Backstory */}
                <div className="bg-amber-50/90 border border-amber-800/60 rounded-xl px-3 py-3 md:px-4 md:py-4 shadow-sm">
                  <h3
                    className="text-sm md:text-base font-semibold text-amber-950 mb-2 tracking-wide"
                    style={{ fontFamily: '"Uncial Antiqua", system-ui, serif' }}
                  >
                    Backstory
                  </h3>
                  <p className="text-xs md:text-sm text-stone-900 leading-relaxed whitespace-pre-line">
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
