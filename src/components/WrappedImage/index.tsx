import Image, { type ImageProps } from "next/image";

import styles from "./WrappedImage.module.scss";

const WrappedImage = function WrappedImageComponent({
  alt,
  ...props
}: ImageProps) {
  return (
    <div className={styles.wrapper}>
      <Image {...props} alt={alt} />
    </div>
  );
};

export default WrappedImage;
