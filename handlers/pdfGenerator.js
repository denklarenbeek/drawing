const hummus = require('hummus');
const fs = require('fs');

exports.pcfContract = async (data) => {
  const contractName = `${data.company.toLowerCase()}-${Date.now()}`;
  const filepath = `./tmp/${contractName}.pdf` 
  const pdfWriter = hummus.createWriterToModify('./templates/pcfcontract.pdf', {
    modifiedFilePath: filepath
  });

  const focoFont = pdfWriter.getFontForFile('./templates/fonts/foco_lt.ttf');
  const textOptions = {font:focoFont,size:9,colorspace:'gray',color:0x00}

  // Edit page 1 with the debitor info
  const pageModifier = new hummus.PDFPageModifier(pdfWriter,0);
  pageModifier.startContext().getContext()
    .writeText(data.company,235, 643, textOptions)
    .writeText(data.street, 235, 630, textOptions)
    .writeText(data.city, 235, 617, textOptions)
    .writeText(data.country, 235, 604, textOptions);
  pageModifier.endContext().writePage();

  const page3Modifier = new hummus.PDFPageModifier(pdfWriter,2);
  page3Modifier.startContext().getContext()
    .writeText(data.contract_duration, 225, 626, textOptions)
    .writeText(data.fee, 191, 228, textOptions);
  page3Modifier.endContext().writePage();
  
  const page5Modifier = new hummus.PDFPageModifier(pdfWriter, 4);
  page5Modifier.startContext().getContext()
    .writeText(data.starting_date, 310, 720, textOptions)
    .writeText(data.contract_duration, 459, 706, textOptions)
  page5Modifier.endContext().writePage();

  await pdfWriter.end();
  return filepath;
};

