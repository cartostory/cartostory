import React from 'react'

function useFormValidation<E extends string>(): [
  Partial<MapUnionTo<E, string>>,
  (elements: HTMLInputElement[]) => boolean,
] {
  const [errors, setErrors] = React.useState<Partial<MapUnionTo<E, string>>>({})

  /**
   * TODO reconsider whether validate should return the result
   */
  const validate = (elements: HTMLInputElement[]) => {
    const result = elements.reduce((prev, cur) => {
      if (cur.validity.valid) {
        return prev
      }

      return {
        ...prev,
        [cur.name]: cur.validationMessage,
      }
      // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    }, {} as typeof errors)

    setErrors(result)

    return Object.keys(result).length === 0
  }

  return [errors, validate]
}

export { useFormValidation }
