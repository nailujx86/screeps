export enum EnergySource {
    SOURCE,
    CONTAINER,
    STORAGE,
    RESOURCE
}

export default interface IEnergySource {
    type: EnergySource,
    id: Id<Source | StructureStorage | StructureContainer | Resource>
}