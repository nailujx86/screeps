import { ENERGY_TRANSFER_THRESHOLD } from "constants/Energy";
import IEnergySource, { EnergySource } from "interfaces/IEnergySource";

function sourceEmpty(energySource: IEnergySource) {
    let source = Game.getObjectById(energySource.id)
    if (source instanceof Source) {
        return source.energy == 0
    } else if (source instanceof Resource) {
        return source.amount == 0
    }
    return true
}

export function run(creep: Creep) {
    if (creep.store.getFreeCapacity() > 0) {
        let drops = creep.room.find(FIND_DROPPED_RESOURCES).filter(drop => drop.resourceType == RESOURCE_ENERGY && drop.amount > ENERGY_TRANSFER_THRESHOLD)
        let sources = creep.room.find(FIND_SOURCES).filter(source => source.energy > 0)
        if (creep.memory.energySource == undefined || sourceEmpty(creep.memory.energySource)) { // Stores the source in the creeps memory so we don't have to search for it every tick
            creep.memory.energySource = drops.length ? { // If there are drops, harvest from them, otherwise harvest from sources
                type: EnergySource.RESOURCE,
                id: drops[Math.floor(Math.random() * drops.length)].id
            } : {
                type: EnergySource.SOURCE,
                id: sources[Math.floor(Math.random() * sources.length)].id
            }
        }
        let source = Game.getObjectById(creep.memory?.energySource?.id)
        if (source instanceof Source) {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { reusePath: 10, range: 1, visualizePathStyle: { stroke: '#E64A19' } })
            } else {
                creep.say("🌾harvest")
            }
        } else if (source instanceof Resource) {
            if (creep.pickup(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { reusePath: 10, range: 1, visualizePathStyle: { stroke: '#E64A19' } })
            } else {
                creep.say("🏗️pickup")
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
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > ENERGY_TRANSFER_THRESHOLD
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