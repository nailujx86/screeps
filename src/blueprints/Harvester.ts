import { Role } from "Roles";
import { ENERGY_TRANSFER_THRESHOLD } from "constants/Energy";
import IEnergySource, { EnergySource } from "interfaces/IEnergySource";
import { IScreep } from "interfaces/IScreep";

const harvester: IScreep = {
    role: Role.HARVESTER,

    buildingPlan: {
        configurations: [[WORK, CARRY, MOVE, MOVE], [WORK, WORK, CARRY, MOVE, MOVE], [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE], [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]],
        desired: 5
    },

    run(creep: Creep) {
        if(creep.memory.atWork && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.atWork = false 
        }
        if(!creep.memory.atWork && creep.store.getFreeCapacity() == 0) {
            creep.memory.atWork = true
        }
        if (!creep.memory.atWork) { // not working, we have to collect energy..
            if (creep.memory.energySource == undefined || sourceEmpty(creep.memory.energySource)) { // Stores the source in the creeps memory so we don't have to search for it every tick
                let drops = creep.room.find(FIND_DROPPED_RESOURCES).filter(drop => drop.resourceType == RESOURCE_ENERGY && drop.amount > ENERGY_TRANSFER_THRESHOLD)
                let tombstones = creep.room.find(FIND_TOMBSTONES).filter(tombstone => tombstone.store.energy >= ENERGY_TRANSFER_THRESHOLD)
                let sources = creep.room.find(FIND_SOURCES).filter(source => source.energy > 0)
            
                
                let source: IEnergySource
                if (tombstones.length) { // someone died.. :( lets harvest from it first...
                    source = { 
                        type: EnergySource.CONTAINER,
                        id: tombstones[Math.floor(Math.random() * tombstones.length)].id // lets choose a random one for now until we've figured out pathfinding
                    }
                } else if (drops.length) { // If there are drops, harvest from them, otherwise harvest from sources
                    source = { 
                        type: EnergySource.RESOURCE,
                        id: drops[Math.floor(Math.random() * drops.length)].id
                    }
                } else {
                    source = {
                        type: EnergySource.SOURCE,
                        id: sources[Math.floor(Math.random() * sources.length)].id
                    }
                }
                
                creep.memory.energySource = source
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
            } else if (source && hasStore(source)) {
                if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, { reusePath: 10, range: 1, visualizePathStyle: { stroke: '#E64A19' } })
                } else {
                    creep.say("🧺withdraw")
                }
            }
        } else { // working..
            creep.memory.energySource = undefined // Reset energy source, so we search for a new source whenever the creep is empty again.
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
}

function sourceEmpty(energySource: IEnergySource) {
    let source = Game.getObjectById(energySource.id)
    if (source instanceof Source) {
        return source.energy == 0
    } else if (source instanceof Resource) {
        return source.amount == 0
    } else if (source instanceof Tombstone) {
        return source.store.energy == 0
    }
    return true
}

function hasStore(obj: any): boolean {
    return obj && (obj instanceof Structure || obj instanceof Tombstone)
}

export default harvester