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
      <div className="h-screen flex flex-row">
        <div className="w-[45%] h-full flex flex-col justify-center items-center bg-[#272932] z-10">
          <div className="self-start pl-28 pt-[49px]">
            <h1 className="text-4xl text-white font-bold">LOGO</h1>
          </div>

          <Tabs.Root
            className="flex flex-col w-[660px] h-full pt-[69px]"
            defaultValue="login"
          >
            <Tabs.List asChild>
              <div className="flex border-[#3F4149] justify-center">
                <Tabs.Trigger
                  className="w-80 h-[60px] flex items-center justify-center data-[state=active]:shadow-[inset_0_-5px_0_0,0_1px_0_0] 
              cursor-default data-[state=active]:text-[#8C67F6] text-[#3F4149] 
              font-bold shadow-[inset_0_-5px_0_0,0_1px_0_0]"
                  value="login"
                >
                  LOGIN
                </Tabs.Trigger>
                <Tabs.Trigger
                  className="w-80 h-[60px] flex items-center justify-center data-[state=active]:shadow-[inset_0_-5px_0_0,0_1px_0_0] 
              cursor-default data-[state=active]:text-[#8C67F6] text-[#3F4149] 
              font-bold shadow-[inset_0_-5px_0_0,0_1px_0_0]"
                  value="signUp"
                >
                  SIGN UP
                </Tabs.Trigger>
              </div>
            </Tabs.List>
            <Tabs.Content asChild value="login">
              <FormLogin />
            </Tabs.Content>

            <Tabs.Content asChild value="signUp">
              <FormSignUp />
            </Tabs.Content>
          </Tabs.Root>
        </div>
        <div className="w-[55%] h-full bg-[#1A1C26]">
          <img
            className="absolute right-[0px] top-[0px] z-0 "
            src={photo1}
            alt=""
          />

          <img
            className="absolute -right-[0px] top-[274px]"
            src={photo2}
            alt=""
          />

          <img
            className="absolute right-[620px] top-[275px] z-0"
            src={photo3}
            alt=""
          />

          <img
            className="absolute right-[410px] top-[735px] z-0"
            src={photo4}
            alt=""
          />
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
