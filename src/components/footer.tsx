import { Link } from 'react-router-dom'
import logo from '../assets/euzerei-logo.svg'
import { useAuth } from '../hooks/useAuth'

const linkClass =
  'block w-fit whitespace-nowrap rounded-sm py-1 text-sm text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:text-white focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light'

const groupTitleClass = 'mb-2 text-sm font-semibold text-white'

export function Footer() {
  const { user } = useAuth()

  const exploreLinks = [
    { to: '/', label: 'Início' },
    { to: '/games', label: 'Jogos' },
    { to: '/games/comingSoon', label: 'Em breve' },
  ]

  const accountLinks = user?.id
    ? [
        { to: '/userLibrary', label: 'Biblioteca' },
        { to: `/users/${encodeURIComponent(user.id)}`, label: 'Perfil' },
      ]
    : [
        { to: '/auth?tab=login', label: 'Entrar' },
        { to: '/auth?tab=signUp', label: 'Criar conta' },
      ]

  return (
    <footer className="mt-16 border-t border-dark-border pt-8">
      <div className="grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-12">
        <div className="col-span-2 min-w-0 lg:col-span-1">
          <img src={logo} alt="EuZerei" className="h-6 w-auto" />
          <p className="mt-4 flex flex-col gap-1 text-xs text-gray-400 lg:flex-row lg:flex-wrap lg:gap-x-6">
            <span>© {new Date().getFullYear()} EuZerei</span>
            <span>Um projeto pessoal em desenvolvimento contínuo.</span>
            <span>Capas e dados de jogos fornecidos pela IGDB.</span>
          </p>
        </div>

        <nav aria-labelledby="footer-explorar" className="min-w-0">
          <h2 id="footer-explorar" className={groupTitleClass}>
            Explorar
          </h2>
          <ul>
            {exploreLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-conta" className="min-w-0">
          <h2 id="footer-conta" className={groupTitleClass}>
            Conta
          </h2>
          <ul>
            {accountLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
