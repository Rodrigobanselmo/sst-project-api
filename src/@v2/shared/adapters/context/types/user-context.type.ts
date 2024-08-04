type Profile = {
  id: number
  name: string
  type: 'MEDICAL' | 'NORMAL' | 'FACULTATIVE_ACCESS'
}

type Role = {
  id: number
  profile: Profile
  institutionId: number | null
  isHealthleader: boolean
}

type UserData = {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

type UserContextConstructor = { user: UserData }

export class UserContext {
  private user: UserData

  constructor({ user }: UserContextConstructor) {
    this.user = user
  }

  get isAdmin(): boolean {
    return this.user.roles.some((role) => role.institutionId === null)
  }

  get id(): number {
    return this.user.id
  }

  get institutionIds(): number[] {
    return this.user.roles.map((profile) => profile.institutionId).filter((id) => id !== null) as number[]
  }

  isInstitutionHealthLeader(institutionId: number): boolean {
    return this.user.roles.some((profile) => profile.institutionId === institutionId && profile.isHealthleader)
  }

  isMedicalInstitutional(institutionId: number): boolean {
    return this.user.roles.some(
      (profile) => profile.institutionId === institutionId && profile.profile.type === 'MEDICAL'
    )
  }
}
