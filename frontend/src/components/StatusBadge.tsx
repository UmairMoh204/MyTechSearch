import type { Status } from '../types';

export const LOZENGE: Record<Status, string> = {
  Saved: 'bg-[#F1F2F4] text-[#44546F]',
  Applied: 'bg-[#E9F2FF] text-[#0C66E4]',
  Interview: 'bg-[#F3F0FF] text-[#5E4DB2]',
  Offer: 'bg-[#DCFFF1] text-[#216E4E]',
  Rejected: 'bg-[#FFECEB] text-[#C9372C]',
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex h-5 items-center rounded-ds px-1.5 text-[11px] font-bold uppercase tracking-wide ${LOZENGE[status]}`}>
      {status}
    </span>
  );
}
