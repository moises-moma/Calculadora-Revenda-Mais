import React from 'react';

interface Props {
  title: string;
  icon?: React.ReactNode;
}

export const SectionHeader: React.FC<Props> = ({ title, icon }) => {
  return (
    <div className="bg-brand-red text-white p-3 rounded-t-lg font-bold uppercase text-sm flex items-center gap-2 shadow-sm">
      {icon}
      {title}
    </div>
  );
};