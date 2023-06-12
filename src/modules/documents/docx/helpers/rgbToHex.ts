export function rgbStringToHex(rgbColor: string) {
  // Extract the decimal values of the color components from the input string
  const decimalValues = rgbColor.slice(4, -1).split(',');
  const r = parseInt(decimalValues[0].trim());
  const g = parseInt(decimalValues[1].trim());
  const b = parseInt(decimalValues[2].trim());

  // Convert each decimal value to its equivalent hexadecimal value
  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');

  // Concatenate the three hexadecimal values and return the result
  return hexR + hexG + hexB;
}
