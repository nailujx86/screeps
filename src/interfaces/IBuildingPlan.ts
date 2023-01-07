import { Role } from "Roles";

export type BodyConfiguration = Array<BodyPartConstant>

export default interface IBuildingPlan {
    configurations: Array<BodyConfiguration>,
    role: Role,
    desired: number
}