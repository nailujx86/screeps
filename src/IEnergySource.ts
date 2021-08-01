export enum EnergySource {
    SOURCE,
    CONTAINER,
    STORAGE
}

export default interface IEnergySource {
    type: EnergySource,
    id: Id<Source | StructureStorage | StructureContainer>
}