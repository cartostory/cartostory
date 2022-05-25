function Form({
  children,
  ...props
}: React.PropsWithChildren<unknown> &
  React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form
      {...props}
      noValidate
      className="mt-14 mx-auto w-max space-y-5 border p-10"
    >
      {children}
    </form>
  )
}

export { Form }
