const hummus = require('hummus');
const fs = require('fs');

const page1textPosition = {
  debitor_company: {
    x: 235,
    y: 643
  },
  debitor_street: {
    x: 235,
    y: 630
  },
  debitor_city: {
    x: 235,
    y: 617
  },
  debitor_country: {
    x: 235,
    y: 604
  },
  contract_duration: {
    x: 225,
    y: 626
  },
  contract_fee: {
    x: 191,
    y: 228
  }
}

exports.pcfContract = async (data) => {
  const contractName = `${data.company.toLowerCase()}-${Date.now()}`;
  const filepath = `./public/tmp/${contractName}.pdf` 
  const pdfWriter = hummus.createWriterToModify('./public/templates/pcfcontract.pdf', {
    modifiedFilePath: filepath
  });

  const focoFont = pdfWriter.getFontForFile('./public/templates/fonts/foco_lt.ttf');
  const textOptions = {font:focoFont,size:9,colorspace:'gray',color:0x00}

  // Edit page 1 with the debitor info
  const pageModifier = new hummus.PDFPageModifier(pdfWriter,0);
  pageModifier.startContext().getContext()
    .writeText(data.company,page1textPosition.debitor_company.x, page1textPosition.debitor_company.y, textOptions)
    .writeText(data.street, page1textPosition.debitor_street.x, page1textPosition.debitor_street.y, textOptions)
    .writeText(data.city, page1textPosition.debitor_city.x, page1textPosition.debitor_city.y, textOptions)
    .writeText(data.country, page1textPosition.debitor_country.x, page1textPosition.debitor_country.y, textOptions);
  pageModifier.endContext().writePage();

  const page3Modifier = new hummus.PDFPageModifier(pdfWriter,2);
  page3Modifier.startContext().getContext()
    .writeText(data.contract_duration, page1textPosition.contract_duration.x, page1textPosition.contract_duration.y, textOptions)
    .writeText(data.fee, page1textPosition.contract_fee.x, page1textPosition.contract_fee.y, textOptions);
  page3Modifier.endContext().writePage();
  
  const page5Modifier = new hummus.PDFPageModifier(pdfWriter, 4);
  page5Modifier.startContext().getContext()
    .writeText(data.starting_date, 310, 720, textOptions)
    .writeText(data.contract_duration, 459, 706, textOptions)
  page5Modifier.endContext().writePage();

  await pdfWriter.end();
  return filepath;
};

