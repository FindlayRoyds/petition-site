export interface Petition {
    categoryId: number
    creationDate: Date
    numberOfSupporters: number
    ownerFirstName: string
    ownerId: number
    ownerLastName: string
    petitionId: number
    supportingCost: number
    title: number
}

export interface SupportTier {
    title: String,
    description: String,
    cost: number,
    supportTierId: number
}

export interface PetitionAdvanced {
    petitionId: number,
    title: String,
    categoryId: number,
    ownerId: number,
    ownerFirstName: String,
    ownerLastName: String,
    numberOfSupporters: number,
    creationDate: Date
    description: String,
    moneyRaised: number,
    supportTiers: SupportTier[]
}
export interface Category {
    categoryId: number,
    name: string
}