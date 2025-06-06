"use client"

import { SessionProvider } from "next-auth/react"
import PropTypes from 'prop-types'

export default function NextAuthSessionProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>
}

NextAuthSessionProvider.propTypes = {
  children: PropTypes.node.isRequired
}
