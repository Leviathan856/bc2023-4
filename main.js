const xml = require("fast-xml-parser");
const fs = require('fs');
const http = require("http");

const host = 'localhost';
const port = 8000;

const xmlFile = 'data.xml';
const totalIncome = 'BS2_IncomeTotal';
const totalExpenses = 'BS2_ExpensesTotal';

const xmlData = fs.readFileSync(xmlFile, 'utf-8');
const parser = new xml.XMLParser();
const jsonData = parser.parse(xmlData);

const filteredData = {
    data: {
      indicators: []
    }
  };

for (let i = 0; i < jsonData.indicators.banksincexp.length; i++) {
const item = jsonData.indicators.banksincexp[i];
if (item.id_api === totalIncome || item.id_api === totalExpenses) {
    filteredData.data.indicators.push({
        txt: item.txt,
        value: item.value
    });
}
}

const builderForXML = new xml.XMLBuilder();
const xmlStr = builderForXML.build(filteredData);

const server = http.createServer(function(req,res){
    res.setHeader('Content-type', 'text/xml');
    res.setHeader('Access-Controll-Allow-Origin', "*");
    res.writeHead(200);
    res.end(xmlStr);
});

server.listen(port, host, function(){
    console.log(`Server on port ${port}`)
})