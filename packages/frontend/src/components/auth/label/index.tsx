import React from 'react'

function Label({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return <label className={`block ${className}`}>{children}</label>
}

export { Label }
