import { useEffect } from 'react';

const BASE_TITLE = 'The Black Star Journal';

export function usePageTitle(subtitle?: string) {
  useEffect(() => {
    document.title = subtitle ? `${subtitle} | ${BASE_TITLE}` : BASE_TITLE;
    return () => { document.title = BASE_TITLE; };
  }, [subtitle]);
}
