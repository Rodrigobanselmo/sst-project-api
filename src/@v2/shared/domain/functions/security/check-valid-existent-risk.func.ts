
export function checkValidExistentRisk(risk: { isRepresentAll: boolean }) {
    if (risk?.isRepresentAll) {
        return false;
    }

    return true;
}
