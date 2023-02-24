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
  console.log(styles.inputConteiner);

  return (
    <>
      <div className={styles.inputConteiner}>
        <span className={styles.loadedSpan}>
          {haveFirst ? "Image is loaded" : "Image not selected"}
        </span>
        <input
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
      </div>
      <div className={styles.inputConteiner}>
        <span className={styles.loadedSpan}>
          {haveSecond ? "Image is loaded" : "Image not selected"}
        </span>
        <input
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
