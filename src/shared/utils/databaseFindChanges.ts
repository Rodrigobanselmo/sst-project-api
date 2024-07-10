export async function databaseFindChanges({
  userId,
  sanitaze,
  lastPulledVersion = new Date(0),
  options,
  entity,
  findManyFn,
  deletedAtKey = 'deleted_at',
}: {
  deletedAtKey?: string;
  sanitaze?: (any: any) => any;
  lastPulledVersion?: Date;
  options: any;
  entity: any;
  findManyFn: any;
  userId: number;
}) {
  const createdPromise = findManyFn({
    ...options,
    where: {
      created_at: { gte: lastPulledVersion },
      [deletedAtKey]: null,
      ...options.where,
    },
  });

  const updatedPromise = findManyFn({
    ...options,
    where: {
      created_at: { lt: lastPulledVersion },
      updated_at: { gte: lastPulledVersion },
      [deletedAtKey]: null,
      ...options.where,
    },
  });

  const deletePromise = findManyFn({
    ...options,
    select: {
      id: true,
    },
    where: {
      [deletedAtKey]: { gte: lastPulledVersion },
      created_at: { lt: lastPulledVersion },
      ...options.where,
    },
  });

  const [createdData, updatedData, deleteData] = await Promise.all([createdPromise, updatedPromise, deletePromise]);

  return {
    created: createdData.map((data) => {
      const entityData = new entity(data);
      const returnData = { ...entityData, user_id: String(userId), apiId: data.id };

      if (sanitaze) return sanitaze(returnData);
      return returnData;
    }),
    updated: updatedData.map((data) => {
      const entityData = new entity(data);
      const returnData = { ...entityData, user_id: String(userId) };

      if (sanitaze) return sanitaze(returnData);
      return returnData;
    }),
    deleted: deleteData.map((data) => {
      return data.id;
    }),
  };
}
