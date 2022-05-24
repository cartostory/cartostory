function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full py-3 bg-white border-0 border-b-2 text-gray-500 focus:outline-none"
      autoComplete="off"
      {...props}
    />
  )
}

export { Input }
