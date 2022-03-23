import { render, screen, fireEvent } from '@testing-library/react';
import { SubscribeButton } from '.';
import { mocked } from 'jest-mock'
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import subscribe from '../../pages/api/subscribe';


jest.mock('next-auth/react');

jest.mock('next/router');

describe('Subscribe Button component', () => {


  it('renders correctly', () => {

    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({ data: null, status: "authenticated" })

    render(
      <SubscribeButton />
    )

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirets user to sign in when not authenticated', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({ data: null, status: "unauthenticated" })

    const signInMocked = mocked(signIn)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirects to posts when user already has a subbcription', () => {

    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { name: "John Doe", email: "john.doe@example.com" },
        expires: "fake-expires",
        activeSubscription: "fake-expires",
      },
      status: "authenticated",
    })

    useRouterMocked.mockReturnValue({
      push: pushMock,
    } as any)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })

})
