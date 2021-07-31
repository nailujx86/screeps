export function bodycost(body: Array<BodyPartConstant>): number {
    return body.reduce((acc, part) => acc + BODYPART_COST[part], 0)
}