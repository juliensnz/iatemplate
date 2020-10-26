#target Illustrator

if (app.documents.length > 0) {
  main();
} else {
  Window.alert("Cancelled export.");
}

function main() {
  var document = app.activeDocument;
  var afile = document.fullName;
  var filename = afile.name.split('.')[0];

  var pngFolder = new Folder(afile.parent.fsName + "/png");
  if (!pngFolder.exists) {
    pngFolder.create();
  }
  var pdfFolder = new Folder(afile.parent.fsName + "/pdf");
  if (!pdfFolder.exists) {
    pdfFolder.create();
  }
  var file;

  if (pngFolder != null) {
    for (var artboardIndex = 0; artboardIndex < document.artboards.length; artboardIndex++) {
      document.artboards.setActiveArtboardIndex(artboardIndex);
      var activeAB = document.artboards[artboardIndex];
      var options = new ImageCaptureOptions();
      options.resolution = 300;
      options.antiAliasing = true;
      options.transparency = true;
      options.artBoardClipping = true;

      file = new File(pngFolder.fsName + '/' + filename + "_" + document.artboards[artboardIndex].name + ".png");

      document.imageCapture(file, activeAB.artboardRect, options);
    }
  }

  if (pdfFolder != null) {
    for (var artboardIndex = 0; artboardIndex < document.artboards.length; artboardIndex++) {
      document.artboards.setActiveArtboardIndex(artboardIndex);

      var options = new PDFSaveOptions();
      options.compatibility = PDFCompatibility.ACROBAT6;
      options.generateThumbnails = true;
      options.artboardRange = artboardIndex+1;

      file = new File(pdfFolder.fsName + '/' + filename + "_" + document.artboards[artboardIndex].name + ".pdf");

      document.saveAs(file, options);
    }
  }
}
