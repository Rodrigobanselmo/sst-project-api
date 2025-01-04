import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNotNull(message: string = 'Value cannot be null', validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsNotNull',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return value !== null; // Ensure the value is not null
                },
                defaultMessage(args: ValidationArguments) {
                    return message; // Return custom error message
                },
            },
        });
    };
}
