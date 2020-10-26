#target Illustrator
#include 'json2.js'

if (app.documents.length > 0) {
  main();
} else {
  Window.alert("No file open, no rename possible");
}

function main() {
  var document = app.activeDocument;
  const texts = document.textFrames;

  const json = prompt('json', '');
  const data = JSON.parse(json);

  for (var textIndex = 0; textIndex < texts.length; textIndex++) {
    var text = texts[textIndex];

    for (var identifier in data) {
      if (text.contents === identifier) {
        text.contents = data[identifier];
        $.sleep(500);
      }
    }
  }
}
