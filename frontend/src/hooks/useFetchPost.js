import { useState } from 'react'
import { useEffect } from 'react'

import { useAuthState } from '../context/AuthContext'

/*
Adapted from useFetch.js
Hook for fetching data with POST method. It indicated if request has finished and if there were some errors
@param url - url of resource to fetch
@param payload - body of post method
@param initialState - {} for objects or [] for arrays
@param transformFun - function that can be applied to fetched data before setting them to state
@returns array with fetch data, loading indicator, error indicator
*/

const useFetchPost = (url, payload, initialState, transformFun = (arg) => arg) => {
    const [data, setData] = useState(initialState)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    const authState = useAuthState()

    useEffect(() => {
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authState.access}`,
            },
            body: JSON.stringify(payload)
        }).then(response => {
            if (response.ok) return response.json()
            else {
                setIsLoading(false)
                setHasError(true)
                throw new Error(`Response code is ${response.status}`)
            }
        }).then(json => {
            const transformed = transformFun(json)
            setData(transformed)
            setIsLoading(false)
        })
        .catch(e => console.log(e))

    }, [url, JSON.stringify(payload)]) //TODO bardziej wyrafinowane podejście


    return [data, isLoading, hasError]
}

export default useFetchPost 