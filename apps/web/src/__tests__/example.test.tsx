import { render, screen } from '@testing-library/react';

describe('Example Test', () => {
  it('should pass the basic test', () => {
    expect(true).toBe(true);
  });

  it('should render text correctly', () => {
    render(<div>Hello Test</div>);
    expect(screen.getByText('Hello Test')).toBeInTheDocument();
  });
});