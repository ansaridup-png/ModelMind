import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the ModelMind branding and product overview', () => {
  render(<App />);

  expect(screen.getAllByText(/ModelMind/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/from data to decisions/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Machine Learning/i).length).toBeGreaterThan(0);
});
