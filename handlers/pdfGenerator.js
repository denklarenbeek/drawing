const hummus = require('hummus');
const fs = require('fs');

exports.pcfContract = async (data) => {
  const locations = data.locations;
  const contractName = `${data.company.toLowerCase()}-${Date.now()}`;
  const filepath = `./tmp/${contractName}.pdf` 
  const pdfWriter = hummus.createWriterToModify('./templates/pcf.pdf', {
    modifiedFilePath: filepath
  });

  // Text variable holders for locations
  let hardwareFee;
  let nonHardwareFee;
  let priceWithHardware;
  let priceWithoutHardware;
  let oneLocationText;
  let differentFees;
  const yearInvoicing = 'De bedragen worden jaarlijks gefactureerd';

  const multipleLocations = locations.length > 1;
  const objHardwareFee = await locations.filter((el) => {
    return el.hardware === true;
  })
  const objNonHardwareFee = await locations.filter((el) => {
    return el.hardware === false;
  })
  if(objHardwareFee.length > 0 && objNonHardwareFee.length > 0){
    console.log('inside differentFees')
    differentFees = true;
  }
  if(multipleLocations && differentFees){
    if(objHardwareFee.length > 0){
      hardwareFee = objHardwareFee[0].fee || null;
      priceWithoutHardware = `Het bedrag bedraagt € ${hardwareFee} per maand voor locaties met een nieuwe HUB.`;
    }
    if(objNonHardwareFee.length > 0){
      nonHardwareFee = objNonHardwareFee[0].fee || null;
      priceWithHardware = `Het bedrag bedraagt € ${nonHardwareFee} per maand voor locaties met bestaande HUB.`;
    }

  } else {
    const location = locations[0];
    console.log(location);
    if(location.hardware){
      oneLocationText = `Het bedrag bedraagt € ${location.fee} per maand voor locaties met een nieuwe HUB.`;
    } else {
      oneLocationText = `Het bedrag bedraagt € ${location.fee} per maand voor locaties met bestaande HUB.`;
    }
  }

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

  if(multipleLocations && differentFees){
    const page3Modifier = new hummus.PDFPageModifier(pdfWriter,2);
    console.log(priceWithHardware, priceWithoutHardware);
    page3Modifier.startContext().getContext()
      .writeText(data.contract_duration, 225, 626, textOptions)
      .writeText(priceWithHardware, 113, 228, textOptions)
      .writeText(priceWithoutHardware, 113, 215, textOptions)
      .writeText(yearInvoicing, 113, 202, textOptions);
    page3Modifier.endContext().writePage();
  } else {
    const page3Modifier = new hummus.PDFPageModifier(pdfWriter,2);
    page3Modifier.startContext().getContext()
      .writeText(data.contract_duration, 225, 626, textOptions)
      .writeText(oneLocationText, 113, 228, textOptions)
      .writeText(yearInvoicing, 113, 215, textOptions);
    page3Modifier.endContext().writePage();
  }
  
  const page5Modifier = new hummus.PDFPageModifier(pdfWriter, 4);
  page5Modifier.startContext().getContext()
    .writeText(data.starting_date, 255, 691, textOptions)
    .writeText(data.contract_duration, 247, 705, textOptions)
  page5Modifier.endContext().writePage();

  const page9Modifier = new hummus.PDFPageModifier(pdfWriter, 8);
  for(let i =0;i < locations.length; i++){
    let position = 705 - (i * 13);
    let modFee = `€ ${locations[i].fee}`;
    let modHardware;
    if(locations[i].hardware) {modHardware = 'Ja'} else {modHardware = 'Nee'};
    page9Modifier.startContext().getContext()
      .writeText(locations[i].name, 76, position, textOptions)
      .writeText(modHardware, 270, position, textOptions)
      .writeText(modFee, 326, position, textOptions)
    page9Modifier.endContext().writePage();
  }

  await pdfWriter.end();
  return filepath;
};

