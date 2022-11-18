import { createContext, useContext } from "react";

export const platformBackend = 'https://amino-chain-backend.herokuapp.com/'

const AppContext = createContext();

export function AppWrapper({ children }) {
  let sharedState = { search: "temporary"}
   
  // add anything you want to be able to retrieve

  return(
    <AppContext.Provider value={[sharedState]}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}