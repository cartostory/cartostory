import { Link } from 'react-router-dom'
import { useAuthContext } from '../../providers/auth-provider'
import { ReactComponent as Logout } from '../../assets/log-out.svg'
import { ReactComponent as UserCheck } from '../../assets/user-check.svg'
import { ReactComponent as DraftLine } from '../../assets/draft-line.svg'

function Home() {
  return (
    <main>
      <AppBar />
      <section className="container mx-auto bg-blue-100">
        <h1>Cartostory</h1>
      </section>
    </main>
  )
}

function AppBar() {
  const auth = useAuthContext()
  return (
    <nav className="sticky flex px-5 py-7 bg-green-200">
      <Navigation />
      {auth.user ? <UserMenu user={auth.user} /> : <Buttons />}
    </nav>
  )
}

function Navigation() {
  return (
    <ul className="flex grow space-x-5">
      <li>
        <Link className="flex space-x-2" to="/stories/write">
          <DraftLine />
          <span>new story</span>
        </Link>
      </li>
      <li>item 2</li>
      <li>item 3</li>
    </ul>
  )
}

function UserMenu({
  user,
}: {
  user: Exclude<ReturnType<typeof useAuthContext>['user'], undefined>
}) {
  const notVerifiedYet = user.status === 'registered'

  return (
    <div className="group relative">
      <button className="flex items-center space-x-3 ml-auto">
        <span>{user.display_name}</span>
      </button>
      <ul className="hidden group-hover:block absolute w-full bg-white px-5 py-3 space-y-3">
        {!notVerifiedYet ? (
          <li className="flex space-x-5">
            <span className="grow">verify</span>
            <UserCheck />
          </li>
        ) : null}
        <li>
          <Link to="/auth/logout" className="flex space-x-5">
            <span className="grow">logout</span>
            <Logout />
          </Link>
        </li>
      </ul>
    </div>
  )
}

function Buttons() {
  return (
    <ul className="flex space-x-5">
      <li>
        <Link to="/auth/sign-in">sign in</Link>
      </li>
      <li>
        <Link to="/auth/sign-up">sign up</Link>
      </li>
    </ul>
  )
}

export { Home }
