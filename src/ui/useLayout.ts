import { useEffect, useState } from 'react';

export type Layout = 'wide' | 'tall';

const read = (): Layout =>
  window.innerWidth >= 900 && window.innerWidth > window.innerHeight * 1.1 ? 'wide' : 'tall';

/** 'wide' puts panels beside the 3D scene; 'tall' (phones) stacks them below it. */
export function useLayout(): Layout {
  const [layout, setLayout] = useState<Layout>(read);
  useEffect(() => {
    const onResize = () => setLayout(read());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return layout;
}
