export function formatDate(date: string) {
  const [year, month, day] = date.split('-');
  if (!year || !month || !day) {
    return date;
  }
  return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function todayIso() {
  return new Date().toLocaleDateString('en-CA');
}

export function companyInitial(company: string) {
  return company.trim().charAt(0).toUpperCase() || '?';
}

export function daysAgo(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) {
    return date;
  }
  const then = new Date(year, month - 1, day);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.round((now.getTime() - then.getTime()) / 86_400_000);
  if (diff === 0) {
    return 'Today';
  }
  if (diff === 1) {
    return '1 day ago';
  }
  if (diff > 1) {
    return `${diff} days ago`;
  }
  return formatDate(date);
}
