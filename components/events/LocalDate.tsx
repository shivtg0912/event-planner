'use client'

import { useMemo } from 'react';

interface LocalDateProps {
  iso: string | Date;
  /** Intl.DateTimeFormat options for date formatting */
  options?: Intl.DateTimeFormatOptions;
  /** locale, defaults to browser locale */
  locale?: string;
}

export default function LocalDate({ iso, options, locale }: LocalDateProps) {
  const text = useMemo(() => {
    const date = new Date(iso);
    const resolvedLocale = locale || undefined; // let browser decide
    const resolvedOptions: Intl.DateTimeFormatOptions =
      options || { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(resolvedLocale, resolvedOptions);
  }, [iso, options, locale]);

  return <>{text}</>;
}


