var fs = require('fs');
var PDFDocument = require('pdfkit');
const pdfGenerator = require('../handlers/pdfGenerator');

exports.testPdf = async (req, res) => {
  const data = {
    company: 'BigBrother',
    street: 'Galvanistraat 14-2',
    city: '6716AE EDE',
    coutry: 'Nederland',
    starting_date: '20 december 2019',
    fee: '€ 180',
    contract_duration: '36'
  }
  pdfGenerator.pcfContract(data);

}