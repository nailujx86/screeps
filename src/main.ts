import { ICreepMemory } from "ICreepMemory"
import * as spawner from "Spawn"
import * as harvester from "HarvesterRole"

declare global {
    interface CreepMemory extends ICreepMemory {}
}


export const loop = () => {
    for (let name in Memory.creeps) {
        if (!(name in Game.creeps))
            delete Memory.creeps[name]
    }
    spawner.ensureCreeps()
    spawner.visual()

    for(let name in Game.creeps) {
        var creep = Game.creeps[name];
        if(!creep.memory.atWork) continue
        if(creep.memory.role == 'harvester') {
            harvester.run(creep)
        }
    }
}