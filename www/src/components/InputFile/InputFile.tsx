import styles from "./InputFile.module.css";

type Props = {
  haveFirst: boolean;
  haveSecond: boolean;
  onFirstUpload: (buf: Uint8Array) => void;
  onSecondUpload: (buf: Uint8Array) => void;
};
const InputFile = ({
  haveFirst,
  onFirstUpload,
  onSecondUpload,
  haveSecond,
}: Props) => {
  return (
    <>
      <div className={styles.inputConteiner}>
        <label htmlFor="file1" className={styles.inputLabel}>
          {haveFirst ? "1 Image is loaded" : "1 Image not selected"}
        </label>
        <input
          className={styles.fileInput}
          id="file1"
          type="file"
          accept=".jpeg,.jpg,.png"
          onChange={(e) => {
            const reader = new FileReader();
            reader.onload = function () {
              let arrayBuf = this.result;
              if (typeof arrayBuf != "string" && arrayBuf) {
                onFirstUpload(new Uint8Array(arrayBuf));
              }
            };
            if (e.currentTarget.files)
              reader.readAsArrayBuffer(e.currentTarget.files[0]);
          }}
        />
        <label htmlFor="file2" className={styles.inputLabel}>
          {haveSecond ? "2 Image is loaded" : "2 Image not selected"}
        </label>
        <input
          className={styles.fileInput}
          id="file2"
          type="file"
          accept=".jpeg,.jpg,.png"
          onChange={(e) => {
            const reader = new FileReader();
            reader.onload = function () {
              let arrayBuf = this.result;
              if (typeof arrayBuf != "string" && arrayBuf) {
                onSecondUpload(new Uint8Array(arrayBuf));
              }
            };
            if (e.currentTarget.files)
              reader.readAsArrayBuffer(e.currentTarget.files[0]);
          }}
        />
      </div>
    </>
  );
};

export default InputFile;
