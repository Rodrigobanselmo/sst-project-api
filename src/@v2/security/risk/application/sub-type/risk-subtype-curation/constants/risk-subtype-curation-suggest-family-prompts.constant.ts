import { RiskSubtypeCurationFamily } from './risk-subtype-curation-suggest-family.enum';

export const RISK_SUBTYPE_CURATION_FAMILY_PROMPT_BLOCKS: Record<
  RiskSubtypeCurationFamily,
  string
> = {
  [RiskSubtypeCurationFamily.FEN_HA]: `Regras para o subtipo alvo FEN/HA — Fenóis e cresóis:
- INCLUIR somente se houver evidência de grupo fenólico: hidroxila (-OH) ligada diretamente ao anel aromático.
- Exemplos positivos: fenol, cresol (o/m/p), xilenol, catecol, resorcinol, hidroquinona, clorofenol, nitrofenol, dinitrofenol, aminofenol.
- EXCLUIR mesmo sendo aromáticos: benzeno, tolueno, xileno/dimetilbenzeno, etilbenzeno, estireno, naftaleno, HAP, bifenil, anilina, nitrobenzeno/TNT sem hidroxila fenólica, triclorobenzeno/haloaromático sem OH fenólico, ciclohexano/ciclohexeno.
- REGRA EXPLÍCITA: "aromático" ou "anel benzênico" NÃO basta para FEN/HA sem grupo fenólico.
- chemicalIdentity.isPhenolOrCresol=true é evidência forte de inclusão; hasAromaticRing=true sozinho NÃO inclui.`,

  [RiskSubtypeCurationFamily.ISO]: `Regras para o subtipo alvo ISO — Isocianatos:
- INCLUIR se houver grupo isocianato (N=C=O): isocianato, diisocianato, poliisocianato, TDI, MDI, HDI.
- EXCLUIR aromáticos sem grupo isocianato.
- TDI/MDI aromáticos pertencem a ISO, não a HC/HA.`,

  [RiskSubtypeCurationFamily.AMAR_HA]: `Regras para o subtipo alvo AMAR/HA — Aminas aromáticas:
- INCLUIR anilina, toluidinas, xilidinas, benzidina, aminofenóis e derivados aromáticos com grupo amina.
- EXCLUIR hidrocarbonetos aromáticos sem grupo amina e fenóis sem grupo amina.`,

  [RiskSubtypeCurationFamily.NITRO_FEN_HA]: `Regras para o subtipo alvo NITRO/FEN/HA:
- INCLUIR nitrofenóis, dinitrofenóis e derivados nitroaromáticos com grupo fenólico dominante.
- EXCLUIR nitrobenzeno/TNT sem grupo fenólico (esses são NITRO/HA).`,

  [RiskSubtypeCurationFamily.NITRO_HA]: `Regras para o subtipo alvo NITRO/HA — Nitrocompostos aromáticos:
- INCLUIR nitrobenzeno, nitrotoluenos, dinitrotoluenos, trinitrotolueno (TNT), nitroclorobenzenos.
- EXCLUIR nitrofenóis quando o subtipo alvo for NITRO/HA puro (preferir NITRO/FEN/HA).`,

  [RiskSubtypeCurationFamily.HC_HA_HAP]: `Regras para o subtipo alvo HC/HA/HAP — Hidrocarbonetos aromáticos policíclicos:
- INCLUIR policíclicos aromáticos: naftaleno, antraceno, fenantreno, pireno, benzo[a]pireno, benzo[a]antraceno, acenafteno, acenaftileno.
- EXCLUIR aromáticos monocíclicos simples (benzeno, tolueno, xileno).`,

  [RiskSubtypeCurationFamily.HC_HALI]: `Regras para o subtipo alvo HC/HALI — Hidrocarbonetos alifáticos:
- INCLUIR alcanos, alcenos, alcinos, cicloalcanos/cicloalcenos não aromáticos, butadieno, hexano, heptano, ciclohexano, ciclohexeno.
- EXCLUIR aromáticos e compostos com grupos funcionais dominantes não alifáticos.`,

  [RiskSubtypeCurationFamily.HC_HH]: `Regras para o subtipo alvo HC/HH — Hidrocarbonetos halogenados:
- INCLUIR hidrocarbonetos halogenados (alifáticos ou aromáticos) quando halogênio for característica principal.
- EXCLUIR organoclorados persistentes/herbicidas quando houver subtipo mais específico.`,

  [RiskSubtypeCurationFamily.ORGCL_HH]: `Regras para o subtipo alvo ORGCL/HH — Organoclorados:
- INCLUIR organoclorados quando a característica organoclorada for principal.
- EXCLUIR quando couber melhor em HERB ou PERSIST.`,

  [RiskSubtypeCurationFamily.ORGCL_HA_HH_PERSIST]: `Regras para o subtipo alvo ORGCL/HA/HH/PERSIST:
- INCLUIR PCB, bifenilos policlorados e aromáticos halogenados persistentes.`,

  [RiskSubtypeCurationFamily.HERB_HA_HH]: `Regras para o subtipo alvo HERB/HA/HH:
- INCLUIR 2,4-D, 2,4,5-T, derivados clorofenoxiacéticos e herbicidas aromáticos/halogenados.`,

  [RiskSubtypeCurationFamily.HC_HA]: `Regras para o subtipo alvo HC/HA — Hidrocarbonetos aromáticos (guarda-chuva):
- INCLUIR benzeno, tolueno, xilenos/dimetilbenzenos, etilbenzeno, estireno e aromáticos monocíclicos simples.
- EXCLUIR se couber melhor em ISO, FEN/HA, AMAR/HA, NITRO/HA, NITRO/FEN/HA, HAP, ORGCL/HH, HERB ou PERSIST.
- EXCLUIR aldeídos, cetonas, ésteres, ácidos, álcoois, nitrilas sem núcleo aromático relevante.
- EXCLUIR hidrocarbonetos alifáticos/dienos/olefinas: butadieno, alcenos, dienos, alcanos.
- EXCLUIR isocianatos (TDI etc.) — grupo ISO é mais específico.
- NUNCA incluir só por toxicidade/órgão-alvo.`,

  [RiskSubtypeCurationFamily.SOLV]: `Regras para o subtipo alvo SOLV — Solventes orgânicos:
- Categoria por uso/exposição; incluir com cautela quando a característica de solvente orgânico for tecnicamente relevante.
- NÃO usar SOLV para substituir família estrutural mais específica.`,

  [RiskSubtypeCurationFamily.GENERIC]: `Para o subtipo alvo sem família química reconhecida:
- Aplique o critério estrutural/químico descrito no nome e na descrição do subtipo alvo.
- Evite enquadramento por efeito toxicológico isolado.`,
};
