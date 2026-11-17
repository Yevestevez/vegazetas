import CredentialsError from './CredentialsError.ts'
import DuplicityError from './DuplicityError.ts'
import NotFoundError from './NotFoundError.ts'
import OwnershipError from './OwnershipError.ts'
import SystemError from './SystemError.ts'
import ValidationError from './ValidationError.ts'

const Errors: Record<string, new (message: string) => Error> = {
    CredentialsError,
    DuplicityError,
    NotFoundError,
    OwnershipError,
    SystemError,
    ValidationError
}

export function deserializeError(errorName: string, message: string): Error {
    const Ctor = Errors[errorName]
    return Ctor ? new Ctor(message) : new Error(message)
}
