import { Route as rootRoute } from './routes/__root'
import { Route as IndexRoute } from './routes/index'
import { Route as HomeRoute } from './routes/home'
import { Route as ProfileRoute } from './routes/profile'
import { Route as ArchiveRoute } from './routes/archive'
import { Route as LeaderboardRoute } from './routes/leaderboard'
import { Route as AwardsRoute } from './routes/awards'
import { Route as RecordsRoute } from './routes/records'

const routeTree = rootRoute.addChildren([
  IndexRoute,
  HomeRoute,
  ProfileRoute,
  ArchiveRoute,
  LeaderboardRoute,
  AwardsRoute,
  RecordsRoute
])

export { routeTree }
