export type Salon = {
    chainId: string | null // Unique identifier for the salon's chain.
    active: boolean // Indicates if the salon is currently active.
    address: string // Physical address of the salon.
    description: string // Detailed description of the salon.
    email: string // Contact email for the salon.
    fixit: number // Fixit ID or identifier, possibly related to a booking or service system.
    name: string // Name of the salon.
    objectId: string // Unique identifier for the salon.
    path: string // URL-friendly path or identifier for the salon.
    phone: string // Contact phone number for the salon.
    ranking: number // Ranking or rating of the salon.
    recipient: string // Email address for salary-related communication.
    schedule: {
      // Array representing the salon's working schedule.
      hours: string // Hours the salon is open for the day.
      title: string // Title of the schedule, indicating the day (e.g., "Man - Fre" for Monday to Friday).
    }[]
    thumb: string // Thumbnail image for the salon.
}

export type SalonEmployee = {
  name: string,
  objectId: string
}