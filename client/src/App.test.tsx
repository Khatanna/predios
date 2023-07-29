import App from './App';
import { render, screen } from '@testing-library/react';

describe('App component', () => {
  // afterEach(() => {
  // })
  test('should render app component', () => {
    render(<App />)
    expect(screen.getByText(/count/)).toBeDefined()
  })
})