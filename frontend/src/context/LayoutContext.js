import React from 'react'

const LayoutStateContext = React.createContext()
const SidebarToggleContext = React.createContext()


const LayoutProvider = ({ children }) => {
    const [state, setState] = React.useState(true)

    return (
        <LayoutStateContext.Provider value={state}>
            <SidebarToggleContext.Provider value={setState}>
                {children}
            </SidebarToggleContext.Provider>
        </LayoutStateContext.Provider>
    )
}


const useLayoutState = () => {
    const context = React.useContext(LayoutStateContext)
    return context
}

const useSidebarToggle = () => {
    const context = React.useContext(SidebarToggleContext)
    return context
}

export { LayoutProvider, useLayoutState, useSidebarToggle }
