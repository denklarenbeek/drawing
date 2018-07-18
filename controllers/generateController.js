const pdfGenerator = require('../handlers/pdfGenerator');
const mail = require("../handlers/mailer");

exports.generatePCFContract = async (req, res) => {
  const data = {
    company: 'BigBrother',
    street: 'Galvanistraat 14-2',
    city: '6716AE EDE',
    coutry: 'Nederland',
    starting_date: '20 december 2019',
    fee: '€ 180',
    contract_duration: '36'
  }
  const sendMail = true;
  const file = await pdfGenerator.pcfContract(data);

  // if(sendMail){
  //   await mail.send({
  //     fromEmail: req.user.email || 'dennis.klarenbeek@icloud.com',
  //     fromName: req.user.name || 'Dennis Klarenbeek',
  //     toEmail: 'dk@bigbrother.nl',
  //     toName: 'John Doe',
  //     subject: 'Contract PriceCast Fuel',
  //     msg: 'Hierbij treft u het contract voor PriceCast Fuel'
  //   });
  // };
  res.json({
    filepath: file
  });

}