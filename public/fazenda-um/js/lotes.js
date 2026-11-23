/*
 * Dados dos lotes da Fazenda Um. FONTE ÚNICA: a fazenda atualiza só este arquivo.
 *
 * Cada campo da ficha tem um valor `v` e uma origem:
 *   f: "fonte"   -> confirmado em fonte pública (nome da fonte em `fonte`)
 *   f: "regiao"  -> vale para a região inteira, não para o lote
 *   f: "exemplo" -> DADO DE EXEMPLO, sem fonte. Aparece marcado (data-placeholder) e deve ser trocado.
 *
 * O desenho dos lotes (`pontos`, no quadro 160 x 100) é ESQUEMÁTICO, não geográfico.
 */
(function () {
const S = { ect: "European Coffee Trip", site: "fazendaum.com", utl: "Untold Coffee Lab" };
const ex = (v) => ({ v, f: "exemplo" });
const fonte = (v, de) => ({ v, f: "fonte", fonte: de });
const reg = (v, de) => ({ v, f: "regiao", fonte: de });

const MINAS = "1.150 a 1.300 m";
const CAPARAO = "1.050 a 1.800 m";

window.FAZENDA_LOTES = {
  rotulosCampos: { altitude: "Altitude da região", area: "Área", pes: "Pés", ano: "Plantio", sombra: "Sombra", processo: "Processo" },
  regioes: [
    {
      id: "minas",
      nome: "Minas Gerais",
      lugar: "Serra da Mantiqueira, Sul de Minas",
      altitude: MINAS,
      relevo: [ { x: 118, y: 24, h: 1.0, r: 46 }, { x: 52, y: 70, h: 0.45, r: 38 }, { x: 92, y: 88, h: 0.2, r: 30 } ],
      // cenário ILUSTRATIVO do mapa (água, rio, estrada, marcos): não é levantamento da fazenda
      agua: [ [[2,82],[14,78],[28,81],[38,88],[30,97],[12,99],[0,93]] ],
      rotulosAgua: [ { x: 18, y: 91, nome: "represa" } ],
      rios: [ [[38,93],[54,96],[78,97],[104,96],[128,93],[146,90],[166,92]] ],
      estradas: [ [[-6,46],[8,44],[18,38],[30,30]], [[150,50],[156,40],[166,34]] ],
      marcos: [ { tipo: "sede", x: 10, y: 60, nome: "sede" } ],
      lotes: [
        { produtos: ["catuai-vermelho"], id: "catuai-vermelho", nome: "Catuaí Vermelho", variedade: "Catuaí Vermelho", rotulo: ["Catuaí", "Vermelho"],
          pontos: [[30,30],[60,12],[64,34],[70,62],[24,70]],
          nota: "Uma das três primeiras variedades plantadas.",
          campos: { altitude: reg(MINAS, S.site), area: ex("14 ha"), pes: ex("20.000"), ano: ex("2011"), sombra: reg("Na fazenda: árvores de sombra, como a graviola", S.ect), processo: ex("a confirmar") } },
        { produtos: ["pink-bourbon"], destaque: true, id: "pink-bourbon", nome: "Talhão do Pink Bourbon", variedade: "Pink Bourbon", rotulo: ["Pink", "Bourbon"],
          pontos: [[60,12],[100,10],[96,30],[64,34]],
          nota: "30 a 60 sacas por ano. Dali veio o café do campeonato mundial.",
          campos: { altitude: reg(MINAS, S.site), area: ex("9 ha"), pes: fonte("15.000", S.ect), ano: ex("2012"), sombra: reg("Na fazenda: árvores de sombra, como a graviola", S.ect), processo: fonte("Darkroom natural", S.utl) } },
        { produtos: ["nanolotes-gesha", "nanolotes-wush-wush"], id: "geisha-wush-wush", nome: "Geisha e Wush Wush", variedade: "Geisha e Wush Wush", rotulo: ["Geisha e", "Wush Wush"],
          pontos: [[100,10],[135,22],[150,50],[122,44],[96,30]],
          nota: "Testadas sob sombra mais pesada.",
          campos: { altitude: reg(MINAS, S.site), area: ex("4 ha"), pes: ex("6.000"), ano: ex("2013"), sombra: fonte("Mais pesada", S.ect), processo: ex("a confirmar") } },
        { produtos: ["bourbon-amarelo"], id: "bourbon-amarelo", nome: "Bourbon Amarelo", variedade: "Bourbon Amarelo", rotulo: ["Bourbon", "Amarelo"],
          pontos: [[64,34],[96,30],[122,44],[104,64],[70,62]],
          nota: "Uma das três primeiras variedades plantadas.",
          campos: { altitude: reg(MINAS, S.site), area: ex("12 ha"), pes: ex("18.000"), ano: ex("2011"), sombra: reg("Na fazenda: árvores de sombra, como a graviola", S.ect), processo: ex("a confirmar") } },
        { produtos: ["mundo-novo"], id: "mundo-novo", nome: "Mundo Novo", variedade: "Mundo Novo", rotulo: ["Mundo", "Novo"],
          pontos: [[24,70],[70,62],[104,64],[100,90],[55,88]],
          nota: "Uma das três primeiras variedades plantadas.",
          campos: { altitude: reg(MINAS, S.site), area: ex("16 ha"), pes: ex("24.000"), ano: ex("2011"), sombra: reg("Na fazenda: árvores de sombra, como a graviola", S.ect), processo: ex("a confirmar") } },
        { outros: ["vale-da-lua", "sweetheart"], id: "demais-minas", nome: "Demais variedades", variedade: "Mais de 38 no total", rotulo: ["Demais", "variedades"],
          pontos: [[122,44],[150,50],[140,80],[100,90],[104,64]],
          nota: "A fazenda tem mais de 38 variedades plantadas.",
          campos: { altitude: reg(MINAS, S.site), area: ex("10 ha"), pes: ex("12.000"), ano: ex("2014"), sombra: reg("Na fazenda: árvores de sombra, como a graviola", S.ect), processo: ex("a confirmar") } }
      ]
    },
    {
      id: "caparao",
      nome: "Caparaó",
      lugar: "Alto Caparaó, Espírito Santo",
      altitude: CAPARAO,
      relevo: [ { x: 120, y: 16, h: 1.3, r: 38 }, { x: 34, y: 66, h: 0.5, r: 30 }, { x: 84, y: 54, h: 0.7, r: 34 } ],
      // cenário ILUSTRATIVO do mapa (rio, estrada, marcos): não é levantamento da fazenda
      rios: [ [[166,58],[156,70],[146,80],[132,88],[124,98],[118,106]] ],
      estradas: [ [[-6,60],[8,56],[16,48],[22,40]] ],
      marcos: [ { tipo: "pico", x: 154, y: 12, nome: "serra" }, { tipo: "sede", x: 10, y: 76, nome: "sede" } ],
      lotes: [
        { blends: ["blend-i-lemon-zest"], id: "catuai-81", nome: "Catuaí 81", variedade: "Catuaí 81", rotulo: ["Catuaí 81"],
          pontos: [[22,40],[60,10],[84,28],[52,44]],
          nota: "Uma das variedades do Caparaó.",
          campos: { altitude: reg(CAPARAO, S.site), area: ex("8 ha"), pes: ex("14.000"), ano: ex("2019"), sombra: ex("a confirmar"), processo: ex("a confirmar") } },
        { produtos: ["catucai-785"], id: "catucai-785", nome: "Catucaí 785", variedade: "Catucaí 785", rotulo: ["Catucaí 785"],
          pontos: [[60,10],[110,8],[116,40],[84,28]],
          nota: "Uma das variedades do Caparaó.",
          campos: { altitude: reg(CAPARAO, S.site), area: ex("7 ha"), pes: ex("12.000"), ano: ex("2019"), sombra: ex("a confirmar"), processo: ex("a confirmar") } },
        { produtos: ["microlote-paraiso"], id: "paraiso", nome: "Paraíso", variedade: "Paraíso", rotulo: ["Paraíso"],
          pontos: [[110,8],[146,30],[144,70],[104,68],[116,40]],
          nota: "Uma das variedades do Caparaó.",
          campos: { altitude: reg(CAPARAO, S.site), area: ex("9 ha"), pes: ex("15.000"), ano: ex("2019"), sombra: ex("a confirmar"), processo: ex("a confirmar") } },
        { id: "sl28", nome: "SL28", variedade: "SL28", rotulo: ["SL28"],
          pontos: [[52,44],[84,28],[116,40],[104,68],[70,66]],
          nota: "Uma das variedades do Caparaó.",
          campos: { altitude: reg(CAPARAO, S.site), area: ex("5 ha"), pes: ex("8.000"), ano: ex("2020"), sombra: ex("a confirmar"), processo: ex("a confirmar") } },
        { blends: ["blend-i-lemon-zest"], id: "catimor", nome: "Catimor", variedade: "Catimor", rotulo: ["Catimor"],
          pontos: [[22,40],[52,44],[70,66],[60,90],[26,70]],
          nota: "Uma das variedades do Caparaó.",
          campos: { altitude: reg(CAPARAO, S.site), area: ex("6 ha"), pes: ex("10.000"), ano: ex("2019"), sombra: ex("a confirmar"), processo: ex("a confirmar") } },
        { produtos: ["arara-1"], regiaoEx: true, id: "arara", nome: "Arara", variedade: "Arara", rotulo: ["Arara"],
          pontos: [[70,66],[104,68],[144,70],[112,92],[60,90]],
          nota: "Entre as 16 a 17 variedades da fazenda.",
          campos: { altitude: reg(CAPARAO, S.site), area: ex("5 ha"), pes: ex("9.000"), ano: ex("2020"), sombra: ex("a confirmar"), processo: ex("a confirmar") } }
      ]
    }
  ]
};
})();
if (typeof module !== "undefined") module.exports = window.FAZENDA_LOTES;
