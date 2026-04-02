import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import UrlShortenerForm from '../UrlShortenerForm';
import { urlService } from '../../services/api';

// Mock the API service
vi.mock('../../services/api', () => ({
  urlService: {
    createShortUrl: vi.fn(),
  },
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('UrlShortenerForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    renderWithRouter(<UrlShortenerForm />);
    expect(screen.getByPlaceholderText(/Paste your long URL here/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Shorten/i })).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    renderWithRouter(<UrlShortenerForm />);
    const input = screen.getByPlaceholderText(/Paste your long URL here/i);
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    expect(input.value).toBe('https://example.com');
  });

  it('shows loading state during submission', async () => {
    urlService.createShortUrl.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    
    renderWithRouter(<UrlShortenerForm />);
    const input = screen.getByPlaceholderText(/Paste your long URL here/i);
    const button = screen.getByRole('button', { name: /Shorten/i });

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);

    expect(screen.getByText(/Shortening.../i)).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('displays shortened URL and QR code on success', async () => {
    const mockData = {
      shortUrl: 'http://localhost:8080/api/v1/abc12',
      shortCode: 'abc12',
    };
    urlService.createShortUrl.mockResolvedValue(mockData);

    renderWithRouter(<UrlShortenerForm />);
    const input = screen.getByPlaceholderText(/Paste your long URL here/i);
    const button = screen.getByRole('button', { name: /Shorten/i });

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Your temporary link is ready/i)).toBeInTheDocument();
      expect(screen.getByText('http://localhost:8080/api/v1/abc12')).toBeInTheDocument();
      expect(screen.getByText(/Scan QR Code/i)).toBeInTheDocument();
    });
  });

  it('displays error message on failure', async () => {
    urlService.createShortUrl.mockRejectedValueOnce({
      response: { data: { message: 'URL already exists' } },
    });

    renderWithRouter(<UrlShortenerForm />);
    const input = screen.getByPlaceholderText(/Paste your long URL here/i);
    const button = screen.getByRole('button', { name: /Shorten/i });

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/URL already exists/i)).toBeInTheDocument();
    });
  });

  it('copies short URL to clipboard and shows success state', async () => {
    // Mock clipboard API
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const mockData = {
      shortUrl: 'http://localhost:8080/api/v1/abc12',
      shortCode: 'abc12',
    };
    urlService.createShortUrl.mockResolvedValue(mockData);

    renderWithRouter(<UrlShortenerForm />);
    const input = screen.getByPlaceholderText(/Paste your long URL here/i);
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Shorten/i }));

    await waitFor(() => {
      const copyButton = screen.getByRole('button', { name: /Copy Link/i });
      fireEvent.click(copyButton);
    });

    expect(writeTextMock).toHaveBeenCalledWith('http://localhost:8080/api/v1/abc12');
    expect(screen.getByText(/Copied!/i)).toBeInTheDocument();
  });
});
