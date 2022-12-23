import React, { useContext } from 'react'
import { AuthProvider } from '../src/AuthContext'
import { TAuthConfig } from '../src/Types'
import { act, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { AuthContext } from '../src'

const authConfig: TAuthConfig = {
  clientId: 'myClientID',
  authorizationEndpoint: 'myAuthEndpoint',
  tokenEndpoint: 'myTokenEndpoint',
  logoutEndpoint: 'myLogoutEndpoint',
  redirectUri: 'http://localhost:3000/',
  logoutRedirect: 'http://localhost:3000/',
  decodeToken: false,
  autoLogin: false,
  scope: 'someScope openid',
  extraLogoutParameters: {
    prompt: false,
    client_id: 'anotherClientId',
    testKey: 'test Value',
  },
}

const AuthConsumer = () => {
  const { logOut, token } = useContext(AuthContext)
  console.log(token)
  return (
    <>
      <button
        onClick={() => {
          // @ts-ignore
          logOut()
          console.log('HAlSODKASLDKJH')
        }}
        data-testid={'logout-button'}
      >
        Logout
      </button>
      <p data-testid={'token'}>{token}</p>
    </>
  )
}

describe('make logout request with extra parameters', () => {
  localStorage.setItem('ROCP_loginInProgress', 'false')
  localStorage.setItem('ROCP_token', '"mockToken"')
  localStorage.setItem('ROCP_refreshToken', '"mockToken"')
  localStorage.setItem('ROCP_tokenExpire', '9999999999')
  const wrapper = ({ children }: any) => <AuthProvider authConfig={authConfig}>{children}</AuthProvider>

  it.skip('calls the logout endpoint with these parameters', async () => {
    const user = userEvent.setup()
    // await act(async () => {
    //   // @ts-ignore
    //   render(<AuthConsumer/>, {wrapper})
    // })
    render(
      <AuthProvider authConfig={authConfig}>
        <AuthConsumer />
      </AuthProvider>
    )

    // @ts-ignore
    await waitFor(() => expect(screen.getByTestId('token')).toHaveTextContent('mockToken'))
    await user.click(screen.getByText('Logout'))
    console.log(localStorage.getItem('ROCP_token'))
    expect(window.location.replace).toHaveBeenCalledWith(
      expect.stringMatching(
        /^myLogoutEndpoint\?client_id=anotherClientId&scope=someScope\+openid&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&code_challenge=.{43}&code_challenge_method=S256&prompt=true/gm
      )
    )
  })
})
