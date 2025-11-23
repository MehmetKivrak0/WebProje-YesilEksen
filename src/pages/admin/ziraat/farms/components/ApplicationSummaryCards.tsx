import { useEffect, useState } from 'react';
import { ziraatService } from '../../../../../services/ziraatService';
import type { FarmApplication } from '../types';

type ApplicationSummaryCardsProps = {
  applications: FarmApplication[];
};

function ApplicationSummaryCards({ applications }: ApplicationSummaryCardsProps) {
  const [stats, setStats] = useState<{
    newApplications: number;
    inspections: number;
    approved: number;
  } | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await ziraatService.getDashboardStats();
      if (response.success) {
        setStats(response.stats.farmSummary);
      }
    } catch (error) {
      console.error('Stats yükleme hatası:', error);
    }
  };

  const pendingCount = stats?.newApplications || applications.filter(
    (farm) => farm.status === 'İlk İnceleme',
  ).length;
  const approvedCount = stats?.approved || applications.filter((farm) => farm.status === 'Onaylandı').length;
  const missingDocumentsCount = applications.filter((farm) => farm.status === 'Evrak Bekliyor').length;

  const cards = [
    {
      label: 'Bekleyen Başvurular',
      value: pendingCount,
      description: 'İlk inceleme bekleyen başvurular',
    },
    {
      label: 'Onaylanan Çiftlikler',
      value: approvedCount,
      description: 'Toplam onaylanan çiftlik sayısı',
    },
    {
      label: 'Evrak Bekliyor',
      value: missingDocumentsCount,
      description: 'Evrak eksikliği nedeniyle bekleyen başvurular',
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

