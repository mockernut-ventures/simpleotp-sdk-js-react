import React, { createContext, useContext, useState } from 'react'
import { AuthStatusCode, SimpleOTP } from '@simpleotp/core'

const SIMPLEOTP_CONTEXT_KEY = 'simpleotp'

class ReactSimpleOTP extends SimpleOTP {
  constructor(siteID, apiURL = null) {
    super(siteID, apiURL)

    this.userRef = React.createRef()
    this.isAuthenticatedRef = React.createRef(Boolean(this.userRef.current))
  }

  async authWithURLCode() {
    const resp = await super.authWithURLCode()
    if (resp.code === AuthStatusCode.OK.description) {
      this.isAuthenticatedRef.current = true
      this.userRef.current = this.getUser()
    }
    return resp
  }

  isAuthenticatedRef() {
    return this.isAuthenticatedRef.current
  }

  getUserRef() {
    return this.userRef.current
  }

  signOut() {
    super.signOut()
    this.isAuthenticatedRef.current = false
    this.userRef.current = null
  }
}

export function useSimpleOTP() {
  return useContext(SimpleOTPContext)
}

export function SimpleOTPProvider({ siteID, apiURL, children }) {
  const [simpleOTPInstance] = useState(() => new ReactSimpleOTP(siteID, apiURL))

  return (
    <SimpleOTPContext.Provider value={simpleOTPInstance}>
      {children}
    </SimpleOTPContext.Provider>
  )
}

const SimpleOTPContext = createContext()

export default SimpleOTPProvider