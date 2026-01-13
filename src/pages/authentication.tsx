import * as Tabs from '@radix-ui/react-tabs'

import { ToastContainer } from 'react-toastify'
import { FormLogin } from '../components/formLogin'
import { FormSignUp } from '../components/formSignUp'
import { useSearchParams } from 'react-router-dom'

export function Authentication() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab')

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value })
  }

  return (
    <>
      <div className="flex flex-row w-full">
        <div className="w-full flex flex-col justify-center items-center z-10">
          <div className="pt-4 md:pt-10 nesthub:pt-4 asus:pt-2">
            <h1 className="text-4xl text-white font-bold">LOGO</h1>
          </div>

          <Tabs.Root
            className="flex flex-col w-[300px] sm:w-[550px] md:w-[550px] lg:w-[400px] xl:w-[480px] 2xl:w-[600px] h-full sm:pt-[30px] nesthub:pt-2 asus:pt-2 nesthub:w-[550px]"
            value={tab === 'signUp' ? 'signUp' : 'login'}
            onValueChange={handleTabChange}
          >
            <Tabs.List asChild>
              <div className="flex border-[#3F4149] justify-center">
                <Tabs.Trigger
                  className="w-80 lg:w-[400px] h-[60px] flex items-center justify-center data-[state=active]:shadow-[inset_0_-5px_0_0,0_1px_0_0] 
              cursor-default data-[state=active]:text-[#8C67F6] text-[#3F4149] 
              font-bold md:text-lg shadow-[inset_0_-5px_0_0,0_1px_0_0]"
                  value="login"
                >
                  LOGIN
                </Tabs.Trigger>
                <Tabs.Trigger
                  className="w-80 lg:w-[400px] h-[60px] flex items-center justify-center data-[state=active]:shadow-[inset_0_-5px_0_0,0_1px_0_0] 
              cursor-default data-[state=active]:text-[#8C67F6] text-[#3F4149] 
              font-bold md:text-lg shadow-[inset_0_-5px_0_0,0_1px_0_0]"
                  value="signUp"
                >
                  SIGN UP
                </Tabs.Trigger>
              </div>
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
      <ToastContainer />
    </>
  )
}
