import { EnergySource } from "IEnergySource"

export function run(creep: Creep) {
    if(creep.memory.atWork && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.atWork = false 
    }
    if(!creep.memory.atWork && creep.store.getFreeCapacity() == 0) {
        creep.memory.atWork = true
    }
    if(creep.memory.atWork) {
        creep.memory.energySource = undefined
        let toRepair = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {
            return (structure instanceof StructureContainer ||
            structure instanceof StructureStorage ||
            (structure instanceof StructureWall && structure.hits < 150000)) &&
            structure.hits < (structure.hitsMax / 2)
        }})
        if(toRepair.length) {
            if (creep.repair(toRepair[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(toRepair[0], {range: 3, visualizePathStyle: {stroke: "#0F0F0F"}})
            } else {
                creep.say("🔨repair")
            }
        } else {
            let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES)
            if(constructionSites.length) {
                if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSites[0], { range: 3, visualizePathStyle: {stroke: '#E64A19'}})
                } else {
                    creep.say("🚧build")
                }
            } else {
                if (creep.room.controller && (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE || creep.pos.getRangeTo(creep.room.controller) > 1)) {
                    creep.moveTo(creep.room.controller, { range: 1, visualizePathStyle: { stroke: '#E64A19' } });
                } else {
                    creep.say("⚡upgrade")
                }
            }
        }
    } else {
        let sources = creep.room.find(FIND_SOURCES)
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
    }
}