import {
  type ChangeEvent,
  type DragEvent,
  forwardRef,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ChangeHandler } from "react-hook-form";
import { showNotification } from "@mantine/notifications";
import clsx from "clsx";

import styles from "./FileDropInput.module.scss";

import { changeInputFiles, imgFileToBase64, mergeRefs } from "@/utils";

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

const DISPLAY_NAME = "FileDropInput";
export const FileDropInput = forwardRef<HTMLInputElement, FileDropInputProps>(
  (
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
  ) => {
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

      handleDragLeave();
    }

    function handleDragEnter() {
      dropAreaRef.current?.classList.add(styles.dragOver as string);
    }

    function handleDragLeave() {
      dropAreaRef.current?.classList.remove(styles.dragOver as string);
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

    async function showImage(file: File) {
      const dropAreaElement = dropAreaRef.current;
      if (dropAreaElement) {
        try {
          const base64EncodedImage = await imgFileToBase64(file);
          dropAreaElement.style.backgroundImage = `url(${base64EncodedImage})`;
        } catch (error) {
          // Error notification
          showNotification({
            color: "red",
            message: "Erro ao processar imagem",
          });
        }
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
            className={clsx(styles.dropAreaDefaultContent, {
              "sr-only": fileNames.length > 0 || placeholderImage,
            })}
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

FileDropInput.displayName = DISPLAY_NAME;
