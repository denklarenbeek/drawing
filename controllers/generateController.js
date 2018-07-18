const pdfGenerator = require('../handlers/pdfGenerator');
const mail = require("../handlers/mailer");
const hummus = require('hummus');
const path = require('path');
const moment = require('moment');
moment.locale('nl');


exports.generatePCFContract = async (req, res) => {
  const debitor = req.body.debitor;
  const dates = req.body.dates;
  const options = req.body.options;
  const locations = req.body.locations;
  const data = {
    company: debitor.company,
    street: debitor.street,
    city: `${debitor.zippcode} ${debitor.city.toUpperCase()}`,
    coutry: debitor.country,
    starting_date: await moment(dates.starting_date).format('D MMMM YYYY'),
    fee: `€ ${locations[0].fee}`,
    contract_duration: dates.contract_duration
  }
  // const sendMail = options.send_by_email;
  // const file = await pdfGenerator.pcfContract(data);

  // res.json({
  //   filepath: file
  // });

  res.setHeader("Content-Type", "application/pdf");

  const contractName = `${data.company.toLowerCase()}-${Date.now()}`;
  const filepath = `./public/tmp/${contractName}.pdf` 
  const pdfWriter = hummus.createWriterToModify(new hummus.PDFRStreamForFile('./public/templates/pcfcontract.pdf'), new hummus.PDFStreamForResponse(res))

  const focoFont = pdfWriter.getFontForFile('./public/templates/fonts/foco_lt.ttf');
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
  res.send();

}