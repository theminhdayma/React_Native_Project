import { apiClient } from './api';
import type { HotelResponse, ApiResponse } from '@/types';

class HotelService {
  private api = apiClient.instance;

  async getBestHotels(limit: number = 5): Promise<HotelResponse[]> {
    const response = await this.api.get<ApiResponse<HotelResponse[]>>('/hotels/best', {
      params: { limit },
    });
    return response.data.data;
  }

  async getAllHotels(): Promise<HotelResponse[]> {
    const response = await this.api.get<ApiResponse<HotelResponse[]>>('/hotels');
    return response.data.data;
  }
}

export const hotelService = new HotelService();


