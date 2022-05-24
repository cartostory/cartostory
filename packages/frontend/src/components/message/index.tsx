type Props = {
  mode: 'inline' | 'block'
  level: 'error'
}

const classes: Record<Props['level'], (mode: Props['mode']) => string> = {
  error: mode =>
    mode === 'block'
      ? 'border border-rose-500 bg-rose-100 px-2 py-2 block'
      : 'text-rose-500',
}

function Message({ children, level, mode }: React.PropsWithChildren<Props>) {
  return <small className={classes[level](mode)}>{children}</small>
}

export { Message }
