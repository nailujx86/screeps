import { ICreepMemory } from "ICreepMemory"
import * as spawner from "Spawn"
import * as harvester from "Harvester"
import * as builder from "Builder"
import { Role } from "Roles"
import profiler from "screeps-profiler"

declare global {
    interface CreepMemory extends ICreepMemory {}
    interface StructureMemory {
        needsRepair?: boolean
    }
    interface OwnedStructure {
        memory: StructureMemory
    }
    interface Memory {
        structures: {[id: string]: StructureMemory}
    }
    // spawn creep code
}

function patchPrototypes() {
    if (!Memory.structures) {
        Memory.structures = {}
    }
    Object.defineProperty(OwnedStructure.prototype, 'memory', {
        get: function() {
            return Memory.structures[this.id]
        },
        set: function(value) {
            Memory.structures[this.id] = value
        },
        configurable: true
    })
}

//profiler.enable()
export const loop = () => {
    patchPrototypes()
    profiler.wrap(function() {
        if (Game.cpu.bucket == 10000) {
            Game.cpu.generatePixel()
            console.log("Pixel generated!")
        }
        
        for (let name in Memory.creeps) {
            if (!(name in Game.creeps))
                delete Memory.creeps[name]
        }

        if(Game.time % 5 == 0) {
            spawner.spawnCreeps()
        }
        
        spawner.visual()

        for(let name in Game.creeps) {
            var creep = Game.creeps[name]
            if(creep.memory.role == Role.HARVESTER) {
                harvester.run(creep)
            } else if(creep.memory.role == Role.BUILDER) {
                builder.run(creep)
            }
        }
    })
}