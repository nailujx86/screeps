import { EnergySource } from "IEnergySource";

export function run(creep: Creep) {
    if (creep.store.getFreeCapacity() > 0) {
        let sources = creep.room.find(FIND_SOURCES);
        creep.memory.energySource = creep.memory.energySource == undefined ? {
            type: EnergySource.SOURCE,
            id: sources[Math.floor(Math.random() * sources.length)].id
        } : creep.memory.energySource
        let source = Game.getObjectById(creep.memory?.energySource?.id)
        if (source instanceof Source) {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { reusePath: 10, range: 1, visualizePathStyle: { stroke: '#E64A19' } })
            } else {
                creep.say("🌾harvest")
            }
        }
    } else {
        creep.memory.energySource = undefined
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure: AnyStructure) => {
                return (structure instanceof StructureExtension ||
                    structure instanceof StructureSpawn ||
                    structure instanceof StructureTower ||
                    structure instanceof StructureContainer) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            }
        })
        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { reusePath: 10, range: 1, visualizePathStyle: { stroke: '#FFF' } })
            } else {
                creep.say("🚢transfer")
            }
        } else {
            if (creep.room.controller && (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE || creep.pos.getRangeTo(creep.room.controller) > 1)) {
                creep.moveTo(creep.room.controller, { reusePath: 10, range: 1, visualizePathStyle: { stroke: '#E64A19' } });
            } else {
                creep.say("⚡upgrade")
            }
        }
    }
}