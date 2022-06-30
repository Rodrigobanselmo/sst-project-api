import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

//* document example (TOXILAB) form page 12 to 30

export const definitionsSection: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.H1,
          text: 'DEFINIÇÕES',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Qualquer discussão sobre Riscos deve ser precedida de uma explicação da terminologia, seu sentido preciso e inter-relacionamentos. Desta forma, passamos a definir os principais termos utilizados neste nosso estudo:',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Ação Corretiva:** Ação para eliminar a causa de uma não conformidade identificada ou outra situação indesejável. É executada para prevenir a repetição; ',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Ação Preventiva:** Ação para eliminar a causa de um potencial não conformidade ou outra situação po-tencialmente indesejável. É executada para prevenir a ocorrência;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Acidente do Trabalho:** São ocorrências de menos frequência, que se restringem na maior parte das vezes a uma pessoa, não passando dos limites da empresa envolvida. Por exemplo: cortes, queimaduras térmicas/químicas, torções etc.;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Acidente:** É um incidente que resultou em lesão, doença ou fatalidade;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Acidentes Maiores/Acidentes Químicos Ampliados:** São eventos de maior gravidade e de frequência significativamente menor, cujas consequências se es-tendem a um maior número de pessoas. Estes eventos causam grandes perdas as próprias instalações da empresa, podendo ultrapassar os seus limites geográficos e causam substanciais danos ambientais;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Agente Biológico:** Microrganismos, parasitas ou materiais originados de organismos que, em função de sua natureza e do tipo de exposição, são capazes de acarretar lesão ou agravo à saúde do trabalhador. Exemplos: bacté-ria Bacillus anthracis, vírus linfotrópico da célula T humana, príon agente de doença de Creutzfeldt-Jakob, fungo Coccidioides immitis **(NR-01 Anexo I);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Agente Físico:** Qualquer forma de energia que, em função de sua natureza, intensidade e exposição, é capaz de causar lesão ou agravo à saúde do trabalhador. Exemplos: ruído, vibrações, pressões anormais, temperaturas extremas, radiações ionizantes, radiações não ionizantes. **Observação:** Critérios sobre iluminamento, conforto térmico e conforto acústico da NR-17 não constituem agente físico para fins da NR-09 **(NR-01 Anexo I).**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Agente Químico:** : Substância química, por si só ou em misturas, quer seja em seu estado natural, quer seja produzida, utili-zada ou gerada no processo de trabalho, que em função de sua natureza, concentração e exposição, é capaz de causar lesão ou agravo à saúde do trabalhador. **Exemplos:** : fumos de cádmio, poeira mineral contendo sílica cristalina, vapores de tolueno, névoas de ácido sulfúri-co. **(NR-01 Anexo I);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Agentes Biológicos:** Considera-se Risco Biológico a probabilidade da exposição ocupacional a agentes biológicos, definidos como microrganismos, geneticamente modificados ou não; as culturas de células; os parasitas; as toxinas e os príons **(NR-32);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Agentes Químicos – Fumos:** partículas sólidas, produzidas por condensação ou oxidação de vapores de substâncias que são sólidas a temperatura normal;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Agentes Químicos – Gases:** denominação dada às substâncias que, em Condições Normais de Pressão e Temperatura – CNTP (25º C e 760mmHg) estão em fase gasosa;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Agentes Químicos – Neblinas:** partículas líquidas, produzidas por condensação de vapores de substâncias que são líquidas a temperatura normal;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Agentes Químicos – Nevoas:** partículas líquidas, produzidas por ruptura mecânica de líquidos, tais como a nebulização, borbulhamento, spray e respingo;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Agentes Químicos – Poeiras:** partículas sólidas, produzidas por ruptura mecânica de sólidos, tais como moa-gem, trituração, esmerilhamento, polimento, explosão, abrasão, corte etc.;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Agentes Químicos – Vapores:** fase gasosa de uma substância, que em CNTP encontra-se no estado líquido ou sólido;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Agentes Químicos – Vias de Absorção – Cutâneo:** o contato da pele com determinados agentes químicos pode desenvolver as seguintes alterações: o agente químico pode agir diretamente na pele e provocar irritação local primária; a substância química pode combinar com as substâncias protetoras da pele e provocar uma sensibilização local; o agente pode penetrar através da pele, diluir-se no sangue e atuar como tóxico de forma generalizada;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Agentes Químicos – Vias de Absorção – Digestiva:** ocorre somente de forma acidental;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Agentes Químicos – Vias de Absorção – Respiratória ou inalatória:** constitui a principal via de absorção de tóxicos, devido não só a grande quantidade de ar inalado durante a jornada de trabalho, como também a grande superfície dos alvéolos pulmonares. As substâncias penetram pelo nariz e pela boca, atuando na garganta e nos pulmões, em virtude da grande permeabilidade da parede alveolar da rica vasculari-zação. Os gases e os vapores são rapidamente absorvidos e diluídos no sangue, que por sua vez serão distribuídos para outras regiões do organismo. Algumas vezes, eles podem retidos em nível alveolar e de-senvolver uma ação localizada:',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Agentes Químicos:** Consideram-se agentes químicos as substâncias, compostos ou produtos que possam penetrar no organismo pela via cutânea, digestiva ou respiratória, nas formas sólida, líquida ou gasosa, tais como: poeiras minerais ou vegetais, fumos metálicos, névoas, neblinas, gases ou vapores e outros, ou que, pela natureza da atividade possam se apresentar potencializados pelo pela reação ou transforma-ção química entre os corpos;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Ainda desconhecidos, mas que são perfeitamente identificáveis através de metodologias já́ empregadas pela empresa:** Ex. Armazenamento de produtos tóxicos e inflamáveis em áreas de presença permanente de pessoas. A aplicação da inspeção planejada no almoxarifado constatou que estavam armazenando produto tóxico e inflamável em locais que poderiam prejudicar a saúde das pessoas e provocar um in-cêndio;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Atmosfera IPVS:** atmosfera que apresenta uma ameaça imediata à vida; pode causar efeitos adversos irreversíveis à saúde ou pode diminuir a capacidade das pessoas de escaparem de atmosferas perigosas. Os valores da concentração IPVS são obtidos sob o título IDHL (Immediately Dangerous to Health and Life) apresentados pelo NIOSH na publicação Pocket Guide to Chemical Hazards. (PPR – FUNDACENTRO 4ª Edição 2016);',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Avaliação do Risco:** Todo o processo de estimação da magnitude dos riscos e de decisão a respeito da capacidade de se tolerar ou não tais riscos;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Avaliação dos Indicadores Biológicos:** Exames realizados com o objetivo de demonstrar/quantificar o nível de exposição/absorção dos agentes pelo indivíduo;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Avaliação Qualitativa:** Caracterização preliminar dos riscos ambientais a partir da identificação dos Fato-res de Riscos e Perigos presentes no ambiente de trabalho ou decorrentes do processo produtivo, da ca-tegorização dos seus efeitos à saúde, da listagem e do tempo de execução das tarefas desempenhadas pelos empregados;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Avaliação Quantitativa:** Determinação das concentrações dos agentes químicos e biológicos ou intensi-dade dos agentes físicos, através de metodologias de Higiene Ocupacional;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**CA:** Certificado de Aprovação;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Canteiro de obra:** área de trabalho fixa e temporária, onde se desenvolvem operações de apoio e exe-cução à construção, demolição ou reforma de uma obra. **(NR-01 Anexo I);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Causa:** é a origem de caráter humano ou material relacionada com o evento catastrófico (acidente), pela materialização de um risco, resultando danos.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**CIPA:** Comissão Interna de Prevenção de Acidentes: comissão no âmbito das empresas, privadas e públi-cas, regulamentada pela CLT, nos artigos 162 a 165, e pela NR 5;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Classificação de Riscos:** Processo global de estimar a magnitude do risco e de decisão sobre se o risco é ou não tolerável; ou, Processo de avaliação de riscos provenientes de perigos, levando em considera-ção a adequação de qualquer controle existente, e decidindo se o risco é ou não aceitável. Neste do-cumento os Fatores de Riscos e Perigos são classificados em 5 (cinco) níveis, sedo estes: 1º Muito Baixo (MB); 2º Baixo (B); Moderado (M); Alto (A); Muito Alto (MA);',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**CNAE:** Classificação Nacional de Atividades Econômicas: elaborada sob coordenação da Secretaria da Receita Federal e orientação técnica do IBGE, aprovada e divulgada pela CONCLA (Comissão Nacional de Classificação), a CNAE objetiva registrar, catalogar e classificar pesquisas estatísticas nacionais no contexto de globalização da economia, mantendo compatibilidade com a Classificação Internacional da ONU (NR 4, da Portaria/MTb n.º 3.214/1978, de 6 de julho de 1978). <link>http://www.mte.gov.br|www.mte.gov.br<link>;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Confiabilidade:** é quantitativamente definida como sendo a probabilidade que um componente, disposi-tivo, equipamento ou sistema desempenhe satisfatoriamente suas funções por um determinado espaço de tempo e sob um dado conjunto de condições de operação;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Conhecidos e já́ devidamente controlados:** Ex. Sala de transformadores isolada e fechada. Casa de máqui-nas e compressores com elevado nível de ruído, totalmente fechada e sinalizada;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Conhecidos, porém ainda não aceitavelmente controlados:** Ex. O produto químico Hexano ainda é muito utilizado em alguns tipos de solventes, podendo gerar problemas a saúde do trabalhador. Uma escada com degraus pequenos onde é necessário transportar volumes grandes, foi colocado um piso antiderra-pante e placas de aviso, mas o risco de queda contínua;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Consequência/Dano:** é a medida do resultado de um acidente do trabalho ou de acidentes maiores. Também pode ser definido como sendo a gravidade da perda humana, material ou financeira, ou a re-dução da capacidade de desempenho de uma função pré-determinada em um dado sistema;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Considerando os conceitos apresentados podemos classificar os riscos de uma instalação, da seguinte maneira:',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**dB(A):** (dê-bê-a) Indicação do nível de intensidade sonora medida com instrumento de nível de pressão sonora operando no circuito de compressão “A”. O dB(A) é usado para definir limites de ruídos contínuos ou intermitentes;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Deficiência de Oxigênio:** Pelo Anexo III da Norma Regulamentadora 33, define-se deficiência de oxigênio uma atmosfera contendo menos de 20,9% de oxigênio em volume na pressão atmosférica normal, a não ser que a redução do percentual seja devidamente monitorada e controlada;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Doenças Profissionais:** São todos os males aos quais a saúde humana está exposta, devido as atividades profissionais desenvolvidas. Estas doenças são causadas principalmente pela exposição crônica a deter-minados agentes físicos, químicos ou biológicos;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Empregador:** a empresa individual ou coletiva que, assumindo os riscos da atividade econômica, admite, assalaria e dirige a prestação pessoal de serviços. Equiparam-se ao empregador as organizações, os pro-fissionais liberais, as instituições de beneficência, as associações recreativas ou outras instituições sem fins lucrativos, que admitam trabalhadores como empregados. **(NR-01 Anexo I);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**EPC:** Equipamentos de Proteção Coletiva: todos e quaisquer dispositivos de uso coletivo, de fabricação nacional ou estrangeira, destinados a proteger a saúde e a integridade física dos trabalhadores;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**EPI:** Equipamentos de Proteção Individual: todos e quaisquer dispositivos de uso individual, de fabricação nacional ou estrangeira, destinados a proteger a saúde e a integridade física dos trabalhadores. De acordo com a NR 6 torna-se obrigatório a toda empresa o fornecimento gratuito, aos empregados, de EPI em perfeito estado de conservação e funcionamento e adequados aos riscos profissionais;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Estabelecimento:** local privado ou público, edificado ou não, móvel ou imóvel, próprio ou de terceiros, onde a empresa ou a organização exerce suas atividades em caráter temporário ou permanente. **(NR-01 Anexo I);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Evento perigoso:** Ocorrência ou acontecimento com o potencial de causar lesões ou agravos à saúde. **(NR-01 Anexo I);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Exposição:** A situação ou condição de uma ou mais pessoas que podem estar sujeitas à interação com agentes ou fatores de riscos;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**FISPQ:** Ficha de Informação de Segurança de Produto Químico;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**FPMR:** Fator de Proteção Mínimo Requerido (Manual de Proteção Respiratória – Fundacentro)',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Frente de trabalho:** área de trabalho móvel e temporária. Local de trabalho: área onde são executados os trabalhos. **(NR-01 Anexo I);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Grau de risco:** classificação adotada pelos Ministérios do Trabalho e Emprego e da Previdência e Assistên-cia Social que fixa uma escala crescente para os riscos presentes nos diferentes ramos da atividade eco-nômica;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Grupo Similar de Exposição – GSE:** grupo de trabalhadores que experimentam exposição semelhante, de forma que o resultado fornecido pela avaliação de qualquer membro do grupo, seja representativo do grupo como um todo;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Higiene Ocupacional:** É a ciência e arte dedicadas à prevenção, reconhecimento, avaliação e controle dos fatores ambientais ou tensões emanadas ou provocadas pelo local de trabalho, e que pode ocasio-nar enfermidades, destruir a saúde e o bem-estar, ou criar algum mal-estar significativo entre aos traba-lhadores ou cidadãos da comunidade;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**IBUTG: índice de bulbo úmido-termômetro de globo:** Índice usado para avaliação da exposição ao calor;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**IDLH (IPVS):** Concentração máxima imediatamente perigosa para a vida ou saúde, da qual o trabalhador poderá escapar, dentro de 30 minutos, sem sintomas graves nem efeitos irreversíveis para a saúde (NIOSH/OSHA/EUA);',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Incidente:** qualquer evento ou fato negativo com potencial para provocar danos. É também chamado de “quase-acidente”. Atualmente, este conceito tem sido muito contestado, uma vez que pela defini-ção de acidentes, estes se confundiriam, ficando a diferença em se ter ou não lesão.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Índice de Julgamento (IJ):** É um conceito estatístico extraído da INSTRUÇÃO NORMATIVA Nº 1 DE 20 DE DE-ZEMBRO DE 1995 que trata da AVALIAÇÃO DAS CONCENTRAÇÕES DE BENZENO EM AMBIENTES DE TRABA-LHO, mas que pode ser extrapolada para qualquer Fator de Risco Químico, o qual na referida IN é expres-so pela fórmula: IJ = LSC (95%)  ÷ LC . Considerando que na IN 01 o LSC representa o critério de aceitabili-dade da exposição para efeito de comparação com o LEO, neste documento o IJ sofre a seguinte adaptação: IJ = MVUE ÷ LEO. Desta forma podemos dizer que o IJ é um índice estatístico que expressa uma relação percentual de quanto o resultado representativo da exposição do trabalhador (concentra-ção do FR no ambiente de trabalho) se aproxima ou se afasta do LEO, tendo este índice a referência central em 1 (um) sendo este índice equivalente a 100%, sendo assim, quanto mais abaixo de 1 for o IJ mais distante do LEO maior é a condição de aceitabilidade da exposição e menos ações de controles são necessárias, ao passo que quanto mais o IJ se aproximar ou superar o 1, maior o risco para o traba-lhador e consequentemente a condição de inaceitabilidade torna-se mais urgente e demanda ações ainda mais imediatas (Alex Abreu Marins). ',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**IPVS (Imediatamente Perigoso à Vida ou à Saúde):** Condição considerada imediatamente perigosa à vida ou à saúde. Refere-se à exposição respiratória aguda, que supõe uma ameaça direta de morte ou de consequências adversas irreversíveis à saúde, imediatas ou retardadas, ou exposição aguda aos olhos que impeça a fuga da atmosfera perigosa (ver atmosfera IPVS). (PPR – FUNDACENTRO 4ª Edição 2016);',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Limite de Exposição – Curta Duração – TLV-STEL2 (ACGIH-EUA):** concentração máxima a que os trabalhado-res podem estar expostos continuamente por um período curto, de até 15 minutos, sem sofrer irritação, lesão tissular crônica ou irreversível, narcose em grau suficiente para aumentar a predisposição a aciden-tes, impedir autossalvamento ou reduzir significativamente a eficiência no trabalho, desde que não sejam permitidas mais de 4 exposições diárias, com pelo menos 60 minutos de intervalo entre os períodos de exposição e também que não seja excedido o TLV-TWA. 2– STEL: Short Term Exposure Limit;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Limite de Exposição – Média Ponderada – TLV-TWA1 (ACGIH-EUA):** concentração média ponderada pelo tempo para uma jornada normal de 8 h diárias e 40 h semanais, para a qual a maioria dos trabalhadores pode estar repetidamente exposta, dia após dia, sem sofrer efeitos adversos a sua saúde. 1 – TLV-TWA: Treshold Limit Value – Time Weighted Average;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Limite de Exposição – Valor Teto (NR-15/Brasil), TLV-C3 (ACGIH-EUA):** concentração que não deverá ser ex-cedida durante nenhum momento de exposição na jornada. 3 – TLV – C – Treshold Limit Value, C- Ceiling (Teto);',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Limite de Tolerância – LT (NR-15/Brasil):** concentração ou intensidade máxima ou mínima, relacionada com a natureza e o tempo de exposição ao agente, que não causará dano à saúde do trabalhador, durante a sua vida laboral;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Limites de Exposição Ocupacional:** são os valores de limites de tolerância previstos na Norma Regulamen-tadora n.º 15 ou, na ausência de limites de tolerância previstos na NR-15 e seus anexos, devem ser utiliza-dos como referência para a adoção de medidas de prevenção aqueles previstos pela American Confe-rence of Governmental Industrial Higyenists – ACGIH. (NR-09 item 9.6.1.1);',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Medidas de Controle:** ações tomadas para eliminar, neutralizar e/ou minimizar os riscos de exposição aos agentes ambientais. Podem ser de âmbito coletivo (equipamento de proteção coletiva – EPC) ou indivi-dual (equipamento de proteção individual – EPI);',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Monitoramento:** é o processo periódico e sistemático da avaliação ambiental de agentes no ambiente;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**MTE:** Ministério do Trabalho e Emprego (antigo MTb – Ministério do Trabalho). <link>http://www.mte.gov.br|www.mte.gov.br<link>;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**MVUE: Minimum – Variance Unbiased Estimator:** Estimativa da Média Verdadeira obtida através de trata-mento estatístico;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Nível de Ação:** valor acima do qual devem ser iniciadas ações preventivas (monitoramento periódico, informação aos trabalhadores e controle médico) de forma a minimizar a probabilidade de que as expo-sições a agentes ambientais ultrapassem os limites de exposição. Para agentes químicos corresponde a metade dos limites de exposição ocupacional (NR-15, ACGIH, acordos coletivos) e para o ruído a dose de 0,5 (superior a 50%), conforme estabelecido na NR-15, Anexo 1, item 6 — Considera-se nível de ação, o valor acima do qual devem ser implementadas ações de controle sistemático de forma a minimizar a probabilidade de que as exposições ocupacionais ultrapassem os limites de exposição. (NR-09 item 9.6.1.2);',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**NR:** Norma Regulamentadora. Instituídas pelo Ministério do Trabalho, regulamentam e oferecem orienta-ções sobre procedimentos obrigatórios relacionados à medicina e segurança no trabalho;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Obra:** todo e qualquer serviço de engenharia de construção, montagem, instalação, manutenção ou reforma. **(NR-01 Anexo I);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Ordem de serviço de segurança e saúde no trabalho:** instruções por escrito quanto às precauções para evitar acidentes do trabalho ou doenças ocupacionais. A ordem de serviço pode estar contemplada em procedimentos de trabalho e outras instruções de SST. (NR-01 Anexo I);',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Organização:** pessoa ou grupo de pessoas com suas próprias funções com responsabilidades, autoridades e relações para alcançar seus objetivos. Inclui, mas não é limitado a empregador, a tomador de serviços, a empresa, a empreendedor individual, produtor rural, companhia, corporação, firma, autoridade, parce-ria, organização de caridade ou instituição, ou parte ou combinação desses, seja incorporada ou não, pública ou privada. **(NR-01 Anexo I);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Perigo ou fator de risco ocupacional/ Perigo ou fonte de risco ocupacional:** Fonte com o potencial de causar lesões ou agravos à saúde. Elemento que isoladamente ou em combinação com outros tem o potencial intrínseco de dar origem a lesões ou agravos à saúde. **(NR-01 Anexo I);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Perigo:** Situação ou condição de risco com probabilidade de causar lesão física ou dano à saúde das pessoas por ausência de medidas de controle;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Prevenção:** o conjunto das disposições ou medidas tomadas ou previstas em todas as fases da atividade da organização, visando evitar, eliminar, minimizar ou controlar os riscos ocupacionais. **(NR-01 Anexo I);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Probabilidade:** é a chance de ocorrência de uma falha que pode conduzir a um determinado acidente. Esta falha pode ser de um equipamento ou componente do mesmo, ou pode ser ainda uma falha huma-na.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Radiações Ionizantes:** Forma de energia, associada a partículas extremamente pequenas, acionadas a velocidades muito elevadas, que atinge o espaço (ex. raios gama, raios-X, etc.);',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Radiações não Ionizantes:** É uma radiação eletromagnética, cuja energia não é suficiente para ionizar os átomos dos meios nos quais incide ou atravessa (ex. microondas, ultravioleta, etc.);',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Radiações:** Definem-se como radiação as ondas de energia que se transmite pelo espaço como ondas eletromagnéticas. As absorções dessas ondas podem ser altamente lesivas. Podemos classificá-las em:',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Responsável técnico pela capacitação:** profissional legalmente habilitado ou trabalhador qualificado, con-forme disposto em NR específica, responsável pela elaboração das capacitações e treinamentos. **(NR-01 Anexo I);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Risco (Hazard):** uma ou mais condições de uma variável com potencial necessário para causar danos. Esses danos podem ser entendidos como lesões a pessoas, danos à equipamentos ou estruturas, perda de material em processo, ou redução da capacidade de desempenho de uma função pré-determinada. Havendo um risco, persistem as possibilidades de efeitos adversos;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Risco (Risk):** expressa uma probabilidade de possíveis danos dentro de um período especifico de tempo ou número de ciclos operacionais. O valor quantitativo do risco de uma dada instalação ou processo industrial pode ser conseguido multiplicando-se a probabilidade de ocorrência (taxa de falha) de um acidente pela medida da consequência/dano (perda material ou humana) causada por este acidente;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Risco Ocupacional:** Combinação da **probabilidade** de ocorrer lesão ou agravo à saúde, causados por um evento perigoso, exposição a agente nocivo ou exigência da atividade de trabalho e da **severidade** dessa lesão ou agravo à saúde. **(NR-01 Anexo I);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Risco:** Exposição de pessoas a perigos. O risco pode ser dimensionado em função da probabilidade e da gravidade do dano possível (GUIA DE ANÁLISE ACIDENTES DE TRABALHO – MTE 2010);',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Riscos Ambientais:** São os agentes físicos, químicos e biológicos existentes nos ambientes de trabalho que, em função de sua natureza, concentração ou intensidade e tempo de exposição são capazes de causar danos à saúde do trabalhador (NR-09);',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Ruído contínuo ou intermitente:** todo e qualquer ruído que não está classificado como ruído de impacto ou impulsivo;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Ruído de impacto ou impulsivo:** ruído que apresenta picos de energia acústica de duração inferior a 1 (um) segundo, a intervalos superiores a 1 (um) segundo;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Ruído:** Denomina-se ruído uma mistura de tons de diversas frequências, sendo que as mesmas diferem en-tre si por um valor ao poder de descriminação (em frequência) do ouvido. Som é um fenômeno físico on-dulatório resultante de variações da pressão num meio elástico, que se sucede com regularidade. Dentro do ambiente de trabalho da empresa, em geral, os sons são produzidos por máquinas ou equipamentos utilizados. Dessa forma, os trabalhadores mais expostos, são, por exemplo, operadores de maquinário es-pecializado, em comparação a outros setores administrativos. A exposição prolongada a níveis de ruído excessivo pode a curto, médio e longo prazo provocar prejuízo à saúde do trabalhador. A propagação do ruído se dá através do ar em forma de vibrações sonoras ou ondas sonoras. O ruído pode ser:',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Segurança:** é frequentemente definido como “isenção de riscos”. Entretanto é praticamente impossível a eliminação completa de todos os riscos. Podemos então definir segurança como, uma condição ou con-junto de condições que objetivam uma relativa proteção contra um determinado risco;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**SESMT:** Serviços Especializados em Engenharia de Segurança e em Medicina do Trabalho: estabelecidos pela NR 4;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Setor de serviço:** A menor unidade administrativa ou operacional compreendida no mesmo estabeleci-mento. **(NR-01 Anexo I);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Setor de serviço:** Subsetor (critério próprio);',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Sistema:** é um arranjo ordenado de componentes que estão inter-relacionados e que atuam e interatuam com outros sistemas, para cumprir uma determinada tarefa ou função (objetivo) previamente definida, em um ambiente. Um sistema pode conter ainda vários outros sistemas básicos, aos quais chamamos de subsistemas;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**SRT (Superintendência Regional do Trabalho):** Órgão do Ministério do Trabalho para execução das ativida-des relacionadas à segurança e à medicina do trabalho, nos limites de sua jurisdição, inclusive da Cam-panha Nacional de Prevenção de Acidentes do Trabalho (CANPAT), do Programa de Alimentação do Trabalhador (PAT) e da fiscalização do cumprimento dos preceitos legais e regulamentares nas áreas de sua alçada. <link>http://www.mte.gov.br|www.mte.gov.br<link>;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**SSST:** Secretaria de Segurança e Saúde no Trabalho: criada pela NR 1, da Portaria/MTb n.º 3.214/1978, atu-almente Departamento de Segurança e Saúde no Trabalho, criado pelo Decreto n.º 3.129/ 1999, de 9 de agosto de 1999, é o órgão de âmbito nacional competente para coordenar, orientar, controlar e super-visionar as atividades relacionadas com a segurança e a medicina do trabalho, além de fiscalizar o cum-primento dos preceitos legais e regulamentares sobre as áreas de sua alçada em todo o território nacio-nal, entre outras atribuições. (<link>https://www.gov.br/trabalho/pt-br|www.gov.br/trabalho/pt-br<link>);',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Temperaturas Extremas:** Várias são as atividades em que os trabalhadores podem estar expostos a tempe-raturas extremas que estão divididas em frio ou calor;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Totalmente desconhecidos por falta de informações que nos permita identificá-los:** Ex.: O ascarel era um pro-duto muito usado nos anos 70 em todo o mundo para refrigerar transformadores, até descobrirem que ele é altamente cancerígeno;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Trabalhador:** pessoa física inserida em uma relação de trabalho, inclusive de natureza administrativa, co-mo os empregados e outros sem vínculo de emprego. **(NR-01 Anexo I);**',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Umidade:** quando as atividades são exercidas em locais alagados com umidade excessiva, podem ocor-rer danos à saúde dos trabalhadores. A forma de contato com este agente se dá pelo contato;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Vibrações de Corpo Inteiro:** são aquelas provocadas pela operação com grandes máquinas, como, por exemplo, máquinas motorizadas com martelete pneumático;',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Vibrações Localizada:** são aquelas provocadas pelo uso de ferramentas manuais, elétricas ou pneumáti-cas; ',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Vibrações:** Definem-se como vibrações o ato ou efeito de vibrar, tremular ou oscilar. A utilização de de-terminadas máquinas ou equipamentos pode produzir nos operadores vibrações danosas. Podemos classi-ficar as vibrações em dois tipos:',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**VRT-Valor de Referência Tecnológico:** refere-se à concentração de benzeno no ar considerada exequível do ponto de vista técnico, definido em processo de negociação tripartite. O VRT deve ser considerado como referência para os programas de melhoria contínua das condições dos ambientes de trabalho. O cumprimento do VRT é obrigatório e não exclui risco à saúde.',
        },
      ],
    },
  ],
};