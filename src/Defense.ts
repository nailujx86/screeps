export function defend(room: Room) {
    let hostiles = room.find(FIND_HOSTILE_CREEPS);
    if(hostiles.length > 0) {
        let username = hostiles[0].owner.username
        Game.notify(`User ${username} spotted in room ${room.name}`)
        let towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}}) as StructureTower[]
        towers.forEach(tower => tower.attack(hostiles[0]))
    }
}