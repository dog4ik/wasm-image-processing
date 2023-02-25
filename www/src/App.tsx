import "./App.css";
import { console_log, merge_image } from "../../pkg/hello_wasm";
import { useRef, useState } from "react";
import CropBar from "./components/CropBar";
import InputFile from "./components/InputFile/InputFile";
import ImageSpace from "./components/ImageSpace/ImageSpace";

function App() {
  const [firstImage, setFirstImage] = useState<Uint8Array>();
  const [secondImage, setSecondImage] = useState<Uint8Array>();
  const [croppedSrc, setCroppedSrc] = useState<string>();
  const [resultImage, setResultImage] = useState<string>();
  const imgRef = useRef<HTMLImageElement>(null);
  function handleClick() {
    if (firstImage && secondImage) {
      const result = merge_image(firstImage, secondImage);
      setResultImage(result);
    }
  }
  function printPage() {
    const iframe = document.createElement("iframe");
    iframe.onload = function () {
      if (imgRef.current) {
        const image = imgRef.current.cloneNode() as HTMLImageElement;
        image.style.maxWidth = "100%";
        image.style.maxHeight = "700px";
        const body = iframe.contentDocument?.body!;
        body.style.textAlign = "center";
        body.appendChild(image);
      }
    };
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.setAttribute("srcdoc", "<html><body></body></html>");
    document.body.appendChild(iframe);
    iframe.contentWindow?.print();
    iframe.contentWindow?.addEventListener("afterprint", function () {
      iframe.parentNode?.removeChild(iframe);
    });
  }
  return (
    <div className="container">
      <ImageSpace
        imgRef={imgRef}
        onCrop={(img) => setCroppedSrc(img)}
        img={resultImage}
      />
      <CropBar />
      {resultImage && (
        <>
          <a className="button" download="image.png" href={resultImage}>
            Download
          </a>
          <button className="button" onClick={() => printPage()}>
            Print
          </button>
        </>
      )}
      <InputFile
        haveFirst={!!firstImage}
        haveSecond={!!secondImage}
        onFirstUpload={(buf) => setFirstImage(buf)}
        onSecondUpload={(buf) => setSecondImage(buf)}
      />
      <div>
        <button className="button" onClick={() => handleClick()}>
          Hi from WASM
        </button>
      </div>
      <img src={`data:image/png;base64,${croppedSrc}`} />
    </div>
  );
}

export default App;
