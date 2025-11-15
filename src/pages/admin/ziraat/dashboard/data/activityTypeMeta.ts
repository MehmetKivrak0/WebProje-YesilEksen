import type { ActivityTypeMetaMap } from '../types';

export const activityTypeMeta: ActivityTypeMetaMap = {
  kayit: {
    label: 'Kayıt',
    icon: 'person_add',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-200',
    bubbleClass: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconClass: 'text-emerald-600 dark:text-emerald-300',
  },
  guncelleme: {
    label: 'Güncelleme',
    icon: 'update',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/70 dark:text-amber-200',
    bubbleClass: 'bg-amber-100 dark:bg-amber-900/40',
    iconClass: 'text-amber-600 dark:text-amber-300',
  },
  onay: {
    label: 'Onay',
    icon: 'verified',
    badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/70 dark:text-green-200',
    bubbleClass: 'bg-green-100 dark:bg-green-900/40',
    iconClass: 'text-green-600 dark:text-green-300',
  },
  denetim: {
    label: 'Denetim',
    icon: 'assignment',
    badgeClass: 'bg-sky-100 text-sky-700 dark:bg-sky-900/70 dark:text-sky-200',
    bubbleClass: 'bg-sky-100 dark:bg-sky-900/40',
    iconClass: 'text-sky-600 dark:text-sky-300',
  },
};

