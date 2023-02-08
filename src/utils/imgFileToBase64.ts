export function imgFileToBase64(
  file: File
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64EncodedImage = reader.result;
      resolve(base64EncodedImage);
    };
    reader.onerror = (event) => reject(event);

    reader.readAsDataURL(file);
  });
}
