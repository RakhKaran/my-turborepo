const centralizedTools = [
  {
    id: "tool_ocr",
    title: "OCR Tool",
    description: "Extract text from an image using OCR",
    icon: "/assets/ocr.svg",
    type: "central_ocr",

    bgColor: "#1976D2",
    borderColor: "#1565C0",
    color: "#90CAF9",

    popupKey: "central_ocr_popup",

    configFields: [
      {
        name: "model",
        label: "OCR Model",
        type: "select",
        options: ["tesseract", "google_vision"]
      },
      {
        name: "language",
        label: "Language",
        type: "select",
        options: ["eng", "hin"]
      }
    ],

    defaultValues: {
      model: "",
      language: ""
    }
  }
];

module.exports = centralizedTools;
