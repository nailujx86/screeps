import { Role } from "Roles";

export interface ICreepMemory {
    role: Role,
    atWork?: boolean,
    energySource?: number
}