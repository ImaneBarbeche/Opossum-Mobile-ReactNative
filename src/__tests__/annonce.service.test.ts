import * as annonceService from '../services/annonce.service';

jest.mock('axios');
const axios = require('axios');

describe('annonce.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get filtered listings', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: { content: [{ id: '1' }] } } });
    const res = await annonceService.getFilteredListings();
    expect(res[0].id).toBe('1');
  });

  it('should get my listings', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: '2' }] });
    const res = await annonceService.getMyListings('token');
    expect(res[0].id).toBe('2');
  });

  it('should create a listing', async () => {
    axios.post.mockResolvedValueOnce({ data: { id: '3' } });
    const res = await annonceService.createListing('token', { title: 'test', description: 'desc', isLost: false, userId: 'user1' });
    expect(res.id).toBe('3');
  });

  it('should get listing details', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: { id: '4' } } });
    const res = await annonceService.getListingDetails('4', 'token');
    expect(res.id).toBe('4');
  });

  it('should update a listing', async () => {
    axios.put.mockResolvedValueOnce({ data: { updated: true } });
    const res = await annonceService.updateListing('5', 'token', { title: 'new' });
    expect(res.updated).toBe(true);
  });

  it('should delete a listing', async () => {
    axios.delete.mockResolvedValueOnce({ data: { deleted: true } });
    const res = await annonceService.deleteListing('6', 'token');
    expect(res.deleted).toBe(true);
  });

  it('should search listings', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: { content: [{ id: '7' }] } } });
    const res = await annonceService.searchListings();
    expect(res[0].id).toBe('7');
  });
});
