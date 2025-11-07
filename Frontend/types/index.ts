
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  BANK_TRANSFER = "bank_transfer",
  CASH = "cash",
}


export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string; 
  gender?: Gender;
  verified: boolean;
  avatar?: string;
  createdAt?: string; 
  updatedAt?: string; 
}

export interface Hotel {
  id: number;
  name: string;
  address?: string;
  starRating?: number;
  description?: string;
  image?: string;
}


export interface Room {
  id: number;
  hotel: Hotel;
  roomNumber: string;
  roomType?: string;
  price: number;
  maxAdults: number;
  maxChildren: number;
  description?: string;
  available: boolean;
}


export interface Booking {
  id: number;
  user: User;
  room: Room;
  checkInDate: string; 
  checkOutDate: string; 
  numAdults: number;
  numChildren: number;
  totalPrice: number;
  bookingStatus: BookingStatus | string;
  createdAt: string; 
}

export interface Payment {
  id: number;
  booking: Booking;
  paymentMethod: PaymentMethod | string;
  cardNumber?: string;
  amount: number;
  paymentStatus: PaymentStatus | string;
  paymentDate?: string; 
}

export interface Review {
  id: number;
  user: User;
  room: Room;
  booking?: Booking;
  rating?: number;
  comment?: string;
  createdAt: string;
}


export interface RoomImage {
  id: number;
  room: Room;
  imageUrl: string;
  primaryImage: boolean;
}


export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string; 
  gender?: Gender;
}


export interface LoginRequest {
  email: string;
  password: string;
}


export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  purpose?: string;
}


export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface RoomSearchRequest {
  keyword?: string;
  hotelId?: number;
  roomType?: string;
  minPrice?: number;
  maxPrice?: number;
  maxAdults?: number;
  maxChildren?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number; 
  email: string;
  firstName: string;
  lastName: string;
}

export interface HotelResponse {
  id: number;
  name: string;
  address?: string;
  starRating?: number;
  description?: string;
  image?: string;
  availableRoomsCount?: number;
  startingPrice?: number;
}

export interface HotelInfo {
  id: number;
  name: string;
  address?: string;
  starRating?: number;
  image?: string;
}

export interface RoomImageInfo {
  id: number;
  imageUrl: string;
  primaryImage: boolean;
}

export interface RoomResponse {
  id: number;
  roomNumber: string;
  roomType?: string;
  price: number;
  maxAdults: number;
  maxChildren: number;
  description?: string;
  available: boolean;
  hotel: HotelInfo;
  images: RoomImageInfo[];
  averageRating?: number;
  reviewCount?: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number; 
  size: number;
  totalElements: number;
  totalPages: number; 
  first: boolean; 
  last: boolean; 
}

export interface ApiResponse<T> {
  status: number;
  code: number;
  data: T;
  message: string;
}
