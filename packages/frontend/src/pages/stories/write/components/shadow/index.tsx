function Shadow() {
  return (
    <div
      aria-hidden
      className="absolute top-0 z-[10000] w-[10px] h-full right-0 pointer-events-none"
      style={{ boxShadow: 'inset -5px 0px 3px 0px rgba(0, 0, 0, .15)' }}
    />
  )
}

export { Shadow }
