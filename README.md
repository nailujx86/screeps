# screeps
my little screeps ai

## features
- barebone support for building constructions
- cleaning up of dead screeps
- screeps role management
- automatic spawning of most needed roles
- automatic pixel generation
- towers defend against hostile creeps from other users
## roles
- builder  
builds and repairs construction sites
- harvester  
harvests energy, stores it in the spawn or upgrades the room controller. salvages dead screeps
## how to use
### compile
```shell
npm install
gulp clean build
```
### compile and deploy
```shell
npm install
gulp screeps
```
For the deployment the gulpfile expects a file named `credentials.js` to be provided in the root of the repository. This file should export an object with the following properties:
```javascript
module.exports = {
    token: 'my-screeps-api-token',
    branch: 'default' // the screeps branch to commit to
}
```
## todos
- [ ] support storing energy in containers
- [ ] role: automatic road builder
- [ ] support for extensions
- [ ] support for links