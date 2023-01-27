export function imgFileToBase64(
  file: File,
  callback: (base64EncodedImage: string | ArrayBuffer | null) => void,
  errorHandler?: () => void
) {
  const reader = new FileReader();

  reader.onload = function () {
    const base64EncodedImage = reader.result;
    callback(base64EncodedImage);
  };
  reader.onerror = errorHandler || null;

  reader.readAsDataURL(file);
}
