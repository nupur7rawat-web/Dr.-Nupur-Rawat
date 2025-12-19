
import React from 'react';
import { IngredientInfo, RiskLevel } from '../types';

interface IngredientCardProps {
  ingredient: IngredientInfo;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient }) => {
  const getRiskStyles = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH: return 'border-rose-500 bg-rose-50/30 text-rose-900 ring-rose-500/10';
      case RiskLevel.MODERATE: return 'border-amber-400 bg-amber-50/30 text-amber-900 ring-amber-400/10';
      case RiskLevel.LOW: return 'border-emerald-500 bg-emerald-50/30 text-emerald-900 ring-emerald-500/10';
      default: return 'border-slate-200 bg-white text-slate-700 ring-slate-200/10';
    }
  };

  const getPregnancyTag = (status: string) => {
    switch (status) {
      case 'SAFE': return <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm shadow-emerald-100">Safe</span>;
      case 'CAUTION': return <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm shadow-amber-100">Caution</span>;
      case 'AVOID': return <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm shadow-rose-100">Avoid</span>;
      default: return null;
    }
  };

  return (
    <div className={`p-6 rounded-[32px] border-l-[10px] shadow-sm mb-4 transition-all hover:shadow-xl hover:-translate-y-1 glass group ring-1 ${getRiskStyles(ingredient.riskLevel)}`}>
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <h3 className="font-extrabold text-xl capitalize tracking-tight group-hover:text-emerald-700 transition-colors">{ingredient.name}</h3>
          <p className="text-[10px] opacity-60 font-black uppercase tracking-[0.2em]">{ingredient.category}</p>
        </div>
        <div className={`px-3 py-1 rounded-xl text-[10px] font-black border-2 border-current`}>
          {ingredient.riskLevel}
        </div>
      </div>
      
      <div className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl mb-4 border border-white shadow-inner">
        <p className="text-sm font-medium leading-relaxed opacity-90">
          <span className="block text-[10px] uppercase font-black tracking-widest opacity-40 mb-2">Scientific Note</span>
          {ingredient.harm}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1.5 mr-2">
           <i className="fas fa-person-breastfeeding text-xs opacity-50"></i>
           {getPregnancyTag(ingredient.pregnancySafe)}
        </div>
        {ingredient.tags.map(tag => (
          <span key={tag} className="bg-white/80 text-slate-600 px-3 py-1 rounded-full text-[9px] font-black tracking-wider border border-slate-100 shadow-sm">
            #{tag}
          </span>
        ))}
      </div>
      
      <div className="mt-5 pt-4 border-t border-current/5 flex justify-between items-center">
        <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30">Source: {ingredient.evidence}</span>
        <button className="text-emerald-600/40 group-hover:text-emerald-600 transition-colors">
          <i className="fas fa-circle-info"></i>
        </button>
      </div>
    </div>
  );
};

export default IngredientCard;
