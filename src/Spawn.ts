import _ from "lodash"

export function ensureCreeps() {
    const harvesters = _.filter(Game.creeps, creep => creep.memory.role == 'harvester')
    if (harvesters.length < 2) {
        let harvesterName = 'Harvester' + Game.time
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], harvesterName,
            {memory: {role: 'harvester', atWork: true}})
    }
}

export function visual() {
    if (Game.spawns['Spawn1'].spawning) {
        let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name]
        Game.spawns['Spawn1'].room.visual.text(
            '🏗 ' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: .8})
    }
}