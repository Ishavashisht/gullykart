import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import FestivalInsightPage from '../FestivalInsightPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        trends: [
          {
            trend_id: 'trend_diwali_lehenga_cholis',
            trend_name: 'Diwali Dazzle: Lehengas Reimagined',
            context:
              'Elevate your Diwali celebrations with exquisitely crafted lehengas and cholis featuring modern twists on traditional embroidery and bold color palettes.',
            suggestion_keyword: 'diwali',
          },
          {
            trend_id: 'trend_eid_festive_kurta',
            trend_name: 'Eid Elegance: Festive Kurtas',
            context:
              'Make a statement this Eid with meticulously crafted kurtas in luxurious fabrics and intricate detailing perfect for celebrations and gatherings.',
            suggestion_keyword: 'eid',
          },
        ],
      }),
  })
) as jest.Mock;

describe('FestivalInsightPage', () => {
  test('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/festival/diwali']}>
        <Routes>
          <Route path="/festival/:festival" element={<FestivalInsightPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading festival insights/i)).toBeInTheDocument();
  });

  test('renders festival insights for diwali', async () => {
    render(
      <MemoryRouter initialEntries={['/festival/diwali']}>
        <Routes>
          <Route path="/festival/:festival" element={<FestivalInsightPage />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Diwali Dazzle: Lehengas Reimagined/i)).toBeInTheDocument();
    });
  });

  test('renders festival not found for unknown festival', async () => {
    render(
      <MemoryRouter initialEntries={['/festival/unknown']}>
        <Routes>
          <Route path="/festival/:festival" element={<FestivalInsightPage />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Festival not found/i)).toBeInTheDocument();
    });
  });
});
