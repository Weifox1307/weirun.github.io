import { Route as rootRoute } from './routes/__root'
import { Route as IndexRoute } from './routes/index'
import { Route as HomeRoute } from './routes/home'
import { Route as ProfileRoute } from './routes/profile'
import { Route as ArchiveRoute } from './routes/archive'
import { Route as LeaderboardRoute } from './routes/leaderboard'

const routeTree = rootRoute.addChildren([
  IndexRoute,
  HomeRoute,
  ProfileRoute,
  ArchiveRoute,
  LeaderboardRoute
])

export { routeTree }
