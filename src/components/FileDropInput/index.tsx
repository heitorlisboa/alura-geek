import { forwardRef, useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, ReactElement } from "react";
import type { ChangeHandler } from "react-hook-form";

import styles from "./FileDropInput.module.scss";

import {
  changeInputFiles,
  classNames,
  imgFileToBase64,
  mergeRefs,
} from "@src/utils";

type FileDropInputProps = {
  name: string;
  description: string;
  className?: string;
  accept?: string;
  errorMessage?: string;
  placeholderImage?: string;
  Icon?: ReactElement;
  // React Hook Form props
  onChange?: ChangeHandler;
  onBlur?: ChangeHandler;
};

const FileDropInput = forwardRef<HTMLInputElement, FileDropInputProps>(
  function FileDropInputComponent(
    {
      name,
      description,
      className,
      accept,
      errorMessage,
      placeholderImage,
      Icon,
      onChange,
      onBlur,
    },
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
      const dropAreaElement = dropAreaRef.current;
      if (dropAreaElement) {
        imgFileToBase64(file, (base64EncodedImage) => {
          dropAreaElement.style.backgroundImage = `url(${base64EncodedImage})`;
        });
      }
    }

    function hideImage() {
      const dropAreaElement = dropAreaRef.current;
      if (dropAreaElement)
        dropAreaElement.style.removeProperty("background-image");
    }

    /* Setting the placeholder image as the background image when the component
    loads and every time there is no file selected */
    useEffect(() => {
      const dropAreaElement = dropAreaRef.current;
      const hasNoFiles = fileNames.length === 0;
      if (placeholderImage && dropAreaElement && hasNoFiles)
        dropAreaElement.style.backgroundImage = `url(${placeholderImage})`;
    }, [placeholderImage, fileNames]);

    return (
      <div className={className}>
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
            {...classNames([
              styles.dropAreaDefaultContent,
              fileNames.length > 0 || placeholderImage ? "sr-only" : undefined,
            ])}
          >
            {Icon}
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

        {errorMessage && (
          <p className={styles.errorMessage} role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

export default FileDropInput;
