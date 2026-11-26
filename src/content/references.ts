// Referencias bibliográficas en APA 7, transcritas de la sección «Referencias» de la guía.
// No editar el texto salvo para corregir errores de transcripción contra docs/extracted/guia_texto.md.

export interface Reference {
  /** Cita en texto, como aparece en la guía. */
  cite: string;
  /** Referencia completa APA 7. */
  apa: string;
  url?: string;
}

export const REFERENCES = {
  azadeh2019: {
    cite: 'Azadeh et al. (2019)',
    apa: 'Azadeh, K., De Koster, R., & Roy, D. (2019). Robotized and automated warehouse systems: Review and recent developments. Transportation Science, 53(4), 917–945.',
  },
  bsi_sf: {
    cite: 'BSI (s. f.)',
    apa: 'British Standards Institution. (s. f.). BS 6884: Recommendations for plan dimensions of unit loads.',
    url: 'https://knowledge.bsigroup.com/products/recommendations-for-plan-dimensions-of-unit-loads',
  },
  castaneda2026: {
    cite: 'Castañeda (2026)',
    apa: 'Castañeda Huamán, E. (2026). Capítulo VI: Manejo de materiales y equipo para el manejo de materiales [Diapositivas de clase]. Ingeniería de Métodos 2, Universidad Nacional de San Agustín de Arequipa.',
  },
  cdc_sf: {
    cite: 'CDC (s. f.)',
    apa: 'Centers for Disease Control and Prevention. (s. f.). Revised NIOSH lifting equation.',
    url: 'https://cdc.gov/niosh/ergonomics/about/RNLE.html',
  },
  chakraborthy2006: {
    cite: 'Chakraborthy y Banik (2006)',
    apa: 'Chakraborthy, S., & Banik, D. (2006). Design of a material handling equipment selection model using analytic hierarchy process. The International Journal of Advanced Manufacturing Technology, 28, 1237–1245.',
  },
  chan2001: {
    cite: 'Chan et al. (2001)',
    apa: 'Chan, F. T. S., Ip, R. W. L., & Lau, H. (2001). Integration of expert system with analytic hierarchy process for the design of material handling equipment selection system. Journal of Materials Processing Technology, 116, 137–145.',
  },
  cmco_sf: {
    cite: 'CMCO (s. f.)',
    apa: "CMCO. (s. f.). Overhead crane types: What's best for your application?",
    url: 'https://cmco.com/en-us/resources/blog/overhead-crane-types/',
  },
  cicmhe_sf: {
    cite: 'CICMHE (s. f.)',
    apa: 'College-Industry Council on Material Handling Education. (s. f.). I-A. Conveyors [Taxonomía de equipo de transporte].',
    url: 'https://og.mhi.org/learning/cicmhe/resources/taxonomy/TransEq/Conv/index.htm',
  },
  datar1991: {
    cite: 'Datar et al. (1991)',
    apa: 'Datar, S., Kekre, S., Mukhopadhyay, T., & Svaan, E. (1991). Overloaded overheads: Activity-based cost analysis of material handling in cell manufacturing. Journal of Operations Management, 10(1).',
    url: 'https://deepblue.lib.umich.edu/handle/2027.42/29552',
  },
  designingbuildings_sf: {
    cite: 'Designing Buildings (s. f.)',
    apa: 'Designing Buildings. (s. f.). Overhead crane.',
    url: 'https://www.designingbuildings.co.uk/wiki/Overhead_Crane',
  },
  fragapane2021: {
    cite: 'Fragapane et al. (2021)',
    apa: 'Fragapane, G., de Koster, R., Sgarbossa, F., & Strandhagen, J. O. (2021). Planning and control of autonomous mobile robots for intralogistics: Literature review and research agenda. European Journal of Operational Research, 294(2), 405–426.',
    url: 'https://repub.eur.nl/pub/134773',
  },
  groover2008: {
    cite: 'Groover (2008)',
    apa: 'Groover, M. P. (2008). Automation, production systems, and computer-integrated manufacturing (3.ª ed.). Pearson.',
  },
  hassan2010: {
    cite: 'Hassan (2010)',
    apa: 'Hassan, M. M. D. (2010). A framework for selection of material handling equipment in manufacturing and logistics facilities. Journal of Manufacturing Technology Management, 21(2), 246–268.',
    url: 'https://doi.org/10.1108/17410381011014396',
  },
  heragu_sf: {
    cite: 'Heragu y Ekren (s. f.)',
    apa: 'Heragu, S. S., & Ekren, B. (s. f.). Materials handling system design [Extracto del capítulo 1]. Wiley.',
    url: 'https://catalogimages.wiley.com/images/db/pdf/9780470170700.excerpt.pdf',
  },
  iso2003: {
    cite: 'ISO (2003)',
    apa: 'International Organization for Standardization. (2003). Flat pallets for intercontinental materials handling — Principal dimensions and tolerances (ISO 6780:2003).',
    url: 'https://www.iso.org/standard/30524.html',
  },
  kay_sf: {
    cite: 'Kay (s. f.)',
    apa: 'Kay, M. G. (s. f.). Material handling equipment. North Carolina State University.',
    url: 'https://mgkay.github.io/Material_Handling_Equipment.pdf',
  },
  keith2024: {
    cite: 'Keith y La (2024)',
    apa: 'Keith, R., & La, H. M. (2024). Review of autonomous mobile robots for the warehouse environment [Preprint]. arXiv.',
    url: 'https://arxiv.org/abs/2406.08333',
  },
  kubasakova2024: {
    cite: 'Kubasáková et al. (2024)',
    apa: 'Kubasáková, I., Kubáňová, J., Benčo, D., & Kadlecová, D. (2024). Implementation of automated guided vehicles for the automation of selected processes and elimination of collisions between handling equipment and humans in the warehouse. Sensors, 24(3), Artículo 1029.',
    url: 'https://doi.org/10.3390/s24031029',
  },
  kulak2005: {
    cite: 'Kulak (2005)',
    apa: 'Kulak, O. (2005). A decision support system for fuzzy multi-attribute selection of material handling equipments. Expert Systems with Applications, 29(2), 310–319.',
  },
  logcluster2022: {
    cite: 'Logistics Cluster (2022)',
    apa: 'Logistics Cluster. (2022). Standard pallet specifications.',
    url: 'https://log.logcluster.org/sites/default/files/2022-07/Pallet%20Specifications.pdf',
  },
  mecalux_sf: {
    cite: 'Mecalux (s. f.)',
    apa: 'Mecalux. (s. f.). The key difference between a Euro pallet and a US pallet is their dimensions.',
    url: 'https://www.mecalux.com/blog/euro-pallet-vs-us-pallet',
  },
  meyers2006: {
    cite: 'Meyers y Stephens (2006)',
    apa: 'Meyers, F. E., & Stephens, M. P. (2006). Diseño de instalaciones de manufactura y manejo de materiales (3.ª ed.). Pearson Educación.',
  },
  mmh_sf_a: {
    cite: 'Modern Materials Handling (s. f.-a)',
    apa: 'Modern Materials Handling. (s. f.-a). Equipment 101: Automatic guided vehicles basics.',
    url: 'https://www.mmh.com/article/equipment_101_automatic_guided_vehicles_basics',
  },
  mmh_sf_b: {
    cite: 'Modern Materials Handling (s. f.-b)',
    apa: 'Modern Materials Handling. (s. f.-b). Equipment 101: Overhead handling equipment basics.',
    url: 'https://www.mmh.com/article/overhead_handling_equipment_basics/Equipment_101',
  },
  mmh_sf_c: {
    cite: 'Modern Materials Handling (s. f.-c)',
    apa: 'Modern Materials Handling. (s. f.-c). Equipment 101: Automated storage and retrieval systems (AS/RS).',
    url: 'https://www.mmh.com/article/how_as_rs_works/Equipment_101',
  },
  muther1973: {
    cite: 'Muther (1973)',
    apa: 'Muther, R. (1973). Systematic layout planning (2.ª ed.). Cahners Books.',
  },
  niosh1996: {
    cite: 'NIOSH (1996)',
    apa: 'National Institute for Occupational Safety and Health. (1996). Health hazard evaluation report 95-0335-2566: Schrock Cabinet Company, Arthur, Illinois.',
    url: 'https://www.cdc.gov/niosh/hhe/reports/pdfs/1995-0335-2566.pdf',
  },
  osha_sf_a: {
    cite: 'OSHA (s. f.-a)',
    apa: 'Occupational Safety and Health Administration. (s. f.-a). Powered industrial trucks (forklift) eTool: Forklift classifications.',
    url: 'https://osha.gov/etools/powered-industrial-trucks/types-fundamentals/types/classes',
  },
  osha_sf_b: {
    cite: 'OSHA (s. f.-b)',
    apa: 'Occupational Safety and Health Administration. (s. f.-b). Lifting analysis worksheet [OSHA Technical Manual, sección VII].',
    url: 'https://osha.gov/sites/default/files/otm_vii_lifting_analysis_worksheet.pdf',
  },
  peters1998: {
    cite: 'Peters (1998)',
    apa: 'Peters, B. A. (Ed.). (1998). An introduction to material handling equipment selection. College-Industry Council on Material Handling Education.',
    url: 'https://og.mhi.org/downloads/learning/cicmhe/guidelines/equpguid.pdf',
  },
  roodbergen2009: {
    cite: 'Roodbergen y Vis (2009)',
    apa: 'Roodbergen, K. J., & Vis, I. F. A. (2009). A survey of literature on automated storage and retrieval systems. European Journal of Operational Research, 194(2), 343–362.',
    url: 'https://doi.org/10.1016/j.ejor.2008.01.038',
  },
  saputro2015: {
    cite: 'Saputro et al. (2015)',
    apa: 'Saputro, T. E., Masudin, I., & Daneshvar Rouyendegh, B. (2015). A literature review on MHE selection problem: Levels, contexts, and approaches. International Journal of Production Research, 53(17), 5139–5152.',
    url: 'https://ideas.repec.org/a/taf/tprsxx/v53y2015i17p5139-5152.html',
  },
  satoglu2021: {
    cite: 'Satoglu y Türkekul (2021)',
    apa: 'Satoglu, S. I., & Türkekul, İ. (2021). Selection of material handling equipment using the AHP and MOORA. Jurnal Teknik Industri, 22(1), 113–124.',
    url: 'https://doi.org/10.22219/JTIUMM.Vol22.No1.113-124',
  },
  fabricator_sf: {
    cite: 'The Fabricator (s. f.)',
    apa: 'The Fabricator. (s. f.). Everything you wanted to know about overhead cranes.',
    url: 'https://www.thefabricator.com/thefabricator/article/materialshandling/everything-you-wanted-to-know-about-overhead-cranes',
  },
  tompkins2010: {
    cite: 'Tompkins et al. (2010)',
    apa: 'Tompkins, J. A., White, J. A., Bozer, Y. A., & Tanchoco, J. M. A. (2010). Facilities planning (4.ª ed.). Wiley.',
  },
  vieira2011: {
    cite: 'Vieira et al. (2011)',
    apa: 'Vieira, G. B. B., Pasa, G. S., Borsa, M. B. N. O., Milan, G. S., & Pandolfo, A. (2011). Materials handling management: A case study. Journal of Operations and Supply Chain Management, 4(2), 19–30.',
  },
  waseem2021: {
    cite: 'Waseem et al. (2021)',
    apa: 'Waseem, M., Ghani, U., Habib, T., Noor, S., et al. (2021). Productivity enhancement with material handling system design and human factors analysis: A case study. Mehran University Research Journal of Engineering and Technology, 40(3), 556–569.',
    url: 'https://doi.org/10.22581/muet1982.2103.10',
  },
  waters2021: {
    cite: 'Waters et al. (2021)',
    apa: 'Waters, T. R., Putz-Anderson, V., & Garg, A. (2021). Applications manual for the revised NIOSH lifting equation (DHHS [NIOSH] Publication No. 94-110, rev.). National Institute for Occupational Safety and Health.',
    url: 'https://doi.org/10.26616/NIOSHPUB94110revised0720201',
  },
  waters1993: {
    cite: 'Waters et al. (1993)',
    apa: 'Waters, T. R., Putz-Anderson, V., Garg, A., & Fine, L. J. (1993). Revised NIOSH equation for the design and evaluation of manual lifting tasks. Ergonomics, 36(7), 749–776.',
    url: 'https://doi.org/10.1080/00140139308967940',
  },
  white_sf: {
    cite: 'White (s. f.)',
    apa: 'White, J. A. (s. f.). Material handling in integrated manufacturing systems. National Academies Press.',
    url: 'https://www.nap.edu/read/1100/chapter/6',
  },
} as const satisfies Record<string, Reference>;

export type ReferenceId = keyof typeof REFERENCES;

export const REFERENCE_IDS = Object.keys(REFERENCES) as ReferenceId[];
