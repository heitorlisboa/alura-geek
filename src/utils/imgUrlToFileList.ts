import axios from "axios";

import { createFileList } from "@/utils/createFileList";

function imgUrlToFileList(
  url: string,
  fileName: string,
  callback: (fileList: FileList) => void
) {
  axios
    .get(url, {
      responseType: "blob",
    })
    .then(({ data: imageBlob, headers }) => {
      const fileList = createFileList([
        new File([imageBlob], fileName, {
          type: headers["content-type"],
        }),
      ]);
      callback(fileList);
    });
}

export { imgUrlToFileList };
