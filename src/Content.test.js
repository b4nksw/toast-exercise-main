import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Content from './Content';

jest.mock('./service/mockServer', () => ({
  onMessage: jest.fn(),
  fetchLikedFormSubmissions: jest.fn(),
  saveLikedFormSubmission: jest.fn(),
}));

describe('Content Component', () => {
  let fetchLikedFormSubmissions;

  beforeEach(() => {
    jest.resetAllMocks();
    fetchLikedFormSubmissions = require('./service/mockServer').fetchLikedFormSubmissions;
  });

  test('render content with initial state', async () => {
    fetchLikedFormSubmissions.mockImplementation(() =>
      Promise.resolve({ formSubmissions: [] })
    );
    render(<Content openSnackBar={false} setOpenSnackBar={jest.fn()} />);

    const submissionListTitle = screen.getByText('Liked Form Submissions')
    const fetchSubmissionText = screen.getByText('Fetching submission list. Please wait.')
    expect(submissionListTitle).toBeInTheDocument();
    expect(fetchSubmissionText).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('No submission is found.')).toBeInTheDocument();
    });
  });

  test('fetch submission list and display', async () => {
    const mockSubmissionData = { 
      id: 'mockId',
      data: { 
        email: 'mock@mockDomain.com', 
        firstName: 'mockFirstName', 
        lastName: 'mockLastName' ,
        liked: false,
      } 
    }
    fetchLikedFormSubmissions.mockImplementation(() =>
      Promise.resolve({ formSubmissions: [mockSubmissionData] })
    );

    render(<Content openSnackBar={false} setOpenSnackBar={jest.fn()} />);

    await waitFor(() => {
      const submissionText = screen.getByText(/Email:/).closest('div');
      expect(submissionText).toBeInTheDocument();
      const expectedText = 'Email: mock@mockDomain.com, First Name: mockFirstName, Last Name: mockLastName'
      expect(submissionText.textContent).toBe(expectedText)
    });
  });

  test('show snackbar with submission data', async () => {
    fetchLikedFormSubmissions.mockImplementation(() =>
      Promise.resolve({ formSubmissions: [] })
    );
    render(<Content openSnackBar={true} setOpenSnackBar={jest.fn()} />);
    await waitFor(() => {
      expect(screen.getByText('New submission received')).toBeInTheDocument();
    });
  })
})