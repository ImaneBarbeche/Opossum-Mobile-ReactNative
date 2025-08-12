import * as listingService from '../services/listing.service';
import axios from 'axios';

jest.mock('axios');

describe('listing.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get filtered listings', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: { content: [{ id: '1' }] } } });
    const res = await listingService.getFilteredListings();
    expect(res[0].id).toBe('1');
  });

  it('should get user listings', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: { content: [{ id: '2' }] } } });
    const res = await listingService.getUserListings('token');
    expect(res[0].id).toBe('2');
  });

  it('should create a listing', async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { id: '3' } });
    const res = await listingService.createListing('token', { title: 'test', description: 'desc', type: 'LOST', category: 'other', location: { city: 'Paris' } }) as { id: string };
    expect(res.id).toBe('3');
  });

  it('should get listing details', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: { id: '4', title: 'Test' } } });
    const res = await listingService.getListingDetails('4', 'token');
    expect(res.id).toBe('4');
    expect(res.title).toBe('Test');
  });

  it('should update a listing', async () => {
    (axios.put as jest.Mock).mockResolvedValueOnce({ data: { data: { id: '5', title: 'new', updatedAt: '2025-07-31T12:00:00Z' } } });
    const res = await listingService.updateListing('5', 'token', { title: 'new' });
    expect(res.id).toBe('5');
    expect(res.updatedAt).toBeDefined();
  });

  it('should delete a listing', async () => {
    (axios.delete as jest.Mock).mockResolvedValueOnce({ data: { deleted: true } });
    const res = await listingService.deleteListing('6', 'token') as { deleted: boolean };
    expect(res.deleted).toBe(true);
  });
});