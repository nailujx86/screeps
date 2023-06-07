import { IScreep } from "interfaces/IScreep"
import { Role } from "Roles"
import screeps from "blueprints/blueprints"
import { bodycost } from "Util"

const blueprints: IScreep[] = screeps

// Sort the blueprints by descending cost
blueprints.forEach(blueprint => { blueprint.buildingPlan.configurations.sort((a, b) => bodycost(b) - bodycost(a)) })

/**
 * Sort the building plans by the ratio of existing creeps to desired creeps. This way, the
 * most needed creeps are built first.
 * @param plans The building plans to sort
 */ 
function sortBlueprintsByDesireRatio(plans: Array<IScreep>): IScreep[] {
    const creepsByRole = Object.keys(Game.creeps).reduce((acc, name) => {
        let role = Game.creeps[name].memory.role
        acc[role] = (acc[role] || []).concat(Game.creeps[name])
        return acc;
    }, {} as { [key in Role]: Creep[] })
    return blueprints.sort((a, b) => {
        return (creepsByRole[a.role]?.length / a.buildingPlan.desired) - (creepsByRole[b.role]?.length / b.buildingPlan.desired)
    })
}

export function spawnCreeps() {
    let availableEnergy = Game.spawns['Spawn1'].room.energyAvailable
    for (let blueprint of sortBlueprintsByDesireRatio(blueprints)) {
        console.log(`Considering to build: ${Role[blueprint.role]} with ${availableEnergy} energy. Cheapest plan costs: ${bodycost(blueprint.buildingPlan.configurations[blueprint.buildingPlan.configurations.length - 1])}.`)
        let config = blueprint.buildingPlan.configurations.find(conf => bodycost(conf) <= availableEnergy)
        if (config) { // Config buildable with current resources found
            console.log("Building: " + blueprint.role)
            let count = Object.keys(Game.creeps).filter(key => Game.creeps[key].memory.role == blueprint.role).length
            if (count < blueprint.buildingPlan.desired) { // Too little built
                Game.spawns['Spawn1'].spawnCreep(config, Role[blueprint.role] + Game.time, {
                    memory: { role: blueprint.role, atWork: false }
                })
                return; // Only build one creep per tick
            }
        }
    }
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