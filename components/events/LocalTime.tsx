'use client'

import { useMemo } from 'react';

interface LocalTimeProps {
  iso: string | Date;
  /** show seconds in output */
  showSeconds?: boolean;
  /** 12-hour clock (true) or 24-hour clock (false). If undefined, browser default */
  hour12?: boolean;
  locale?: string;
}

export default function LocalTime({ iso, showSeconds = false, hour12, locale }: LocalTimeProps) {
  const text = useMemo(() => {
    const date = new Date(iso);
    const resolvedLocale = locale || undefined;
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...(showSeconds ? { second: '2-digit' } : {}),
      ...(hour12 !== undefined ? { hour12 } : {}),
    };
    return date.toLocaleTimeString(resolvedLocale, options);
  }, [iso, showSeconds, hour12, locale]);

  return <>{text}</>;
}


