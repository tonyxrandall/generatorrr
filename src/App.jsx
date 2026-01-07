import React, { useEffect, useMemo, useState } from "react";
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

const NAV_LINKS = [
  { label: "Name Generator", href: "/name-generator" },
  { label: "Character Generator", href: "/character-generator" },
  { label: "Dice Roller", href: "/dice-roller" },
  { label: "NPC Generator", href: "/npc-generator" },
  { label: "DM Tools", href: "/dm-tools" }
];

const FAQ_ITEMS = [
  {
    question: "Can I lock a race or class and still generate new names?",
    answer:
      "Yes. Pick a race or class in the dropdowns and the generator will keep those settings when you roll again."
  },
  {
    question: "What does Generate x10 do?",
    answer:
      "It produces ten unique names at once so you can scan a batch and save favorites quickly."
  },
  {
    question: "Do you reuse names?",
    answer:
      "We avoid repeats by tracking used first names in local storage until you clear them."
  },
  {
    question: "How do saved names work?",
    answer:
      "Saved names stay in your session list so you can export them to text or CSV later."
  }
];

// ====== UTILITIES ======

const randItem = (arr) =>
  arr && arr.length > 0
    ? arr[Math.floor(Math.random() * arr.length)]
    : undefined;

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
  .trim();

const upsertMetaTag = (attr, value, content) => {
  let tag = document.querySelector(`meta[${attr}="${value}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, value);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const upsertLinkTag = (rel, href) => {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const upsertJsonLd = (id, data) => {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

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
  onCopy,
  onSaveToggle,
  onRerollSurname
}) => (
  <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-white/80 px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between">
    <div>
      <p className="text-base font-semibold text-amber-950">{entry.full}</p>
      <p className="text-xs text-amber-700">
        {entry.race} · {entry.clazz} · {entry.gender}
      </p>
    </div>
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onCopy(entry.full)}
        className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
      >
        <Copy className="h-3.5 w-3.5" />
        Copy
      </button>
      <button
        type="button"
        onClick={() => onRerollSurname(entry.id)}
        className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reroll surname
      </button>
      <button
        type="button"
        onClick={() => onSaveToggle(entry)}
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

const FAQSection = ({ items }) => (
  <section className="max-w-6xl mx-auto px-4 pb-16">
    <div className="rounded-2xl border border-amber-200 bg-white/80 px-6 py-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-amber-950 mb-6">
        Frequently asked questions
      </h2>
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
  const [selectedRegion, setSelectedRegion] = useState("Any Region");

  const [generatedNames, setGeneratedNames] = useState([]);
  const [savedNames, setSavedNames] = useState([]);
  const [openPicker, setOpenPicker] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [surnamePrefixes, setSurnamePrefixes] = useState([]);
  const [surnameSuffixes, setSurnameSuffixes] = useState([]);
  const [surnameNatural, setSurnameNatural] = useState([]);
  const [surnameElemental, setSurnameElemental] = useState([]);
  const [surnameNoble, setSurnameNoble] = useState([]);

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
        const [sPre, sSuf, sNat, sElem, sNob] = await Promise.all([
          loadTextLines("/random/surnames/prefixes.txt"),
          loadTextLines("/random/surnames/suffixes.txt"),
          loadTextLines("/random/surnames/natural.txt"),
          loadTextLines("/random/surnames/elemental.txt"),
          loadTextLines("/random/surnames/noble.txt")
        ]);

        setSurnamePrefixes(sPre);
        setSurnameSuffixes(sSuf);
        setSurnameNatural(sNat);
        setSurnameElemental(sElem);
        setSurnameNoble(sNob);
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
    const gender =
      selectedGender === "Any" ? randItem(GENDERS.slice(1)) : selectedGender;

    return { race, clazz, gender };
  };

  const createNameEntry = () => {
    const firstName = getUniqueFirstName();
    if (!firstName) return null;

    const { race, clazz, gender } = resolveOptions();
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

    return {
      id,
      firstName,
      surname,
      full: `${firstName} ${surname}`,
      race,
      clazz,
      gender,
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
    setGeneratedNames((prev) =>
      prev.map((entry) => {
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
        return {
          ...entry,
          surname,
          full: `${entry.firstName} ${surname}`
        };
      })
    );
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

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "D&D Name Generator",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    description:
      "Generate Dungeons & Dragons character names by class, race, and gender with instant copy and save tools.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
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

  useEffect(() => {
    document.title = "D&D Name Generator | Generatorrr";

    const description =
      "Generate Dungeons & Dragons character names by class, race, and gender. Save favorites, copy instantly, and export your list.";

    upsertMetaTag("name", "description", description);
    upsertMetaTag("property", "og:title", "D&D Name Generator");
    upsertMetaTag(
      "property",
      "og:description",
      "Pick a class, race, and gender, then generate D&D names instantly with save and export tools."
    );
    upsertMetaTag("property", "og:type", "website");
    upsertMetaTag("name", "twitter:card", "summary_large_image");

    if (canonicalUrl) {
      upsertLinkTag("canonical", canonicalUrl);
      upsertMetaTag("property", "og:url", canonicalUrl);
    }

    upsertJsonLd("jsonld-software", softwareJsonLd);
    upsertJsonLd("jsonld-faq", faqJsonLd);
  }, [canonicalUrl, softwareJsonLd, faqJsonLd]);

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-amber-100/70 to-amber-200 text-stone-900"
      style={{ fontFamily: '"Crimson Pro", system-ui, -apple-system, serif' }}
    >
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
                Name Generator
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold text-amber-950">
                Build a hero name in seconds.
              </h1>
              <p className="mt-2 text-sm text-amber-700 max-w-2xl">
                Pick a class or race, roll a batch of names, and keep the ones
                you love. Your selections update the URL for fast sharing and
                SEO-friendly browsing.
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
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
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
                      onCopy={handleCopy}
                      onSaveToggle={handleToggleSave}
                      onRerollSurname={handleRerollSurname}
                    />
                  ))
                )}
              </div>
            </section>

            <aside className="rounded-2xl border border-amber-200 bg-white/80 px-5 py-6 shadow-sm">
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
                          {entry.race} · {entry.clazz}
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
            </aside>
          </div>
        </section>

        <FAQSection items={FAQ_ITEMS} />
      </main>

      <Footer />
    </div>
  );
}
