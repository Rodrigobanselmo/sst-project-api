export const setNiceProportion = (maxWidth: number, maxHeight: number, imgWidth: number, imgHeight: number) => {
  let width = maxWidth;
  let height = maxHeight;

  const proportionHeight = imgHeight / maxHeight;
  const proportionWidth = imgWidth / maxWidth;

  const isHeightProportionHigher = proportionHeight > proportionWidth;

  if (isHeightProportionHigher) {
    width = imgWidth / proportionHeight;
    height = maxHeight;
  } else {
    width = maxWidth;
    height = imgHeight / proportionWidth;
  }

  return { width, height };
};
