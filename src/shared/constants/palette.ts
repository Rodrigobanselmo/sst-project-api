export const hexToColors = (hex: string) => {
  return { hex: hex, string: hex.substring(1, hex.length) };
};

export const palette = {
  table: {
    header: hexToColors('#fca557'),
    row: hexToColors('#fcf2e8'),
    rowDark: hexToColors('#fce2c9'),
  },
  common: {
    white: hexToColors('#ffffff'),
    black: hexToColors('#000000'),
  },
  text: {
    simple: hexToColors('#fca557'),
    main: hexToColors('#000000'),
    attention: hexToColors('#ff0000'),
  },
  matrix: {
    0: hexToColors('#ffffff'),
    1: hexToColors('#3cbe7d'),
    2: hexToColors('#8fa728'),
    3: hexToColors('#d9d10b'),
    4: hexToColors('#d96c2f'),
    5: hexToColors('#F44336'),
  },
};
