import React from 'react';
import { screen, render } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders header text', () => {
    render(<App />);

    const heading  = screen.getByRole('heading', { name: /toast exercise/i});
    expect(heading).toBeInTheDocument();
  });

  test('render new submission button', () => {
    render(<App />);

    const newSubmissionButton = screen.getByRole('button', { name: /new submission/i});
    expect(newSubmissionButton).toBeInTheDocument();
  })
})