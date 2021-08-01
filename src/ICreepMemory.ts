import IEnergySource from "IEnergySource";
import { Role } from "Roles";

export interface ICreepMemory {
    role: Role,
    atWork?: boolean,
    energySource?: IEnergySource
    shouldUpgrade?: boolean
}