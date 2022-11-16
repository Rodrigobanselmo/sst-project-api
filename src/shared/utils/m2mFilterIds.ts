export const m2mGetDeletedIds = (dbArray: any[], sendArray: any[], compareFieldSend: string, compareFieldDb?: string) => {
  return dbArray
    .filter(
      (dbData) =>
        !sendArray.find((sendData) => {
          return typeof sendData === 'string'
            ? sendData === dbData[compareFieldDb || compareFieldSend]
            : sendData[compareFieldSend] === dbData[compareFieldDb || compareFieldSend];
        }),
    )
    .map((data) => data[compareFieldDb || compareFieldSend]);
};
