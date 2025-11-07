import { apiClient } from './api';
import type {
  RoomResponse,
  RoomSearchRequest,
  PageResponse,
  ApiResponse,
} from '@/types';

class RoomService {
  private api = apiClient.instance;

  async searchRooms(params: RoomSearchRequest): Promise<PageResponse<RoomResponse>> {
    const response = await this.api.get<ApiResponse<PageResponse<RoomResponse>>>('/rooms/search', {
      params,
    });
    return response.data.data;
  }

  async getRoomById(id: number): Promise<RoomResponse> {
    const response = await this.api.get<ApiResponse<RoomResponse>>(`/rooms/${id}`);
    return response.data.data;
  }
}

export const roomService = new RoomService();


