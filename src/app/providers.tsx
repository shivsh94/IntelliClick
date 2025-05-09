'use client';

import { store } from '@/stores/weatherStore';
import { Provider } from 'mobx-react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
