import { WALL_HITS } from "constants/Maintenance"

export function checkForRepair(structures: Structure[]) {
    structures.forEach(structure => {
        let needsRepairCurrently = structure.memory.needsRepair ?? false
        if (repairableAtControlLevel(structure.room, structure)) {
            if (structure instanceof StructureWall && structure.hits < WALL_HITS || !(structure instanceof StructureWall) && structure.hits < (structure.hitsMax / 3)) {
                console.log(`Structure ${structure.id} of type ${structure.structureType} needs repair. (${structure.hits} / ${structure.hitsMax}) at position ${structure.pos.x}, ${structure.pos.y}, isWall: ${structure instanceof StructureWall}`)
                structure.memory.needsRepair = true
            }
            if ((structure.hitsMax > 0 && (structure.hits / structure.hitsMax) > 0.5 || structure instanceof StructureWall && structure.hits >= WALL_HITS) && needsRepairCurrently)
                structure.memory.needsRepair = false
        } else {
            structure.memory.needsRepair = false
        }
    })
}

function repairableAtControlLevel(room: Room, structure: Structure): boolean {
    if (room.controller == undefined)
        return false
    if (structure instanceof StructureWall || structure instanceof StructureRampart) {
        return room.controller.level >= 3
    }
    if (structure instanceof StructureRoad) {
        return room.controller.level >= 2
    }
    return true
}

export function getRepairableStructures(room: Room): Structure[] {
    return room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure instanceof StructureContainer ||
                structure instanceof StructureStorage || structure instanceof StructureRoad ||
                structure instanceof StructureWall
            )
        }
    })
}