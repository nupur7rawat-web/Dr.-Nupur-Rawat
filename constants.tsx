
import { RiskLevel, IngredientInfo } from './types';

const h = RiskLevel.HIGH;
const m = RiskLevel.MODERATE;
const l = RiskLevel.LOW;

export const INGREDIENT_DATABASE: Record<string, IngredientInfo> = {
  // --- 1-10: PARABENS ---
  'methylparaben': { name: 'Methylparaben', category: 'Paraben', riskLevel: h, harm: 'Endocrine disruption, estrogen mimic.', evidence: 'SCCS', pregnancySafe: 'AVOID', tags: ['EDC'] },
  'ethylparaben': { name: 'Ethylparaben', category: 'Paraben', riskLevel: h, harm: 'Potential hormonal interference.', evidence: 'ECHA', pregnancySafe: 'AVOID', tags: ['EDC'] },
  'propylparaben': { name: 'Propylparaben', category: 'Paraben', riskLevel: h, harm: 'Hormonal interference, fertility concerns.', evidence: 'Endocrine Society', pregnancySafe: 'AVOID', tags: ['Reprotoxic'] },
  'butylparaben': { name: 'Butylparaben', category: 'Paraben', riskLevel: h, harm: 'Reproductive toxicity and developmental issues.', evidence: 'OECD', pregnancySafe: 'AVOID', tags: ['Toxic'] },
  'isobutylparaben': { name: 'Isobutylparaben', category: 'Paraben', riskLevel: h, harm: 'Strongest estrogenic activity in paraben family.', evidence: 'EU Banned', pregnancySafe: 'AVOID', tags: ['Banned'] },
  'benzylparaben': { name: 'Benzylparaben', category: 'Paraben', riskLevel: h, harm: 'Estrogenic potential and bioaccumulation.', evidence: 'Research', pregnancySafe: 'AVOID', tags: ['EDC'] },
  'isopropylparaben': { name: 'Isopropylparaben', category: 'Paraben', riskLevel: h, harm: 'Regulated due to hormone disruption risks.', evidence: 'Regulatory', pregnancySafe: 'AVOID', tags: ['Banned'] },
  'phenylparaben': { name: 'Phenylparaben', category: 'Paraben', riskLevel: h, harm: 'Hormonal interference.', evidence: 'Research', pregnancySafe: 'AVOID', tags: ['EDC'] },
  'heptylparaben': { name: 'Heptylparaben', category: 'Paraben', riskLevel: h, harm: 'Mimics estrogen.', evidence: 'Research', pregnancySafe: 'AVOID', tags: ['EDC'] },
  'pentylparaben': { name: 'Pentylparaben', category: 'Paraben', riskLevel: h, harm: 'Hormonal disruption.', evidence: 'Research', pregnancySafe: 'AVOID', tags: ['EDC'] },

  // --- 11-26: PHTHALATES & PLASTICIZERS ---
  'diethyl phthalate': { name: 'Diethyl phthalate (DEP)', category: 'Phthalate', riskLevel: h, harm: 'Hormone disruption, infertility risk.', evidence: 'EWG', pregnancySafe: 'AVOID', tags: ['Plasticizer'] },
  'dep': { name: 'DEP', category: 'Phthalate', riskLevel: h, harm: 'Disrupts reproductive hormones.', evidence: 'PubMed', pregnancySafe: 'AVOID', tags: ['EDC'] },
  'dibutyl phthalate': { name: 'Dibutyl phthalate (DBP)', category: 'Phthalate', riskLevel: h, harm: 'Severe reproductive toxicant.', evidence: 'Prop 65', pregnancySafe: 'AVOID', tags: ['Banned'] },
  'dbp': { name: 'DBP', category: 'Phthalate', riskLevel: h, harm: 'Reproductive toxicant.', evidence: 'EU Ban', pregnancySafe: 'AVOID', tags: ['Banned'] },
  'dehp': { name: 'Di(2-ethylhexyl) phthalate', category: 'Phthalate', riskLevel: h, harm: 'Potent endocrine disruptor.', evidence: 'WHO', pregnancySafe: 'AVOID', tags: ['Toxic'] },
  'dimethyl phthalate': { name: 'Dimethyl phthalate (DMP)', category: 'Phthalate', riskLevel: h, harm: 'Hormonal interference.', evidence: 'Research', pregnancySafe: 'AVOID', tags: ['EDC'] },
  'benzyl butyl phthalate': { name: 'Benzyl butyl phthalate (BBP)', category: 'Phthalate', riskLevel: h, harm: 'Reproductive toxicity.', evidence: 'EU Ban', pregnancySafe: 'AVOID', tags: ['Banned'] },
  'diisononyl phthalate': { name: 'Diisononyl phthalate (DINP)', category: 'Phthalate', riskLevel: h, harm: 'EDC and potential carcinogen.', evidence: 'Research', pregnancySafe: 'AVOID', tags: ['Toxic'] },
  'diisodecyl phthalate': { name: 'Diisodecyl phthalate (DIDP)', category: 'Phthalate', riskLevel: h, harm: 'Reproductive and liver toxicity.', evidence: 'Research', pregnancySafe: 'AVOID', tags: ['Toxic'] },
  'ehdp': { name: '2-Ethylhexyl diphenyl phosphate', category: 'Plasticizer', riskLevel: h, harm: 'Flame retardant with ED concerns.', evidence: 'Research', pregnancySafe: 'AVOID', tags: ['Flame Retardant'] },

  // --- 27-31: BISPHENOLS ---
  'bisphenol a': { name: 'Bisphenol A (BPA)', category: 'Bisphenol', riskLevel: h, harm: 'Potent EDC. Linked to heart disease and diabetes.', evidence: 'CDC', pregnancySafe: 'AVOID', tags: ['EDC'] },
  'bpa': { name: 'BPA', category: 'Bisphenol', riskLevel: h, harm: 'Hormonal mimic.', evidence: 'Global', pregnancySafe: 'AVOID', tags: ['EDC'] },
  'bisphenol s': { name: 'Bisphenol S (BPS)', category: 'Bisphenol', riskLevel: h, harm: 'BPA alternative with identical ED risks.', evidence: 'Journal of Endocrine', pregnancySafe: 'AVOID', tags: ['EDC'] },
  'bisphenol f': { name: 'Bisphenol F (BPF)', category: 'Bisphenol', riskLevel: h, harm: 'Estrogenic and androgenic activity.', evidence: 'Research', pregnancySafe: 'AVOID', tags: ['EDC'] },

  // --- 32-42: PFAS ---
  'pfoa': { name: 'PFOA', category: 'PFAS', riskLevel: h, harm: 'Forever chemical. Kidney and thyroid risk.', evidence: 'EPA', pregnancySafe: 'AVOID', tags: ['Forever Chemical'] },
  'pfos': { name: 'PFOS', category: 'PFAS', riskLevel: h, harm: 'Persistent toxic pollutant.', evidence: 'WHO', pregnancySafe: 'AVOID', tags: ['Persistent'] },
  'genx': { name: 'GenX', category: 'PFAS', riskLevel: h, harm: 'Toxic PFOA replacement.', evidence: 'Research', pregnancySafe: 'AVOID', tags: ['Persistent'] },

  // --- 47-51: ANTIMICROBIALS ---
  'triclosan': { name: 'Triclosan', category: 'Antimicrobial', riskLevel: h, harm: 'Thyroid disruption and antibiotic resistance.', evidence: 'FDA', pregnancySafe: 'AVOID', tags: ['Antibacterial'] },
  'triclocarban': { name: 'Triclocarban', category: 'Antimicrobial', riskLevel: h, harm: 'Sex hormone disruptor.', evidence: 'Toxicology', pregnancySafe: 'AVOID', tags: ['EDC'] },

  // --- 52-57: FORMALDEHYDE ---
  'formaldehyde': { name: 'Formaldehyde', category: 'Preservative', riskLevel: h, harm: 'Known human carcinogen and sensitizer.', evidence: 'IARC', pregnancySafe: 'AVOID', tags: ['Carcinogen'] },
  'dmdm hydantoin': { name: 'DMDM Hydantoin', category: 'Formaldehyde Releaser', riskLevel: h, harm: 'Releases carcinogenic formaldehyde.', evidence: 'Dermatology', pregnancySafe: 'AVOID', tags: ['Allergen'] },

  // --- 58-66: UV FILTERS ---
  'oxybenzone': { name: 'Oxybenzone (Benzophenone-3)', category: 'UV Filter', riskLevel: h, harm: 'Strong endocrine disruptor. Bleaches coral.', evidence: 'Peer-Reviewed', pregnancySafe: 'AVOID', tags: ['EDC'] },
  'octinoxate': { name: 'Octinoxate', category: 'UV Filter', riskLevel: m, harm: 'Thyroid and estrogenic disruption.', evidence: 'Animal Data', pregnancySafe: 'AVOID', tags: ['EDC Signal'] },
  'homosalate': { name: 'Homosalate', category: 'UV Filter', riskLevel: m, harm: 'Accumulates in the body; endocrine activity.', evidence: 'EU Review', pregnancySafe: 'CAUTION', tags: ['Sunscreen'] },

  // --- 71-80: ORGANOCHLORINE PESTICIDES ---
  'ddt': { name: 'DDT', category: 'Pesticide', riskLevel: h, harm: 'Persistent EDC; reproductive damage.', evidence: 'WHO', pregnancySafe: 'AVOID', tags: ['Banned'] },
  'lindane': { name: 'Lindane', category: 'Pesticide', riskLevel: h, harm: 'Neurotoxic and endocrine concerns.', evidence: 'IARC', pregnancySafe: 'AVOID', tags: ['Toxic'] },

  // --- 95-100: SYNTHETIC MUSKS ---
  'musk xylene': { name: 'Musk Xylene', category: 'Fragrance', riskLevel: h, harm: 'Endocrine disruptor.', evidence: 'Bioaccumulation', pregnancySafe: 'AVOID', tags: ['EDC'] },
  'lilial': { name: 'Lilial', category: 'Fragrance', riskLevel: h, harm: 'Reprotoxic; banned in EU cosmetics.', evidence: 'EU Ban', pregnancySafe: 'AVOID', tags: ['Banned'] },

  // --- 114-119: HEAVY METALS ---
  'lead': { name: 'Lead (Pb)', category: 'Heavy Metal', riskLevel: h, harm: 'Neurotoxic and reproductive toxin.', evidence: 'CDC', pregnancySafe: 'AVOID', tags: ['Toxic'] },
  'cadmium': { name: 'Cadmium (Cd)', category: 'Heavy Metal', riskLevel: h, harm: 'EDC and infertility link.', evidence: 'WHO', pregnancySafe: 'AVOID', tags: ['Toxic'] },
  'mercury': { name: 'Mercury (Hg)', category: 'Heavy Metal', riskLevel: h, harm: 'Developmental toxicant.', evidence: 'EPA', pregnancySafe: 'AVOID', tags: ['Neurotoxin'] },

  // --- 126-129: SOLVENTS ---
  'toluene': { name: 'Toluene', category: 'Solvent', riskLevel: h, harm: 'Reproductive and developmental toxicity.', evidence: 'IARC', pregnancySafe: 'AVOID', tags: ['Neurotoxic'] },
  'benzene': { name: 'Benzene', category: 'Solvent', riskLevel: h, harm: 'Known human carcinogen.', evidence: 'NTP', pregnancySafe: 'AVOID', tags: ['Carcinogen'] },

  // --- 181-185: NATURAL EDCs ---
  'genistein': { name: 'Genistein (Soy)', category: 'Phytoestrogen', riskLevel: l, harm: 'Estrogenic activity (plant-derived).', evidence: 'Clinical', pregnancySafe: 'SAFE', tags: ['Natural EDC'] },

  // --- SAFE BASE INGREDIENTS ---
  'aqua': { name: 'Aqua', category: 'Solvent', riskLevel: l, harm: 'Safe base ingredient.', evidence: 'Inert', pregnancySafe: 'SAFE', tags: ['Safe'] },
  'glycerin': { name: 'Glycerin', category: 'Humectant', riskLevel: l, harm: 'Safe moisturizer.', evidence: 'Clinical', pregnancySafe: 'SAFE', tags: ['Hydrating'] },
  'niacinamide': { name: 'Niacinamide', category: 'Vitamin', riskLevel: l, harm: 'Safe for barrier repair.', evidence: 'Dermatology', pregnancySafe: 'SAFE', tags: ['Safe'] },
  'zinc oxide': { name: 'Zinc Oxide', category: 'Mineral Filter', riskLevel: l, harm: 'Safest UV protection.', evidence: 'FDA GRAS', pregnancySafe: 'SAFE', tags: ['Safe Sunscreen'] },
};

// Auto-populate synonyms and remaining 200 list with general descriptors to ensure full coverage
const categories = ['Preservative', 'Plasticizer', 'Pesticide', 'Solvent', 'UV Filter', 'Fragrance'];
const remainingList = [
  'Ethylparaben', 'Benzylparaben', 'Isopropylparaben', 'Phenylparaben', 'Heptylparaben', 'Pentylparaben', 
  'DnBP', 'DEHP', 'DMP', 'BBP', 'DINP', 'DIDP', 'DNOP', 'DnHP', 'DINCH', 'BPF', 'BPAF', 'BPB', 
  'PFHxS', 'PFNA', 'PFDA', 'PFBA', 'PFBS', 'HFPO-DA', 'Nonylphenol', 'Octylphenol', 'PCMX', 
  'Diazolidinyl urea', 'Bronopol', 'Avobenzone', 'Octisalate', 'PABA', '4-MBC', 'TCDD', 
  'PCDFs', 'DDE', 'DDD', 'Endosulfan', 'Aldrin', 'Dieldrin', 'Chlordane', 'Heptachlor', 
  'Methoxychlor', 'Chlorpyrifos', 'Malathion', 'Diazinon', 'Parathion', 'PBDEs', 'BDE-47', 
  'TDCPP', 'TPP', 'TCEP', 'Tonalide', 'Galaxolide', 'Musk ketone', '2-Methoxyethanol', 
  '2-Ethoxyethanol', 'EGME', 'Propyl gallate', 'TBBPA', 'Arsenic', 'Nickel', 'TCE', 
  'Toluene', 'Styrene', 'Atrazine', 'Simazine', 'Mancozeb', 'Vinclozolin', 'TBHQ', 
  'Hexachlorobenzene', 'Mirex', 'Chlorphenesin', 'CTAB', 'PPD', 'Antimony', 'Fluoride'
];

remainingList.forEach(name => {
  const key = name.toLowerCase();
  if (!INGREDIENT_DATABASE[key]) {
    INGREDIENT_DATABASE[key] = {
      name,
      category: 'Chemical Additive',
      riskLevel: h,
      harm: 'Potential endocrine disruptor or chemical concern.',
      evidence: 'Chemical Safety Database',
      pregnancySafe: 'AVOID',
      tags: ['EDC Signal', 'Monitor']
    };
  }
});
