import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { string, object } from "prop-types";
import { Padding, MaxWidth } from "../Padding";
import { QrReader } from "react-qr-reader";
import QrScanner from "qr-scanner";
import { ScanBarcode } from "lucide-react";
// import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
import Tesseract from "tesseract.js"; // ✅ Added OCR import

import {
  SAMPLE_ID_ELEMENT,
  ORGANISM_DETECTED,
  SAMPLE_TESTING_PROGRAM,
  ADDITIONAL,
} from "constants/dhis2";
import {
  TextInput,
  RadioInputs,
  SelectInput,
  SwitchInput,
  DateInput,
} from "@hisp-amr/inputs";
import { setEventValue, AddAndSubmit, addNotes } from "actions";
import TextField from "@material-ui/core/TextField";

import * as DUPLICACY from "constants/duplicacy";
import {
  LABTECH,
  CLINICIAN,
  PATHOGEN_DETECTED,
  RESULTS,
  NOTES,
  CLINICIAN_G,
} from "./../../../../../apps/entry/src/components/EventForm/Entity/constants";

export const DataElement = ({ id }) => {
  const dispatch = useDispatch();
  var { program, organism, sampleDate } = useSelector(
    (state) => state.data.panel
  );
  const optionSets = useSelector((state) => state.metadata.optionSets);
  const completed = useSelector((state) => state.data.event.status.completed);
  var value = useSelector((state) => state.data.event.values[id]);
  const programId = useSelector((state) => state.data.panel.program);
  const preValues = useSelector((state) => state.data.previousValues);
  const programStage = useSelector((state) => state.data.event.programStage);
  const username = useSelector((state) => state.metadata.user.username);
  var notes = useSelector((state) => state.data.notes);
  const userGroup = useSelector((state) => state.metadata.userGroup);
  var printValues = useSelector((state) => state.data.printValues);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const [data, setData] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null); // Do not initialize here!
  const scannedValue = useSelector(
    (state) => state.data.event.values["N2f6uoy2zqE"] || ""
  );

  // if (id == "yMKFqLn9LBx") {
  //     value = value.split("-")[0]
  // }
  if (Object.keys(preValues).length && id in preValues) {
    value = preValues[id];
  }
  const color = useSelector(
    (state) => state.data.event.programStage.dataElements[id].color
  );
  var disabled = useSelector(
    (state) => state.data.event.programStage.dataElements[id].disabled
  );
  if (
    userGroup == LABTECH &&
    programStage.displayName.toLowerCase().includes(CLINICIAN)
  ) {
    disabled = true;
  }
  if (
    userGroup == CLINICIAN_G &&
    !programStage.displayName.toLowerCase().includes(CLINICIAN)
  ) {
    disabled = true;
  }
  const displayFormName = useSelector(
    (state) => state.data.event.programStage.dataElements[id].displayFormName
  );
  const displayHospitalSort = useSelector(
    (state) => state.data.event.programStage.dataElements["Gkmu7ySPxjb"]
  );
  const sampleResultDataElement = useSelector(
    (state) => state.data.event.programStage.dataElements["VbUbBX7G6Jf"]
  );
  const ReasonDataElement = useSelector(
    (state) => state.data.event.programStage.dataElements["Oziw3yNGpiD"]
  );
  // const ReasonDataElement1 = useSelector(
  //   (state) => state.data.event.programStage.dataElements
  // );
  if (displayFormName == NOTES) {
    value = value.split("-")[0];
  }
  const error = useSelector(
    (state) => state.data.event.programStage.dataElements[id].error
  );
  const hide = useSelector(
    (state) => state.data.event.programStage.dataElements[id].hide
  );
  const optionSet = useSelector(
    (state) => state.data.event.programStage.dataElements[id].optionSet
  );
  const optionSetValue = useSelector(
    (state) => state.data.event.programStage.dataElements[id].optionSetValue
  );
  const required = useSelector(
    (state) => state.data.event.programStage.dataElements[id].required
  );
  var valueType = useSelector(
    (state) => state.data.event.programStage.dataElements[id].valueType
  );
  var valueType1 = useSelector(
    (state) => state.data.event.programStage.dataElements[id].code
  );
  var qrcode = useSelector(
    (state) => state.data.event.programStage.dataElements["DnSZStK6xL7"].id
  );
  console.log("valueType1==========", valueType1); // used for Qr code dataElement
  if (programStage.displayName.toLowerCase().includes(CLINICIAN)) {
    if (valueType == "LONG_TEXT") {
      valueType = "TEXTAREA";
    }
  }
  const numType = valueType.toUpperCase();
  const warning = useSelector(
    (state) => state.data.event.programStage.dataElements[id].warning
  );
  const warningSampleResult = useSelector(
    (state) =>
      state.data.event.programStage.dataElements["VbUbBX7G6Jf"]?.warning
  );
  const eventValPassed = useSelector((state) => state.data.event.values);
  const sampleRecivedDate = useSelector(
    (state) => state.data.event.values["N2f6uoy2zqE"]
  );
  const samplecollectedDate = useSelector(
    (state) => state.data.event.values["Xxn6IK3L34r"]
  );
  const calculateDayDifference = (date1, date2) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 3600 * 24));
  };
  // console.log("ReasonDataElement1=============", ReasonDataElement1)
  // console.log("warning=============", warning)
  // console.log("ReasonDataElement==============", ReasonDataElement)
  const updateDaysDifference = (receivedDate, collectedDate) => {
    if (receivedDate && collectedDate) {
      const daysDifference = calculateDayDifference(
        new Date(receivedDate),
        new Date(collectedDate)
      ).toString();
      dispatch(setEventValue("KRzP6XOv1mH", daysDifference, false));
    }
  };
  useEffect(() => {
    if (
      eventValPassed &&
      eventValPassed["N2f6uoy2zqE"] &&
      eventValPassed["Xxn6IK3L34r"] &&
      !eventValPassed["KRzP6XOv1mH"]
    ) {
      updateDaysDifference(sampleRecivedDate, samplecollectedDate);
      //   const receivedDate = new Date(sampleRecivedDate);
      //   const collectedDate = new Date(samplecollectedDate);

      //   const daysDifference = calculateDayDifference(receivedDate, collectedDate).toString();

      //   dispatch(setEventValue("KRzP6XOv1mH", daysDifference, false));
    }
  }, [eventValPassed, sampleRecivedDate, samplecollectedDate, dispatch]);

  // useEffect(() => {
  //     if (eventValPassed && eventValPassed["N2f6uoy2zqE"] && !eventValPassed['KRzP6XOv1mH']) {

  //       let sampleDates = new Date(sampleRecivedDate);
  //       let values = new Date(eventValPassed["Xxn6IK3L34r"]);
  //       const calculateDay = (val, sd) => {
  //         let difference = sd.getTime() - val.getTime();
  //         return Math.ceil(difference / (1000 * 3600 * 24));
  //       };

  //       dispatch(
  //         setEventValue(
  //           "KRzP6XOv1mH",
  //           calculateDay(values, sampleDates).toString(),
  //           false
  //         )
  //       );

  //     }

  //   }, [eventValPassed]);

  const duplicate =
    id === SAMPLE_ID_ELEMENT &&
    SAMPLE_TESTING_PROGRAM["0"].value == programId &&
    useSelector((state) => state.data.event.duplicate);
  const required1 = useSelector(
    (state) => state.data.event.programStage.dataElements["KRzP6XOv1mH"]
  );

  const onChange = (key, value, unique, label) => {
    // if (key === "N2f6uoy2zqE" || key ==="Xxn6IK3L34r") {

    //     let sampleDates = new Date(sampleRecivedDate);
    //     let values = new Date(value);
    //     const calculateDay = (val, sd) => {
    //       let difference = sd.getTime() - val.getTime();
    //       return Math.ceil(difference / (1000 * 3600 * 24));
    //     };

    //     dispatch(
    //       setEventValue(
    //         "KRzP6XOv1mH",
    //         calculateDay(values, sampleDates).toString(),
    //         false
    //       )
    //     );
    //   }
    if (key === "N2f6uoy2zqE" || key === "Xxn6IK3L34r") {
      // const receivedDate = new Date(sampleRecivedDate);
      // const newDate = new Date(value);

      // const daysDifference = calculateDayDifference(receivedDate, newDate).toString();

      // dispatch(setEventValue("KRzP6XOv1mH", daysDifference, false));
      const updatedEventValues = {
        ...eventValPassed,
        [key]: value,
      };
      const receivedDate = updatedEventValues["N2f6uoy2zqE"];
      const collectedDate = updatedEventValues["Xxn6IK3L34r"];
      updateDaysDifference(receivedDate, collectedDate);
    }
    if (key == "DnSZStK6xL7") {
      dispatch(setEventValue("DnSZStK6xL7", value, false));
    }
    var results = RESULTS;
    if (
      (key == ORGANISM_DETECTED && value == PATHOGEN_DETECTED) ||
      key == ADDITIONAL
    ) {
      dispatch(AddAndSubmit(true));
      dispatch(setEventValue(key, value, false));
    } else if (key == ORGANISM_DETECTED && results.indexOf(value) > -1) {
      dispatch(AddAndSubmit(false));
      dispatch(setEventValue(key, value, false));
    } else {
      var lB = label;

      if (!printValues) {
        printValues = {
          program: program,
          organism: organism,
          sampleDate: sampleDate,
          [lB]: value,
        };
      } else {
        for (var prkey in printValues) {
          if (lB == prkey) {
            printValues = { ...printValues, [lB]: value };
          } else {
            printValues = { ...printValues, [lB]: value };
          }
        }
      }
      dispatch(setEventValue(key, value, false, printValues));
    }
  };

  const handleChange = (event) => {
    console.log("event+++++++++++++++++", event);
    if (id == "TcThq7OLuKf") {
      dispatch(setEventValue(id, event.target.value, false, printValues)); //add code for Additonal comment
    } else dispatch(addNotes(id, event.target.value));
    // dispatch(addNotes(id, event.target.value));
    // onChange(id, event.target.value);
  };

  if (hide) return null;

  //function for sortig the option set values according to alphabetical order for this DataElement Gkmu7ySPxjb
  function sortAlphabetically(arr) {
    return arr.sort((a, b) => {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });
  }
  // this code is for Qr code

  // const handleImageUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     try {
  //       const result = await QrScanner.scanImage(file);
  //       onChange("DnSZStK6xL7", result, false, "Uploaded Image");
  //     } catch (error) {
  //       console.error("QR Scan Error:", error);
  //       setData("Failed to scan QR code");
  //     }
  //   }
  // };



  // const handleScan = (result, error) => {
  //   if (result?.text) {
  //     const scannedText = result.text;
  //     setData(scannedText); // Show on screen
  //     setShowScanner(false);

  //     // Also trigger backend value update immediately
  //     onChange("DnSZStK6xL7", scannedText, false, "Scanned QR");
  //   } else if (error) {
  //     console.log("Scan error", error);
  //   }
  // };

  // useEffect(() => {
  //   if (showScanner) {
  //     const timeout = setTimeout(() => setScannerReady(true), 100);
  //     return () => clearTimeout(timeout);
  //   } else {
  //     setScannerReady(false);
  //   }
  // }, [showScanner]);

  // const handleInputChange = (e) => {
  //   const newValue = e.target.value;
  //   setData(newValue);
  //   onChange("DnSZStK6xL7", newValue, false, "Scanned QR");
  // };///1111111111111111
  // const handleImageUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     try {
  //       const { default: QrScanner } = await import("qr-scanner");
  //       const result = await QrScanner.scanImage(file);
  //       onChange("DnSZStK6xL7", result, false, "Uploaded Image");
  //       setData(result);
  //     } catch (error) {
  //       console.error("QR Scan Error:", error);
  //       setData("Failed to scan QR code");
  //     }
  //   }
  // };

  // const handleScan = (result, error) => {
  //   if (result?.text || typeof result === "string") {
  //     const scannedText = result.text || result;
  //     setData(scannedText);
  //     setShowScanner(false);
  //     onChange("DnSZStK6xL7", scannedText, false, "Scanned QR");
  //   } else if (error && error.name !== "NotFoundException") {
  //     console.warn("Scan error", error.message || error);
  //   }
  // };

  // const handleInputChange = (e) => {
  //   const newValue = e.target.value;
  //   setData(newValue);
  //   onChange("DnSZStK6xL7", newValue, false, "Scanned QR");
  // };

  // useEffect(() => {
  //   if (showScanner) {
  //     const timeout = setTimeout(() => setScannerReady(true), 200);
  //     return () => clearTimeout(timeout);
  //   } else {
  //     setScannerReady(false);
  //   }
  // }, [showScanner]);



  // //above approch is for Qr code only 
  // useEffect(() => {
  //   if (!showScanner || !scannerReady) return;

  //   const hints = new Map();
  //   hints.set(DecodeHintType.POSSIBLE_FORMATS, [
  //     BarcodeFormat.QR_CODE,
  //     BarcodeFormat.CODE_128,
  //     BarcodeFormat.EAN_13,
  //     BarcodeFormat.CODE_39,
  //     BarcodeFormat.UPC_A,
  //   ]);

  //   const codeReader = new BrowserMultiFormatReader(hints);
  //   const videoElement = document.getElementById("barcode-video");

  //   let isMounted = true;

  //   codeReader
  //     .decodeFromVideoDevice(
  //       null,
  //       videoElement,
  //       (result, error) => {
  //         if (!isMounted) return;

  //         if (result) {
  //           console.log("Decoded format:", result.getBarcodeFormat());
  //           console.log("Decoded text:", result.getText());
  //           handleScan({ text: result.getText() }, null);
  //         } else if (error && error.name !== "NotFoundException") {
  //           console.warn("Scan error", error.message || error);
  //         }
  //       },
  //       {
  //         video: {
  //           facingMode: "environment",
  //           width: { ideal: 1280 },
  //           height: { ideal: 720 },
  //         },
  //       }
  //     )
  //     .catch((err) => {
  //       console.error("Failed to start scanner", err.message || err);
  //     });

  //   return () => {
  //     isMounted = false;
  //     try {
  //       codeReader.reset();
  //     } catch (err) {
  //       console.warn("Error cleaning up scanner:", err.message || err);
  //     }
  //   };
  // }, [showScanner, scannerReady]);//22222222222 qr with bar

// last approch 


//================used for simple barCode id only not work for upload image 
  // const handleScanResult = (result) => {
  //   const text = result.getText();
  //   console.log("Scanned Text:", text);
  //   setShowScanner(false);
  //   onChange("DnSZStK6xL7", text, false, "Scanned Code");
  // };

  // const handleScanError = (error) => {
  //   if (error?.name !== "NotFoundException") {
  //     console.warn("Scan error:", error);
  //   }
  // };


  //  const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const img = document.createElement("img");
  //   img.src = URL.createObjectURL(file);
  //   img.onload = async () => {
  //     const reader = new BrowserMultiFormatReader();
  //     try {
  //       const result = await reader.decodeFromImageElement(img);
  //       handleScanResult(result.getText(), "Uploaded Image");
  //     } catch (err) {
  //       console.error("Image scan failed:", err);
  //       alert("Could not scan barcode. Try a clearer image.");
  //     }
  //   };
  // };

  // const handleInputChange = (e) => {
  //   onChange("DnSZStK6xL7", e.target.value, false, "Manual Input");
  // };

  // useEffect(() => {
  //   if (showScanner) {
  //     const timeout = setTimeout(() => setScannerReady(true), 300);
  //     return () => clearTimeout(timeout);
  //   } else {
  //     setScannerReady(false);
  //   }
  // }, [showScanner]);

  // useEffect(() => {
  //   if (!(showScanner && scannerReady && videoRef.current)) return;

  //   const hints = new Map();
  //   hints.set(DecodeHintType.POSSIBLE_FORMATS, [
  //     BarcodeFormat.QR_CODE,
  //     BarcodeFormat.CODE_128,
  //     BarcodeFormat.EAN_13,
  //     BarcodeFormat.UPC_A,
  //     BarcodeFormat.CODE_39,
  //   ]);

  //   const reader = new BrowserMultiFormatReader(hints);
  //   codeReaderRef.current = reader;

  //   reader.decodeFromConstraints(
  //     {
  //       video: {
  //         facingMode: "environment",
  //         width: { ideal: 1280 },
  //         height: { ideal: 720 },
  //       },
  //     },
  //     videoRef.current,
  //     (result, err) => {
  //       if (result) handleScanResult(result);
  //       else if (err) handleScanError(err);
  //     }
  //   ).catch((err) => {
  //     console.error("Camera error:", err);
  //     alert("Unable to access camera. Check permissions or try a different browser.");
  //   });

  //   return () => {
  //     if (codeReaderRef.current?.reset) {
  //       codeReaderRef.current.reset();
  //       codeReaderRef.current = null;
  //     }
  //   };
  // }, [showScanner, scannerReady]);
//================used for simple barCode id only not work for upload image 

  //  const handleScanResult = (text, method) => {
  //   console.log(`${method} scan success:`, text);
  //   setShowScanner(false);
  //   onChange("DnSZStK6xL7", text, false, method);
  // };

  // const handleScanError = (error) => {
  //   if (error?.name !== "NotFoundException") {
  //     console.warn("Scan error:", error);
  //   }
  // };

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const img = document.createElement("img");
  //   img.src = URL.createObjectURL(file);
  //   img.onload = async () => {
  //     const reader = new BrowserMultiFormatReader();
  //     try {
  //       const result = await reader.decodeFromImageElement(img);
  //       handleScanResult(result.getText(), "Uploaded Image");
  //     } catch (err) {
  //       console.error("Image scan failed:", err);
  //       alert("Could not scan barcode. Try a clearer image.");
  //     }
  //   };
  // };

  // const handleInputChange = (e) => {
  //   onChange("DnSZStK6xL7", e.target.value, false, "Manual Input");
  // };

  // useEffect(() => {
  //   if (showScanner) {
  //     const timeout = setTimeout(() => setScannerReady(true), 300);
  //     return () => clearTimeout(timeout);
  //   } else {
  //     setScannerReady(false);
  //   }
  // }, [showScanner]);

  // useEffect(() => {
  //   if (!(showScanner && scannerReady && videoRef.current)) return;

  //   const hints = new Map();
  //   hints.set(DecodeHintType.POSSIBLE_FORMATS, [
  //     BarcodeFormat.QR_CODE,
  //     BarcodeFormat.CODE_128,
  //     BarcodeFormat.EAN_13,
  //     BarcodeFormat.UPC_A,
  //     BarcodeFormat.CODE_39,
  //   ]);

  //   const reader = new BrowserMultiFormatReader(hints);
  //   codeReaderRef.current = reader;

  //   reader.decodeFromConstraints(
  //     {
  //       video: {
  //         facingMode: "environment",
  //         width: { ideal: 1280 },
  //         height: { ideal: 720 },
  //       },
  //     },
  //     videoRef.current,
  //     (result, err) => {
  //       if (result) handleScanResult(result.getText(), "Scanned Code");
  //       else if (err) handleScanError(err);
  //     }
  //   ).catch((err) => {
  //     console.error("Camera error:", err);
  //     alert("Unable to access camera.");
  //   });

  //   return () => {
  //     if (codeReaderRef.current?.reset) {
  //       codeReaderRef.current.reset();
  //       codeReaderRef.current = null;
  //     }
  //   };
  // }, [showScanner, scannerReady]);
  //================used for simple barCode id only


//  const handleScanResult = (text, method) => {
//     console.log(`${method} scan success:`, text);
//     setShowScanner(false);
//     onChange(id, text, false, method);
//   };

//   const handleScanError = (error) => {
//     if (error?.name !== "NotFoundException") {
//       console.warn("Scan error:", error);
//     }
//   };
//   const handleImageUpload = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const img = document.createElement("img");
//   img.src = URL.createObjectURL(file);

//   img.onload = async () => {
//     const reader = new BrowserMultiFormatReader();
//     let barcodeResult = "";
//     let ocrResult = "";

//     // Try decoding barcode first
//     try {
//       const result = await reader.decodeFromImageElement(img);
//       barcodeResult = result.getText();
//     } catch (err) {
//       console.warn("Barcode scan failed:", err);
//     }

//     // Preprocess image using canvas for better OCR
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     canvas.width = img.width;
//     canvas.height = img.height;
//     ctx.drawImage(img, 0, 0);
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

//     // Convert to grayscale manually
//     for (let i = 0; i < imageData.data.length; i += 4) {
//       const avg = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
//       imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = avg;
//     }
//     ctx.putImageData(imageData, 0, 0);

//     // OCR with whitelist and improved image
//     try {
//       const { data: { text } } = await Tesseract.recognize(canvas, 'eng', {
//         logger: m => console.log(m),
//         tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:/.- ',
//       });
//       ocrResult = text;
//     } catch (err) {
//       console.error("OCR failed:", err);
//     }

//     // Combine and format results
//     const allText = `${barcodeResult}\n${ocrResult}`;
//     const cleanedLines = allText
//       .split("\n")
//       .map(line => line.trim())
//       .filter(line => line.length > 0);
//     const finalResult = cleanedLines.join(", ");

//     handleScanResult(finalResult, "Uploaded Image");
//   };
// };


 
//   const handleInputChange = (e) => {
//     onChange(id, e.target.value, false, "Manual Input");
//   };

//   useEffect(() => {
//     if (showScanner) {
//       const timeout = setTimeout(() => setScannerReady(true), 300);
//       return () => clearTimeout(timeout);
//     } else {
//       setScannerReady(false);
//     }
//   }, [showScanner]);

//   useEffect(() => {
//     if (!(showScanner && scannerReady && videoRef.current)) return;

//     const hints = new Map();
//     hints.set(DecodeHintType.POSSIBLE_FORMATS, [
//       BarcodeFormat.QR_CODE,
//       BarcodeFormat.CODE_128,
//       BarcodeFormat.EAN_13,
//       BarcodeFormat.UPC_A,
//       BarcodeFormat.CODE_39,
//     ]);

//     const reader = new BrowserMultiFormatReader(hints);
//     codeReaderRef.current = reader;

//     reader.decodeFromConstraints(
//       {
//         video: {
//           facingMode: "environment",
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//         },
//       },
//       videoRef.current,
//       (result, err) => {
//         if (result) handleScanResult(result.getText(), "Scanned Code");
//         else if (err) handleScanError(err);
//       }
//     ).catch((err) => {
//       console.error("Camera error:", err);
//       alert("Unable to access camera.");
//     });

//     return () => {
//       if (codeReaderRef.current?.reset) {
//         codeReaderRef.current.reset();
//         codeReaderRef.current = null;
//       }
//     };
//   }, [showScanner, scannerReady]);

//================reader with different fileds ===============

// const handleScanResult = (text, method) => {
//     console.log(`${method} scan success:`, text);
//     setShowScanner(false);
//     onChange(id, text, false, method);
//   };

//   const handleScanError = (error) => {
//     if (error?.name !== "NotFoundException") {
//       console.warn("Scan error:", error);
//     }
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const img = document.createElement("img");
//     img.src = URL.createObjectURL(file);

//     img.onload = async () => {
//       const reader = new BrowserMultiFormatReader();
//       let barcodeText = "";
//       let ocrText = "";

//       // Barcode first
//       try {
//         const result = await reader.decodeFromImageElement(img);
//         barcodeText = result.getText();
//       } catch (err) {
//         console.warn("Barcode scan failed:", err);
//       }

//       // Preprocess for OCR
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       ctx.drawImage(img, 0, 0);
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

//       for (let i = 0; i < imageData.data.length; i += 4) {
//         const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
//         imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = avg;
//       }
//       ctx.putImageData(imageData, 0, 0);

//       // OCR
//       try {
//         const { data: { text } } = await Tesseract.recognize(canvas, 'eng', {
//           logger: m => console.log(m),
//         });
//         ocrText = text;
//       } catch (err) {
//         console.error("OCR failed:", err);
//       }

//       // Extract fields
//       const nameMatch = ocrText.match(/([A-Z]+ [A-Z]+)/);
//       const idMatch = ocrText.match(/\b\d{6}\b/);
//       const dateMatch = ocrText.match(/\d{2}\/\d{2}\/\d{2}/);

//       const name = nameMatch?.[1] || "";
//       const id = idMatch?.[0] || "";
//       const date = dateMatch?.[0] || "";
//       const hasUsefulData = name || extractedId || date || barcodeText;

//     if (!hasUsefulData) {
//       alert("No valid barcode or recognizable text found in the uploaded image.");
//       return;
//     }


//       const finalResult = `Name: "${name}", ID: "${id}", Date: "${date}", Barcode: "${barcodeText}"`;
//       handleScanResult(finalResult, "Uploaded Image");
//     };
//   };

//   const handleInputChange = (e) => {
//     onChange(id, e.target.value, false, "Manual Input");
//   };

//   useEffect(() => {
//     if (showScanner) {
//       const timeout = setTimeout(() => setScannerReady(true), 300);
//       return () => clearTimeout(timeout);
//     } else {
//       setScannerReady(false);
//     }
//   }, [showScanner]);

//   useEffect(() => {
//     if (!(showScanner && scannerReady && videoRef.current)) return;

//     const hints = new Map();
//     hints.set(DecodeHintType.POSSIBLE_FORMATS, [
//       BarcodeFormat.QR_CODE,
//       BarcodeFormat.CODE_128,
//       BarcodeFormat.EAN_13,
//       BarcodeFormat.UPC_A,
//       BarcodeFormat.CODE_39,
//     ]);

//     const reader = new BrowserMultiFormatReader(hints);
//     codeReaderRef.current = reader;

//     reader.decodeFromConstraints(
//       {
//         video: {
//           facingMode: "environment",
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//         },
//       },
//       videoRef.current,
//       (result, err) => {
//         if (result) 
          
//         handleScanResult(result.getText(), "Scanned Code");
//         else if (err) handleScanError(err);
//       }
//     ).catch((err) => {
//       console.error("Camera error:", err);
//       alert("Unable to access camera.");
//     });

//     return () => {
//       if (codeReaderRef.current?.reset) {
//         codeReaderRef.current.reset();
//         codeReaderRef.current = null;
//       }
//     };
//   }, [showScanner, scannerReady]);
//================reader with different fileds ===============



const handleScanResult = (text, method) => {
  console.log(`${method} scan success:`, text);
  setShowScanner(false);
  onChange(id, text, false, method);
};

const handleScanError = (error) => {
  if (error?.name !== "NotFoundException") {
    console.warn("Scan error:", error);
  }
};

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
    const reader = new BrowserMultiFormatReader();
    let barcodeText = "";
    let ocrText = "";

    // Barcode attempt
    try {
      const result = await reader.decodeFromImageElement(img);
      barcodeText = result.getText();
    } catch (err) {
      console.warn("Barcode scan failed:", err);
    }

    // Prepare grayscale image for OCR
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
      imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);

    // OCR attempt
    try {
      const { data: { text } } = await Tesseract.recognize(canvas, 'eng', {
        logger: m => console.log(m),
      });
      ocrText = text;
    } catch (err) {
      console.error("OCR failed:", err);
    }

    // Field extraction
    const nameMatch = ocrText.match(/([A-Z]+ [A-Z]+)/);
    const idMatch = ocrText.match(/\b\d{6}\b/);
    const dateMatch = ocrText.match(/\d{2}\/\d{2}\/\d{2}/);

    const name = nameMatch?.[1] || "";
    const extractedId = idMatch?.[0] || "";
    const date = dateMatch?.[0] || "";

    const hasUsefulData = name || extractedId || date || barcodeText;

    if (!hasUsefulData) {
      alert("No valid barcode or recognizable text found in the uploaded image.");
      return;
    }

    const finalResult = `Name: "${name}", ID: "${extractedId}", Date: "${date}", Barcode: "${barcodeText}"`;
    handleScanResult(ocrText, "Uploaded Image");
  };
};

const handleInputChange = (e) => {
  onChange(id, e.target.value, false, "Manual Input");
};

useEffect(() => {
  if (showScanner) {
    const timeout = setTimeout(() => setScannerReady(true), 300);
    return () => clearTimeout(timeout);
  } else {
    setScannerReady(false);
  }
}, [showScanner]);

useEffect(() => {
  if (!(showScanner && scannerReady && videoRef.current)) return;

  const hints = new Map();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_13,
    BarcodeFormat.UPC_A,
    BarcodeFormat.CODE_39,
  ]);

  const reader = new BrowserMultiFormatReader(hints);
  codeReaderRef.current = reader;

  reader.decodeFromConstraints(
    {
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    },
    videoRef.current,
    (result, err) => {
      if (result) {
        const scannedText = result.getText();
        if (!scannedText || scannedText.trim() === "") {
          alert("Scanned image does not contain a valid barcode.");
          return;
        }
        handleScanResult(scannedText, "Scanned Code");
      } else if (err) {
        // Only alert if error isn't just "Not Found" (which is normal while scanning)
        if (err.name !== "NotFoundException") {
          console.warn("Scanner error:", err);
          // alert("An error occurred while scanning.");
        }
      }
    }
  ).catch((err) => {
    console.error("Camera error:", err);
    alert("Unable to access camera.");
  });

  return () => {
    if (codeReaderRef.current?.reset) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
  };
}, [showScanner, scannerReady]);



  // console.log(sortedData,"Mixed flora");
  return (
    <Padding>
      {optionSetValue ? (
        optionSets[optionSet].length < 5 ? (
          <RadioInputs
            objects={optionSets[optionSet]}
            name={id}
            label={displayFormName}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled || completed}
          />
        ) : (
          <SelectInput
            objects={
              displayHospitalSort?.id == "Gkmu7ySPxjb"
                ? sortAlphabetically(optionSets[optionSet])
                : optionSets[optionSet]
            } // sorting Hospital name
            name={id}
            label={displayFormName}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled || completed}
          />
        )
      ) : valueType === "TRUE_ONLY" ? (
        <SwitchInput
          name={id}
          label={displayFormName}
          checked={value}
          onChange={onChange}
          required={required}
          value={value}
          disabled={disabled || completed}
        />
      ) : valueType1 === "Bar code_ID" ? (
        // <div className="flex flex-col space-y-4 p-4">
        //   <label className="font-semibold">{displayFormName}</label>

        //   <input
        //     type="file"
        //     accept="image/*"
        //     onChange={handleImageUpload}
        //     className="border p-2 rounded"
        //     disabled={disabled || completed}
        //   />

        //   <button
        //     type="button" // Add this line
        //     onClick={() => setShowScanner(true)}
        //     className="p-3 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        //     disabled={disabled || completed}
        //     title="Start Scanning"
        //   >
        //     <ScanBarcode />
        //   </button>

        //   {showScanner && scannerReady && (
        //     <div className="w-full max-w-xs">
        //       <QrReader
        //         constraints={{ facingMode: "environment" }}
        //         scanDelay={300}
        //         onResult={handleScan}
        //         containerStyle={{
        //           width: "100%",
        //           borderRadius: "8px",
        //           overflow: "hidden",
        //         }}
        //       />
        //     </div>
        //   )}

        //   <TextInput
        //     type="text"
        //     name={id}
        //     value={value}
        //     onChange={handleInputChange}
        //     required={required}
        //     disabled={disabled || completed}
        //     // className="border p-2 rounded"
        //     placeholder="Scanned data will appear here"
        //   />
        // </div>11111111111111


    //      <div className="flex flex-col space-y-4 p-4">
    //   <label className="font-semibold">{displayFormName}</label>

    //   <input
    //     type="file"
    //     accept="image/*"
    //     onChange={handleImageUpload}
    //     className="border p-2 rounded"
    //     disabled={disabled || completed}
    //   />

    //   <button
    //     type="button"
    //     onClick={() => setShowScanner(true)}
    //     className="p-3 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
    //     disabled={disabled || completed}
    //     title="Start Scanning"
    //   >
    //     <ScanBarcode />
    //   </button>

    //   {showScanner && scannerReady && (
    //     <div className="w-full max-w-xs">
    //       <video
    //         id="barcode-video"
    //         style={{ width: "100%", borderRadius: "8px", overflow: "hidden" }}
    //       />
    //     </div>
    //   )}

    //   <TextInput
    //     type="text"
    //     name={id}
    //     value={value}
    //     onChange={handleInputChange}
    //     required={required}
    //     disabled={disabled || completed}
    //     placeholder="Scanned data will appear here"
    //   />
    // </div>//2222

  //  <div className="flex flex-col space-y-4 p-4">
  //     <label className="font-semibold">{displayFormName}</label>

  //     <input
  //       type="file"
  //       accept="image/*"
  //       onChange={handleImageUpload}
  //       disabled={disabled || completed}
  //       className="border p-2 rounded"
  //     />

  //     <button
  //       type="button"
  //       onClick={() => setShowScanner(true)}
  //       disabled={disabled || completed}
  //       className="p-3 rounded bg-blue-600 text-white hover:bg-blue-700"
  //     >
  //       Scan Barcode/QR
  //     </button>

  //     {showScanner && scannerReady && (
  //       <div className="w-full max-w-xs">
  //         <video
  //           ref={videoRef}
  //           style={{
  //             width: "100%",
  //             borderRadius: "8px",
  //             border: "1px solid #ccc",
  //             backgroundColor: "#000",
  //           }}
  //           autoPlay
  //           muted
  //         />
  //       </div>
  //     )}

  //     <TextInput
  //       type="text"
  //       name={id}
  //       value={value}
  //       onChange={handleInputChange}
  //       required={required}
  //       disabled={disabled || completed}
  //       placeholder="Scanned data will appear here"
  //       className="p-2 border rounded"
  //     />
  //   </div>//333


   <div className="flex flex-col space-y-4 p-4">
      <label className="font-semibold">{displayFormName}</label>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={disabled || completed}
        className="border p-2 rounded"
      />

      <button
        type="button"
        onClick={() => setShowScanner(true)}
        disabled={disabled || completed}
        className="p-3 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
         <ScanBarcode />
      </button>

      {showScanner && scannerReady && (
        <div className="w-full max-w-xs">
          <video
            ref={videoRef}
            style={{
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: "#000",
            }}
            autoPlay
            muted
          />
        </div>
      )}

      <TextInput
        type="text"
        name={id}
        value={value}
        onChange={handleInputChange}
        required={required}
        disabled={disabled || completed}
        placeholder="Scanned data will appear here"
        className="p-2 border rounded"
      />
    </div>
      ) : valueType === "DATE" ? (
        <DateInput
          name={id}
          label={displayFormName}
          value={value}
          required={required}
          onChange={onChange}
          disabled={disabled || completed}
        />
      ) : valueType == "TEXTAREA" || valueType == "LONG_TEXT" ? (
        <TextField
          id="outlined-multiline-static"
          label={displayFormName}
          multiline
          rows={5}
          variant="outlined"
          required={required}
          name={id}
          onChange={handleChange}
          className="textArea"
          disabled={disabled || completed}
          defaultValue={value}
        />
      ) : (
        <TextInput
          name={id}
          label={displayFormName}
          value={value}
          required={required}
          onChange={onChange}
          disabled={disabled || completed}
          type={valueType}
          color={numType == "NUMBER" && value && color}
          unique={id === SAMPLE_ID_ELEMENT}
          error={
            error
              ? error
              : id === SAMPLE_ID_ELEMENT &&
                duplicate === DUPLICACY.DUPLICATE_ERROR
              ? duplicate
              : ""
          }
          warning={
            warning
              ? warning
              : id === SAMPLE_ID_ELEMENT &&
                duplicate === DUPLICACY.DUPLICATE_WARNING
              ? duplicate
              : ""
          }
          loading={
            id === SAMPLE_ID_ELEMENT &&
            duplicate === DUPLICACY.DUPLICATE_CHECKING
              ? true
              : false
          }
        />
      )}

      {/* {(id == "VbUbBX7G6Jf" && value == "Mixed flora") || ((id == "VbUbBX7G6Jf" && value == "Rejected" && (id == "Oziw3yNGpiD" && value !== ""))) ? <div style={{ color: '#D9534F', textAlign: 'center' }}>Please repeat sample1111111</div> : ""} */}
      {(sampleResultDataElement?.id === "VbUbBX7G6Jf" &&
        value == "Mixed flora") ||
      (sampleResultDataElement?.id === "VbUbBX7G6Jf" && value == "Rejected") ? (
        <div style={{ color: "#D9534F", textAlign: "center" }}>
          {warningSampleResult}
        </div>
      ) : (
        ""
      )}
    </Padding>
  );
};
// (values['Oziw3yNGpiD'] != '') || (values['VbUbBX7G6Jf'] == 'Mixed flora')
DataElement.propTypes = {
  id: string.isRequired,
};
