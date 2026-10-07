# Database Architecture & Entity Models

## 1. Schema Entities

```
User (id, email, passwordHash, name, avatar, roles: Role[], createdAt)
Address (id, userId, street, city, state, country, postalCode, isDefault)
Product (id, slug, name, description, price, compareAtPrice, categoryId, collectionId, isPublished, images[], metadata)
ProductVariant (id, productId, sku, title, size, color, priceAdjustment, stock, reservedStock)
Category (id, slug, name, description, image)
Collection (id, slug, name, season, description, bannerImage, isFeatured)
Cart (id, userId?, items: CartItem[], expiresAt)
CartItem (variantId, quantity, unitPrice)
Order (id, orderNumber, userId?, items: OrderItem[], subtotal, tax, shipping, total, status: OrderStatus, shippingAddress, paymentId, createdAt)
OrderItem (productId, variantId, title, size, color, quantity, unitPrice)
Payment (id, reference, provider, amount, currency, status, orderId?, courseId?, bookingId?, metadata, createdAt)
Course (id, slug, title, subtitle, description, level, durationHours, price, thumbnail, instructorId, isPublished)
CourseModule (id, courseId, title, order)
Lesson (id, moduleId, title, durationMinutes, videoUrl, contentMarkdown, order, resources: Resource[])
Enrollment (id, userId, courseId, enrolledAt, progressPercent, isCompleted, certificateId?)
LessonProgress (id, userId, lessonId, isCompleted, completedAt)
Instructor (id, userId, bio, specialties[], hourlyRate, rating, studioLocation)
ClassSession (id, courseId?, instructorId, title, date, startTime, endTime, capacity, enrolledCount, isOnline, meetingUrl, location)
TutoringAvailability (id, instructorId, dayOfWeek, startTime, endTime, isBlocked)
TutoringBooking (id, studentId, instructorId, date, startTime, endTime, durationMinutes, price, status, meetingUrl, notes, paymentId)
Certificate (id, certificateCode, userId, courseId, instructorId, issueDate, grade)
Review (id, userId, productId?, courseId?, rating, comment, createdAt)
Notification (id, userId, type, title, message, isRead, createdAt)
AuditLog (id, actorId, action, entityType, entityId, changes, timestamp)
```

## 2. Integrity & Concurrency Rules
- **Inventory Reservation**: `availableStock = stock - reservedStock`. An order atomically reserves quantity before payment handoff. If payment fails or expires within 30 minutes, stock reservation reverts.
- **Tutoring Double-Booking Prevention**: When creating a booking, a transactional lock checks for overlapping reservations for that instructor.
- **Content Entitlement**: Lessons marked premium strictly require an active `Enrollment` record matching `userId` and `courseId`.
