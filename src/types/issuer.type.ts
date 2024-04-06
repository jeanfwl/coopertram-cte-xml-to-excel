type Nfe = {
  chave: string;
};

type Issuer = {
  vPrest: {
    vTPrest: number;
    vRec: number;
  };
  imp: {
    ICMS: {
      ICMS00: {
        pICMS: number;
        vICMS: number;
      };
    };
  };
  infCTeNorm: {
    infCarga: {
      vCarga: number;
      proPred: string;
    };
    infDoc: {
      infNFe: Nfe[] | Nfe;
    };
  };
};
