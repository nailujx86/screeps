import { Role } from "Roles";
import IBuildingPlan from "interfaces/IBuildingPlan";

/**
 * The Blueprint for a single type of Creep.
 */
export interface IScreep {
    /**
     * A creeps logic
     * @param creep the creep to run on
     */
    run(creep: Creep): void

    /**
     * The creeps role
     */
    role: Role

    /**
     * The creeps building plan
     */
    buildingPlan: IBuildingPlan
}