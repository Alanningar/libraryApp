import { expect, test, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Signup from '../Signup'
import * as nextNavigation from 'next/navigation'

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}))

beforeEach(() => {
    vi.resetAllMocks()
})

test('renders signup form', () => {
    render(<Signup />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument()
})

test('submits form successfully', async () => {
    const push = vi.fn()
    nextNavigation.useRouter.mockReturnValue({ push })

    global.fetch = vi.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, userId: '123' }),
        })
    )

    render(<Signup />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /signup/i }))

    await waitFor(() => {
        expect(screen.getByText(/account created successfully/i)).toBeInTheDocument()
        expect(push).toHaveBeenCalledWith('/login')
    })
})

test('shows error on failed submission', async () => {
    global.fetch = vi.fn(() =>
        Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ message: 'Email already in use' }),
        })
    )

    render(<Signup />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /signup/i }))

    await waitFor(() => {
        expect(screen.getByText(/email already in use/i)).toBeInTheDocument()
    })
})