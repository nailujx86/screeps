import { Role } from "Roles"
import { EnergySource } from "interfaces/IEnergySource"
import { IScreep } from "interfaces/IScreep"

const builder: IScreep = {
    role: Role.BUILDER,

    buildingPlan: {
        configurations: [[WORK, CARRY, MOVE, MOVE], [WORK, WORK, CARRY, MOVE, MOVE], [WORK, WORK, CARRY, CARRY, MOVE, MOVE], [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]],
        desired: 5
    },

    run(creep: Creep) {
        if(creep.memory.atWork && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.atWork = false 
        }
        if(!creep.memory.atWork && creep.store.getFreeCapacity() == 0) {
            creep.memory.atWork = true
        }
        if(creep.memory.atWork) {
            creep.memory.energySource = undefined
            let toRepair = Object.keys(Memory.structures).filter(val => {
                return Memory.structures[val].needsRepair && Game.getObjectById(val as Id<Structure>)
            }).map(val => Game.getObjectById(val as Id<Structure>))
            //console.log("TO REPAIR: " + creep.name + " " + toRepair)
            if(toRepair.length && toRepair[0] instanceof Structure) {
                let code = creep.repair(toRepair[0])
                if (code == ERR_NOT_IN_RANGE) {
                    creep.moveTo(toRepair[0], {range: 2, visualizePathStyle: {stroke: "#0F0F0F"}})
                } else {
                    creep.say("🔨repair")
                    console.log(`Creep ${creep.name} is repairing ${toRepair[0].structureType} at ${toRepair[0].pos.x}, ${toRepair[0].pos.y}.`)
                }
            } else {
                let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES)
                if(constructionSites.length) {
                    if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSites[0], { range: 3, visualizePathStyle: {stroke: '#E64A19'}})
                    } else {
                        creep.say("🚧build")
                    }
                } else { // No construction sites, so upgrade controller instead of just standing around
                    if (creep.room.controller && (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE || creep.pos.getRangeTo(creep.room.controller) > 1)) {
                        creep.moveTo(creep.room.controller, { range: 1, visualizePathStyle: { stroke: '#E64A19' } });
                    } else {
                        creep.say("⚡upgrade")
                    }
                }
            }
        } else {
            let sources = creep.room.find(FIND_SOURCES)
            creep.memory.energySource = creep.memory.energySource ?? {
                type: EnergySource.SOURCE,
                id: sources[Math.floor(Math.random() * sources.length)].id
            }
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
}

export default builder;