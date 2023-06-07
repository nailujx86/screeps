export type BodyConfiguration = Array<BodyPartConstant>

export default interface IBuildingPlan {
    configurations: Array<BodyConfiguration>,
    desired: number
}