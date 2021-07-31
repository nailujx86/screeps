import { ICreepMemory } from "ICreepMemory"
import * as spawner from "Spawn"
import * as harvester from "Harvester"
import * as builder from "Builder"
import { Role } from "Roles"

declare global {
    interface CreepMemory extends ICreepMemory {}
}


export const loop = () => {
    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel()
        console.log("Pixel generated!")
    }

    for (let name in Memory.creeps) {
        if (!(name in Game.creeps))
            delete Memory.creeps[name]
    }
    spawner.spawnCreeps()
    spawner.visual()

    for(let name in Game.creeps) {
        var creep = Game.creeps[name]
        if(creep.memory.role == Role.HARVESTER) {
            harvester.run(creep)
        } else if(creep.memory.role == Role.BUILDER) {
            builder.run(creep)
        }
    }
}