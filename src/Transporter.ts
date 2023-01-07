import { EnergySource } from "interfaces/IEnergySource";

const priority = { StructureTower: 0, StructureExtension: 1, StructureContainer: 2, StructureSpawn: 3 }

export function run(creep: Creep) {
    if (creep.store.getCapacity() / creep.store.getFreeCapacity() > 0.8) {
        // TODO FIND RESOURCES OR PICK UP FROM CONTAINER
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
        targets = targets.sort((a, _b) => { return a instanceof StructureTower ? 0 : a instanceof StructureExtension ? 1 : a instanceof StructureContainer ? 2 : a instanceof StructureSpawn ? 3 : 4 })
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