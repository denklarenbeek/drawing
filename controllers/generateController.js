const pdfGenerator = require('../handlers/pdfGenerator');
const mail = require("../handlers/mailer");
const hummus = require('hummus');
const path = require('path');
const moment = require('moment');
moment.locale('nl');

exports.generatePCFContract = async (req, res, next) => {
  const debitor = req.body.debitor;
  const dates = req.body.dates;
  const options = req.body.options;
  const locations = req.body.locations;
  const data = {
    company: debitor.company,
    street: debitor.street,
    city: `${debitor.zippcode} ${debitor.city.toUpperCase()}`,
    country: debitor.country,
    starting_date: await moment(dates.starting_date).format('D MMMM YYYY'),
    fee: `€ ${locations[0].fee}`,
    contract_duration: dates.contract_duration
  }

  res.setHeader("Content-Type", "application/pdf"); 
  const pdfWriter = hummus.createWriterToModify(new hummus.PDFRStreamForFile('./templates/pcf.pdf'), new hummus.PDFStreamForResponse(res))

  const focoFont = pdfWriter.getFontForFile('./templates/fonts/foco_lt.ttf');
  const textOptions = {font: focoFont, size:9,colorspace:'gray',color:0x00}

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
  
  const filepath = await pdfGenerator.pcfContract(data);
  res.filepath = filepath;
  await pdfWriter.end();
  next();
}

exports.sendContract = async (req, res, next) => {
  if(req.body.options.send_by_email){
    await mail.send({
      fromEmail: req.user.email,
      fromName: req.user.name,
      toEmail: req.body.options.send_to_email,
      toName: '',
      subject: 'pcf contract',
      msg: 'Kijk eens! Uw PriceCast Fuel overeenkomst',
      template: "attachment",
      attachments: [
        {
          filename: 'PriceCast Fuel Overeenkomst',
          path: res.filepath,
        }
      ]
    });
  }
  res.send();
}