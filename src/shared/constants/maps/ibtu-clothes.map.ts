export enum ClothesIBTUG {
  CLOTHES_0 = 'CLOTHES_0',
  CLOTHES_1 = 'CLOTHES_1',
  CLOTHES_2 = 'CLOTHES_2',
  CLOTHES_3 = 'CLOTHES_3',
  CLOTHES_4 = 'CLOTHES_4',
  CLOTHES_5 = 'CLOTHES_5',
  CLOTHES_6 = 'CLOTHES_6',
}

export const clothesMap = {
  [ClothesIBTUG.CLOTHES_0]: {
    type: ClothesIBTUG.CLOTHES_0,
    value: 0,
    content: 'Uniforme de trabalho (calça e camisa de manga comprida) ou Macacão de tecido',
  },

  [ClothesIBTUG.CLOTHES_1]: {
    type: ClothesIBTUG.CLOTHES_1,
    value: 0.5,
    content: 'Macacão de polipropileno SMS (Spun-Melt-Spun)',
  },
  [ClothesIBTUG.CLOTHES_2]: {
    type: ClothesIBTUG.CLOTHES_2,
    value: 2,
    content: 'Macacão de poliolefina',
  },
  [ClothesIBTUG.CLOTHES_3]: {
    type: ClothesIBTUG.CLOTHES_3,
    value: 3,
    content: 'Vestimenta ou macacão forrado (tecido duplo)',
  },
  [ClothesIBTUG.CLOTHES_4]: {
    type: ClothesIBTUG.CLOTHES_4,
    value: 4,
    content: 'Avental longo de manga comprida impermeável ao vapor',
  },
  [ClothesIBTUG.CLOTHES_5]: {
    type: ClothesIBTUG.CLOTHES_5,
    value: 10,
    content: 'Macacão impermeável ao vapor',
  },
  [ClothesIBTUG.CLOTHES_6]: {
    type: ClothesIBTUG.CLOTHES_6,
    value: 12,
    content: 'Macacão impermeável ao vapor sobreposto à roupa de trabalho',
  },
};

export const clothesList = [
  clothesMap[ClothesIBTUG.CLOTHES_0],
  clothesMap[ClothesIBTUG.CLOTHES_1],
  clothesMap[ClothesIBTUG.CLOTHES_2],
  clothesMap[ClothesIBTUG.CLOTHES_3],
  clothesMap[ClothesIBTUG.CLOTHES_4],
  clothesMap[ClothesIBTUG.CLOTHES_5],
  clothesMap[ClothesIBTUG.CLOTHES_6],
];
