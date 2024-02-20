export async function databaseFindChanges({ userId, lastPulledVersion = new Date(0), options, entity, findManyFn, deletedAtKey = 'deleted_at' }: { deletedAtKey?: string, lastPulledVersion?: Date; options: any; entity: any; findManyFn: any; userId: number }) {

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
            const entityData = new entity(data)
            return { ...entityData, user_id: String(userId), apiId: data.id }
        }),
        updated: updatedData.map((data) => {
            const entityData = new entity(data)
            return { ...entityData, user_id: String(userId) }
        }),
        deleted: deleteData.map((data) => {
            return data.id
        }),
    }
}