import { X2jOptions, XMLParser } from 'fast-xml-parser';
import * as ExcelJS from 'exceljs';
import { Cte, CteXml, Nfe } from './types/cte-information.type';
import { ComplementObservation, Complements } from './types/complements.type';

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

const currencyFormat = '_-"R$" * #,##0.00_-;-"R$" * #,##0.00_-;_-"R$" * "-"??_-;_-@_-';

document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('button');
  button?.addEventListener('click', generateExcel);

  const xmlInput = document.getElementById('xmlInput');
  xmlInput?.addEventListener('change', handleMergeXmlToggle);
});

function handleMergeXmlToggle({ target }: Event) {
  const input = <HTMLInputElement>target!;
  const mergeXmlInput = <HTMLInputElement>document.getElementById('IsToMergeXmlSwitchInput')!;

  const xmlFiles = input.files!;

  if (input.files!?.length <= 1) {
    mergeXmlInput.checked = false;
    mergeXmlInput?.setAttribute('disabled', 'true');
  } else {
    mergeXmlInput?.removeAttribute('disabled');
  }

  if (input.files?.length === 0) {
    document.getElementById('xml-list')!.innerHTML = '';
  } else {
    document.getElementById(
      'xml-list',
    )!.innerHTML = `<li class="list-group-item list-group-item-light">Arquivos selecionados (em ordem)</li>
        <li class="list-group-item p-0">
          <ul class="list-group list-group-flush list-group-numbered rounded overflow-y-scroll" style="max-height: 250px">
          ${Array.from(xmlFiles)
            .map((file) => `<li class="list-group-item text-truncate">${file.name}</li>`)
            .join('')}
            </ul>
            </li>`;
  }
}

async function generateExcel(event: Event) {
  event.preventDefault();

  const formValid = document.forms[0].reportValidity();

  if (formValid === false) return;

  const xmlFilesInput = <HTMLInputElement>document.getElementById('xmlInput');
  const xmlMerge = <HTMLInputElement>document.getElementById('IsToMergeXmlSwitchInput');

  const xmlFiles = xmlFilesInput.files!;

  if (xmlFiles.length === 0) return;

  const xmlsTextContent = await Promise.all(Array.from(xmlFiles).map(async (file) => await file.text()));

  const ctes = xmlsTextContent.map((content) => {
    const xmlContentParsedAsJSON: CteXml = new XMLParser(parsingOptions).parse(content);
    return extractCteXmlInfo(xmlContentParsedAsJSON);
  });

  createCteExcel(ctes, xmlMerge.checked);
}

function extractCteXmlInfo(cteXml: CteXml): Cte {
  const infCte = cteXml.cteProc.CTe.infCte;

  const emissionDate = new Date(infCte.ide.dhEmi);
  const [loadCode, driverName] = getCteObservationData(infCte.compl);
  const nfes = getCteInvoices(infCte.infCTeNorm.infDoc.infNFe);

  return {
    numero: infCte.ide.nCT,
    dataEmissao: emissionDate,
    origem: infCte.ide.xMunIni,
    destino: infCte.ide.xMunFim,
    carga: loadCode,
    motorista: driverName,
    valorFrete: infCte.vPrest.vRec,
    valorIcms: infCte.imp.ICMS?.ICMS00?.vICMS ?? 0,
    valorCarga: infCte.infCTeNorm.infCarga.vCarga,
    produto: infCte.infCTeNorm.infCarga.proPred,
    notas: nfes,
  };
}

function getCteDriverName(observations: ComplementObservation[]): string {
  const driverRegex = /Subcontr:\s\d+-([^-]+)\s-/;
  const driverObsValue =
    (observations.find((obs) => obs.xCampo === 'Subcontratado:')?.xTexto as string) ?? '';

  const driverRegexMatch = driverObsValue.match(driverRegex);
  return driverRegexMatch ? driverRegexMatch[1].trim() : 'NÃO ENCONTRADO';
}

function getCteLoadCode(observation: string): string {
  const loadRegex = /(?<=carga:?\s?)\d+/gi;
  const loadRegexMatch = observation.match(loadRegex);

  return loadRegexMatch ? loadRegexMatch[0] : 'NÃO ENCONTRADO';
}

function getCteObservationData(complements: Complements) {
  return [getCteLoadCode(complements.xObs), getCteDriverName(complements.ObsCont)];
}

function getCteInvoices(nfes: Nfe | Nfe[]): string | number {
  const invoices = [];
  if (Array.isArray(nfes)) {
    invoices.push(...nfes.map((nf) => nf.chave));
  } else {
    invoices.push(nfes.chave);
  }

  const invoicesConverted = invoices.map((nf) => +nf.slice(25, 34).replace(/^0+/, ''));

  return invoicesConverted.length === 1 ? +invoicesConverted[0] : invoicesConverted.join(', ');
}

function generateExcelRows(ctes: Cte[]): (string | number | Date)[][] {
  return ctes.map((cte) => {
    return [
      cte.motorista,
      cte.dataEmissao,
      cte.valorFrete,
      cte.produto,
      cte.notas,
      cte.origem,
      cte.destino,
      cte.numero,
      cte.valorFrete,
      cte.valorIcms,
    ];
  });
}

function generateExcelMergedRows(ctes: Cte[]): (string | number | Date)[][] {
  const cteRows = generateExcelRows(ctes);

  cteRows.forEach((row) => row.splice(row.length - 2, 2));

  return cteRows;
}

function createCteExcel(ctes: Cte[], merge: boolean): void {
  const excelRow = +(<HTMLInputElement>document.getElementById('excelLine')).value;

  const qtdCtes = ctes.length;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  if (merge) {
    const [totalFrete, totalIcms, totalCarga] = ctes.reduce(
      (totais, cte) => {
        totais[0] += cte.valorFrete;
        totais[1] += cte.valorIcms;
        totais[2] += cte.valorCarga;
        return totais;
      },
      [0, 0, 0],
    );
    const rows = generateExcelMergedRows(ctes);
    rows[0].push(totalFrete, totalIcms);
    worksheet.addRows(rows);
    const valorCargaCell = worksheet.getCell(`T1`);
    valorCargaCell.value = totalCarga;
    valorCargaCell.numFmt = currencyFormat;
  } else {
    const excelDataRows = generateExcelRows(ctes);
    worksheet.addRows(excelDataRows);
  }

  // Definindo as mesclagens
  if (merge) {
    worksheet.eachRow((row) => {
      row.font = {
        size: 10,
      };
      Array.from({ length: 25 }).forEach((_, i) => {
        const cell = row.getCell(i + 1);
        cell.border = {
          top: { style: 'double', color: { argb: '000' } },
          left: { style: 'double', color: { argb: '000' } },
          bottom: { style: 'double', color: { argb: '000' } },
          right: { style: 'double', color: { argb: '000' } },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F4B084' },
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
      });
    });
    const merges = [
      { start: { row: 1, col: 1 }, end: { row: qtdCtes, col: 1 } }, // Merge A1 to A(n)
      { start: { row: 1, col: 2 }, end: { row: qtdCtes, col: 2 } }, // Merge B1 to B(n)
      { start: { row: 1, col: 4 }, end: { row: qtdCtes, col: 4 } }, // Merge D1 to D(n)
      { start: { row: 1, col: 6 }, end: { row: qtdCtes, col: 6 } }, // Merge F1 to F(n)
      ...Array.from({ length: 17 }).map((_, i) => {
        return {
          start: { row: 0, col: i + 9 },
          end: { row: qtdCtes, col: i + 9 },
        };
      }),
    ];
    merges.forEach((merge) =>
      worksheet.mergeCells(merge.start.row, merge.start.col, merge.end.row, merge.end.col),
    );

    worksheet.getCell(`B1`).numFmt = 'dd/mmm';
    for (const index of Array.from({ length: qtdCtes }).map((_, i) => i)) {
      worksheet.getCell(`C${index + 1}`).numFmt = currencyFormat;
    }

    worksheet.getCell(`I1`).numFmt = currencyFormat;

    worksheet.getCell(`J1`).numFmt = currencyFormat;
    worksheet.getCell(`O1`).value = 0;
    worksheet.getCell(`O1`).numFmt = currencyFormat;

    //FORMULAS
    worksheet.getCell(`K1`).numFmt = currencyFormat;
    worksheet.getCell(`K1`).value = { formula: `SUM(I$${excelRow}-J$${excelRow})*0.03` };

    worksheet.getCell(`L1`).numFmt = currencyFormat;
    worksheet.getCell(`L1`).font = {
      bold: true,
      italic: true,
    };
    worksheet.getCell(`L1`).value = { formula: `SUM(I$${excelRow}-J$${excelRow})*0.97` };

    worksheet.getCell(`M1`).numFmt = currencyFormat;
    worksheet.getCell(`M1`).value = { formula: `L$${excelRow}*0.04` };

    worksheet.getCell(`N1`).numFmt = currencyFormat;
    worksheet.getCell(`N1`).value = { formula: `L$${excelRow}*0.005` };
    worksheet.getCell(`N1`).font = {
      bold: true,
      italic: true,
    };

    worksheet.getCell(`P1`).numFmt = currencyFormat;
    worksheet.getCell(`P1`).value = {
      formula: `SUM(L$${excelRow})-(M$${excelRow}+N$${excelRow}+O$${excelRow})`,
    };
    worksheet.getCell(`P1`).font = {
      bold: true,
      italic: true,
    };

    worksheet.getCell(`U1`).numFmt = currencyFormat;
    worksheet.getCell(`U1`).value = {
      formula: `SUM(T$${excelRow}*0.00015)*0.0738+(T$${excelRow}*0.00015)`,
    };

    worksheet.getCell(`X1`).numFmt = currencyFormat;
    worksheet.getCell(`X1`).value = {
      formula: `SUM(W$${excelRow}*0.04)*(7.38%)+(W$${excelRow}*0.04%)`,
    };

    worksheet.getCell(`Y1`).numFmt = currencyFormat;
    worksheet.getCell(`Y1`).value = {
      formula: `SUM(P$${excelRow}+X$${excelRow})-(U$${excelRow}+W$${excelRow})`,
    };
    worksheet.getCell(`Y1`).font = {
      bold: true,
      italic: true,
    };
  } else {
    ctes.forEach((cte, i) => {
      let linhaDiff = i === 0 ? excelRow : excelRow + i;
      // VALORES
      const valorCargaCell = worksheet.getCell(`T${i + 1}`);
      valorCargaCell.value = cte.valorCarga;
      valorCargaCell.numFmt = currencyFormat;

      worksheet.getCell(`B${i + 1}`).numFmt = 'dd/mmm';
      worksheet.getCell(`C${i + 1}`).numFmt = currencyFormat;

      worksheet.getCell(`I${i + 1}`).numFmt = currencyFormat;

      worksheet.getCell(`J${i + 1}`).numFmt = currencyFormat;
      worksheet.getCell(`O${i + 1}`).value = 0;
      worksheet.getCell(`O${i + 1}`).numFmt = currencyFormat;

      //FORMULAS
      worksheet.getCell(`K${i + 1}`).numFmt = currencyFormat;
      worksheet.getCell(`K${i + 1}`).value = { formula: `SUM(I$${linhaDiff}-J$${linhaDiff})*0.03` };

      worksheet.getCell(`L${i + 1}`).numFmt = currencyFormat;
      worksheet.getCell(`L${i + 1}`).value = { formula: `SUM(I$${linhaDiff}-J$${linhaDiff})*0.97` };

      worksheet.getCell(`M${i + 1}`).numFmt = currencyFormat;
      worksheet.getCell(`M${i + 1}`).value = { formula: `L$${linhaDiff}*0.04` };

      worksheet.getCell(`N${i + 1}`).numFmt = currencyFormat;
      worksheet.getCell(`N${i + 1}`).value = { formula: `L$${linhaDiff}*0.005` };

      worksheet.getCell(`P${i + 1}`).numFmt = currencyFormat;
      worksheet.getCell(`P${i + 1}`).value = {
        formula: `SUM(L$${linhaDiff})-(M$${linhaDiff}+N$${linhaDiff}+O$${linhaDiff})`,
      };

      worksheet.getCell(`U${i + 1}`).numFmt = currencyFormat;
      worksheet.getCell(`U${i + 1}`).value = {
        formula: `SUM(T$${linhaDiff}*0.00015)*0.0738+(T$${linhaDiff}*0.00015)`,
      };

      worksheet.getCell(`X${i + 1}`).numFmt = currencyFormat;
      worksheet.getCell(`X${i + 1}`).value = {
        formula: `SUM(W$${linhaDiff}*0.04)*(7.38%)+(W$${linhaDiff}*0.04%)`,
      };

      worksheet.getCell(`Y${i + 1}`).numFmt = currencyFormat;
      worksheet.getCell(`Y${i + 1}`).value = {
        formula: `SUM(P$${linhaDiff}+X$${linhaDiff})-(U$${linhaDiff}+W$${linhaDiff})`,
      };
    });
  }

  // Escrevendo o arquivo Excel
  workbook.xlsx
    .writeBuffer()
    .then((buffer) => {
      // Cria um Blob a partir do buffer
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      // Cria um URL para o Blob
      const url = window.URL.createObjectURL(blob);
      // Cria um link para o URL
      const link = document.createElement('a');
      link.href = url;
      // Define o nome do arquivo
      link.download = 'ctes.xlsx';
      // Adiciona o link ao documento
      // Simula um clique no link para iniciar o download
      link.click();
      // Limpa o URL criado
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error('Erro ao gerar a planilha:', error);
    });
}

const cellsConfig = {
  A: {
    numberFormat: currencyFormat,
    alignment: {
      horizontal: 'center',
      vertical: 'middle',
    },
    border: {
      top: { style: 'double', color: { rgb: '000' } },
      left: { style: 'double', color: { rgb: '000' } },
      bottom: { style: 'double', color: { rgb: '000' } },
      right: { style: 'double', color: { rgb: '000' } },
    },
    fill: {},
  },
};
