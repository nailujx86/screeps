export function checkForRepair(structures: Structure[]) {
    structures.forEach(structure => {
        let needsRepairCurrently = structure.memory.needsRepair ?? false
        if (structure instanceof StructureWall && structure.hits < 1500000 || !(structure instanceof StructureWall) && structure.hits < (structure.hitsMax / 3))
            structure.memory.needsRepair = true
        if (((structure.hits / structure.hitsMax) > 0.5 || structure instanceof StructureWall && structure.hits >= 150000) && needsRepairCurrently)
            structure.memory.needsRepair = false
    })
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