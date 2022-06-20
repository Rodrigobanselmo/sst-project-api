export const hexToColors = (hex: string) => {
  return { hex: hex, string: hex.substring(1, hex.length) };
};

export const palette = {
  table: {
    header: hexToColors('#fca557'),
    row: hexToColors('#fcf2e8'),
    rowDark: hexToColors('#fce2c9'),
  },
  text: {
    simple: hexToColors('#fca557'),
    main: hexToColors('#000000'),
    attention: hexToColors('#ff0000'),
  },
};
