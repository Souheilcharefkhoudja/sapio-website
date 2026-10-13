// Edit names, descriptions and prices here; the page rebuilds itself.
// price: number in euro, a string for special pricing, or null when the price is not known.
// Hero film: save a clip in assets/video/ and put its path here, e.g. 'assets/video/hero.mp4'. Empty = sliding photos.
window.HERO_VIDEO = "";
window.HERO_VIDEO_PHONE = "";   // optional lighter file for phones

window.MENU = [
  {
    "id": "sapere",
    "it": "Sapere Sapore",
    "en": "Sapere Sapore",
    "note": {
      "it": "La Sicilia intreccia nodi che la rendono partenza e approdo.",
      "en": "Sicily ties knots that make it both a departure and a landing place."
    },
    "items": [
      {
        "it": "Amuse-bouche",
        "price": ""
      },
      {
        "it": "Scorfano in fette sottili",
        "en": "Thinly sliced scorpion fish",
        "dIt": "Il suo brodo ristretto al Carricante, cavolfiore violetto marinato, miele e finocchietto selvatico",
        "dEn": "Its broth reduced with Carricante wine, marinated purple cauliflower, honey and wild fennel",
        "price": ""
      },
      {
        "it": "Baccalà",
        "en": "Salt cod",
        "dIt": "In foglia di lattuga cotto al vapore, le sue trippe con vongole al verde e limone salato",
        "dEn": "Steamed in a lettuce leaf, its tripe with clams in green sauce and salted lemon",
        "price": ""
      },
      {
        "it": "Tonno e cipolla",
        "en": "Tuna and onion",
        "dIt": "La sua ventresca sottile, estratto di cipolla e foglie di cappero",
        "dEn": "Thin slices of tuna belly, onion extract and caper leaves",
        "price": ""
      },
      {
        "it": "Triglia allo scoglio",
        "en": "Red mullet “allo scoglio”",
        "dIt": "Cotta sui “cutulisci”, aria di conchiglie acidulata, sugo ristretto e pane al pomodoro",
        "dEn": "Cooked on sea pebbles, a tart shellfish foam, reduced sauce and tomato bread",
        "price": ""
      },
      {
        "it": "Millefoglie di zucca",
        "en": "Pumpkin millefeuille",
        "dIt": "Olive alla brace e pinoli",
        "dEn": "Char-grilled olives and pine nuts",
        "price": ""
      },
      {
        "it": "Risotto riserva",
        "dIt": "Castagne, lepre e sommacco",
        "dEn": "Aged rice with chestnuts, hare and sumac",
        "price": ""
      },
      {
        "it": "Coppa di maialino",
        "en": "Suckling pig neck",
        "dIt": "Cotta a lungo, il suo sugo all’aceto e amarena in conserva",
        "dEn": "Slow-cooked, its vinegar jus and preserved sour cherries",
        "price": ""
      },
      {
        "it": "Pre dessert",
        "price": ""
      },
      {
        "it": "“Aliveddi”",
        "dIt": "Il nostro omaggio a Sant’Agata: mousse di mandorle, cremoso al limone e granita di ficodindia",
        "dEn": "Our tribute to Saint Agatha: almond mousse, lemon cream and prickly pear granita",
        "price": ""
      },
      {
        "it": "Petit four",
        "price": ""
      }
    ]
  },
  {
    "id": "sciaredda",
    "it": "Sciaredda",
    "en": "Sciaredda",
    "note": {
      "it": "Nel dialetto siciliano la “sciaredda” è la lava dell’Etna, ora fredda, ma un tempo incandescente e indomabile.",
      "en": "In Sicilian dialect “sciaredda” is Etna’s lava, cold now but once glowing and untameable."
    },
    "items": [
      {
        "it": "Amuse-bouche",
        "price": ""
      },
      {
        "it": "Gambero affogato",
        "en": "“Drowned” prawn",
        "dIt": "Crudo di gambero rosso, spuma di broccolo nero e le sue foglie",
        "dEn": "Raw red prawn, black broccoli foam and its leaves",
        "price": ""
      },
      {
        "it": "Ostrica",
        "en": "Oyster",
        "dIt": "Cotta sul fuoco, lenticchia nera di Leonforte e zuppetta di mandorle",
        "dEn": "Cooked over the fire, black lentils from Leonforte and almond broth",
        "price": ""
      },
      {
        "it": "Cinara",
        "dIt": "Carciofo arrosto e ricci*",
        "dEn": "Roasted artichoke and sea urchins*",
        "price": ""
      },
      {
        "it": "Ragabo",
        "dIt": "Lichene, nocciola, manzo e midollo affumicato",
        "dEn": "Lichen, hazelnut, beef and smoked marrow",
        "price": ""
      },
      {
        "it": "Pappardella",
        "dIt": "Pecora, alloro e limone bruciato",
        "dEn": "Mutton, bay leaf and burnt lemon",
        "price": ""
      },
      {
        "it": "Animella di vitello",
        "en": "Veal sweetbread",
        "dIt": "Albicocca glassata, succo di carote e scorza nera",
        "dEn": "Glazed apricot, carrot juice and black salsify",
        "price": ""
      },
      {
        "it": "Zuzzu",
        "dIt": "In gelatina",
        "dEn": "Sicilian pork in aspic",
        "price": ""
      },
      {
        "it": "Piccione in conca come una volta",
        "en": "Pigeon, as it once was",
        "dIt": "Cotto intero e laccato al carrubo, olive e pancotto",
        "dEn": "Cooked whole and glazed with carob, olives and bread soup",
        "price": ""
      },
      {
        "it": "Pre dessert",
        "price": ""
      },
      {
        "it": "Contadina",
        "dIt": "Pera cotta al forno, crema di latte e pane tostato",
        "dEn": "Oven-baked pear, milk cream and toasted bread",
        "price": ""
      },
      {
        "it": "Petit four",
        "price": ""
      }
    ]
  },
  {
    "id": "sorpresa",
    "it": "Menù a sorpresa",
    "en": "Surprise menu",
    "note": {
      "it": "Se si ha voglia dell’irripetibile, questo menu segue la spontaneità pura dello chef.",
      "en": "For those who want something unrepeatable, this menu follows the chef’s pure spontaneity."
    },
    "items": [
      {
        "it": "Dieci portate",
        "en": "Ten courses",
        "dIt": "L’ispirazione di Alessandro si libera da ogni impostazione abituale, per allargarsi all’audacia",
        "dEn": "Alessandro’s inspiration breaks free from every habit and reaches for boldness",
        "price": ""
      }
    ]
  },
  {
    "id": "carta",
    "it": "À la carte",
    "en": "À la carte",
    "note": {
      "it": "Singole portate à la carte, scelte dai nostri menù degustazione.",
      "en": "Single courses à la carte, chosen from our tasting menus."
    },
    "items": [
      {
        "it": "2 portate a persona",
        "en": "2 courses per person",
        "price": ""
      },
      {
        "it": "3 portate a persona",
        "en": "3 courses per person",
        "price": ""
      },
      {
        "it": "Desserts",
        "price": ""
      },
      {
        "it": "Selezione di formaggi",
        "en": "Cheese selection",
        "price": ""
      }
    ]
  }
];

window.FIXED_MENU = {
  "price": 50,
  "title": {
    "it": "Chef’s Table",
    "en": "Chef’s Table"
  },
  "sub": {
    "it": "Un’esperienza a parte",
    "en": "An experience apart"
  },
  "courses": [
    {
      "k": {
        "it": "In cucina",
        "en": "In the kitchen"
      },
      "v": {
        "it": "Il tavolo dello chef, nelle cucine",
        "en": "The chef’s table, inside the kitchen"
      }
    },
    {
      "k": {
        "it": "In cantina",
        "en": "In the cellar"
      },
      "v": {
        "it": "Il tavolo conviviale, tra le bottiglie",
        "en": "The convivial table, among the bottles"
      }
    }
  ],
  "foot": {
    "it": "Supplemento per commensale, su prenotazione.",
    "en": "Supplement per guest, by reservation."
  }
};
