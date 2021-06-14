import { useState } from 'react'
import { useEffect } from 'react'

import { useAuthState } from '../context/AuthContext'

/*
Hook for fetching data with GET method. It indicated if request has finished and if there were some errors

@param url - url of resource to fetch
@param initialState - {} for objects or [] for arrays
@param transformFun - function that can be applied to fetched data before setting them to state

@returns array with fetch data, loading indicator, error indicator

*/
const useFetch = (url, initialState, transformFun = (arg) => arg) => {
    const [data, setData] = useState(initialState)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    const authState = useAuthState()

    useEffect(() => {
        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authState.access}`,
            }
        }).then(response => {
            if (response.ok) {
                setHasError(false)
                return response.json()
            }
            else {
                setIsLoading(false)
                setHasError(true)
                throw new Error(`Response code is ${response.status}`)
            }
        }).then(json => {
            setData(transformFun(json))
            setIsLoading(false)
        })
        .catch(e => {
            console.log(e)})

    }, [url])


    return [data, isLoading, hasError]
}

export default useFetch