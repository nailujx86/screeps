export function run(creep: Creep) {
    if(creep.memory.atWork && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.atWork = false 
    }
    if(!creep.memory.atWork && creep.store.getFreeCapacity() == 0) {
        creep.memory.atWork = true
    }
    if(creep.memory.atWork) {
        creep.memory.energySource = undefined
        let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES)
        if(constructionSites.length) {
            if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSites[0], {range: 3, visualizePathStyle: {stroke: '#E64A19'}})
            } else {
                creep.say("🚧build")
            }
        }
    } else {
        let sources = creep.room.find(FIND_SOURCES)
        creep.memory.energySource = creep.memory.energySource == undefined ? Math.floor(Math.random() * sources.length) : creep.memory.energySource
        if(creep.harvest(sources[creep.memory.energySource]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[creep.memory.energySource], { range: 1, visualizePathStyle: {stroke: '#E64A19'}})
        } else {
            creep.say("🌾harvest")
        }
    }
}