import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {useRouter} from 'next/router';

interface ToggleMenuProvideProps{
  children: ReactNode;
}

interface ToggleMenuContextProps{
  isActiveMenu: boolean;
  toggleCloseMenu: () => void;
  toggleOpenMenu: () => void;
}

export const ToggleMenuContext = createContext<ToggleMenuContextProps>({} as ToggleMenuContextProps);

export function ToggleMenuProvider({children}:ToggleMenuProvideProps){
  const [isActiveMenu, setIsActiveMenu] = useState(false);
  const router = useRouter()

  function toggleCloseMenu(){
    setIsActiveMenu(false);
  }
  function toggleOpenMenu(){
    setIsActiveMenu(true);
  }

  useEffect(() => {
    toggleCloseMenu()
  }, [router.asPath])

  return(
    <ToggleMenuContext.Provider value={{isActiveMenu , toggleCloseMenu, toggleOpenMenu}}>
      {children}
    </ToggleMenuContext.Provider>
  )
}