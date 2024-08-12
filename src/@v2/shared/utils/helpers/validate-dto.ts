import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

function getChildrenErrors(errors: any[]): string | null {
  if (errors && errors.length > 0) {
    if (errors[0].constraints) {
      return String(Object.values(errors[0].constraints)[0])
    }

    return getChildrenErrors(errors[0].children)
  }

  return null
}

export async function validateDto<R>(data: any, dto: new () => R): Promise<[R, string | null]> {
  const dtoInstance = plainToInstance(dto, data, { enableImplicitConversion: true })

  const errors = await validate(dtoInstance as object)
  const stringError = getChildrenErrors(errors)

  return [dtoInstance, stringError]
}
