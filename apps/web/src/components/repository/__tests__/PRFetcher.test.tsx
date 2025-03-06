import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { PRFetcher } from '../PRFetcher';
import { RepositoryService } from '@/app/_dashboard_old/pr-analyzer/repository-service';

// Mock the repository service
jest.mock('@/app/_dashboard_old/pr-analyzer/repository-service');

const mockPullRequest = {
  id: 'pr-123',
  repositoryId: 'repo-456',
  platform: 'github',
  externalId: '12345',
  number: 123,
  title: 'Test Pull Request',
  description: 'This is a test PR',
  state: 'open',
  createdAt: new Date(),
  updatedAt: new Date(),
  closedAt: null,
  mergedAt: null,
  isDraft: false,
  author: {
    id: 'user-789',
    login: 'testuser',
    name: 'Test User',
    avatarUrl: 'https://github.com/avatar.png'
  },
  headRef: 'feature-branch',
  baseRef: 'main',
  headSha: 'abc123',
  baseSha: 'def456',
  labels: ['bug', 'enhancement'],
  url: 'https://github.com/test-owner/test-repo/pull/123'
};

describe('PRFetcher', () => {
  let mockRepositoryService: jest.Mocked<RepositoryService>;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create a mock repository service
    mockRepositoryService = {
      getPullRequest: jest.fn().mockResolvedValue(mockPullRequest)
    } as unknown as jest.Mocked<RepositoryService>;
  });
  
  it('renders the input and button', () => {
    render(<PRFetcher repositoryService={mockRepositoryService} />);
    
    expect(screen.getByPlaceholderText(/github\/owner\/repo\/pull\/123/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fetch pr/i })).toBeInTheDocument();
  });
  
  it('handles successful PR fetching', async () => {
    // Create a more explicit mock implementation to avoid timing issues
    jest.clearAllMocks();
    
    // Create a formatted mock PR with proper date strings
    const formattedMockPR = {
      ...mockPullRequest,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      closedAt: null,
      mergedAt: null,
      repository: {
        id: 'repo-456',
        owner: 'test-owner',
        name: 'test-repo',
        description: 'Test repo description',
        isPrivate: false,
        defaultBranch: 'main'
      },
      files: []
    };
    
    // Override the mock to return proper data
    mockRepositoryService.getPullRequest = jest.fn().mockResolvedValue(formattedMockPR);
    
    // Create spy for the callback
    const onPRFetched = jest.fn();

    // Render the component
    render(
      <PRFetcher 
        repositoryService={mockRepositoryService} 
        onPRFetched={onPRFetched}
      />
    );
    
    // Enter a valid PR URL
    fireEvent.change(screen.getByPlaceholderText(/github\/owner\/repo\/pull\/123/i), {
      target: { value: 'github/test-owner/test-repo/pull/123' }
    });
    
    // Click the fetch button - use act to wrap state updates
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /fetch pr/i }));
      // Let any promises resolve
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    // Verify the service was called with correct parameters
    expect(mockRepositoryService.getPullRequest).toHaveBeenCalledWith(
      'github',
      'test-owner',
      'test-repo',
      123
    );
  });
  
  it('displays an error message when PR fetching fails', async () => {
    // Mock the service to reject
    mockRepositoryService.getPullRequest.mockRejectedValueOnce(
      new Error('Repository not found')
    );
    
    const onError = jest.fn();
    render(
      <PRFetcher 
        repositoryService={mockRepositoryService} 
        onError={onError}
      />
    );
    
    // Enter a valid PR URL
    fireEvent.change(screen.getByPlaceholderText(/github\/owner\/repo\/pull\/123/i), {
      target: { value: 'github/nonexistent/repo/pull/123' }
    });
    
    // Click the fetch button - wrap in act
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /fetch pr/i }));
      // Allow time for state updates to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    // Verify error message is displayed
    expect(screen.getByText(/repository not found/i)).toBeInTheDocument();
    
    // Verify error callback was called
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });
  
  it('parses different PR URL formats correctly', async () => {
    render(<PRFetcher repositoryService={mockRepositoryService} />);
    
    // Test GitHub format
    fireEvent.change(screen.getByPlaceholderText(/github\/owner\/repo\/pull\/123/i), {
      target: { value: 'https://github.com/test-owner/test-repo/pull/123' }
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /fetch pr/i }));
      // Allow time for state updates to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    expect(mockRepositoryService.getPullRequest).toHaveBeenCalledWith(
      'github',
      'test-owner',
      'test-repo',
      123
    );
    
    // Clear mock calls
    mockRepositoryService.getPullRequest.mockClear();
    
    // Test GitLab format
    fireEvent.change(screen.getByPlaceholderText(/github\/owner\/repo\/pull\/123/i), {
      target: { value: 'https://gitlab.com/test-owner/test-repo/-/merge_requests/456' }
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /fetch pr/i }));
      // Allow time for state updates to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    expect(mockRepositoryService.getPullRequest).toHaveBeenCalledWith(
      'gitlab',
      'test-owner',
      'test-repo',
      456
    );
  });
  
  it('validates PR URL format', async () => {
    render(<PRFetcher repositoryService={mockRepositoryService} />);
    
    // Enter an invalid PR URL
    fireEvent.change(screen.getByPlaceholderText(/github\/owner\/repo\/pull\/123/i), {
      target: { value: 'invalid-url' }
    });
    
    // Click the fetch button with proper async handling
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /fetch pr/i }));
      // Allow time for state updates to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    // Verify error message is displayed
    expect(screen.getByText(/invalid pr url format/i)).toBeInTheDocument();
    
    // Verify service was not called
    expect(mockRepositoryService.getPullRequest).not.toHaveBeenCalled();
  });
});
