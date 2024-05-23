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
    title: string,
    description: string,
    cost: number,
    supportTierId: number
}

export interface PetitionAdvanced {
    petitionId: number,
    title: string,
    categoryId: number,
    ownerId: number,
    ownerFirstName: string,
    ownerLastName: string,
    numberOfSupporters: number,
    creationDate: Date
    description: string,
    moneyRaised: number,
    supportTiers: SupportTier[]
}

export interface Supporter {
    supportId: number,
    supportTierId: number,
    message: string,
    supporterId: number,
    supporterFirstName: string,
    supporterLastName: string,
    timestamp: Date
}

export interface Category {
    categoryId: number,
    name: string
}

export interface User {
    token: string,
    userId: number,
    email: string
    firstName: string
    lastName: string
}