import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ChevronDown,
  Copy,
  Download,
  Menu,
  RotateCcw,
  Sparkles,
  Star,
  Wand2,
  X
} from "lucide-react";

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

const GENDERS = ["Any", "Female", "Male", "Non-binary", "Other"];
const REGIONS = ["Any Region", "Forgotten Realms", "Eberron", "Ravenloft"];
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

const SPELLCASTING_ABILITY = {
  Artificer: "INT",
  Bard: "CHA",
  Cleric: "WIS",
  Druid: "WIS",
  Paladin: "CHA",
  Ranger: "WIS",
  Sorcerer: "CHA",
  Warlock: "CHA",
  Wizard: "INT"
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

const NAV_LINKS = [
  { label: "Name Generator", href: "/name-generator" },
  { label: "Character Generator", href: "/character-generator" },
  { label: "Dice Roller", href: "/dice-roller" },
  { label: "NPC Generator", href: "/npc-generator" },
  { label: "DM Tools", href: "/dm-tools" }
];

const FAQ_ITEMS = [
  {
    question: "How are ability scores generated?",
    answer:
      "Each ability score rolls 4d6 and drops the lowest die, then racial bonuses and ASI boosts are applied."
  },
  {
    question: "Which races get bonuses in this generator?",
    answer:
      "The generator applies the race bonuses coded for core race families like human, elf, dwarf, halfling, gnome, dragonborn, tiefling, and more."
  },
  {
    question: "When do ability score increases (ASI) apply?",
    answer:
      "ASI bonuses apply at levels 4, 8, 12, 16, and 19, boosting the primary class stat up to 20."
  },
  {
    question: "How are hit points calculated?",
    answer:
      "HP uses max hit die at level 1, then average per level afterward, plus the Constitution modifier."
  },
  {
    question: "How is proficiency bonus handled?",
    answer:
      "Proficiency bonus follows standard 5e scaling based on character level."
  },
  {
    question: "Does this follow 5e-style rules?",
    answer:
      "Yes, it follows 5e-style rules for ability rolls, modifiers, HP, proficiency, and derived stats."
  },
  {
    question: "Do I need to download anything?",
    answer:
      "No downloads required—everything runs in your browser."
  }
];

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

  for (let i = 0; i < numAsi; i += 1) {
    if (result[primary] < 20) {
      result[primary] += 2;
    } else {
      const otherKeys = Object.keys(result).filter((k) => k !== primary);
      const highestOther = otherKeys.reduce(
        (best, cur) => (result[cur] > result[best] ? cur : best),
        otherKeys[0]
      );
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

const speedFromRace = (race) => {
  if (!race) return 30;
  if (race.includes("Dwarf")) return 25;
  if (race.includes("Halfling")) return 25;
  if (race.includes("Gnome")) return 25;
  return 30;
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
  .trim();

const buildGeneratorPath = (race, clazz) => {
  const parts = ["/name-generator"];
  if (race && race !== "Any Race") {
    parts.push("race", slugify(race));
  }
  if (clazz && clazz !== "Any Class") {
    parts.push("class", slugify(clazz));
  }
  return parts.join("/");
};

const initialTag = (value) =>
  value
    .replace(/\(.*\)/g, "")
    .split(" ")
    .map((chunk) => chunk[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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

// ====== SURNAME BUILDER ======

const generateSurname = (ctx, surnamePools) => {
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

const generateGear = (clazz, gearPools) => {
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

  return Array.from(gearSet);
};

const getDerivedStats = (entry) => {
  if (!entry) return null;
  const initiative = entry.mods.DEX;
  const passivePerception = 10 + entry.mods.WIS;
  const speed = speedFromRace(entry.race);
  const spellAbility = SPELLCASTING_ABILITY[entry.clazz];
  const spellMod = spellAbility ? entry.mods[spellAbility] : null;
  const spellcasting =
    spellAbility && spellMod !== null
      ? {
          ability: spellAbility,
          saveDc: 8 + entry.proficiencyBonus + spellMod,
          attackBonus: entry.proficiencyBonus + spellMod
        }
      : null;

  return {
    hp: entry.hp,
    proficiencyBonus: entry.proficiencyBonus,
    initiative,
    passivePerception,
    speed,
    spellcasting
  };
};

const Logo = () => (
  <a
    href="/"
    className="flex items-center gap-2 text-amber-900 hover:text-amber-700 transition"
  >
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 border border-amber-300 shadow-sm">
      <Sparkles className="h-5 w-5" />
    </span>
    <div className="leading-tight">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
        DND
      </p>
      <p className="text-base font-semibold">Generatorrr</p>
    </div>
  </a>
);

const DesktopNav = ({ links }) => (
  <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-amber-900">
    {links.map((link) => (
      <a
        key={link.label}
        href={link.href}
        className="hover:text-amber-700 transition"
      >
        {link.label}
      </a>
    ))}
  </nav>
);

const MobileNavDrawer = ({ isOpen, links, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        aria-label="Close navigation"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative z-10 h-full w-72 max-w-[85%] bg-amber-50 shadow-xl border-r border-amber-200 flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b border-amber-200">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-amber-800 hover:bg-amber-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-4 text-base text-amber-900">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="block font-medium hover:text-amber-700"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

const PickerDropdown = ({
  label,
  items,
  selectedItem,
  isOpen,
  onToggle,
  onSelect
}) => (
  <div className="relative">
    <button
      type="button"
      onClick={onToggle}
      className="w-full md:w-64 inline-flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 shadow-sm hover:bg-amber-100"
    >
      <span>
        <span className="text-xs uppercase tracking-[0.2em] text-amber-600">
          {label}
        </span>
        <span className="block text-base font-semibold">{selectedItem}</span>
      </span>
      <ChevronDown
        className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    {isOpen && (
      <div className="fixed inset-0 z-40 md:absolute md:inset-auto md:top-full md:left-0 md:z-30">
        <button
          type="button"
          aria-label={`Close ${label} picker`}
          className="absolute inset-0 bg-black/40 md:bg-transparent"
          onClick={onToggle}
        />
        <div className="relative z-10 h-full w-full bg-amber-50 md:h-auto md:w-72 md:mt-3 md:rounded-2xl md:border md:border-amber-200 md:shadow-xl">
          <div className="flex items-center justify-between border-b border-amber-200 px-4 py-3 md:hidden">
            <span className="text-sm font-semibold text-amber-900">
              Choose {label}
            </span>
            <button
              type="button"
              onClick={onToggle}
              className="rounded-full p-2 text-amber-800 hover:bg-amber-100"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto px-4 py-4 md:max-h-80">
            <div className="space-y-2">
              {items.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onSelect(item)}
                  className="w-full rounded-xl border border-transparent px-3 py-2 text-left hover:border-amber-200 hover:bg-amber-100/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center text-xs font-bold">
                      {initialTag(item)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-amber-900">
                        {item}
                      </div>
                      <div className="text-xs text-amber-700">
                        {item === selectedItem
                          ? "Currently selected"
                          : "View themed name sets"}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

const NameRow = ({
  entry,
  isSaved,
  isActive,
  onSelect,
  onCopy,
  onSaveToggle,
  onRerollSurname
}) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onSelect(entry.id)}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect(entry.id);
      }
    }}
    className={`w-full text-left rounded-xl border px-4 py-3 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-amber-300 md:flex md:items-center md:justify-between md:gap-4 ${
      isActive
        ? "border-amber-400 bg-amber-100/70"
        : "border-amber-200 bg-white/80 hover:border-amber-300"
    }`}
  >
    <div>
      <p className="text-base font-semibold text-amber-950">{entry.full}</p>
      <p className="text-xs text-amber-700">
        Level {entry.level} · {entry.race} · {entry.clazz} · {entry.gender}
      </p>
    </div>
    <div className="mt-3 flex flex-wrap gap-2 md:mt-0">
      <button
        type="button"
        aria-label={`Copy ${entry.full}`}
        onClick={(event) => {
          event.stopPropagation();
          onCopy(entry.full);
        }}
        className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
      >
        <Copy className="h-3.5 w-3.5" />
        Copy
      </button>
      <button
        type="button"
        aria-label={`Reroll surname for ${entry.full}`}
        onClick={(event) => {
          event.stopPropagation();
          onRerollSurname(entry.id);
        }}
        className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reroll surname
      </button>
      <button
        type="button"
        aria-label={
          isSaved ? `Remove ${entry.full} from saved` : `Save ${entry.full}`
        }
        onClick={(event) => {
          event.stopPropagation();
          onSaveToggle(entry);
        }}
        className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
          isSaved
            ? "border-amber-500 bg-amber-200 text-amber-900"
            : "border-amber-200 text-amber-900 hover:bg-amber-100"
        }`}
      >
        <Star className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} />
        {isSaved ? "Saved" : "Save"}
      </button>
    </div>
  </div>
);

const CharacterSheet = ({
  entry,
  derivedStats,
  onCopyText,
  onCopyJson,
  onDownloadText,
  copiedState
}) => {
  if (!entry) {
    return (
      <div className="rounded-2xl border border-dashed border-amber-200 bg-white/70 px-4 py-8 text-center text-sm text-amber-700">
        Choose options and click Generate to create a character sheet.
      </div>
    );
  }

  const resolvedDerived = derivedStats || getDerivedStats(entry);
  const modifiers = Object.entries(entry.mods).map(([stat, mod]) => ({
    stat,
    mod: formatMod(mod)
  }));

  const spellBlock = resolvedDerived.spellcasting
    ? [
        {
          label: `Spell Save DC (${resolvedDerived.spellcasting.ability})`,
          value: resolvedDerived.spellcasting.saveDc
        },
        {
          label: `Spell Attack Bonus (${resolvedDerived.spellcasting.ability})`,
          value: formatMod(resolvedDerived.spellcasting.attackBonus)
        }
      ]
    : [];

  return (
    <div className="rounded-2xl border border-amber-200 bg-white/80 px-5 py-6 shadow-sm">
      <div className="border-b border-amber-200 pb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl font-semibold text-amber-950">
            {entry.full}
          </h2>
          <span className="text-xs uppercase tracking-wide text-amber-900/90 bg-amber-200/70 px-2 py-1 rounded border border-amber-300">
            Level {entry.level} {entry.race} {entry.clazz}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            aria-label="Copy character as text"
            onClick={() => onCopyText(entry)}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
          >
            <Copy className="h-3.5 w-3.5" />
            {copiedState === "text" ? "Copied!" : "Copy as Text"}
          </button>
          <button
            type="button"
            aria-label="Copy character as JSON"
            onClick={() => onCopyJson(entry)}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
          >
            <Copy className="h-3.5 w-3.5" />
            {copiedState === "json" ? "Copied!" : "Copy as JSON"}
          </button>
          <button
            type="button"
            aria-label="Download character as text"
            onClick={() => onDownloadText(entry)}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
          >
            <Download className="h-3.5 w-3.5" />
            Download .txt
          </button>
        </div>
        <div className="mt-2 text-xs text-amber-700 flex flex-wrap gap-x-4 gap-y-1">
          <span>
            <span className="font-semibold text-amber-950">Gender:</span>{" "}
            {entry.gender}
          </span>
          <span>
            <span className="font-semibold text-amber-950">Alignment:</span>{" "}
            {entry.alignment}
          </span>
          <span>
            <span className="font-semibold text-amber-950">Region:</span>{" "}
            {entry.region}
          </span>
          <span>
            <span className="font-semibold text-amber-950">Hometown:</span>{" "}
            {entry.hometown}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-amber-900">
        {modifiers.map((item) => (
          <span
            key={item.stat}
            className="rounded-full border border-amber-200 bg-amber-50/80 px-2 py-1"
          >
            {item.stat} {item.mod}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl px-3 py-3 shadow-sm">
          <h3 className="text-sm font-semibold text-amber-950 mb-2 tracking-wide">
            Ability Scores
          </h3>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {Object.entries(entry.abilities).map(([stat, value]) => (
              <div
                key={stat}
                className="bg-amber-100/90 rounded-lg px-2 py-2 flex flex-col items-center justify-center border border-amber-200 shadow-inner"
              >
                <span className="text-[11px] font-semibold text-amber-950 tracking-wide">
                  {stat}
                </span>
                <span className="text-sm font-bold text-stone-900">
                  {value}
                </span>
                <span className="text-[10px] text-amber-900/80">
                  {formatMod(entry.mods[stat])}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50/90 border border-amber-200 rounded-xl px-3 py-3 shadow-sm">
          <h3 className="text-sm font-semibold text-amber-950 mb-2 tracking-wide">
            Derived Stats
          </h3>
          <div className="space-y-1 text-xs text-stone-900">
            <p>
              <span className="font-semibold text-amber-950">Hit Points:</span>{" "}
              {resolvedDerived.hp}
            </p>
            <p>
              <span className="font-semibold text-amber-950">
                Proficiency Bonus:
              </span>{" "}
              {formatMod(resolvedDerived.proficiencyBonus)}
            </p>
            <p>
              <span className="font-semibold text-amber-950">Initiative:</span>{" "}
              {formatMod(resolvedDerived.initiative)}
            </p>
            <p>
              <span className="font-semibold text-amber-950">
                Passive Perception:
              </span>{" "}
              {resolvedDerived.passivePerception}
            </p>
            <p>
              <span className="font-semibold text-amber-950">Speed:</span>{" "}
              {resolvedDerived.speed} ft.
            </p>
            {spellBlock.map((item) => (
              <p key={item.label}>
                <span className="font-semibold text-amber-950">
                  {item.label}:
                </span>{" "}
                {item.value}
              </p>
            ))}
            <p className="text-amber-900/80 text-[11px] mt-1 leading-snug">
              HP uses max at level 1 and average per level thereafter, plus
              Constitution modifier.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-amber-50/90 border border-amber-200 rounded-xl px-3 py-3 shadow-sm">
        <h3 className="text-sm font-semibold text-amber-950 mb-2 tracking-wide">
          Starting Gear
        </h3>
        <ul className="list-disc list-inside text-xs text-stone-900 space-y-1">
          {entry.gear.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const FAQSection = ({ items }) => (
  <section className="max-w-6xl mx-auto px-4 pb-16">
    <div className="rounded-2xl border border-amber-200 bg-white/80 px-6 py-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-amber-950 mb-6">FAQ</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.question} className="space-y-2">
            <h3 className="text-sm font-semibold text-amber-900">
              {item.question}
            </h3>
            <p className="text-sm text-amber-700 leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SEOContentSection = () => (
  <section className="max-w-6xl mx-auto px-4 pb-16">
    <div className="rounded-2xl border border-amber-200 bg-white/80 px-6 py-8 shadow-sm space-y-8 text-sm text-amber-700 leading-relaxed">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-amber-950">
          What this D&amp;D character generator creates
        </h2>
        <p>
          This generator builds full 5e-style character sheets with names,
          races, classes, levels, and ability scores so you can jump straight
          into play prep. It includes modifiers, hit points, proficiency bonus,
          initiative, passive perception, and a simple speed value based on race
          family.
        </p>
        <p>
          You can lock in race, class, gender, and level, then roll again to
          see new characters while keeping those choices. Each result also
          comes with randomized starting gear so you have a ready-to-use
          adventurer kit.
        </p>
        <p>
          Export tools let you copy or download the same stats shown on screen,
          including ability scores, modifiers, HP, proficiency bonus, and gear,
          so your generated characters are easy to reuse in your prep notes.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-amber-950">
          How stats are generated
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Each ability score rolls 4d6 and drops the lowest die.</li>
          <li>Racial bonuses are applied using the generator&apos;s rules.</li>
          <li>ASI boosts apply at levels 4, 8, 12, 16, and 19.</li>
          <li>Ability scores cap at 20 after bonuses and ASIs.</li>
        </ul>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-amber-950">
          How HP and proficiency work
        </h2>
        <p>
          Hit points use max hit die at level 1, then average per level
          afterward, plus the Constitution modifier. Proficiency bonus follows
          standard 5e scaling by level. Derived stats use initiative from the
          DEX modifier, passive perception as 10 + WIS modifier, and a basic
          speed map (25 for dwarf/halfling/gnome families, otherwise 30).
        </p>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-amber-200 bg-amber-50/80">
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-amber-700">
        © 2024 Generatorrr. Roll responsibly.
      </div>
      <div className="flex flex-wrap gap-4 text-sm font-medium text-amber-900">
        <a href="/about" className="hover:text-amber-700">
          About
        </a>
        <a href="/resources" className="hover:text-amber-700">
          Resources
        </a>
        <a href="/sitemap.xml" className="hover:text-amber-700">
          Sitemap
        </a>
        <a href="/privacy" className="hover:text-amber-700">
          Privacy
        </a>
      </div>
    </div>
  </footer>
);

// ====== MAIN APP COMPONENT ======

export default function App() {
  const [namesPool, setNamesPool] = useState([]);
  const [loadingNames, setLoadingNames] = useState(true);
  const [loadingRandomData, setLoadingRandomData] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // User options
  const [selectedGender, setSelectedGender] = useState("Any");
  const [selectedRace, setSelectedRace] = useState("Any Race");
  const [selectedClass, setSelectedClass] = useState("Any Class");
  const [selectedLevel, setSelectedLevel] = useState("Random");
  const [selectedRegion, setSelectedRegion] = useState("Any Region");

  const [generatedNames, setGeneratedNames] = useState([]);
  const [savedNames, setSavedNames] = useState([]);
  const [activeEntryId, setActiveEntryId] = useState(null);
  const [openPicker, setOpenPicker] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [copiedState, setCopiedState] = useState(null);

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

  const anyLoading = loadingNames || loadingRandomData;

  const raceSlugMap = useMemo(
    () => new Map(RACES.map((race) => [slugify(race), race])),
    []
  );
  const classSlugMap = useMemo(
    () => new Map(CLASSES.map((clazz) => [slugify(clazz), clazz])),
    []
  );

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setIsMobileNavOpen(false);
        setOpenPicker(null);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const segments = window.location.pathname.split("/").filter(Boolean);
    const raceIndex = segments.indexOf("race");
    const classIndex = segments.indexOf("class");

    if (raceIndex !== -1 && segments[raceIndex + 1]) {
      const race = raceSlugMap.get(segments[raceIndex + 1]);
      if (race) setSelectedRace(race);
    }

    if (classIndex !== -1 && segments[classIndex + 1]) {
      const clazz = classSlugMap.get(segments[classIndex + 1]);
      if (clazz) setSelectedClass(clazz);
    }
  }, [raceSlugMap, classSlugMap]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const nextPath = buildGeneratorPath(selectedRace, selectedClass);
    if (window.location.pathname !== nextPath) {
      window.history.replaceState({}, "", nextPath);
    }
  }, [selectedRace, selectedClass]);

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
      selectedClass === "Any Class"
        ? randItem(CLASSES.slice(1))
        : selectedClass;
    const level =
      selectedLevel === "Random"
        ? Math.floor(Math.random() * 20) + 1
        : parseInt(selectedLevel, 10);
    const gender =
      selectedGender === "Any" ? randItem(GENDERS.slice(1)) : selectedGender;

    return { race, clazz, level, gender };
  };

  const createNameEntry = () => {
    const firstName = getUniqueFirstName();
    if (!firstName) return null;

    const { race, clazz, level, gender } = resolveOptions();
    const alignment = randItem(ALIGNMENTS);
    const hometown = randomHometown();
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

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const fullName = `${firstName} ${surname}`;
    const baseAbilities = generateBaseAbilities();
    const racialAbilities = applyRacialBonuses(baseAbilities, race);
    const finalAbilities = applyASI(racialAbilities, clazz, level);
    const mods = Object.fromEntries(
      Object.entries(finalAbilities).map(([k, v]) => [k, abilityMod(v)])
    );
    const hp = calculateHP(clazz, level, mods.CON);
    const proficiencyBonus = getProficiencyBonus(level);
    const gear = generateGear(clazz, {
      martial: gearMartial,
      caster: gearCaster,
      stealth: gearStealth,
      divine: gearDivine,
      nature: gearNature,
      trinkets: gearTrinkets
    });

    return {
      id,
      firstName,
      surname,
      full: fullName,
      race,
      clazz,
      level,
      gender,
      alignment,
      abilities: finalAbilities,
      mods,
      hp,
      proficiencyBonus,
      gear,
      hometown,
      region: selectedRegion
    };
  };

  const handleGenerate = (count) => {
    setError("");
    setBusy(true);

    setTimeout(() => {
      const next = [];
      for (let i = 0; i < count; i += 1) {
        const entry = createNameEntry();
        if (!entry) break;
        next.push(entry);
      }
      if (next.length) {
        setGeneratedNames(next);
        setActiveEntryId(next[0].id);
      }
      setBusy(false);
    }, 200);
  };

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (copyError) {
      console.warn("Clipboard copy failed", copyError);
    }
  };

  const handleToggleSave = (entry) => {
    setSavedNames((prev) => {
      const exists = prev.some((item) => item.id === entry.id);
      if (exists) {
        return prev.filter((item) => item.id !== entry.id);
      }
      return [...prev, entry];
    });
  };

  const handleRerollSurname = (entryId) => {
    setGeneratedNames((prev) => {
      let updatedEntry = null;
      const next = prev.map((entry) => {
        if (entry.id !== entryId) return entry;
        const surname = generateSurname(
          { race: entry.race, clazz: entry.clazz, hometown: entry.hometown },
          {
            surnamePrefixes,
            surnameSuffixes,
            surnameNatural,
            surnameElemental,
            surnameNoble
          }
        );
        updatedEntry = {
          ...entry,
          surname,
          full: `${entry.firstName} ${surname}`
        };
        return updatedEntry;
      });

      if (updatedEntry) {
        setSavedNames((saved) =>
          saved.map((entry) =>
            entry.id === updatedEntry.id ? updatedEntry : entry
          )
        );
      }

      return next;
    });
  };

  const getExportData = (entry) => {
    const derived = getDerivedStats(entry);
    return {
      name: entry.full,
      level: entry.level,
      race: entry.race,
      class: entry.clazz,
      gender: entry.gender,
      alignment: entry.alignment,
      region: entry.region,
      hometown: entry.hometown,
      abilities: entry.abilities,
      modifiers: entry.mods,
      hp: derived.hp,
      proficiencyBonus: derived.proficiencyBonus,
      initiative: derived.initiative,
      passivePerception: derived.passivePerception,
      speed: derived.speed,
      spellcasting: derived.spellcasting,
      gear: entry.gear
    };
  };

  const buildTextExport = (entry) => {
    const derived = getDerivedStats(entry);
    const spellBlock = derived.spellcasting
      ? [
          `Spell Save DC (${derived.spellcasting.ability}): ${derived.spellcasting.saveDc}`,
          `Spell Attack Bonus (${derived.spellcasting.ability}): ${formatMod(
            derived.spellcasting.attackBonus
          )}`
        ]
      : [];

    return [
      `${entry.full}`,
      `Level ${entry.level} ${entry.race} ${entry.clazz}`,
      `Gender: ${entry.gender}`,
      `Alignment: ${entry.alignment}`,
      `Region: ${entry.region}`,
      `Hometown: ${entry.hometown}`,
      "",
      "Ability Scores",
      ...Object.entries(entry.abilities).map(
        ([stat, value]) => `${stat}: ${value} (${formatMod(entry.mods[stat])})`
      ),
      "",
      "Derived Stats",
      `HP: ${derived.hp}`,
      `Proficiency Bonus: ${formatMod(derived.proficiencyBonus)}`,
      `Initiative: ${formatMod(derived.initiative)}`,
      `Passive Perception: ${derived.passivePerception}`,
      `Speed: ${derived.speed} ft.`,
      ...spellBlock,
      "",
      "Starting Gear",
      ...entry.gear.map((item) => `- ${item}`)
    ].join("\n");
  };

  const handleCopyExport = async (entry, type) => {
    try {
      const payload =
        type === "json"
          ? JSON.stringify(getExportData(entry), null, 2)
          : buildTextExport(entry);
      await navigator.clipboard.writeText(payload);
      setCopiedState(type);
      setTimeout(() => setCopiedState(null), 2000);
    } catch (copyError) {
      console.warn("Clipboard copy failed", copyError);
    }
  };

  const handleDownloadText = (entry) => {
    const content = buildTextExport(entry);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(entry.full) || "character"}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = (format) => {
    if (!savedNames.length) return;
    const rows = savedNames.map((entry) => entry.full);
    const content =
      format === "csv"
        ? `Name\n${rows.map((name) => `"${name}"`).join("\n")}`
        : rows.join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      format === "csv" ? "saved-names.csv" : "saved-names.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const canonicalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : "";

  const activeEntry = generatedNames.find((entry) => entry.id === activeEntryId);
  const derivedStats = activeEntry ? getDerivedStats(activeEntry) : null;
  const abilitySummary = activeEntry
    ? Object.entries(activeEntry.abilities)
        .map(
          ([stat, value]) =>
            `${stat} ${value} (${formatMod(activeEntry.mods[stat])})`
        )
        .join(", ")
    : "";

  const baseDescription =
    "Generate D&D 5e characters with names, race, class, level, ability scores (4d6 drop lowest), racial bonuses, ASI at 4/8/12/16/19, modifiers, HP (max at level 1 + average per level + CON mod), proficiency bonus (standard 5e scaling), initiative (DEX), passive perception (10 + WIS), basic speed mapping, and starting gear.";

  const seoDescription = activeEntry
    ? `${activeEntry.full} — Level ${activeEntry.level} ${activeEntry.race} ${activeEntry.clazz}. Ability scores: ${abilitySummary}. HP ${derivedStats.hp}, proficiency ${formatMod(derivedStats.proficiencyBonus)}. Stats use 4d6 drop lowest, racial bonuses, ASI at 4/8/12/16/19, HP max at level 1 + average per level + CON mod, proficiency 5e scaling, initiative = DEX mod, passive perception = 10 + WIS, and basic speed mapping.`
    : baseDescription;

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "D&D Character Generator",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    description: baseDescription,
    url: canonicalUrl
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "D&D Character Generator (5e) – Stats, Gear, Level, Race & Class",
    description: baseDescription,
    url: canonicalUrl
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-amber-100/70 to-amber-200 text-stone-900"
      style={{ fontFamily: '"Crimson Pro", system-ui, -apple-system, serif' }}
    >
      <Helmet>
        <title>
          D&amp;D Character Generator (5e) – Stats, Gear, Level, Race &amp;
          Class
        </title>
        <meta name="description" content={seoDescription} />
        <meta name="robots" content="index,follow" />
        {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
        <meta
          property="og:title"
          content="D&D Character Generator (5e) – Stats, Gear, Level, Race & Class"
        />
        <meta property="og:description" content={seoDescription} />
        {canonicalUrl ? (
          <meta property="og:url" content={canonicalUrl} />
        ) : null}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Generatorrr" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="D&D Character Generator (5e) – Stats, Gear, Level, Race & Class"
        />
        <meta name="twitter:description" content={seoDescription} />
        <script type="application/ld+json">
          {JSON.stringify(softwareJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(webPageJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqJsonLd)}
        </script>
      </Helmet>
      <header className="sticky top-0 z-40 border-b border-amber-200 bg-amber-50/95 backdrop-blur shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Logo />
          <DesktopNav links={NAV_LINKS} />
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(true)}
            className="lg:hidden rounded-lg border border-amber-200 p-2 text-amber-900 hover:bg-amber-100"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        links={NAV_LINKS}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-amber-600">
                Character Generator
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold text-amber-950">
                Build a D&amp;D character in seconds.
              </h1>
              <p className="mt-2 text-sm text-amber-700 max-w-2xl">
                Roll full 5e-style characters with names, race, class, level,
                ability scores, modifiers, HP, proficiency, initiative, and
                starting gear. Stats use 4d6 drop lowest, apply racial bonuses,
                and ASI boosts at levels 4, 8, 12, 16, and 19.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-amber-700">
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-white/70 px-3 py-1">
                <Wand2 className="h-3.5 w-3.5" />
                {generatedNames.length || 0} results
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-white/70 px-3 py-1">
                <Star className="h-3.5 w-3.5" />
                {savedNames.length} saved
              </span>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-5 shadow-sm">
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
                <PickerDropdown
                  label="Classes"
                  items={CLASSES}
                  selectedItem={selectedClass}
                  isOpen={openPicker === "class"}
                  onToggle={() =>
                    setOpenPicker((prev) => (prev === "class" ? null : "class"))
                  }
                  onSelect={(value) => {
                    setSelectedClass(value);
                    setOpenPicker(null);
                  }}
                />
                <PickerDropdown
                  label="Races"
                  items={RACES}
                  selectedItem={selectedRace}
                  isOpen={openPicker === "race"}
                  onToggle={() =>
                    setOpenPicker((prev) => (prev === "race" ? null : "race"))
                  }
                  onSelect={(value) => {
                    setSelectedRace(value);
                    setOpenPicker(null);
                  }}
                />
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-amber-600">
                    Gender
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {GENDERS.map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setSelectedGender(gender)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                          selectedGender === gender
                            ? "border-amber-500 bg-amber-200 text-amber-900"
                            : "border-amber-200 bg-white/70 text-amber-700 hover:bg-amber-100"
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-amber-600">
                    Level
                  </span>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="rounded-xl border border-amber-200 bg-white/80 px-3 py-2 text-xs font-semibold text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  >
                    <option value="Random">Random (1–20)</option>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-amber-600">
                    Region
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {REGIONS.map((region) => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => setSelectedRegion(region)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                          selectedRegion === region
                            ? "border-amber-500 bg-amber-200 text-amber-900"
                            : "border-amber-200 bg-white/70 text-amber-700 hover:bg-amber-100"
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleGenerate(1)}
                  disabled={anyLoading || busy}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border border-amber-800 px-4 py-2 text-sm font-semibold transition ${
                    anyLoading || busy
                      ? "bg-amber-200 text-amber-600"
                      : "bg-amber-800 text-amber-50 hover:bg-amber-700"
                  }`}
                >
                  {anyLoading ? "Loading..." : busy ? "Generating..." : "Generate"}
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerate(10)}
                  disabled={anyLoading || busy}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold transition ${
                    anyLoading || busy
                      ? "bg-amber-100 text-amber-500"
                      : "bg-white/80 text-amber-900 hover:bg-amber-100"
                  }`}
                >
                  Generate x10
                </button>
                <p className="text-[11px] text-amber-700">
                  Stats roll 4d6 drop lowest. Gear is randomized each time you
                  generate.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-2xl border border-amber-200 bg-white/80 px-5 py-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-amber-950">
                  Generated names
                </h2>
                <span className="text-xs text-amber-600">
                  {generatedNames.length} results
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {generatedNames.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-amber-200 px-4 py-10 text-center text-sm text-amber-700">
                    Pick a class and race, then hit Generate to see names here.
                  </div>
                ) : (
                  generatedNames.map((entry) => (
                    <NameRow
                      key={entry.id}
                      entry={entry}
                      isSaved={savedNames.some((item) => item.id === entry.id)}
                      isActive={entry.id === activeEntryId}
                      onSelect={setActiveEntryId}
                      onCopy={handleCopy}
                      onSaveToggle={handleToggleSave}
                      onRerollSurname={handleRerollSurname}
                    />
                  ))
                )}
              </div>
            </section>

            <aside className="space-y-6">
              <CharacterSheet
                entry={activeEntry}
                derivedStats={derivedStats}
                copiedState={copiedState}
                onCopyText={(entry) => handleCopyExport(entry, "text")}
                onCopyJson={(entry) => handleCopyExport(entry, "json")}
                onDownloadText={handleDownloadText}
              />

              <div className="rounded-2xl border border-amber-200 bg-white/80 px-5 py-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-amber-950">
                    Saved names
                  </h2>
                  <span className="text-xs text-amber-600">
                    {savedNames.length} saved
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {savedNames.length === 0 ? (
                    <p className="text-sm text-amber-700">
                      Save a name to collect your favorites here.
                    </p>
                  ) : (
                    savedNames.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-semibold text-amber-900">
                            {entry.full}
                          </p>
                          <p className="text-[11px] text-amber-600">
                            Level {entry.level} · {entry.race} · {entry.clazz}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleSave(entry)}
                          className="text-xs text-amber-700 hover:text-amber-900"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleExport("txt")}
                    disabled={!savedNames.length}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-40"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export TXT
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("csv")}
                    disabled={!savedNames.length}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-40"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export CSV
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <SEOContentSection />
        <FAQSection items={FAQ_ITEMS} />
      </main>

      <Footer />
    </div>
  );
}
