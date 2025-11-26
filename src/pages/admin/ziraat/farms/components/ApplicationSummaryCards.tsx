import { useMemo } from 'react';
import type { FarmApplication } from '../types';

type ApplicationSummaryCardsProps = {
  applications: FarmApplication[];
  approvedFarmCount: number;
};

function ApplicationSummaryCards({ applications, approvedFarmCount }: ApplicationSummaryCardsProps) {
  const { pendingCount, approvedCount, rejectedCount } = useMemo(() => {
    const pending = applications.filter((farm) => farm.status === 'İlk İnceleme').length;
    const approved = applications.filter((farm) => farm.status === 'Onaylandı').length;
    const rejected = applications.filter((farm) => farm.status === 'Reddedildi').length;

    return {
      pendingCount: pending,
      approvedCount: approved,
      rejectedCount: rejected,
    };
  }, [applications]);

  const cards = [
    {
      label: 'Bekleyen Başvurular',
      value: pendingCount,
      description: 'İlk inceleme bekleyen başvurular',
    },
    {
      label: 'Onaylanan Çiftlikler',
      value: approvedFarmCount || approvedCount,
      description: approvedFarmCount
        ? 'Aktif çiftlikler (ciftlikler tablosu)'
        : 'Toplam onaylanan çiftlik sayısı',
    },
    {
      label: 'Reddedilen Başvurular',
      value: rejectedCount,
      description: 'Reddedilmiş başvurular',
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border-light bg-background-light p-6 dark:border-border-dark dark:bg-background-dark"
        >
          <p className="text-sm text-subtle-light dark:text-subtle-dark">{card.label}</p>
          <p className="text-3xl font-bold text-content-light dark:text-content-dark">{card.value}</p>
          <p className="mt-2 text-xs text-subtle-light dark:text-subtle-dark">{card.description}</p>
        </div>
      ))}
    </div>
  );
}

export default ApplicationSummaryCards;

