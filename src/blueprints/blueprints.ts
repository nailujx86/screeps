import { IScreep } from "interfaces/IScreep"
import builder from "blueprints/Builder"
import harvester from "blueprints/Harvester"

/**
 * An array of all creep blueprints
 */
const blueprints: Array<IScreep> = [builder, harvester]

export default blueprints