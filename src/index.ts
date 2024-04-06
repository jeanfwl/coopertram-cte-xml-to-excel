import { X2jOptions, XMLParser } from 'fast-xml-parser';

const parsingOptions = {
  ignoreAttributes: false,
  processEntities: true,
  htmlEntities: true,
  attributeNamePrefix: '',
  numberParseOptions: {
    hex: false,
    skipLike: /\+[0-9]{10}/,
    eNotation: false,
  },
} as X2jOptions;

document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('button');

  button?.addEventListener('click', generateExcel);
});

async function generateExcel() {
  const xmlFilesInput = <HTMLInputElement>document.getElementById('xmlInput');
  const xmlMerge = <HTMLInputElement>document.getElementById('IsToMergeXmlSwitchInput');

  const isToMergeXmls = xmlMerge?.checked;

  const xmlFiles = xmlFilesInput.files;

  if (xmlFiles === null) return;

  const xmlsTextContent = await Promise.all(Array.from(xmlFiles).map(async (file) => await file.text()));

  const rows = xmlsTextContent.map((content) => {
    const xmlContentParsedAsJSON = new XMLParser(parsingOptions).parse(content);
    console.log(xmlContentParsedAsJSON);
    // const cteInfo = extractCteXmlInfo(xmlContentParsedAsJSON);
    // ctesInfo.push(cteInfo);
    // return Object.values(cteInfo);
  });

  return;

  // const ctesInfo = [];

  // const allInfo = {
  //   ctes: ctesInfo.map((cte) => {
  //     let novoCte = {
  //       ...cte,
  //     };
  //     novoCte.valorIcms;
  //     novoCte.valorCarga;

  //     return novoCte;
  //   }),
  //   totalFrete: +ctesInfo
  //     .reduce((total, cte) => {
  //       return total + cte.valorFrete;
  //     }, 0)
  //     .toFixed(2),
  //   totalIcms: +ctesInfo
  //     .reduce((total, cte) => {
  //       return total + cte.valorIcms;
  //     }, 0)
  //     .toFixed(2),
  //   totalCarga: +ctesInfo
  //     .reduce((total, cte) => {
  //       return total + cte.valorCarga;
  //     }, 0)
  //     .toFixed(2),
  // };

  // console.log(allInfo);

  // document.getElementById('xmlResult').innerText = JSON.stringify(allInfo, null, 2);

  // teste(allInfo, isMergeCte);
}
