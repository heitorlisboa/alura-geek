function changeInputFiles(inputElement: HTMLInputElement, fileList: FileList) {
  inputElement.files = fileList;
  inputElement.dispatchEvent(new Event("change", { bubbles: true }));
}

export { changeInputFiles };
