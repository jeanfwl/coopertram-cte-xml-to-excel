const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');

const parser = new XMLParser();
let jObj = parser.parse(`
<cteProc xmlns="http://www.portalfiscal.inf.br/cte" versao="4.00">
<CTe xmlns="http://www.portalfiscal.inf.br/cte">
<infCte versao="4.00" Id="CTe41240428849505000144570010000712731000712739">
<ide>
<cUF>41</cUF>
<cCT>00071273</cCT>
<CFOP>6352</CFOP>
<natOp>Prest servico de transporte a estabel industrial Outros Esta</natOp>
<mod>57</mod>
<serie>1</serie>
<nCT>71273</nCT>
<dhEmi>2024-04-01T12:58:16-03:00</dhEmi>
<tpImp>1</tpImp>
<tpEmis>1</tpEmis>
<cDV>9</cDV>
<tpAmb>1</tpAmb>
<tpCTe>0</tpCTe>
<procEmi>0</procEmi>
<verProc>NDDigital CTe 4.8.5</verProc>
<cMunEnv>4113908</cMunEnv>
<xMunEnv>MALLET</xMunEnv>
<UFEnv>PR</UFEnv>
<modal>01</modal>
<tpServ>0</tpServ>
<cMunIni>4113908</cMunIni>
<xMunIni>MALLET</xMunIni>
<UFIni>PR</UFIni>
<cMunFim>3205002</cMunFim>
<xMunFim>SERRA</xMunFim>
<UFFim>ES</UFFim>
<retira>1</retira>
<indIEToma>1</indIEToma>
<toma3>
<toma>0</toma>
</toma3>
</ide>
<compl>
<xObs>UF/CT-e: P1/71273 - Emit.: 100 - Resp.: PAOLA - Vlr p/ Seg: 85629.68 - - VALE PEDAGIO RECEBIDO ANTECIPADAMENTE. ATENCAO NOTA DE DESCARGA SO PODE SER EMITIDA EM NOME DO COOPERADO PESSOA FISICA, NAO DEVE SER FEITA EMISSAO EM NOME DA COOPERTRAM. carga 0287571. VALOR PEDAGIO: 688,59N PROTOCOLO: 87496292-3EMPRESA: 12815827000132 ROADCARD TAGResponsavel pelo pedagio: 75.655.720/0001-94 - Vlr Aprox. Tributos: 1234.50 (10.65%)</xObs>
<ObsCont xCampo="Subcontratado:">
<xTexto>Subcontr: 06288158917-JOHN LENNON KOWALCZYK - RUA RUA SETE DE SETEMBRO, 976 MALLET-PR, Veic: HBG6I90-PR.</xTexto>
</ObsCont>
<ObsCont xCampo="SubcontrMsg">
<xTexto>ICMS SOBRE SERVICO DE TRANSPORTE SERA PAGO PELO CONTRATANTE. O TRANSPORTADOR OPTOU PELO CREDITO PRESUMIDO DE QUE TRATA O ITEM 48 ANEXO III RICMS/2012 - PR</xTexto>
</ObsCont>
<ObsCont xCampo="PLACA">
<xTexto>HBG6I90</xTexto>
</ObsCont>
<ObsCont xCampo="TRANSPPROPRIO">
<xTexto>N</xTexto>
</ObsCont>
<ObsCont xCampo="RGMOTORISTA">
<xTexto>104968465</xTexto>
</ObsCont>
<ObsCont xCampo="CPFMOTORISTA">
<xTexto>06288158917</xTexto>
</ObsCont>
</compl>
<emit>
<CNPJ>28849505000144</CNPJ>
<IE>9077050300</IE>
<xNome>COOPERTRAM - COOP. DE TRANSP. DE CARGAS</xNome>
<xFant>COOPERTRAM - COOP. DE TRANSP. DE CARGAS</xFant>
<enderEmit>
<xLgr>AVENIDA-AV. BARAO DO RIO BRANCO</xLgr>
<nro>857</nro>
<xBairro>CENTRO</xBairro>
<cMun>4113908</cMun>
<xMun>MALLET</xMun>
<CEP>84570000</CEP>
<UF>PR</UF>
<fone>4235421989</fone>
</enderEmit>
<CRT>3</CRT>
</emit>
<rem>
<CNPJ>75655720000194</CNPJ>
<IE>3040018017</IE>
<xNome>SEPAC SERRADOS E PASTA DE CELULOSE LTDA</xNome>
<xFant>SEPAC SERRADOS E PASTA DE CELU</xFant>
<fone>4235428000</fone>
<enderReme>
<xLgr>AVENIDA-DOS TRABALHADORES</xLgr>
<nro>2678</nro>
<xBairro>VILA CAROLINE</xBairro>
<cMun>4113908</cMun>
<xMun>MALLET</xMun>
<CEP>84570000</CEP>
<UF>PR</UF>
<cPais>1058</cPais>
<xPais>BRASIL</xPais>
</enderReme>
<email>contablidade@sepac.com.br</email>
</rem>
<dest>
<CNPJ>28410074000387</CNPJ>
<IE>082974993</IE>
<xNome>ATACADO SAO PAULO LTDA</xNome>
<fone>2721215098</fone>
<enderDest>
<xLgr>RUA-NESTOR GUISSO DISTRITO DE CARAPINA</xLgr>
<nro>553</nro>
<xBairro>BOA VISTA II</xBairro>
<cMun>3205002</cMun>
<xMun>SERRA</xMun>
<CEP>29161019</CEP>
<UF>ES</UF>
<cPais>1058</cPais>
<xPais>BRASIL</xPais>
</enderDest>
<email>nfe@atacadosaopaulo.com.br</email>
</dest>
<vPrest>
<vTPrest>11591.55</vTPrest>
<vRec>11591.55</vRec>
<Comp>
<xNome>VLR FRETE</xNome>
<vComp>11591.55</vComp>
</Comp>
</vPrest>
<imp>
<ICMS>
<ICMS00>
<CST>00</CST>
<vBC>11591.55</vBC>
<pICMS>7.00</pICMS>
<vICMS>811.41</vICMS>
</ICMS00>
</ICMS>
<vTotTrib>1234.50</vTotTrib>
<infAdFisco>NT 05/2013 - LEI DA TRANSPARENCIA</infAdFisco>
</imp>
<infCTeNorm>
<infCarga>
<vCarga>85629.68</vCarga>
<proPred>PAPEL HIGIENICO</proPred>
<infQ>
<cUnid>01</cUnid>
<tpMed>PESO CONTRATADO</tpMed>
<qCarga>8946.4000</qCarga>
</infQ>
<infQ>
<cUnid>01</cUnid>
<tpMed>PESO DECLARADO</tpMed>
<qCarga>8946.4000</qCarga>
</infQ>
<infQ>
<cUnid>03</cUnid>
<tpMed>VOLUME TRANSP.</tpMed>
<qCarga>1521.0000</qCarga>
</infQ>
<vCargaAverb>85629.68</vCargaAverb>
</infCarga>
<infDoc>
<infNFe>
<chave>41240475655720000194550010006847981478651169</chave>
<dPrev>2024-04-10</dPrev>
</infNFe>
</infDoc>
<infModal versaoModal="4.00">
<rodo>
<RNTRC>50768188</RNTRC>
</rodo>
</infModal>
</infCTeNorm>
<autXML>
<CNPJ>04898488000177</CNPJ>
</autXML>
<autXML>
<CNPJ>21114342000102</CNPJ>
</autXML>
<autXML>
<CPF>74870122987</CPF>
</autXML>
<infRespTec>
<CNPJ>06255692000103</CNPJ>
<xContato>Jackson Antonio Cenci</xContato>
<email>produtos.edocs@ndd.com.br</email>
<fone>554932518000</fone>
</infRespTec>
</infCte>
<infCTeSupl>
<qrCodCTe>http://www.fazenda.pr.gov.br/cte/qrcode?chCTe=41240428849505000144570010000712731000712739&tpAmb=1</qrCodCTe>
</infCTeSupl>
<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
<SignedInfo>
<CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
<SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
<Reference URI="#CTe41240428849505000144570010000712731000712739">
<Transforms>
<Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
<Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
</Transforms>
<DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
<DigestValue>UausAMk/zyxKRmAXfPVwB7gpm0w=</DigestValue>
</Reference>
</SignedInfo>
<SignatureValue>AmcwmPKo6+XO1huB2VsRpXc2JuCSKxlmnhXK9UPbTYGbWllUo9MY7zatYA4qNuK3gbrRJ3OMW89S9T+UJMYbw8gnNSyIt/2IJAyQ9sleRzgZ+uvrc7hkV4dRP251n5t1COBWvfyd7W1jrDf0vrNSFIcl0fzxdfGXo2PhvXx2/uB1olK1qHQVVDn6FSEdihWp44MewR7k5b/eqEcGlUiJbUV3FFDHYJ+1fvwEJuKxtIqi2EC8eULvCbCEKbzSEMUbpOB0XBQfg+lVxm4r1eZg80F66MBrVGfzT+NgAay2O0941NFV2SwQkzHco5mg5YHpzyL9a3ZcXrDH887kQUnIyQ==</SignatureValue>
<KeyInfo>
<X509Data>
<X509Certificate>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</X509Certificate>
</X509Data>
</KeyInfo>
</Signature>
</CTe>
<protCTe versao="4.00">
<infProt Id="ID141240088955956">
<tpAmb>1</tpAmb>
<verAplic>PR-v4.0.77</verAplic>
<chCTe>41240428849505000144570010000712731000712739</chCTe>
<dhRecbto>2024-04-01T12:58:24-03:00</dhRecbto>
<nProt>141240088955956</nProt>
<digVal>UausAMk/zyxKRmAXfPVwB7gpm0w=</digVal>
<cStat>100</cStat>
<xMotivo>Autorizado o uso do CT-e</xMotivo>
</infProt>
</protCTe>
</cteProc>`);

console.log(jObj);
console.log(jObj.cteProc);
