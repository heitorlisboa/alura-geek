import { forwardRef, ReactElement, useRef, useState } from "react";
import type { DragEvent, ChangeEvent } from "react";
import type { ChangeHandler } from "react-hook-form";

import styles from "./FileDropInput.module.scss";

import { changeInputFiles, mergeRefs } from "../../utils";

type FileDropInputProps = {
  name: string;
  description: string;
  accept?: string;
  errorMessage?: string;
  icon?: ReactElement;
  // React Hook Form props
  onChange?: ChangeHandler;
  onBlur?: ChangeHandler;
};

const FileDropInput = forwardRef<HTMLInputElement, FileDropInputProps>(
  function FileDropInputComponent(
    { name, description, accept, errorMessage, icon, onChange, onBlur },
    ref
  ) {
    const [fileNames, setFileNames] = useState<string[]>([]);
    const dropAreaRef = useRef<HTMLButtonElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleClick() {
      const fileInputElement = fileInputRef.current;

      if (fileInputElement) fileInputElement.click();
    }

    function handleDrop(event: DragEvent) {
      // Prevent file from being opened
      event.preventDefault();
      // Prevent execution when draging something that is not a file
      if (event.dataTransfer.files.length === 0) return;

      const fileInputElement = fileInputRef.current;

      if (fileInputElement)
        changeInputFiles(fileInputElement, event.dataTransfer.files);

      handleDragLeave(event);
    }

    function handleDragEnter(event: DragEvent) {
      dropAreaRef.current?.classList.add(styles.dragOver);
    }

    function handleDragLeave(event: DragEvent) {
      dropAreaRef.current?.classList.remove(styles.dragOver);
    }

    function handleDragOver(event: DragEvent) {
      // Prevent file from being opened
      event.preventDefault();
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      if (onChange) onChange(event);

      const fileList = event.target.files;
      if (fileList && fileList.length > 0) {
        setFileNames(Array.from(fileList).map((file) => file.name));

        let hasImage = false;

        for (const file of Array.from(fileList)) {
          const isImage = file.type.startsWith("image/");
          if (isImage) {
            showImage(file);
            hasImage = true;
            break;
          }
        }

        if (!hasImage) hideImage();
      } else {
        setFileNames([]);
        hideImage();
      }
    }

    function showImage(file: File) {
      const reader = new FileReader();
      reader.onload = function () {
        const fileUrl = reader.result;
        const dropAreaElement = dropAreaRef.current;
        if (dropAreaElement)
          dropAreaElement.style.backgroundImage = `url(${fileUrl})`;
      };
      reader.readAsDataURL(file);
    }

    function hideImage() {
      const dropAreaElement = dropAreaRef.current;
      if (dropAreaElement)
        dropAreaElement.style.removeProperty("background-image");
    }

    return (
      <div>
        <button
          className={styles.dropArea}
          type="button"
          ref={dropAreaRef}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <div
            className={styles.dropAreaDefaultContent}
            style={{ display: fileNames.length > 0 ? "none" : undefined }}
          >
            {icon}
            <p>{description}</p>
          </div>
          {fileNames.length > 0 && (
            <p className={styles.fileNames}>{fileNames.join(", ")}</p>
          )}
        </button>

        <input
          name={name}
          type="file"
          accept={accept}
          hidden
          ref={mergeRefs(ref, fileInputRef)}
          onChange={handleChange}
          onBlur={onBlur}
        />

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      </div>
    );
  }
);

export default FileDropInput;
