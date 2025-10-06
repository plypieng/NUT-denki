import { render, screen, fireEvent } from '@testing-library/react'
import { StudentCard } from './StudentCard'
import { Specialty } from '@/types/schema'

// Mock next-auth
const mockUseSession = jest.fn()
jest.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
}))

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('StudentCard', () => {
  const mockStudent = {
    id: '1',
    fullName: '山田太郎',
    nickname: 'タロー',
    studentId: 's253149',
    imageUrl: 'https://example.com/image.jpg',
    targetCourse: Specialty.DENKI_ENERGY_CONTROL,
    circle: 'サッカー部',
    caption: 'よろしくお願いします！',
    year: 'B3',
    isPinned: false,
    isFavorited: false,
    ownerEmail: 'student@test.com',
    bloodType: 'A',
    isAuthenticated: true,
  }

  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: { user: { email: 'user@test.com' } },
      status: 'authenticated',
    })
    mockPush.mockClear()
  })

  it('renders student information correctly', () => {
    render(<StudentCard {...mockStudent} />)

    expect(screen.getByText('山田太郎')).toBeInTheDocument()
    expect(screen.getByText('s253149')).toBeInTheDocument()
    expect(screen.getByText('タロー')).toBeInTheDocument()
    expect(screen.getByAltText('山田太郎のプロフィール写真')).toBeInTheDocument()
  })

  it('shows nickname badge for authenticated users', () => {
    render(<StudentCard {...mockStudent} isAuthenticated={true} />)

    expect(screen.getByText('タロー')).toBeInTheDocument()
  })

  it('hides nickname badge for unauthenticated users', () => {
    render(<StudentCard {...mockStudent} isAuthenticated={false} />)

    expect(screen.queryByText('タロー')).not.toBeInTheDocument()
  })

  it('applies blur class to images for unauthenticated users', () => {
    render(<StudentCard {...mockStudent} isAuthenticated={false} />)

    const image = screen.getByAltText('山田太郎のプロフィール写真')
    expect(image).toHaveClass('blur-sm')
  })

  it('does not apply blur class to images for authenticated users', () => {
    render(<StudentCard {...mockStudent} isAuthenticated={true} />)

    const image = screen.getByAltText('山田太郎のプロフィール写真')
    expect(image).not.toHaveClass('blur-sm')
  })

  it('shows placeholder when no image is provided', () => {
    const studentWithoutImage = { ...mockStudent, imageUrl: null }
    render(<StudentCard {...studentWithoutImage} />)

    expect(screen.getByText('写真なし')).toBeInTheDocument()
  })

  it('links to student detail page when authenticated', () => {
    render(<StudentCard {...mockStudent} isAuthenticated={true} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/student/1')
  })

  it('links to signin page when not authenticated', () => {
    render(<StudentCard {...mockStudent} isAuthenticated={false} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/auth/signin')
  })
})