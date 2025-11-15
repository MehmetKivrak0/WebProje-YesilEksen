import type { FarmStatus } from '../types';

type ApplicationFiltersProps = {
  selectedStatus: 'Hepsi' | FarmStatus;
  onStatusChange: (status: 'Hepsi' | FarmStatus) => void;
};

const statusOptions: Array<'Hepsi' | FarmStatus> = ['Hepsi', 'İlk İnceleme', 'Denetimde', 'Onaylandı', 'Evrak Bekliyor'];

function ApplicationFilters({ selectedStatus, onStatusChange }: ApplicationFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-subtle-light dark:text-subtle-dark" htmlFor="farm-status-filter">
        Durum Filtresi
      </label>
      <select
        id="farm-status-filter"
        className="rounded-lg border border-border-light bg-background-light p-2 text-sm dark:border-border-dark dark:bg-background-dark"
        value={selectedStatus}
        onChange={(event) => onStatusChange(event.target.value as 'Hepsi' | FarmStatus)}
      >
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ApplicationFilters;

