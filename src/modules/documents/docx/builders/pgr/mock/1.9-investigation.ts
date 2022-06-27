import { VariablesPGREnum } from '../enums/variables.enum';
import { PGRSectionChildrenTypeEnum } from '../types/elements.types';
import {
  IDocumentPGRSectionGroup,
  PGRSectionTypeEnum,
} from '../types/section.types';

export const investigation: IDocumentPGRSectionGroup = {
  footer: true,
  header: true,
  data: [
    {
      type: PGRSectionTypeEnum.SECTION,
      footerText: `??${VariablesPGREnum.CHAPTER_1}??`,
      children: [
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Ainda Relativo à investigação, será necessário:',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Após a investigação deverá ser elaborado um relatório sintético o qual será encaminhado ao gerente da empresa para as providências necessárias. Tal relatório deverá ser arquivado como um documento do programa.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'As análises de acidentes e doenças relacionadas ao trabalho devem ser documentadas e (NR-01 item 1.5.5.5.2):',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'd.  Considerar as situações geradoras dos eventos, levando em conta as atividades efetivamente desenvolvidas, ambiente de trabalho, materiais e organização da produção e do trabalho;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'e.  Identificar os fatores relacionados com o evento; e',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET_SPACE,
          text: 'f.  Fornecer evidências para subsidiar e revisar as medidas de prevenção existentes.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A Norma ABNT NBR 14.280 fixa critérios para o registro, comunicação, estatística, investigação e análise de acidentes do trabalho, suas causas e consequências, aplicando-se a quaisquer atividades laborativas. Esta Norma aplica-se a qualquer empresa, entidade ou estabelecimento interessado no estudo do acidente do trabalho, suas causas e consequências.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Transcrevemos a seguir alguns conceitos:**',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Acidente do trabalho:** Ocorrência imprevista e indesejável, instantânea ou não, relacionada com o exercício do trabalho, de que resulte ou possa resultar lesão pessoal.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Acidente sem lesão:** Acidente que não causa lesão pessoal.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Acidente de trajeto:** Acidente sofrido pelo empregado no percurso da residência para o local de trabalho ou deste para aquela, qualquer que seja o meio de locomoção, inclusive veículo de propriedade do empregado, desde que não haja interrupção ou alteração de percurso por motivo alheio ao trabalho.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Acidente impessoal:** Acidente cuja caracterização independe de existir acidentado, não podendo ser considerado como causador direto da lesão pessoal.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Acidente inicial:** Acidente impessoal desencadeador de um ou mais acidentes.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Espécie de acidente impessoal (espécie):** Caracterização da ocorrência de acidente impessoal de que resultou ou poderia ter resultado acidente pessoal.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Acidente pessoal:** Acidente cuja caracterização depende de existir acidentado.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Tipo de acidente pessoal (tipo):** Caracterização da forma pela qual a fonte da lesão causou a lesão.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Agente do acidente (agente):** Coisa, substância ou ambiente que, sendo inerente à condição ambiente de segurança, tenha provocado o acidente.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '**Fonte da lesão:** Coisa, substância, energia ou movimento do corpo que diretamente provocou a lesão.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '**Causas do Acidente:**',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Fator pessoal de insegurança (fator pessoal): Causa relativa ao comportamento humano, que pode levar à ocorrência do acidente ou à prática do ato inseguro.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Fator pessoal de insegurança (fator pessoal): Causa relativa ao comportamento humano, que pode levar à ocorrência do acidente ou à prática do ato inseguro.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Condição ambiente de insegurança (condição ambiente): Condição do meio que causou o acidente ou contribuiu para a sua ocorrência.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Consequências do Acidente:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Lesão pessoal: Qualquer dano sofrido pelo organismo humano, como conseqüência de acidentedo trabalho.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Natureza da lesão: Expressão que identifica a lesão, segundo suas características principais.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Localização da lesão: Indicação da sede da lesão.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Lesão imediata: Lesão que se manifesta no momento do acidente.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Lesão mediata (lesão tardia): Lesão que não se manifesta imediatamente após a circunstância acidental da qual resultou.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Doença do trabalho: Doença decorrente do exercício continuado ou intermitente de atividade laborativa capaz de provocar lesão por ação mediata.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Doença profissional: Doença do trabalho causada pelo exercício de atividade específica, constante de relação oficial.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Morte: Cessação da capacidade de trabalho pela perda da vida, independentemente do tempo decorrido desde a lesão.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Lesão com afastamento (lesão incapacitante ou lesão com perda de tempo): Lesão pessoal que impede o acidentado de voltar ao trabalho no dia imediato ao do acidente ou de que resulte incapacidade permanente.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Lesão sem afastamento (lesão não incapacitante ou lesão sem perda de tempo): Lesão pessoal que não impede o acidentado de voltar ao trabalho no dia imediato ao do acidente, desde que não haja incapacidade permanente.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Acidentado: Vítima de acidente.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Incapacidade permanente total: Perda total da capacidade de trabalho, em caráter permanente, sem morte.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Incapacidade permanente parcial: Redução parcial da capacidade de trabalho, em caráter permanente que, não provocando morte ou incapacidade permanente total, é causa de perda de qualquer membro ou parte do corpo, perda total do uso desse membro ou parte do corpo, ou qualquer redução permanente de função orgânica.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Incapacidade temporária total: Perda total da capacidade de trabalho de que resulte um ou mais dias perdidos, excetuadas a morte, a incapacidade permanente parcial e a incapacidade permanente total.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A íntegra da Norma poderá ser adquirida no site <link>https://www.abntcatalogo.com.br|www.abntcatalogo.com.br/norma.aspx?ID=002449<link>.',
        },
        {
          type: PGRSectionChildrenTypeEnum.H3,
          text: 'Comunicação do Acidente de Trabalho – CAT',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Todas as empresas são obrigadas a informar à Previdência Social todos os acidentes de trabalho ocorridos com seus empregados, mesmo que não haja afastamento das atividades, até o primeiro dia útil seguinte ao da ocorrência.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Em caso de morte, a comunicação deverá ser imediata.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'A empresa que não informar o acidente de trabalho dentro do prazo legal estará sujeita à aplicação de multa, conforme disposto nos artigos 286 e 336 do Decreto no 3.048/1999.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Se a empresa não fizer o registro da CAT, o próprio trabalhador, o dependente, a entidade sindical, o médico ou a autoridade pública (magistrados, membros do Ministério Público e dos serviços jurídicos da União e dos Estados ou do Distrito Federal e comandantes de unidades do Exército, da Marinha, da Aeronáutica, do Corpo de Bombeiros e da Polícia Militar) poderão efetivar a qualquer tempo o registro deste instrumento junto à Previdência Social, o que não exclui a possibilidade da aplicação da multa à empresa.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'O INSS permite o Registro da CAT de forma online, desde que preenchidos todos os campos obrigatórios. O sistema também permite gerar o formulário da CAT em branco para, em último caso, ser preenchido de forma manual.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para fazer o cadastro deve-se acessar o site:',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: '<link>https://cadastro-cat.inss.gov.br/CATInternet/faces/pages/cadastramento/cadastramentoCat.xhtml.|https://cadastro-cat.inss.gov.br/CATInternet/faces/pages<link>',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Nos casos em que não for possível o registro da CAT de forma online e para que a empresa não esteja sujeita a aplicação da multa por descumprimento de prazo, o registro da CAT poderá ser feito em uma das agências do INSS (consulte a agência mais próxima). Para tanto, o formulário da CAT deverá estar inteiramente preenchido e assinado, principalmente os dados referentes ao atendimento médico. Preencha agora o formulário da CAT. Em caso de dúvidas, o site disponibiliza as instruções para preenchimento do formulário.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para ser atendido nas agências do INSS, no mínimo deverá ser apresentado um documento de identificação com foto e o número do CPF.',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Para qualquer dos casos indicados acima, deverão ser emitidas quatro vias sendo:',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '1ª via ao INSS;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '2ª via ao segurado ou dependente;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '3ª via ao sindicato de classe do trabalhador;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: '4ª via à empresa.',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'Outras informações',
        },
        {
          type: PGRSectionChildrenTypeEnum.PARAGRAPH,
          text: 'caso a área de informações referente ao atestado médico do formulário não esteja preenchida e assinada pelo médico assistente, deverá ser apresentado o atestado médico, desde que nele conste a devida descrição do local/data/hora de atendimento, bem como o diagnóstico com o CID (Classificação Estatística Internacional de Doenças e Problemas Relacionados com a Saúde) e o período provável para o tratamento, contendo a assinatura, o número do Conselho Regional de Medicina (CRM) e o carimbo do médico responsável pelo atendimento, seja particular, de convênio ou do SUS;',
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'A CAT inicial irá se referir a acidente de trabalho típico, trajeto, doença profissional, do trabalho ou óbito imediato;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'A CAT de reabertura será utilizada para casos de afastamento por agravamento de lesão de acidente do trabalho ou de doença profissional ou do trabalho;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'A CAT de comunicação de óbito, será emitida exclusivamente para casos de falecimento decorrente de acidente ou doença profissional ou do trabalho, após o registro da CAT inicial;',
          level: 0,
        },
        {
          type: PGRSectionChildrenTypeEnum.BULLET,
          text: 'Na CAT de reabertura, deverão constar as mesmas informações da época do acidente, exceto quanto ao afastamento, último dia trabalhado, atestado médico e data da emissão, que serão relativos à data da reabertura. Não será considerada CAT de reabertura a situação de simples assistência médica ou de afastamento com menos de 15 dias consecutivos.',
          level: 0,
        },
      ],
    },
  ],
};
//??${VariablesPGREnum.COMPANY_SHORT_NAME}??
