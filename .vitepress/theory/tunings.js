export const tunings = {
  pythagorean: {
    cents: [0, 90, 204, 294, 408, 498, 588, 612, 702, 792, 906, 996, 1110],
  },
  just: {
    cents: [0, 112, 204, 316, 386, 498, 590, 702, 814, 884, 1017, 1088],
    values: [
      "1/1",
      "16/15",
      "9/8",
      "6/5",
      "5/4",
      "4/3",
      "45/32",
      "3/2",
      "8/5",
      "5/3",
      "9/5",
      "15/8",
    ],
  },
  et: {
    cents: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
  },
};

export const limit5 = {
  "1/1": 1,
  "16/15": 16 / 15,
  "9/8": 9 / 8,
  "6/5": 6 / 5,
  "5/4": 5 / 4,
  "4/3": 4 / 3,
  "45/32": 45 / 32,
  "3/2": 3 / 2,
  "8/5": 8 / 5,
  "5/3": 5 / 3,
  "9/5": 9 / 5,
  "15/8": 15 / 8,
};

export const pythagoras = [
  {
    two: 8,
    three: 5,
    inv: false,
  },
  {
    two: 3,
    three: 2,
    inv: true,
  },
  {
    two: 5,
    three: 3,
    inv: false,
  },
  {
    two: 6,
    three: 4,
    inv: true,
  },
  {
    two: 2,
    three: 1,
    inv: false,
  },
  {
    two: 9,
    three: 6,
    inv: true,
  },
  {
    two: 1,
    three: 1,
    inv: true,
  },
  {
    two: 7,
    three: 4,
    inv: false,
  },
  {
    two: 4,
    three: 3,
    inv: true,
  },
  {
    two: 4,
    three: 2,
    inv: false,
  },
  {
    two: 7,
    three: 5,
    inv: true,
  },
];
