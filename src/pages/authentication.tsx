import * as Tabs from '@radix-ui/react-tabs'

import photo1 from '../assets/bunpal1.png'
import photo2 from '../assets/bunpal2.png'
import photo3 from '../assets/bunpal3.png'
import photo4 from '../assets/bunpal4.png'

import { ToastContainer } from 'react-toastify'
import { FormLogin } from '../components/formLogin'
import { FormSignUp } from '../components/formSignUp'

export function Authentication() {
  return (
    <>
      <div className="flex flex-row">
        <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full 2xl:w-full asus:h-screen lg:h-screen xl:h-screen flex flex-col justify-center items-center bg-[#272932] z-10">
          <div className="pt-4 md:pt-10 nesthub:pt-4 asus:pt-2">
            <h1 className="text-4xl text-white font-bold">LOGO</h1>
          </div>

          <Tabs.Root
            className="flex flex-col w-[300px] sm:w-[550px] md:w-[550px] lg:w-[400px] xl:w-[480px] 2xl:w-[600px] h-full sm:pt-[30px] nesthub:pt-2 asus:pt-2 nesthub:w-[550px]"
            defaultValue="login"
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
                  className="w-80 md:w-80 h-[60px] flex items-center justify-center data-[state=active]:shadow-[inset_0_-5px_0_0,0_1px_0_0] 
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
        <div className="hidden lg:block nesthub:hidden w-full 2xl:h-screen bg-[#1A1C26]">
          <img
            className="absolute lg:right-0 lg:w-[595px] xl:right-0 xl:w-[592px] 2xl:right-0 2xl:w-[620px] z-0 asus:w-[438px]"
            src={photo1}
            alt=""
          />

          <img
            className="absolute top-[274px] lg:top-[322px] lg:right-0 lg:w-[380px] xl:right-0 xl:w-[380px] 2xl:right-0 2xl:w-[400px] 2xl:top-[299px] asus:w-[277px] asus:top-[230px]"
            src={photo2}
            alt=""
          />

          <img
            className="absolute right-[409px] top-[275px] z-0 lg:top-[250px] asus:w-[550px] asus:right-[284px] asus:top-[165px]"
            src={photo3}
            alt=""
          />

          <img
            className="absolute right-[180px] top-[732px] lg:top-[727px] xl:top-[725px] 2xl:top-[737px] z-0 asus:w-[680px] asus:top-[489px] asus:right-[100px]"
            src={photo4}
            alt=""
          />
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
