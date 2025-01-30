import { reduceRoutes } from '@/@modules/shared/utils/helpers/reduce-routes'

const version = '2'

const RawRoutes = {
  ADD_DOCUMENT: 'users/:userId/health-history/documents'
} as const

export const Routes = reduceRoutes(RawRoutes, { version })
