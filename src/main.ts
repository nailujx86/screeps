import { ICreepMemory } from "interfaces/ICreepMemory"
import * as spawner from "Spawn"
import * as harvester from "Harvester"
import * as builder from "Builder"
import { Role } from "Roles"
import profiler from "screeps-profiler"
import { defend } from "Defense"
import { checkForRepair, getRepairableStructures } from "Maintenance"
import { set } from "lodash"

declare global {
    interface CreepMemory extends ICreepMemory { }
    interface StructureMemory {
        needsRepair?: boolean
    }
    interface Structure {
        memory: StructureMemory
    }
    interface Memory {
        structures: { [id: string]: StructureMemory }
    }
    // spawn creep code
}

function patchPrototypes() {
    if (!Memory.structures) {
        Memory.structures = {}
    }
    Object.defineProperty(Structure.prototype, 'memory', {
        get: function () {
            if(!Memory.structures[this.id])
                Memory.structures[this.id] = {}
            return Memory.structures[this.id]
        },
        set: function (value) {
            return set(Memory, ["structures", this.id], value)
        },
        configurable: true
    })
}

function gc() {
    for (let name in Memory.creeps) {
        if (!(name in Game.creeps))
            delete Memory.creeps[name]
    }
    for (let id in Memory.structures) {
        if (!(id in Game.structures)) {
            delete Memory.structures[id]
        }
    }
}

//profiler.enable()
export const loop = () => {
    patchPrototypes()
    profiler.wrap(function () {
        if (Game.cpu.bucket == 10000) {
            Game.cpu.generatePixel()
            console.log("Pixel generated!")
        }

        if (Game.time % 50 == 0)
            gc()

        if (Game.time % 5 == 0) {
            let repairable = getRepairableStructures(Game.spawns['Spawn1'].room)
            checkForRepair(repairable)
            spawner.spawnCreeps()
        }
        defend(Game.spawns['Spawn1'].room)
        spawner.visual()

        for (let name in Game.creeps) {
            let creep = Game.creeps[name]
            switch(creep.memory.role) {
                case Role.HARVESTER:
                    harvester.run(creep)
                    break
                case Role.BUILDER:
                    builder.run(creep)
                    break
            }
        }
    })
}