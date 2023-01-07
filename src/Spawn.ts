import IBuildingPlan from "interfaces/IBuildingPlan"
import { Role } from "Roles"
import { bodycost } from "Util"

const harvester: IBuildingPlan = {
    configurations: [[WORK, CARRY, MOVE, MOVE], [WORK, WORK, CARRY, MOVE, MOVE], [WORK, WORK, CARRY, CARRY, MOVE, MOVE], [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]],
    role: Role.HARVESTER,
    desired: 5
}

const builder: IBuildingPlan = {
    configurations: [[WORK, CARRY, MOVE, MOVE], [WORK, WORK, CARRY, MOVE, MOVE], [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE], [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]],
    role: Role.BUILDER,
    desired: 5
}
const buildingPlans: IBuildingPlan[] = [harvester, builder]

// Sort the plans by descending cost
buildingPlans.forEach(plan => { plan.configurations.sort((a, b) => bodycost(b) - bodycost(a)) })

function sortPlansByDesireRatio(plans: Array<IBuildingPlan>): IBuildingPlan[] {
    const creepsByRole = Object.keys(Game.creeps).reduce((acc, name) => {
        let role = Game.creeps[name].memory.role
        acc[role] = (acc[role] || []).concat(Game.creeps[name])
        return acc;
    }, {} as { [key in Role]: Creep[] })
    return plans.sort((a, b) => {
        return (creepsByRole[a.role]?.length / a.desired) - (creepsByRole[b.role]?.length / b.desired)
    })
}

export function spawnCreeps() {
    let availableEnergy = Game.spawns['Spawn1'].room.energyAvailable
    sortPlansByDesireRatio(buildingPlans).forEach((plan, _index) => {
        let config = plan.configurations.find(conf => bodycost(conf) <= availableEnergy)
        if (config) { // Config buildable with current resources found
            let count = Object.keys(Game.creeps).filter(key => Game.creeps[key].memory.role == plan.role).length
            if (count < plan.desired) { // Too little built
                Game.spawns['Spawn1'].spawnCreep(config, Role[plan.role] + Game.time, {
                    memory: { role: plan.role, atWork: false }
                })
            }
        }
    })
}

export function visual() {
    if (Game.spawns['Spawn1'].spawning) {
        let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name]
        Game.spawns['Spawn1'].room.visual.text(
            '🛠 ' + Role[spawningCreep.memory.role],
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: .8 })
    }
}