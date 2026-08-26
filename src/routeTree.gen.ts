import { Route as rootRoute } from './routes/__root'
import { Route as IndexRoute } from './routes/index'
import { Route as LoginRoute } from './routes/login'
import { Route as ProfileRoute } from './routes/profile'
import { Route as LeaderboardRoute } from './routes/leaderboard'
import { Route as ChallengesRoute } from './routes/challenges'
import { Route as UploadRoute } from './routes/upload'
import { Route as ContactRoute } from './routes/contact'

const routeTree = rootRoute.addChildren([
  IndexRoute,
  LoginRoute,
  ProfileRoute,
  LeaderboardRoute,
  ChallengesRoute,
  UploadRoute,
  ContactRoute
])

export { routeTree }
