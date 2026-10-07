// Common types for ATELIER & ACADÉMIE

export type UserRole = 'CUSTOMER' | 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  roles: UserRole[];
  bio?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  userId?: string;
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  season: string;
  description: string;
  bannerImage: string;
  isFeatured: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Custom';
  color: string;
  colorHex?: string;
  price: number;
  stock: number;
  reservedStock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  details: string[];
  fabricCare: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  collectionId?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  images: string[];
  videoUrl?: string;
  variants: ProductVariant[];
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  product: {
    name: string;
    slug: string;
    image: string;
    price: number;
  };
  variant: {
    sku: string;
    size: string;
    color: string;
    price: number;
  };
  quantity: number;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  sku: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  note: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentId?: string;
  paymentMethod: string;
  trackingNumber?: string;
  timeline: OrderTimeline[];
  createdAt: string;
}

// ACADEMY TYPES
export interface LessonResource {
  id: string;
  title: string;
  url: string;
  fileSize?: string;
  type: 'pdf' | 'pattern' | 'video' | 'sheet';
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  slug: string;
  durationMinutes: number;
  videoUrl?: string;
  summary: string;
  contentMarkdown: string;
  order: number;
  isFreePreview: boolean;
  resources: LessonResource[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Masterclass';
  durationHours: number;
  price: number;
  thumbnail: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  learningOutcomes: string[];
  prerequisites: string[];
  modules: CourseModule[];
  enrolledCount: number;
  rating: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
  enrolledAt: string;
  progressPercent: number;
  lastLessonId?: string;
  isCompleted: boolean;
  completedAt?: string;
  certificateId?: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt: string;
}

export interface ClassSession {
  id: string;
  courseId?: string;
  instructorId: string;
  instructorName: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  enrolledCount: number;
  isOnline: boolean;
  location: string;
  meetingUrl?: string;
  price: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  enrolledUserIds: string[];
}

// TUTORING & MENTORSHIP
export interface Instructor {
  id: string;
  userId: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  specialties: string[];
  hourlyRate: number;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  studioLocation: string;
}

export interface TimeSlot {
  id: string;
  instructorId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isBooked: boolean;
}

export interface TutoringBooking {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  instructorId: string;
  instructorName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  topic: string;
  notes?: string;
  price: number;
  meetingUrl: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  paymentId?: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  certificateCode: string;
  userId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  instructorTitle: string;
  issueDate: string;
  grade: 'Distinction' | 'Merit' | 'Passed';
  verificationUrl: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId?: string;
  courseId?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ORDER' | 'ENROLLMENT' | 'CLASS' | 'TUTORING' | 'CERTIFICATE' | 'SYSTEM';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: 'ORDER' | 'PRODUCT' | 'COURSE' | 'BOOKING' | 'INVENTORY';
  entityId: string;
  changes: Record<string, any>;
  timestamp: string;
}

export interface DashboardData {
  role: UserRole;
  orders: Order[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  bookings: TutoringBooking[];
  courses: Course[];
  classes: ClassSession[];
  notifications: Notification[];
  metrics: { totalRevenue: number; totalOrders: number; lowStockCount: number; totalStudents: number; totalEnrollments: number; upcomingClassesCount: number; activeBookingsCount: number } | null;
  instructor: Instructor | null;
}
