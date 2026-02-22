# **Módulo de Insalubridade — SimpleSST**

## **Entradas no Sistema (Inputs e ajustes necessários)**

### **Identificação do Anexo da NR-15**

#### Cada fator de risco de insalubridade deve possuir referência explícita ao Anexo da NR-15 aplicável
	**Cada fator de risco caracterizado como insalubre deve possuir referência explícita ao Anexo correspondente da NR-15.**
	
	O campo atualmente denominado apenas como “**Anexo**” deve ser interpretado e padronizado como “**Anexo da NR-15**”, uma vez que se trata de informação específica e exclusiva para a caracterização de insalubridade.
	
	O preenchimento deste campo é **obrigatório** para todos os fatores de risco insalubres, pois é a partir dele que o sistema identifica o enquadramento normativo aplicável ao agente (ex.: Anexo 1 – Ruído, Anexo 11 – Agentes Químicos, Anexo 14 – Agentes Biológicos, etc.).
	
	O Anexo da NR-15 define o critério técnico de avaliação (qualitativo ou quantitativo), mas não determina isoladamente o grau de insalubridade, que depende do agente, da atividade e das condições de exposição.

#####  

#### O anexo indica o critério técnico (qualitativo ou quantitativo), mas não define isoladamente o grau
	O campo “**Método**” deve ser **obrigatoriamente preenchido** para todos os fatores de risco vinculados ao módulo de insalubridade, indicando se o critério de avaliação é **Qualitativo** ou **Quantitativo**, conforme definido pelo respectivo Anexo da NR-15.
	
	Esta informação é essencial para que o sistema compreenda **como o fator de risco será analisado posteriormente**, seja por comparação com limites de tolerância (avaliações quantitativas) ou por caracterização direta da atividade e condições de exposição (avaliações qualitativas).
	
	A **ausência** deste preenchimento** compromete a lógica de decisão do sistema** na etapa de conclusão do laudo de insalubridade, devendo o campo ser tratado como requisito obrigatório a partir da ativação do módulo.

#####  

### **Grau de Insalubridade (propriedade do fator de risco)**

#### Criar campo específico no cadastro do fator de risco de insalubridade.

##### **Apenas em:** Físicos, Químicos, Biológicos

##### **Ou:** Se o Campo Anexo da NR 15 for preenchido. **(Melhor para o usuário)**

#### Campo do tipo seleção enumerada

#### Opções possíveis:

##### Grau mínimo – 10%

##### Grau médio – 20%

##### Grau máximo – 40%

#### O grau deve ser definido conforme o enquadramento técnico do fator de risco no respectivo anexo

#### O grau não é uma propriedade fixa do anexo, e sim do fator de risco caracterizado

#####  

## **Vínculo com a Empresa (Aplicação operacional)**

### Associação do fator de risco à empresa / estabelecimento

#### O fator de risco de insalubridade é vinculado à empresa por meio das caracterizações existentes

##### A caracterização pode ser feita por:

###### Atividade

###### Ambiente operacional

###### Equipamento / processo

## **Saídas do Sistema (Relatório de Insalubridade)**

### **Geração do Laudo de Insalubridade**

#### O relatório deve considerar apenas os fatores de risco de insalubridade caracterizados

##### **Cada fator deve apresentar:**

###### Anexo da NR-15 aplicado

###### Tipo de critério (qualitativo ou quantitativo)

###### Grau de insalubridade (10%, 20% ou 40%)

### **Conclusão técnica automatizada**

#### A conclusão deve utilizar textos padronizados

#### O grau de insalubridade informado no fator de risco deve ser refletido diretamente no texto conclusivo

#### A conclusão deve se restringir aos cargos vinculados à caracterização analisada

### **Consolidação dos resultados**

#### **Estrutura por Anexo da NR-15**

##### **Texto introdutório do Anexo (H1)**

###### Identificação do Anexo da NR-15 aplicável[^1]

###### Identificação do agente e do fator de risco associado ao Anexo[^2]

###### Indicação do critério técnico do Anexo (qualitativo ou quantitativo)

####### **Exemplo de texto introdutório**

######## **Critério Quantitativo (H1)**

######### **Anexo 1 — Ruído contínuo ou intermitente**

########## **Anexo 1 da NR-15 – Ruído contínuo ou intermitente
  **Neste item do Laudo de Insalubridade são apresentados os resultados da análise das atividades, cargos, ambientes e/ou grupos homogêneos de exposição caracterizados no GRO como expostos ao fator de risco Ruído Contínuo ou Intermitente, conforme disposto no Anexo 1 da Norma Regulamentadora nº 15.
  O referido Anexo estabelece critério técnico de avaliação quantitativa, baseado na comparação entre os níveis de pressão sonora medidos no ambiente de trabalho e os limites de tolerância definidos na norma.
  A caracterização da insalubridade ocorre quando os níveis de exposição ocupacional ao ruído ultrapassam os limites de tolerância estabelecidos, considerando jornada, tempo de exposição e metodologia de medição aplicável.
  A avaliação considera os resultados das medições ambientais informadas no GRO, realizadas conforme metodologia técnica reconhecida, bem como a eficácia das medidas de controle coletivo e individual registradas, incluindo a verificação da capacidade de neutralização do risco por Equipamentos de Proteção Individual.
  A conclusão apresentada neste Anexo restringe-se exclusivamente às situações em que a exposição ocupacional ao ruído, conforme caracterizada, atende simultaneamente aos critérios legais e técnicos previstos na NR-15.

######### **Anexo 2 — Ruído de impacto**

########## Neste item do Laudo de Insalubridade são apresentados os resultados da análise das atividades, cargos, ambientes e/ou grupos homogêneos de exposição caracterizados no GRO como expostos ao fator de risco Ruído de Impacto, conforme disposto no Anexo 2 da Norma Regulamentadora nº 15.
  O referido Anexo estabelece critério técnico de avaliação quantitativa, baseado na verificação dos níveis máximos de pressão sonora decorrentes de ruídos de impacto, medidos no ambiente de trabalho, e sua comparação com os limites de tolerância definidos na norma.
  A caracterização da insalubridade ocorre quando os níveis de exposição ocupacional ao ruído de impacto ultrapassam os limites de tolerância estabelecidos, independentemente do tempo total de exposição durante a jornada, observada a metodologia de medição aplicável a esse tipo específico de agente físico.
  A avaliação considera os resultados das medições ambientais informadas no GRO, realizadas conforme metodologia técnica reconhecida, bem como a eficácia das medidas de controle coletivo e individual registradas, incluindo a verificação da capacidade de neutralização do risco por Equipamentos de Proteção Individual.
  A conclusão apresentada neste Anexo restringe-se exclusivamente às situações em que a exposição ocupacional ao ruído de impacto, conforme caracterizada, atende simultaneamente aos critérios legais e técnicos previstos na NR-15.

######### **Anexo 3 — Calor**

########## Neste item do Laudo de Insalubridade são apresentados os resultados da análise das atividades, cargos, ambientes e/ou grupos homogêneos de exposição caracterizados no GRO como expostos ao fator de risco Calor, conforme disposto no Anexo 3 da Norma Regulamentadora nº 15.
  O referido Anexo estabelece critério técnico de avaliação quantitativa, baseado na determinação do Índice de Bulbo Úmido Termômetro de Globo (IBUTG), obtido a partir de medições ambientais realizadas no local de trabalho e considerando o tipo de atividade executada, a carga metabólica envolvida e o regime de trabalho e descanso aplicável.
  A caracterização da insalubridade ocorre quando os valores de IBUTG medidos excedem os limites de tolerância estabelecidos na norma para as condições específicas de exposição, conforme metodologia de avaliação aplicável.
  A avaliação considera os resultados das medições ambientais informadas no GRO, realizadas conforme metodologia técnica reconhecida, bem como a existência e a eficácia das medidas de controle coletivo e organizacional registradas, observando-se que, para o agente físico calor, a efetividade dessas medidas deve se refletir diretamente na redução dos valores de IBUTG obtidos nas avaliações quantitativas.
  A conclusão apresentada neste Anexo restringe-se exclusivamente às situações em que a exposição ocupacional ao calor, conforme caracterizada, atende simultaneamente aos critérios legais e técnicos previstos na NR-15.

######### **Anexo 8 — Vibrações**

########## **VMB**

########### Neste item do Laudo de Insalubridade são apresentados os resultados da análise das atividades, cargos, ambientes, equipamentos e/ou grupos homogêneos de exposição caracterizados no GRO como expostos ao fator de risco Vibração de Mãos e Braços (VMB), conforme disposto no Anexo 8 da Norma Regulamentadora nº 15.
  O referido Anexo estabelece critério técnico de avaliação quantitativa para a vibração localizada, com base na determinação da aceleração resultante de exposição normalizada (aren), obtida a partir de medições realizadas conforme os procedimentos e metodologias definidos na Norma de Higiene Ocupacional NHO 10 da Fundacentro.
  A caracterização da insalubridade ocorre quando os valores de aren excedem o limite de tolerância estabelecido na norma, considerando a exposição ocupacional diária à vibração de mãos e braços.
  A avaliação considera os resultados das medições quantitativas informadas no GRO, realizadas conforme metodologia técnica reconhecida, bem como a existência e a eficácia das medidas de controle coletivo, organizacionais e administrativas registradas, observando-se que, para este agente físico, a efetividade das medidas de controle e do Equipamento de Proteção Individual deve se refletir diretamente na redução dos valores de aren obtidos nas avaliações quantitativas.
  A conclusão apresentada neste Anexo restringe-se exclusivamente às situações em que a exposição ocupacional à vibração de mãos e braços, conforme caracterizada, atende simultaneamente aos critérios legais e técnicos previstos na NR-15 e na NHO 10 da Fundacentro.

########## **VCI**

########### Neste item do Laudo de Insalubridade são apresentados os resultados da análise das atividades, cargos, ambientes, equipamentos e/ou grupos homogêneos de exposição caracterizados no GRO como expostos ao fator de risco Vibração de Corpo Inteiro (VCI), conforme disposto no Anexo 8 da Norma Regulamentadora nº 15.
  O referido Anexo estabelece critério técnico de avaliação quantitativa para a vibração de corpo inteiro, com base na determinação da aceleração resultante de exposição normalizada (aren) e da dose de vibração resultante (VDVR), obtidas a partir de medições realizadas conforme os procedimentos e metodologias definidos na Norma de Higiene Ocupacional NHO 09 da Fundacentro.
  A caracterização da insalubridade ocorre quando é superado qualquer dos limites de tolerância estabelecidos para os parâmetros aren e/ou VDVR, conforme previsto na norma, considerando a exposição ocupacional diária à vibração de corpo inteiro.
  A avaliação considera os resultados das medições quantitativas informadas no GRO, realizadas conforme metodologia técnica reconhecida, bem como a existência e a eficácia das medidas de controle coletivo, organizacionais e administrativas registradas, observando-se que, para este agente físico, a efetividade das medidas de controle e do Equipamento de Proteção Individual deve se refletir diretamente na redução dos valores de aren e/ou VDVR obtidos nas avaliações quantitativas.
  A conclusão apresentada neste Anexo restringe-se exclusivamente às situações em que a exposição ocupacional à vibração de corpo inteiro, conforme caracterizada, atende simultaneamente aos critérios legais e técnicos previstos na NR-15 e na NHO 09 da Fundacentro.

######### **Anexo 11 — Agentes químicos com limites de tolerância**

########## Neste item do Laudo de Insalubridade são apresentados os resultados da análise das atividades, cargos, ambientes, processos, substâncias e/ou grupos homogêneos de exposição caracterizados no GRO como expostos a agentes químicos com limites de tolerância estabelecidos, conforme disposto no Anexo 11 da Norma Regulamentadora nº 15.
  O referido Anexo estabelece critério técnico de avaliação quantitativa, baseado na comparação entre as concentrações dos agentes químicos medidas no ambiente de trabalho e os respectivos limites de tolerância definidos na norma, considerando, conforme o caso, a concentração média ponderada no tempo da jornada de trabalho ou o atendimento ao critério de valor teto, quando aplicável.
  A caracterização da insalubridade ocorre quando as concentrações ocupacionais dos agentes químicos ultrapassam os limites de tolerância estabelecidos no Anexo 11 da NR-15, observada a natureza específica de cada substância e o respectivo critério de avaliação aplicável.
  A avaliação considera os resultados das medições quantitativas informadas no GRO, realizadas conforme metodologia técnica reconhecida, bem como a existência e a eficácia das medidas de controle coletivo, organizacionais, administrativas e individuais registradas, incluindo a verificação da possibilidade de neutralização do risco por Equipamentos de Proteção Individual, quando tecnicamente e legalmente aplicável.
  A conclusão apresentada neste Anexo restringe-se exclusivamente às situações em que a exposição ocupacional aos agentes químicos, conforme caracterizada, atende simultaneamente aos critérios legais e técnicos previstos na NR-15.

######### **Anexo 12 — Poeiras minerais (quando aplicável por LT)**

########## Neste item do Laudo de Insalubridade são apresentados os resultados da análise das atividades, cargos, ambientes, processos, agentes e/ou grupos homogêneos de exposição caracterizados no GRO como expostos a poeiras minerais avaliadas por critério quantitativo, conforme disposto no Anexo 12 da Norma Regulamentadora nº 15, quando aplicável por limite de tolerância.
  O referido Anexo estabelece critério técnico de avaliação quantitativa para determinadas poeiras minerais, baseado na comparação entre as concentrações medidas no ambiente de trabalho e os respectivos limites de tolerância definidos na norma, considerando a natureza da poeira, sua composição e, quando aplicável, a fração respirável ou total avaliada.
  A caracterização da insalubridade ocorre quando as concentrações ocupacionais das poeiras minerais excedem os limites de tolerância estabelecidos no Anexo 12 da NR-15, observada a metodologia de avaliação aplicável e as condições específicas de exposição.
  A avaliação considera os resultados das medições quantitativas informadas no GRO, realizadas conforme metodologia técnica reconhecida, bem como a existência e a eficácia das medidas de controle coletivo, organizacionais, administrativas e individuais registradas, incluindo a verificação da possibilidade de neutralização do risco por Equipamentos de Proteção Individual, quando tecnicamente e legalmente aplicável.
  A conclusão apresentada neste Anexo restringe-se exclusivamente às situações em que a exposição ocupacional às poeiras minerais, conforme caracterizada, atende simultaneamente aos critérios legais e técnicos previstos na NR-15.

######## **Critério Qualitativo (H1)**

######### **Anexo 5 — Radiações ionizantes**

########## Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição ocupacional a radiações ionizantes, conforme disposto no Anexo 5 da Norma Regulamentadora nº 15.
  O referido Anexo adota critério técnico de avaliação qualitativa, não apresentando lista fechada de atividades nem limites de tolerância numéricos para fins de caracterização da insalubridade, sendo o enquadramento baseado no julgamento técnico acerca da existência de atividades com potencial de exposição a radiações ionizantes no exercício do trabalho.
  A análise técnica fundamenta-se na identificação da presença de fontes de radiação ionizante, do uso ou manuseio de materiais radioativos, da operação de equipamentos emissores de radiação ou da atuação em áreas controladas ou supervisionadas, conforme caracterizado no GRO, bem como na verificação da suficiência e adequação dos controles de radioproteção adotados.
  Para fins de avaliação, são considerados os princípios, critérios e diretrizes de proteção radiológica aplicáveis, incluindo as disposições da Norma CNEN NN 3.01 – Diretrizes Básicas de Proteção Radiológica, sem prejuízo do enquadramento previsto no Anexo 5 da NR-15.
  Ressalta-se que, para este Anexo, não se exige a comprovação de exposição habitual e permanente, sendo suficiente a caracterização da atividade ou condição de trabalho que envolva exposição ocupacional a radiações ionizantes nos termos da norma.
  A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos pela NR-15 e pelas normas técnicas de proteção radiológica aplicáveis.

######### **Anexo 6 — Pressões Hiperbáricas**

######### **Anexo 7 — Radiações não ionizantes**

########## Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição ocupacional a radiações não ionizantes, conforme disposto no Anexo 7 da Norma Regulamentadora nº 15.
  O referido Anexo adota critério técnico de avaliação qualitativa, não estabelecendo limites de tolerância numéricos nem lista fechada de atividades, sendo a caracterização da insalubridade baseada na natureza da atividade executada e na existência de exposição ocupacional a fontes de radiações não ionizantes previstas na norma.
  A análise técnica fundamenta-se na identificação da presença e utilização de equipamentos, sistemas ou processos emissores de radiações não ionizantes, bem como na comparação entre a atividade real cadastrada no GRO e as situações exemplificativas descritas no Anexo 7 da NR-15, tais como aquelas envolvendo radiações do tipo micro-ondas, ultravioleta, laser, entre outras fontes reconhecidas.
  Para fins de caracterização da insalubridade, considera-se a compatibilidade técnica entre a atividade efetivamente desempenhada e as condições de exposição descritas no Anexo 7, por meio de enquadramento por atividade análoga, não sendo exigida a comprovação de exposição habitual e permanente.
  A avaliação também contempla a verificação das medidas de controle coletivo, organizacionais, administrativas e do uso de Equipamentos de Proteção Individual informadas no GRO, sem prejuízo do enquadramento legal da insalubridade quando caracterizada a exposição ocupacional nos termos da norma.
  A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos pela NR-15 para radiações não ionizantes.

######### **Anexo 9 — Frio**

########## Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição ocupacional ao frio, conforme disposto no Anexo 9 da Norma Regulamentadora nº 15.
  O referido Anexo adota critério técnico de avaliação qualitativa, não estabelecendo limites de tolerância numéricos nem lista fechada de atividades, sendo a caracterização da insalubridade baseada na natureza da atividade executada e nas condições térmicas do ambiente de trabalho.
  A análise técnica fundamenta-se na identificação de atividades ou operações executadas no interior de câmaras frigoríficas ou em ambientes que apresentem condições térmicas similares, capazes de submeter os trabalhadores à exposição ocupacional ao frio, conforme caracterizado no GRO e verificado por meio de inspeção técnica no local de trabalho.
  Para fins de caracterização da insalubridade, considera-se a compatibilidade entre a atividade real cadastrada no GRO e as situações descritas no Anexo 9 da NR-15, por meio de enquadramento por atividade análoga, não sendo exigida a comprovação de exposição habitual e permanente.
  A avaliação contempla ainda a verificação das condições operacionais e das medidas de controle informadas no GRO, incluindo procedimentos de trabalho, medidas de proteção coletiva e Equipamentos de Proteção Individual, sem prejuízo do enquadramento legal quando caracterizada a exposição ocupacional ao frio nos termos da norma.
  A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos pela NR-15 para exposição ocupacional ao frio.
  
  

######### **Anexo 10 — Umidade**

########## Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição ocupacional à umidade, conforme disposto no Anexo 10 da Norma Regulamentadora nº 15.
  O referido Anexo adota critério técnico de avaliação qualitativa, não estabelecendo limites de tolerância numéricos nem lista fechada de atividades, sendo a caracterização da insalubridade baseada nas condições ambientais do local de trabalho e na natureza da atividade executada.
  A análise técnica fundamenta-se na identificação de atividades ou operações executadas em locais alagados ou encharcados, com umidade excessiva, capazes de produzir danos à saúde dos trabalhadores, conforme caracterizado no GRO e verificado por meio de inspeção técnica no ambiente de trabalho.
  Para fins de caracterização da insalubridade, considera-se a compatibilidade entre a atividade real cadastrada no GRO e as condições descritas no Anexo 10 da NR-15, por meio de enquadramento por atividade análoga, não sendo exigida a comprovação de exposição habitual e permanente.
  A avaliação contempla ainda a análise das condições operacionais e das medidas de controle informadas no GRO, sem prejuízo do enquadramento legal da insalubridade quando caracterizada a exposição ocupacional à umidade nos termos da norma.
  A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos pela NR-15 para exposição ocupacional à umidade.

######### **Anexo 12 — Poeiras minerais**

########## **ASBESTO**

########### Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição ocupacional ao asbesto (amianto), conforme disposto no Anexo 12 da Norma Regulamentadora nº 15.
  O referido Anexo adota critério técnico de avaliação qualitativa, não estabelecendo limites de tolerância numéricos para fins de caracterização da insalubridade, sendo o enquadramento baseado na própria natureza da atividade executada e na existência de exposição ocupacional ao asbesto no exercício do trabalho.
  A análise técnica fundamenta-se na identificação de atividades ou operações nas quais os trabalhadores estejam expostos ao asbesto, independentemente da forma de apresentação do agente ou da intensidade da exposição, conforme caracterizado no GRO e verificado por meio de inspeção técnica no local de trabalho.
  Para fins de caracterização da insalubridade, considera-se a compatibilidade entre a atividade real cadastrada no GRO e as situações previstas no Anexo 12 da NR-15, por meio de enquadramento por atividade análoga, não sendo exigida a comprovação de exposição habitual e permanente.
  A avaliação contempla ainda a análise das condições operacionais e das medidas de controle informadas no GRO, incluindo procedimentos de trabalho, medidas de proteção coletiva e Equipamentos de Proteção Individual, sem prejuízo do enquadramento legal da insalubridade quando caracterizada a exposição ocupacional ao asbesto nos termos da norma.
  A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos pela NR-15 para exposição ocupacional ao asbesto.

######### **Anexo 13 — Agentes químicos**

########## Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição a agentes químicos enquadrados por critério qualitativo, conforme disposto no Anexo 13 da Norma Regulamentadora nº 15.
  O referido Anexo adota critério técnico de avaliação qualitativa, no qual a caracterização da insalubridade decorre da natureza da atividade executada, do agente químico envolvido e da forma de exposição, independentemente da realização de medições quantitativas ou da comparação com limites de tolerância.
  A análise técnica fundamenta-se na comparação entre a descrição da atividade real cadastrada no GRO e as atividades expressamente previstas no Anexo 13 da NR-15, considerando a similaridade operacional, o processo de trabalho, o agente químico manipulado e as condições em que ocorre a exposição.
  Observa-se que, para um mesmo agente químico, o Anexo 13 pode estabelecer graus distintos de insalubridade, os quais variam conforme a atividade desempenhada, sendo o enquadramento realizado de forma específica para cada situação caracterizada.
  A avaliação considera ainda a existência e a eficácia das medidas de controle informadas no GRO, incluindo procedimentos operacionais, medidas de proteção coletiva e Equipamentos de Proteção Individual, sem prejuízo do enquadramento legal quando a norma assim o determina.
  A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos pela NR-15.

######### **Anexo 13-A — Benzeno**

########## Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição ocupacional ao benzeno, conforme disposto no Anexo 13-A da Norma Regulamentadora nº 15.
  O referido Anexo adota critério técnico de avaliação predominantemente qualitativo, no qual a caracterização da insalubridade decorre da presença do benzeno no processo de trabalho e da natureza da atividade executada, independentemente da realização de medições quantitativas ou da comparação com limites de tolerância.
  A análise técnica fundamenta-se na identificação da utilização, manuseio, processamento, transporte, armazenamento ou qualquer outra forma de contato ocupacional com o benzeno, conforme caracterizado no GRO, bem como na comparação entre a atividade real e as situações previstas no Anexo 13-A da NR-15 e na legislação específica aplicável ao agente.
  Considera-se, para fins de caracterização da insalubridade, a exposição ocupacional decorrente da própria presença do benzeno no ambiente ou no processo produtivo, não sendo admitida a neutralização do risco por meio de Equipamentos de Proteção Individual, em consonância com o entendimento técnico e normativo aplicável a este agente químico.
  A avaliação contempla ainda a verificação das medidas de controle coletivo, organizacionais e administrativas informadas no GRO, sem prejuízo do enquadramento legal da insalubridade quando caracterizada a exposição ocupacional ao benzeno nos termos da norma.
  A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos no Anexo 13-A da NR-15.
  
  

######### **Anexo 14 — Agentes biológicos**

########## Neste item do Laudo de Insalubridade são apresentadas as análises relativas às atividades, cargos, ambientes e/ou processos caracterizados no GRO como envolvendo exposição a agentes biológicos, conforme disposto no Anexo 14 da Norma Regulamentadora nº 15.
  O referido Anexo adota critério técnico de avaliação qualitativa, no qual a caracterização da insalubridade decorre da natureza da atividade executada e do contato com agentes biológicos previstos na norma, independentemente de medições quantitativas.
  A análise técnica fundamenta-se na comparação entre a descrição da atividade real cadastrada no GRO e as atividades descritas no Anexo 14 da NR-15, considerando a similaridade operacional, o tipo de agente envolvido e a forma de exposição.
  Para fins de caracterização da insalubridade, é indispensável que a exposição aos agentes biológicos seja habitual e permanente, integrando a rotina normal de trabalho, não sendo considerados eventos ocasionais ou fortuitos.
  A avaliação também considera a existência e a eficácia das medidas de controle informadas no GRO, incluindo procedimentos operacionais, medidas de proteção coletiva e Equipamentos de Proteção Individual, sem prejuízo do enquadramento legal quando a norma assim o determina.
  A conclusão apresentada neste Anexo limita-se às atividades e condições efetivamente caracterizadas no GRO como compatíveis com os critérios qualitativos estabelecidos pela NR-15.

###### Descrição sintética das condições legais para caracterização da insalubridade naquele Anexo[^3]

###### Registro de que a análise considera a eficácia ou não das medidas de controle e dos EPIs informados no GRO[^4]

##### **Caracterização da exposição (dados do sistema)**

###### Apresentação da forma de caracterização utilizada no cadastro

####### Por cargo

####### Por atividade

####### Por ambiente operacional

####### Por equipamento etc.

###### Caso o fator de risco esteja caracterizado em mais de uma forma, todas as caracterizações devem ser apresentadas separadamente

###### O sistema não deverá consolidar automaticamente informações conflitantes

###### A responsabilidade pela coerência dos dados é do usuário no momento do cadastro

##### **Análise técnica automatizada**

###### **Critérios quantitativos**[^5]

####### Comparação automática dos resultados informados com os limites de tolerância do Anexo[^6]

####### Indicação objetiva de superação ou não do limite de tolerância

####### Consideração da neutralização ou não do risco por EPC ou EPI, quando aplicável

######## Pode descaracterizar a insalubridade, desde que comprovada eficácia[^7]

####### A habitualidade ou permanência da exposição:

######## NÃO é requisito determinante

######## A simples ultrapassagem do limite de tolerância caracteriza a insalubridade

####### **Anexos da NR-15 com critério quantitativo:**

######## **Anexo 1 — Ruído contínuo ou intermitente**

######## **Anexo 2 — Ruído de impacto**

######## **Anexo 3 — Calor**

######## **Anexo 8 — Vibrações**

######## **Anexo 11 — Agentes químicos com limites de tolerância**

######## **Anexo 12 — Poeiras minerais (quando aplicável por LT)**

###### **Critérios qualitativos**

####### Comparação entre a descrição da atividade real cadastrada e a atividade descrita no Anexo da NR-15

####### A caracterização pressupõe equivalência técnica entre atividade real e normativa

####### Avaliação obrigatória da habitualidade e permanência da exposição

######## SÃO requisitos essenciais para caracterização da insalubridade

######## Exposição eventual ou ocasional não caracteriza insalubridade

####### Consideração da neutralização ou não do risco por EPC ou EPI, quando aplicável

######## Pode descaracterizar a insalubridade, desde que comprovada eficácia[^8]

####### **Anexos da NR-15 com critério qualitativo:**

######## **Anexo 5 — Radiações ionizantes**

######## **Anexo 6 — Pressões Hiperbáricas**

######## **Anexo 7 — Radiações não ionizantes**

######## **Anexo 9 — Frio**

######## **Anexo 10 — Umidade**

######## **Anexo 12 — Poeiras minerais**

######### **ASBESTO**

######## **Anexo 13 — Agentes químicos**

######## **Anexo 13-A — Benzeno**

######## **Anexo 14 — Agentes biológicos**

######## **Particularidades por Anexo (Impacto no Modelo do Sistema)**

######### **Anexo 5 — Radiações Ionizantes**

########## **Na Norma**

########### Não apresenta lista fechada de atividades

########### Caracterização depende exclusivamente do julgamento técnico

############ Existência de atividade com material radioativo

############ Análise da suficiência dos controles de radioproteção

############ Conformidade com normas da CNEN (ex.: CNEN NN 3.01)

########### **Não **[**Exige:**](Exige:) Exposição habitual e permanente

########## **No sistema:**

########### A atividade real é vinculada diretamente ao Anexo 5

########### Enquadramento por atividade análoga

############ Vou inserir um Texto Padrão já que o Anexo não possui uma lista:

############# Atividades ou operações com exposição ocupacional a radiações ionizantes, conforme critérios, princípios e controles de proteção radiológica estabelecidos no Anexo 5 da NR-15 e na Norma CNEN NN 3.01 – Diretrizes Básicas de Proteção Radiológica.

########### **Não **[**Exige:**](Exige:) Exposição habitual e permanente

######### **Anexo 6 — Pressões Hiperbáricas**

########## Anexo complexo

########## Desenvolvimento adiado

########## Implementação condicionada a demanda futura de clientes

######### **Anexo 7 — Radiações Não Ionizantes**

########## **Na Norma**

########### Não apresenta lista fechada de atividades

########### A Norma apresenta exemplos específicos de agentes em uma **única frase**

########### **Não **[**Exige:**](Exige:) Exposição habitual e permanente

########## **No sistema:**

########### A atividade real é vinculada diretamente ao Anexo 7

########### Enquadramento por atividade análoga

############ Vou inserir uma **lista**, já que o Anexo possui **frase única:**

############# Radiações não ionizantes — Micro-ondas

############# Radiações não ionizantes — Ultravioleta

############# Radiações não ionizantes — Laser

########### **Não **[**Exige:**](Exige:) Exposição habitual e permanente

######### **Anexo 9 — Frio**

########## **Na Norma**

########### Não apresenta lista fechada de atividades

########### Baseado em câmaras frigoríficas ou condições similares

########## **No sistema:**

########### A atividade real é vinculada diretamente ao Anexo 7

########### Enquadramento por atividade análoga

############ Vou inserir uma **frase**, já que o Anexo é basedo em câmaras frigoríficas

############# Atividades ou operações executadas no interior de câmaras frigoríficas ou em ambientes que apresentem condições térmicas similares, com exposição ocupacional ao frio, sem proteção adequada, conforme disposto no Anexo 9 da NR-15.

########### **Não **[**Exige:**](Exige:) Exposição habitual e permanente

######### **Anexo 10 — Umidade**

########## **Na Norma**

########### Não apresenta lista fechada de atividades

########### Baseado em locais alagados ou encharcados, com umidade
  excessiva

########### Avaliação técnica do ambiente de trabalho

########## **No sistema:**

########### A atividade real é vinculada diretamente ao Anexo 10

########### Enquadramento por atividade análoga

############ Vou inserir uma **frase**, já que o Anexo é basedo em locais alagados ou encharcados

############# UMIDADE
  1. As atividades ou operações executadas em locais alagados ou encharcados, com umidade excessiva, capazes de produzir danos à saúde dos trabalhadores, serão consideradas insalubres em decorrência de laudo de inspeção realizada no local de trabalho.

########### **Não **[**Exige:**](Exige:) Exposição habitual e permanente

######### **Anexo 12 — Poeiras minerais**

########## **ASBESTO**

########### **Na Norma**

############ Não apresenta lista fechada de atividades

############ Baseado em quaisquer atividades nas quais os trabalhadores estão expostos ao asbesto no exercício do trabalho

############ Avaliação técnica do ambiente de trabalho

########### **No sistema:**

############ A atividade real é vinculada diretamente ao Anexo 12 (Asbesto)

############ Enquadramento por atividade análoga

############# Vou inserir uma lista, já que o Anexo possui frase única:
- ASBESTO
  1. O presente Anexo aplica-se a todas e quaisquer atividades nas quais os trabalhadores estão expostos ao asbesto no exercício do trabalho.

############ **Não **[**Exige:**](Exige:) Exposição habitual e permanente

######### **Anexo 13 — Agentes Químicos (Qualitativo)**

########## **Na Norma**

########### Apresenta lista fechada de atividades

########### Um mesmo agente pode gerar graus distintos conforme a atividade

########## **No sistema:**

########### A atividade real é vinculada diretamente ao Anexo 13

########### Enquadramento por atividade análoga

############ Vou cadartrar para cada agente as sus respectivas atividades.

############ Cada uma dessas atividades podem ser 10%, 20% ou 40% no memso agente.

########### **Não **[**Exige:**](Exige:) Exposição habitual e permanente

######### **Anexo 14 — Agentes Biológicos**

########## **Na Norma**

########### Apresenta lista fechada de atividades

########### Um mesmo agente pode gerar graus distintos conforme a atividade

########## **No sistema:**

########### A atividade real é vinculada diretamente ao Anexo 14

########### Enquadramento por atividade análoga

############ Vou cadartrar para cada agente as sus respectivas atividades.

############ Cada uma dessas atividades podem ser 20% ou 40% no memso agente.

########### [**Exige:**](Exige:) Exposição habitual e permanente

##### **Conclusão por Anexo e Caracaterização**

###### Indicação clara da caracterização ou não da insalubridade[^9]

###### Indicação do grau de insalubridade vinculado ao fator de risco (10%, 20% ou 40%)

####### **Exemplo de texto para a Conclusão**

######## **Critério Quantitativo (H1)**

######### **Anexo 1 da NR-15 – Ruído contínuo ou intermitente**

########## **Considerando Não Insalubre**

########### **NPS < Limite de Tolerância (LT)**

############ **Caracterização: Grupo Similar de Exposição — GSE XXXXX
  **Com base nos resultados das avaliações quantitativas de ruído associadas à atividade caracterizada, verifica-se que os Níveis de Pressão Sonora (NPS) permaneceram abaixo dos limites de tolerância previstos no Anexo 1 da NR-15. As medições registradas representam adequadamente a exposição ocupacional decorrente da execução desta atividade específica. Conclui-se, portanto, pela não caracterização da insalubridade para esta condição, não se configurando a caracterização da insalubridade em grau médio (20%) aplicável ao agente ruído contínuo ou intermitente.
  Esta conclusão aplica-se exclusivamente à atividade caracterizada, não se estendendo a outros cargos, grupos homogêneos de exposição ou ambientes.

########### **NPS > Limite de Tolerância (LT)**

############ **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Para a presente caracterização específica, vinculada ao(s) cargo(s), atividade(s) ou grupo(s) homogêneo(s) analisado(s), verifica-se que os NPS de ruído contínuo ou intermitente mensurados excedem o limite de tolerância de 85 dB(A) para jornada de 8 horas, conforme critérios estabelecidos no Anexo 1 da NR-15, caracterizando, em princípio, condição insalubre em grau médio (20%).
  Entretanto, ficou comprovado no GRO que foram adotadas, previamente, medidas de proteção coletiva e administrativa, e que o Equipamento de Proteção Individual – EPI auditivo fornecido é tecnicamente adequado ao agente, possui Certificado de Aprovação válido, apresenta atenuação compatível com os níveis de exposição, e teve seu uso contínuo, correto e ininterrupto ao longo da jornada devidamente observado, incluindo treinamento, higienização, manutenção e substituição periódica, conforme exigências legais.
  Dessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelo uso eficaz do EPI, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição, controle e uso efetivo do EPI.
  Esta conclusão aplica-se exclusivamente à atividade caracterizada, não se estendendo a outros cargos, grupos homogêneos de exposição ou ambientes.[^10]

########## **Considerando Insalubre
  **

########### **NPS > Limite de Tolerância (LT)**

############ **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Com base nos resultados das avaliações quantitativas de ruído registradas no GRO para esta caracterização, verifica-se que os níveis de pressão sonora medidos ultrapassam os limites de tolerância estabelecidos no Anexo 1 da NR-15.
  As medições foram realizadas conforme metodologia técnica aplicável e representam adequadamente a exposição ocupacional dos trabalhadores vinculados a este grupo homogêneo de exposição.
  As medidas de controle coletivo e os Equipamento de Proteção Individual (EPI) informados no GRO não se mostraram eficazes para neutralizar a exposição ao ruído acima do limite legal.
  Conclui-se, portanto, pela caracterização da insalubridade para este grupo homogêneo de exposição, em decorrência da exposição ocupacional ao ruído contínuo ou intermitente acima do limite de tolerância.
  O grau de insalubridade aplicável ao fator de risco Ruído Contínuo ou Intermitente é grau médio (20%), conforme estabelecido no Anexo 1 da NR-15.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, equipamentos ou ambientes.

########## **Inconclusivo
  **

########### **Sem Medições Lançadas no Sistema SimpleSST**

############ Não é possível concluir quanto à caracterização da insalubridade para esta caracterização específica, uma vez que o critério de avaliação aplicável é quantitativo e não há medições registradas no GRO, condição indispensável para a análise conforme a NR-15.

######### **Anexo 2 — Ruído de impacto**

########## **Considerando Não Insalubre**

########### **NPS < Limite de Tolerância (LT)**

############ **Caracterização: **Atividade — Operação de Equipamento X:
  Com base nos resultados das avaliações quantitativas de ruído de impacto associadas à atividade caracterizada, verifica-se que os níveis de pressão sonora de impacto mensurados permaneceram abaixo do limite de tolerância estabelecido no Anexo 2 da NR-15 (pico máximo ≤ 130 dB(C)).
  As medições realizadas representam adequadamente a exposição ocupacional decorrente da execução desta atividade específica, considerando a natureza intermitente e descontínua do ruído de impacto.
  Conclui-se, portanto, pela não caracterização da insalubridade para esta atividade.
  Esta conclusão aplica-se exclusivamente à atividade caracterizada, não se estendendo a outros cargos, grupos homogêneos ou ambientes.

########### **NPS > Limite de Tolerância (LT)**

############ **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Para a presente caracterização específica, vinculada ao(s) cargo(s), atividade(s) ou grupo(s) homogêneo(s) analisado(s), verifica-se que os níveis de pressão sonora de impacto mensurados excedem o limite de tolerância de 130 dB(C), conforme critérios estabelecidos no Anexo 2 da NR-15, caracterizando, em princípio, condição insalubre.
  Entretanto, ficou comprovado no GRO que foram adotadas, previamente, medidas de proteção coletiva e administrativa, e que o Equipamento de Proteção Individual – EPI auditivo fornecido é tecnicamente adequado ao agente ruído de impacto, possui Certificado de Aprovação válido, apresenta atenuação compatível com os níveis de exposição, e teve seu uso contínuo, correto e ininterrupto ao longo da jornada devidamente observado, incluindo treinamento, higienização, manutenção e substituição periódica, conforme exigências legais.
  Dessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelo uso eficaz do EPI, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição, controle e uso efetivo do EPI.

########## **Considerando Insalubre**

########### **NPS > Limite de Tolerância (LT)**

############ **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Com base nos resultados das avaliações quantitativas de ruído de impacto registradas no GRO para esta caracterização, verifica-se que os níveis de pressão sonora de impacto medidos ultrapassam o limite de tolerância estabelecido no Anexo 2 da NR-15.
  As medições foram realizadas conforme metodologia técnica aplicável e representam adequadamente a exposição ocupacional dos trabalhadores vinculadosAs medidas de controle coletivo e os Equipamentos de Proteção Individual (EPI) informados no GRO não se mostraram eficazes para neutralizar a exposição ao ruído de impacto acima do limite legal. a este grupo homogêneo de exposição.
  Conclui-se, portanto, pela caracterização da insalubridade para este grupo homogêneo de exposição, em decorrência da exposição ocupacional ao ruído de impacto acima do limite de tolerância.
  O grau de insalubridade aplicável ao fator de risco Ruído de Impacto é grau médio (20%), conforme estabelecido no Anexo 2 da NR-15.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, equipamentos ou ambientes.

########## **Inconclusivo**

########### **Sem Medições Lançadas no Sistema SimpleSST**

############ Não é possível concluir quanto à caracterização da insalubridade para esta caracterização específica, uma vez que o critério de avaliação aplicável ao ruído de impacto é quantitativo e não há medições registradas no GRO, condição indispensável para a análise conforme a NR-15.

######### **Anexo 3 — Calor**

########## **Considerando Não Insalubre**

########### **IBUTG < Limite de Tolerância (LT)**

############ **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Com base nos resultados das avaliações quantitativas de calor associadas à atividade caracterizada, verifica-se que os valores de IBUTG mensurados permaneceram abaixo do limite de tolerância aplicável, conforme critérios estabelecidos no Anexo 3 da NR-15, considerando o tipo de atividade desenvolvida e o regime de trabalho. As medições realizadas representam adequadamente a exposição ocupacional ao calor decorrente da execução desta atividade específica. Conclui-se, portanto, pela não caracterização da insalubridade por calor para esta atividade.
  Esta conclusão aplica-se exclusivamente à atividade caracterizada, não se estendendo a outros cargos, grupos homogêneos de exposição ou ambientes.

########## **Considerando Insalubre**

########### **IBUTG > Limite de Tolerância (LT) ****Ausência de Medidas de Controle Eficazes**

############ **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Com base nos resultados das avaliações quantitativas de calor registradas no GRO para esta caracterização, verifica-se que os valores de IBUTG mensurados excedem os limites de tolerância estabelecidos no Anexo 3 da NR-15, considerando o tipo de atividade desenvolvida, o metabolismo envolvido e o regime de trabalho. As medições foram realizadas conforme metodologia técnica aplicável e representam adequadamente a exposição ocupacional dos trabalhadores vinculados a este grupo homogêneo de exposição. As medidas de controle coletivo, organizacional e administrativas adotadas não se mostraram suficientes para neutralizar a sobrecarga térmica acima do limite legal. Conclui-se, portanto, pela caracterização da insalubridade por exposição ao calor para este grupo homogêneo de exposição. O grau de insalubridade aplicável ao agente físico Calor é grau **médio (20%)**, conforme estabelecido no Anexo 3 da NR-15.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, equipamentos ou ambientes.

########### **IBUTG > Limite de Tolerância (LT) ****Medidas de Controle Adotadas sem Redução do IBUTG**

############ **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Embora tenham sido informadas no GRO a adoção de medidas de controle coletivo, organizacionais e administrativas, bem como o cumprimento das boas práticas de gestão do risco ocupacional, os valores de IBUTG mensurados permaneceram acima dos limites de tolerância estabelecidos no Anexo 3 da NR-15. Ressalta-se que, para o agente físico calor, as medidas de controle impactam diretamente a condição de exposição avaliada e, portanto, sua eficácia deve se refletir no próprio resultado da medição. Assim, a permanência de valores de IBUTG acima do limite legal indica que, na prática, as medidas adotadas não foram suficientes para neutralizar a sobrecarga térmica, não sendo possível descaracterizar a insalubridade com base apenas na conformidade formal das ações de controle, mantendo-se a caracterização da insalubridade em grau médio (20%) para esta condição.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, equipamentos ou ambientes.

########## **Inconclusivo**

########### **Sem Medições Lançadas no Sistema SimpleSST**

############ Não é possível concluir quanto à caracterização da insalubridade por exposição ao calor para esta caracterização específica, uma vez que o critério de avaliação aplicável, conforme o Anexo 3 da NR-15, é quantitativo e depende da determinação do índice IBUTG, inexistente no GRO no momento da análise, condição indispensável para o julgamento técnico da insalubridade.

######### **Anexo 8 — Vibrações**

########## **Mãos e Braços (VMB)**

########### **Considerando Não Insalubre**

############ **aren < Limite de Tolerância (LT)**

############# **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Caracteriza-se como não insalubre a exposição ocupacional à vibração de mãos e braços quando a aceleração resultante de exposição normalizada (aren), determinada conforme os critérios e procedimentos estabelecidos na NHO 10 da Fundacentro, apresenta valor igual ou inferior a 5,0 m/s² para uma jornada padrão de 8 horas. Nesta condição, entende-se que o limite de exposição ocupacional previsto no Anexo 8 da NR-15 não foi excedido, não se configurando o direito ao adicional de insalubridade, devendo, contudo, ser mantidas as condições operacionais existentes e adotadas boas práticas de prevenção e monitoramento periódico, especialmente quando os valores se aproximarem do nível de ação definido pela norma técnica.
  Esta conclusão aplica-se exclusivamente à atividade caracterizada, não se estendendo a outros cargos, grupos homogêneos de exposição ou ambientes.

########### **Considerando Insalubre**

############ **aren > Limite de Tolerância (LT)
  ****Ausência de Medidas de Controle Eficazes**

############# **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Com base nos resultados das avaliações quantitativas de vibração de mãos e braços, verifica-se que a aceleração resultante de exposição normalizada (aren), determinada conforme os critérios da NHO 10 da Fundacentro, excede o limite de tolerância de 5,0 m/s² estabelecido no Anexo 8 da NR-15, caracterizando condição insalubre. Adicionalmente, não foi indicada no GRO a eficácia das medidas de controle coletivo, organizacionais, administrativas e do Equipamento de Proteção Individual – EPI para a neutralização da exposição ocupacional à vibração. Dessa forma, conclui-se pela caracterização da insalubridade em grau **médio (20%)** para este grupo homogêneo de exposição, em decorrência da exposição ocupacional à vibração de mãos e braços acima do limite legal.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, equipamentos ou ambientes.

############ **aren > Limite de Tolerância (LT)
  ****Medidas de Controle Adotadas sem Redução do aren**

############# **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Embora tenha sido informado no GRO que o Equipamento de Proteção Individual – EPI foi considerado eficaz, bem como que medidas de controle de engenharia, organizacionais e administrativas foram previamente adotadas, os valores de aceleração resultante de exposição normalizada (aren), determinados conforme os critérios da NHO 10 da Fundacentro, permaneceram acima do limite de tolerância de 5,0 m/s² estabelecido no Anexo 8 da NR-15. Ressalta-se que, para a vibração de mãos e braços, o EPI, incluindo luvas antivibratórias, não é capaz de neutralizar a exposição de forma isolada, sendo sua eficácia condicionada à redução do valor medido de aren. Assim, a permanência de resultados acima do limite legal indica que, na prática, as medidas de controle e o EPI adotados não foram suficientes para reduzir a exposição ocupacional a níveis aceitáveis, mantendo-se a caracterização da insalubridade em grau **médio (20%)** para esta condição.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, equipamentos ou ambientes.

########### **Inconclusivo**

############ **Sem Medições Lançadas no Sistema SimpleSST**

############# Não é possível concluir quanto à caracterização da insalubridade por exposição à vibração de mãos e braços para esta caracterização específica, uma vez que o critério de avaliação aplicável, conforme o Anexo 8 da NR-15 e a NHO 10 da Fundacentro, é quantitativo e depende da determinação da aceleração resultante de exposição normalizada (aren), inexistente no GRO no momento da análise, condição indispensável para o julgamento técnico da insalubridade.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, grupos homogêneos de exposição, atividades, equipamentos ou ambientes.

########## **Mãos e Braços (VCI)**

########### **Considerando Não Insalubre**

############ **aren ≤ Limite de Tolerância (LT)
  e
  VDVR ≤ Limite de Tolerância (LT)**

############# **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Caracteriza-se como não insalubre a exposição ocupacional à vibração de corpo inteiro quando a aceleração resultante de exposição normalizada (aren) apresenta valor igual ou inferior a 1,1 m/s² e, simultaneamente, a dose de vibração resultante (VDVR) apresenta valor igual ou inferior a 21,0 m/s¹·⁷⁵, conforme critérios de avaliação estabelecidos na NHO 09 da Fundacentro e no Anexo 8 da NR-15. Nesta condição, verifica-se que nenhum dos limites de exposição ocupacional diária aplicáveis à vibração de corpo inteiro foi superado, não se configurando a caracterização da insalubridade em grau médio (20%) prevista no item 2.3 do Anexo 8 da NR-15, não sendo devido o adicional de insalubridade, devendo, contudo, ser mantidas as condições operacionais existentes e adotadas boas práticas de prevenção e monitoramento periódico.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, equipamentos ou ambientes.

########### **Considerando Insalubre**

############ **aren > LT e/ou VDVR > LT
  ****Ausência de Medidas de Controle Eficazes**

############# **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Com base nos resultados das avaliações quantitativas de vibração de corpo inteiro, verifica-se que a aceleração resultante de exposição normalizada (aren) excede o limite de tolerância de 1,1 m/s² e/ou a dose de vibração resultante (VDVR) excede o limite de tolerância de 21,0 m/s¹·⁷⁵, conforme critérios estabelecidos na NHO 09 da Fundacentro e no Anexo 8 da NR-15, caracterizando condição insalubre. Adicionalmente, não foi indicada no GRO a eficácia das medidas de controle coletivo, organizacionais, administrativas e do Equipamento de Proteção Individual – EPI para a neutralização da exposição ocupacional à vibração de corpo inteiro. Dessa forma, conclui-se pela caracterização da insalubridade em grau **médio (20%)**, conforme item 2.3 do Anexo 8 da NR-15, em decorrência da exposição ocupacional acima dos limites legais.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, equipamentos ou ambientes.

############ **aren > LT e/ou VDVR > LT
  ****Medidas de Controle Adotadas sem Redução do aren e/ou VDVR**

############# **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Embora tenha sido informado no GRO que medidas de controle de engenharia, organizacionais e administrativas, bem como o Equipamento de Proteção Individual – EPI, foram adotados e considerados eficazes, os resultados das avaliações quantitativas de vibração de corpo inteiro indicam que a aceleração resultante de exposição normalizada (aren) permanece acima do limite de tolerância de 1,1 m/s² e/ou a dose de vibração resultante (VDVR) permanece acima do limite de tolerância de 21,0 m/s¹·⁷⁵, conforme critérios da NHO 09 da Fundacentro e do Anexo 8 da NR-15. Ressalta-se que, para a vibração de corpo inteiro, a eficácia das medidas de controle deve se refletir diretamente na redução dos valores medidos de aren e/ou VDVR, inexistindo mecanismo de neutralização individual capaz de eliminar a exposição sem alterar os resultados da avaliação quantitativa. Assim, a permanência de valores acima dos limites legais evidencia que, na prática, as medidas adotadas não foram suficientes para reduzir a exposição ocupacional a níveis aceitáveis, mantendo-se a caracterização da insalubridade **em grau médio (20%)**, conforme item 2.3 do Anexo 8 da NR-15.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, equipamentos ou ambientes.

########### **Inconclusivo**

############ **Sem Medições Lançadas no Sistema SimpleSST**

############# Não é possível concluir quanto à caracterização da insalubridade por exposição à vibração de corpo inteiro para esta caracterização específica, uma vez que o critério de avaliação aplicável, conforme o Anexo 8 da NR-15 e a NHO 09 da Fundacentro, é quantitativo e depende da determinação da aceleração resultante de exposição normalizada (aren) e da dose de vibração resultante (VDVR), inexistentes no GRO no momento da análise, condição indispensável para o julgamento técnico da insalubridade. Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, equipamentos ou ambientes.

######### **Anexo 11 — Agentes químicos com limites de tolerância**

########## **LT CMTP Jornada**

########### **Considerando Não Insalubre**

############ **CMTP < Limite de Tolerância (LT)**

############# **Caracterização: Grupo Similar de Exposição — GSE XXXXX
  **Caracteriza-se como não insalubre a exposição ocupacional à substância química {NOME_DA_SUBSTÂNCIA} quando a concentração média ponderada no tempo da jornada (CMTP), determinada conforme metodologia de avaliação quantitativa aplicável, apresenta valor igual ou inferior ao respectivo limite de tolerância {VALOR_LT} estabelecido no Anexo 11 da NR-15. Nesta condição, verifica-se que o limite de exposição ocupacional não foi excedido, não se configurando a caracterização da insalubridade em grau {GRAU_INSALUBRIDADE} prevista para este agente, não sendo devido o adicional de insalubridade, devendo, contudo, ser mantidas as condições operacionais existentes e adotadas boas práticas de prevenção, controle e monitoramento periódico.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.

############ **CMTP > Limite de Tolerância (LT)**

############# **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Para a presente caracterização, verifica-se que a concentração média ponderada no tempo da jornada (CMTP) da substância química {NOME_DA_SUBSTÂNCIA} apresenta valor superior ao respectivo limite de tolerância {VALOR_LT} estabelecido no Anexo 11 da NR-15, caracterizando, em princípio, condição insalubre em grau {GRAU_INSALUBRIDADE}. Entretanto, ficou comprovado no GRO que o Equipamento de Proteção Individual – EPI fornecido é tecnicamente adequado ao agente químico avaliado, possui Certificado de Aprovação válido, apresenta fator de proteção compatível com os níveis de exposição identificados e teve seu uso contínuo, correto e ininterrupto ao longo da jornada devidamente observado, incluindo treinamento, higienização, manutenção e substituição periódica, conforme exigências legais. Dessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelo uso eficaz do EPI, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição, controle e uso efetivo do EPI.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.

########### **Considerando Insalubre
  **

############ **CMTP > Limite de Tolerância (LT)**

############# **Caracterização: Grupo Similar de Exposição — GSE XXXXX
  **Com base nos resultados das avaliações quantitativas da exposição ocupacional à substância química {NOME_DA_SUBSTÂNCIA}, verifica-se que a concentração média ponderada no tempo da jornada (CMTP) apresenta valor superior ao respectivo limite de tolerância {VALOR_LT} estabelecido no Anexo 11 da NR-15, caracterizando condição insalubre. Considerando que não foi comprovada no GRO a neutralização da exposição por meio de medidas de controle coletivo, organizacionais, administrativas ou pelo uso eficaz de Equipamento de Proteção Individual – EPI, conclui-se pela caracterização da insalubridade em grau {GRAU_INSALUBRIDADE} para esta condição, em decorrência da exposição ocupacional acima do limite legal.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.

########### **Inconclusivo
  **

############ **Sem Medições Lançadas no Sistema SimpleSST**

############# Não é possível concluir quanto à caracterização da insalubridade por exposição ocupacional à substância química {NOME_DA_SUBSTÂNCIA} para esta caracterização específica, uma vez que o critério de avaliação aplicável, conforme o Anexo 11 da NR-15, é quantitativo e depende da determinação da concentração média ponderada no tempo da jornada (CMTP), inexistente no GRO no momento da análise, condição indispensável para o julgamento técnico da insalubridade.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.

########## **LT TETO**

########### **Considerando Não Insalubre**

############ **CTeto < Limite de Tolerância (LT)**

############# **Caracterização: Grupo Similar de Exposição — GSE XXXXX
  **Caracteriza-se como não insalubre a exposição ocupacional à substância química {NOME_DA_SUBSTÂNCIA}, classificada no Anexo 11 da NR-15 como substância de valor teto, quando os resultados das avaliações quantitativas indicam que a concentração medida permaneceu igual ou inferior ao respectivo valor teto {VALOR_TETO} em todos os instantes da jornada de trabalho. Nesta condição, verifica-se que o critério de exposição ocupacional aplicável foi atendido integralmente, não se configurando a caracterização da insalubridade em grau {GRAU_INSALUBRIDADE} prevista para este agente, não sendo devido o adicional de insalubridade, devendo, contudo, ser mantidas as condições operacionais existentes e adotadas boas práticas de prevenção, controle e monitoramento contínuo.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.

############ **CTeto > Limite de Tolerância (LT)**

############# **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Para a presente caracterização, verifica-se que a concentração da substância química {NOME_DA_SUBSTÂNCIA}, classificada no Anexo 11 da NR-15 como substância de valor teto, apresentou registros pontuais superiores ao respectivo limite de tolerância {VALOR_TETO}, caracterizando, em princípio, condição insalubre em grau {GRAU_INSALUBRIDADE}. Entretanto, ficou comprovado no GRO que o Equipamento de Proteção Individual – EPI fornecido é tecnicamente adequado ao agente químico avaliado, possui Certificado de Aprovação válido, apresenta fator de proteção compatível com os níveis de exposição identificados e teve seu uso contínuo, correto e ininterrupto ao longo da jornada devidamente observado, incluindo treinamento, higienização, manutenção e substituição periódica, conforme exigências legais. Dessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelo uso eficaz do EPI, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição, controle e uso efetivo do EPI.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.

########### **Considerando Insalubre**

############ **CTeto > Limite de Tolerância (LT)**

############# **Caracterização: Grupo Similar de Exposição — GSE XXXXX
  **Com base nos resultados das avaliações quantitativas da exposição ocupacional à substância química {NOME_DA_SUBSTÂNCIA}, classificada no Anexo 11 da NR-15 como substância de valor teto, verifica-se que a concentração medida excedeu o respectivo limite de tolerância {VALOR_TETO} em ao menos um instante da jornada de trabalho, caracterizando condição insalubre. Considerando que não foi comprovada no GRO a neutralização da exposição por meio de medidas de controle coletivo, organizacionais, administrativas ou pelo uso eficaz de Equipamento de Proteção Individual – EPI, conclui-se pela caracterização da insalubridade em grau {GRAU_INSALUBRIDADE}, conforme o Anexo 11 da NR-15, em decorrência da ultrapassagem do valor teto aplicável.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.

########### **Inconclusivo
  **

############ **Sem Medições Lançadas no Sistema SimpleSST**

############# Não é possível concluir quanto à caracterização da insalubridade por exposição ocupacional à substância química {NOME_DA_SUBSTÂNCIA}, classificada no Anexo 11 da NR-15 como substância de valor teto, para esta caracterização específica, uma vez que o critério de avaliação aplicável é quantitativo e depende da verificação da concentração ambiental em todos os instantes da jornada de trabalho, inexistente no GRO no momento da análise, condição indispensável para o julgamento técnico da insalubridade.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.

########## {GRAU_INSALUBRIDADE}

########### grau mínimo (10%)

########### grau médio (20%)

########### grau máximo (40%)

######### **Anexo 12 — Poeiras minerais (quando aplicável por LT)**

########## **Considerando Não Insalubre**

########### **CMTP < Limite de Tolerância (LT)**

############ **Caracterização: Grupo Similar de Exposição — GSE XXXXX
  **Caracteriza-se como não insalubre a exposição ocupacional à substância química {NOME_DA_SUBSTÂNCIA} quando a concentração média ponderada no tempo da jornada (CMTP), determinada conforme metodologia de avaliação quantitativa aplicável, apresenta valor igual ou inferior ao respectivo limite de tolerância {VALOR_LT} estabelecido no Anexo 11 da NR-15. Nesta condição, verifica-se que o limite de exposição ocupacional não foi excedido, não se configurando a caracterização da insalubridade em grau {GRAU_INSALUBRIDADE} prevista para este agente, não sendo devido o adicional de insalubridade, devendo, contudo, ser mantidas as condições operacionais existentes e adotadas boas práticas de prevenção, controle e monitoramento periódico.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.

########### **CMTP > Limite de Tolerância (LT)**

############ **Caracterização: Grupo Similar de Exposição — GSE XXXXX**
  Para a presente caracterização, verifica-se que a concentração média ponderada no tempo da jornada (CMTP) da substância química {NOME_DA_SUBSTÂNCIA} apresenta valor superior ao respectivo limite de tolerância {VALOR_LT} estabelecido no Anexo 11 da NR-15, caracterizando, em princípio, condição insalubre em grau {GRAU_INSALUBRIDADE}. Entretanto, ficou comprovado no GRO que o Equipamento de Proteção Individual – EPI fornecido é tecnicamente adequado ao agente químico avaliado, possui Certificado de Aprovação válido, apresenta fator de proteção compatível com os níveis de exposição identificados e teve seu uso contínuo, correto e ininterrupto ao longo da jornada devidamente observado, incluindo treinamento, higienização, manutenção e substituição periódica, conforme exigências legais. Dessa forma, nos termos do item 15.4 da NR-15, resta caracterizada a neutralização da insalubridade pelo uso eficaz do EPI, não sendo devido o adicional de insalubridade para esta caracterização específica, enquanto mantidas as mesmas condições de exposição, controle e uso efetivo do EPI.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.

########## **Considerando Insalubre
  **

########### **CMTP > Limite de Tolerância (LT)**

############ **Caracterização: Grupo Similar de Exposição — GSE XXXXX
  **Com base nos resultados das avaliações quantitativas da exposição ocupacional à substância química {NOME_DA_SUBSTÂNCIA}, verifica-se que a concentração média ponderada no tempo da jornada (CMTP) apresenta valor superior ao respectivo limite de tolerância {VALOR_LT} estabelecido no Anexo 11 da NR-15, caracterizando condição insalubre. Considerando que não foi comprovada no GRO a neutralização da exposição por meio de medidas de controle coletivo, organizacionais, administrativas ou pelo uso eficaz de Equipamento de Proteção Individual – EPI, conclui-se pela caracterização da insalubridade em grau {GRAU_INSALUBRIDADE} para esta condição, em decorrência da exposição ocupacional acima do limite legal.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.

########## **Inconclusivo
  **

########### **Sem Medições Lançadas no Sistema SimpleSST**

############ Não é possível concluir quanto à caracterização da insalubridade por exposição ocupacional à substância química {NOME_DA_SUBSTÂNCIA} para esta caracterização específica, uma vez que o critério de avaliação aplicável, conforme o Anexo 11 da NR-15, é quantitativo e depende da determinação da concentração média ponderada no tempo da jornada (CMTP), inexistente no GRO no momento da análise, condição indispensável para o julgamento técnico da insalubridade.
  Esta conclusão aplica-se exclusivamente à caracterização analisada, não se estendendo a outros cargos, atividades, grupos homogêneos de exposição, substâncias, processos ou ambientes.

######## **Critério Qualitativo (H1)**

######### **Anexo 14 da NR-15 – Agentes biológicos**

########## **Considerando Não Insalubre
  **Atividade Não Equivalente
  Não Habitual e Permanente

########### **Caracterização:** Grupo Homogêneo de Exposição – GHE B
  Com base na análise qualitativa das atividades típicas deste grupo homogêneo de exposição, verifica-se que não há equivalência plena com as atividades normatizadas no Anexo 14 da NR-15.
  Além disso, a exposição aos agentes biológicos não se caracteriza como habitual e permanente.
  Conclui-se, portanto, pela não caracterização da insalubridade para este grupo homogêneo de exposição.
  Esta conclusão aplica-se exclusivamente a este vínculo específico.

########## **Considerando Não Insalubre
  **Atividade Equivalente
  Não Habitual e Permanente

########### **Caracterização**: Grupo Homogêneo de Exposição – GHE X
  Com base na análise qualitativa das atividades efetivamente desenvolvidas neste grupo homogêneo de exposição, verifica-se que as tarefas executadas são equivalentes, do ponto de vista técnico, às atividades descritas no Anexo 14 da NR-15, envolvendo potencial contato com agentes biológicos.
  
  Entretanto, conforme caracterização realizada no GRO, **a exposição aos agentes biológicos ocorre de forma eventual ou intermitente**, não se configurando como **habitual e permanente**, requisito indispensável para a caracterização da insalubridade nos termos da NR-15 para agentes avaliados por critério qualitativo.
  
  Dessa forma, **ainda que haja equivalência entre a atividade real e a atividade normatizada**, a ausência de exposição habitual e permanente **afasta o enquadramento como atividade insalubre**, não sendo devido o adicional de insalubridade para este vínculo específico.
  Esta conclusão **aplica-se exclusivamente a esta caracterização**, limitada ao grupo homogêneo, atividade ou ambiente aqui analisado, não sendo extensível a outros vínculos ou formas de caracterização eventualmente existentes no GRO.

########## **Considerando Insalubre
  **Atividade Equivalente
  Habitual e Permanente

########### **Caracterização: Grupo Homogêneo de Exposição – GHE X
  **Com base na análise qualitativa das atividades efetivamente desenvolvidas neste grupo homogêneo de exposição, verifica-se que as tarefas executadas são equivalentes, sob o ponto de vista técnico e operacional, às atividades descritas no Anexo 14 da NR-15, envolvendo contato com agentes biológicos potencialmente infectocontagiosos.
  
  Constata-se, conforme caracterização registrada no GRO, que **a exposição aos agentes biológicos ocorre de forma habitual e permanente**, integrando a rotina normal de trabalho dos trabalhadores vinculados a este grupo homogêneo, não se tratando de situação eventual ou esporádica.
  
  Nessas condições, estando atendidos simultaneamente os critérios de **equivalência da atividade real à atividade normatizada** e de **exposição habitual e permanente**, caracteriza-se a insalubridade nos termos do Anexo 14 da NR-15.
  
  Conclui-se, portanto, pela **caracterização da atividade como insalubre**, sendo devido o adicional de insalubridade **no grau máximo de 40% para agentes biológicos**, conforme estabelece a NR-15.
  
  Esta conclusão **aplica-se exclusivamente a esta caracterização específica**, limitada ao grupo homogêneo, atividade ou ambiente aqui analisado, não sendo extensível a outros vínculos eventualmente existentes no GRO.

###### Restrição da conclusão aos cargos, atividades ou ambientes efetivamente vinculados à caracterização[^11]

#### **Regras de consolidação**

##### Não haverá somatório de graus de insalubridade

##### Cada fator de risco será analisado e concluído individualmente

##### O relatório poderá conter múltiplas conclusões técnicas, mantendo rastreabilidade normativa

#### **Princípio jurídico de encerramento**

##### O relatório não deverá inferir insalubridade global da empresa

##### A conclusão será sempre por fator de risco, por Anexo e por caracterização específica

##### A estrutura atende integralmente aos requisitos da NR-15 e à jurisprudência trabalhista consolidada

#  

#  

#  

[^1]: **Exemplo de texto introdutório**
[^2]: **Exemplo de texto introdutório**
[^3]: **Exemplo de texto introdutório**
[^4]: **Exemplo de texto introdutório**
[^5]:  
[^6]:  
[^7]:  
[^8]:  
[^9]: **Exemplo de texto para a Conclusão**
[^10]:  
[^11]: **Exemplo de texto para a Conclusão**