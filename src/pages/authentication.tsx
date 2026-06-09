import * as Tabs from '@radix-ui/react-tabs'
import { ToastContainer } from 'react-toastify'
import { useSearchParams } from 'react-router-dom'
import { FormLogin } from '../components/formLogin'
import { FormSignUp } from '../components/formSignUp'

const tabTrigger =
  'flex-1 py-3 text-sm font-semibold text-gray-600 border-b-2 border-transparent ' +
  'data-[state=active]:text-white data-[state=active]:border-[#7A38CA] ' +
  'transition-colors duration-150 uppercase tracking-wide'

export function Authentication() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') === 'signUp' ? 'signUp' : 'login'

  function handleTabChange(value: string) {
    setSearchParams(value === 'signUp' ? { tab: 'signUp' } : {}, {
      replace: true
    })
  }

  return (
    <div className="flex justify-center py-8 md:py-12">
      <div className="w-full max-w-md">
        <Tabs.Root value={tab} onValueChange={handleTabChange}>
          <Tabs.List className="flex border-b border-[#2A2B36] mb-6">
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

      <ToastContainer />
    </div>
  )
}
