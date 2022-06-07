function Form({
  children,
  className,
  ...props
}: React.PropsWithChildren<unknown> &
  React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form
      {...props}
      noValidate
      className={`mt-14 mx-auto space-y-5 border p-10 ${className}`}
    >
      {children}
    </form>
  )
}

export { Form }
