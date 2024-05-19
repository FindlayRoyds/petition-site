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

export interface Category {
    categoryId: number,
    name: string
}