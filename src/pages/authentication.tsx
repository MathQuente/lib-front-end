import * as Tabs from '@radix-ui/react-tabs'
import { useSearchParams } from 'react-router-dom'
import { FormLogin } from '../components/formLogin'
import { FormSignUp } from '../components/formSignUp'

const tabTrigger =
  'flex-1 py-3 text-sm font-semibold text-gray-400 border-b-2 border-transparent ' +
  'data-[state=active]:text-white data-[state=active]:border-primary ' +
  'transition-colors duration-150 uppercase tracking-wide ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-light'

export function Authentication() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') === 'signUp' ? 'signUp' : 'login'

  function handleTabChange(value: string) {
    setSearchParams(value === 'signUp' ? { tab: 'signUp' } : {}, {
      replace: true
    })
  }

  return (
    <div className="flex justify-center pt-2 pb-8 md:pt-4 md:pb-12">
      <div className="w-full max-w-md">
        <Tabs.Root value={tab} onValueChange={handleTabChange}>
          <Tabs.List className="flex border-b border-dark-border mb-6">
            <Tabs.Trigger className={tabTrigger} value="login">
              Login
            </Tabs.Trigger>
            <Tabs.Trigger className={tabTrigger} value="signUp">
              Criar conta
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="login">
            <FormLogin />
          </Tabs.Content>
          <Tabs.Content value="signUp">
            <FormSignUp />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  )
}
