// Ordered playlist; runtimes and equipment verified from official video sources. See PILATES_SOURCES.md.
const PILATES = [
  {
    "id": "jjivU64G0ts",
    "title": "25 DAY PILATES CHALLENGE | DAY 1 | 30 MIN FULL BODY PILATES X STRENGTH | At Home Pilates",
    "durationSeconds": 2058,
    "focus": "Full Body",
    "equipment": "Weights",
    "equipmentSource": "Description states weights are used."
  },
  {
    "id": "PkoB1jwvOFg",
    "title": "25 DAY PILATES CHALLENGE | DAY 2 | BOOTY AND AB BURN WITH YOGA BLOCK | At Home Pilates Workout",
    "durationSeconds": 1629,
    "focus": "Booty & Ab Burn",
    "equipment": "Yoga Block",
    "equipmentSource": "Title specifies a yoga block."
  },
  {
    "id": "8IvcpXUUifE",
    "title": "25 DAY PILATES CHALLENGE | DAY 3 | Full Body Sweat and Sculpt with Weights | HIIT x Pilates",
    "durationSeconds": 1683,
    "focus": "Full Body Sweat & Sculpt",
    "equipment": "Weights",
    "equipmentSource": "Title specifies weights."
  },
  {
    "id": "hpy6RhbT_nM",
    "title": "25 DAY PILATES CHALLENGE | DAY 4 | GLUE AND CORE WORKOUT WITH PILATES BALL | At Home Pilates Workout",
    "durationSeconds": 1637,
    "focus": "Glutes & Core",
    "equipment": "Pilates Ball",
    "equipmentSource": "Title and description specify a Pilates ball."
  },
  {
    "id": "5ZpQibgtpJs",
    "title": "25 DAY PILATES CHALLENGE | DAY 5 | WEIGHTED UPPER BODY WORKOUT | Strength x Pilates Workout",
    "durationSeconds": 1420,
    "focus": "Upper Body",
    "equipment": "Weights",
    "equipmentSource": "Description specifies hand weights."
  },
  {
    "id": "xqDLgJfkdWE",
    "title": "25 DAY PILATES CHALLENGE | DAY 6 | 30 MIN FULL BODY STRENGTH X PILATES | Weights and Ball",
    "durationSeconds": 1956,
    "focus": "Full Body",
    "equipment": "Weights + Pilates Ball",
    "equipmentSource": "Title specifies weights and a ball."
  },
  {
    "id": "TV1yswlJnIY",
    "title": "25 DAY PILATES CHALLENGE | DAY 7 | 20 MINUTE AB BURN | No Equipment Core Workout | Abs and Waist",
    "durationSeconds": 1426,
    "focus": "Ab Burn",
    "equipment": "No Equipment",
    "equipmentSource": "Title explicitly says no equipment."
  },
  {
    "id": "GR-iIB0Pbk8",
    "title": "25 DAY PILATES CHALLENGE | DAY 8 | 30 MIN FULL BODY HIIT WORKOUT | Pilates x HIIT | No Equipment",
    "durationSeconds": 2037,
    "focus": "Full Body HIIT",
    "equipment": "No Equipment",
    "equipmentSource": "Title explicitly says no equipment."
  },
  {
    "id": "qwmCd2pDb-o",
    "title": "25 DAY PILATES CHALLENGE DAY 9 | INNER THIGH AND LEG WORKOUT | Lower Body Workout with Pilates Ball",
    "durationSeconds": 1527,
    "focus": "Inner Thighs & Legs",
    "equipment": "Pilates Ball",
    "equipmentSource": "Title and description specify a Pilates ball."
  },
  {
    "id": "WAD3scF2zKQ",
    "title": "25 DAY PILATES CHALLENGE | DAY 10 | 35 MIN FULL BODY POWER PILATES | Weights and Resistance Band",
    "durationSeconds": 2208,
    "focus": "Full Body Power",
    "equipment": "Weights + Booty Band",
    "equipmentSource": "Title specifies weights and resistance band; description identifies a booty band."
  },
  {
    "id": "2J9rjorHt_A",
    "title": "25 DAY PILATES CHALLENGE | DAY 11 | FULL BODY WEIGHTED PILATES X STRENGTH | Full Body Workout",
    "durationSeconds": 2154,
    "focus": "Full Body Strength",
    "equipment": "Single Dumbbell",
    "equipmentSource": "Description specifies a single dumbbell."
  },
  {
    "id": "mAWAlTK9S0c",
    "title": "25 DAY PILATES CHALLENGE | DAY 12 | WEIGHTED UPPER BODY WORKOUT | Pilates x Strength | Back and Arms",
    "durationSeconds": 1768,
    "focus": "Upper Body",
    "equipment": "Weights",
    "equipmentSource": "Description specifies dumbbells."
  },
  {
    "id": "Zu89RO6XlUI",
    "title": "25 DAY PILATES CHALLENGE | DAY 13 | 35 MIN LOWER BODY WORKOUT | Lower Body Sculpt with Yoga Block",
    "durationSeconds": 2254,
    "focus": "Lower Body",
    "equipment": "Yoga Block",
    "equipmentSource": "Title and description specify a yoga block."
  },
  {
    "id": "QtuJ27nfTp0",
    "title": "25 DAY PILATES CHALLENGE | DAY 14 | 35 MIN FULL BODY POWER PILATES WITH WEIGHTS | Full Body Workout",
    "durationSeconds": 2158,
    "focus": "Full Body Power",
    "equipment": "Weights",
    "equipmentSource": "Title and description specify hand weights."
  },
  {
    "id": "m0xuxJJAZcU",
    "title": "25 DAY PILATES CHALLENGE | DAY 15 | 35 MIN FULL BODY PILATES FLOW | Revitalising Pilates Flow",
    "durationSeconds": 2096,
    "focus": "Full Body Flow",
    "equipment": "No Equipment",
    "equipmentSource": "Spoken introduction at 0:35 says no equipment is required."
  },
  {
    "id": "3EXTdYjyty0",
    "title": "25 DAY PILATES CHALLENGE | DAY 16 | FULL BODY SWEAT AND SCULPT | hiit x pilates full body workout",
    "durationSeconds": 2207,
    "focus": "Full Body Sweat & Sculpt",
    "equipment": "Weights",
    "equipmentSource": "Description specifies added weights."
  },
  {
    "id": "MPS3DwNUgj0",
    "title": "25 DAY PILATES CHALLENGE | DAY 17 | 25 MIN GLUTE WORKOUT WITH BAND | Banded Workout",
    "durationSeconds": 1458,
    "focus": "Glutes",
    "equipment": "Booty Band",
    "equipmentSource": "Description identifies a booty band."
  },
  {
    "id": "gC9EjDjN8i4",
    "title": "25 DAY PILATES CHALLENGE | DAY 18 | 30 MIN FULL BODY PILATES X STRENGTH WORKOUT | Weighted Workout",
    "durationSeconds": 1961,
    "focus": "Full Body Strength",
    "equipment": "Weights",
    "equipmentSource": "Title and description specify weights."
  },
  {
    "id": "7Fh-ueO9mrI",
    "title": "25 DAY PILATES CHALLENGE | DAY 19 | 30 MIN WEIGHTED CORE AND UPPER BODY | Abs and Arms Workout",
    "durationSeconds": 1764,
    "focus": "Core & Upper Body",
    "equipment": "Weights",
    "equipmentSource": "Title and description specify weighted core and upper-body work."
  },
  {
    "id": "zXpgbWdFz1s",
    "title": "25 DAY PILATES CHALLENGE | DAY 20 | 25 MIN FULL BODY STRENGTH X PILATES WORKOUT | No Standing",
    "durationSeconds": 1589,
    "focus": "Full Body",
    "equipment": "Weights",
    "equipmentSource": "Spoken introduction at 0:26\u20130:37 specifies weights; at 1:45\u20131:48 specifies one in each hand."
  },
  {
    "id": "liXbrJ03bI8",
    "title": "25 DAY PILATES CHALLENGE | DAY 21 | 20 MIN UPPER BODY WORKOUT NO EQUIPMENT | Upper Body Pilates",
    "durationSeconds": 1308,
    "focus": "Upper Body",
    "equipment": "No Equipment",
    "equipmentSource": "Title explicitly says no equipment."
  },
  {
    "id": "m8zmVIHtAm4",
    "title": "25 DAY PILATES CHALLENGE | DAY 22 | 35 MIN FULL BODY WORKOUT | WEIGHTS AND BOOTY BAND | Home Workout",
    "durationSeconds": 2324,
    "focus": "Full Body",
    "equipment": "Weights + Booty Band",
    "equipmentSource": "Title and description specify weights and a booty band."
  },
  {
    "id": "7Su7dMDab1M",
    "title": "25 DAY PILATES CHALLENGE | DAY 23 | 30 MIN LOWER BODY BURN | PILATES BALL | Lower Body Home Workout",
    "durationSeconds": 1791,
    "focus": "Lower Body Burn",
    "equipment": "Pilates Ball",
    "equipmentSource": "Title and description specify a Pilates ball."
  },
  {
    "id": "ysrxwFw25W4",
    "title": "25 DAY PILATES CHALLENGE | DAY 24 | 20 MIN STANDING POWER WORKOUT | No Equipment | 20 min HIIT",
    "durationSeconds": 1227,
    "focus": "Standing Power",
    "equipment": "No Equipment",
    "equipmentSource": "Title explicitly says no equipment."
  },
  {
    "id": "dLwF0BG8kj0",
    "title": "25 DAY PILATES CHALLENGE | DAY 25 | 25 MIN FULL BODY WEIGHTED WORKOUT | At Home Strength x Pilates",
    "durationSeconds": 1594,
    "focus": "Full Body Strength",
    "equipment": "Weights",
    "equipmentSource": "Title specifies a weighted workout; description tags dumbbell work."
  }
];
