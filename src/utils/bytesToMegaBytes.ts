function bytesToMegaBytes(bytes: number, fractionDigits: number = 2) {
  const exactMegaBytes = bytes / 1024 ** 2;
  const fixedMegaBytes = parseFloat(exactMegaBytes.toFixed(fractionDigits));
  return fixedMegaBytes;
}

export { bytesToMegaBytes };
