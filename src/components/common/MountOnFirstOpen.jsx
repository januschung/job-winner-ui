import { Suspense, useEffect, useState } from 'react';

// Renders a lazily loaded dialog only once it has been opened, then keeps it
// mounted so its close transition and internal state behave as before.
export default function MountOnFirstOpen({ open, children }) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  if (!mounted && !open) return null;
  return <Suspense fallback={null}>{children}</Suspense>;
}
