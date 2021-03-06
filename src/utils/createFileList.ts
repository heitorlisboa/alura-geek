function createFileList(files: File[]) {
  const dataTransfer = new DataTransfer();
  files.forEach((file) => {
    dataTransfer.items.add(file);
  });
  return dataTransfer.files;
}

export { createFileList };
