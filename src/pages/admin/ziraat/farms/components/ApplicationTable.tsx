import type { FarmApplication } from '../types';
import FarmStatusBadge from './FarmStatusBadge';

type ApplicationTableProps = {
  applications: FarmApplication[];
  onInspect: (application: FarmApplication) => void;
  onReject: (application: FarmApplication) => void;
  onApprove: (application: FarmApplication) => void;
};

function ApplicationTable({ applications, onInspect, onReject, onApprove }: ApplicationTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="bg-background-light dark:bg-background-dark">
          <tr className="text-xs uppercase tracking-wider text-subtle-light dark:text-subtle-dark">
            <th className="px-6 py-3 text-left">Çiftlik</th>
            <th className="px-6 py-3 text-left">Sahip</th>
            <th className="px-6 py-3 text-left">Lokasyon</th>
            <th className="px-6 py-3 text-left">Durum</th>
            <th className="px-6 py-3 text-left">Planlanan Denetim</th>
            <th className="px-6 py-3 text-left">Son Güncelleme</th>
            <th className="px-6 py-3 text-left">Notlar</th>
            <th className="px-6 py-3 text-right">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light text-sm dark:divide-border-dark">
          {applications.map((farm) => (
            <tr key={farm.id} className="transition-colors hover:bg-primary/5 dark:hover:bg-primary/10">
              <td className="px-6 py-4 font-medium text-content-light dark:text-content-dark">{farm.farm}</td>
              <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">{farm.owner}</td>
              <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">{farm.location}</td>
              <td className="px-6 py-4">
                <FarmStatusBadge status={farm.status} />
              </td>
              <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">{farm.inspectionDate}</td>
              <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">{farm.lastUpdate}</td>
              <td className="px-6 py-4 text-subtle-light dark:text-subtle-dark">{farm.notes}</td>
              <td className="px-6 py-4 text-right">
                <div className="inline-flex items-center gap-2">
                  <button
                    className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-primary/40 dark:hover:bg-primary/30"
                    onClick={() => onInspect(farm)}
                  >
                    İncele
                  </button>
                  <button 
                    className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    onClick={() => onApprove(farm)}
                  >
                    Onayla
                  </button>
                  <button
                    className="rounded-full bg-red-600 px-4 py-1 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:hover:bg-red-500"
                    onClick={() => onReject(farm)}
                  >
                    Reddet
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicationTable;

