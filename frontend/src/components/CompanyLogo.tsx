import { useEffect, useState } from 'react';
import { companyInitial } from '../lib/format';

type CompanyLogoProps = {
  company: string;
  size?: number;
};

export function CompanyLogo({ company, size = 36 }: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);
  const name = company.trim();
  const src = `https://img.loadlogo.com/name/${encodeURIComponent(name)}?size=${size * 2}&format=png&fallback=404`;

  useEffect(() => {
    setFailed(false);
  }, [name]);

  if (failed || !name) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-ds bg-ds-input text-xs font-bold text-ds-subtle"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {companyInitial(company)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className="shrink-0 rounded-ds bg-white object-contain p-0.5 ring-1 ring-ds-border"
      style={{ width: size, height: size }}
    />
  );
}
