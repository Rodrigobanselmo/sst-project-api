/**
 * Cobertura de permissions no formato `código-crud` (ex.: `24-rcud`), alinhado a
 * {@link AccessGroupEntity.checkAllPermissions} e aos serviços de usuário/convite.
 */
export function userCoversAddPermission(userPermissions: string[], addPermission: string): boolean {
  const [addCode, addCrudRaw = ''] = addPermission.split('-');
  const addCrud = Array.from(addCrudRaw || '');
  return userPermissions.some((userPermission) => {
    const [userCode, userCrudRaw = ''] = userPermission.split('-');
    if (userCode !== addCode) return false;
    const userCrud = userCrudRaw || '';
    return addCrud.every((crud) => userCrud.includes(crud));
  });
}

export function listMissingAddPermissions(userPermissions: string[], required: string[]): string[] {
  return required.filter((p) => !userCoversAddPermission(userPermissions, p));
}
