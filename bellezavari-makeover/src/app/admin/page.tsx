'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  ChevronLeft, 
  ChevronRight,
  Check,
  AlertCircle,
  DollarSign,
  Eye,
  X
} from 'lucide-react';
import { Booking } from '@/types';
import { formatPrice, formatTime, formatDate, formatDuration } from '@/lib/utils';
import { services } from '@/data/services';

// Mock bookings for demo (in production, fetch from Firestore)
const mockBookings: Booking[] = [
  {
    id: '1',
    serviceId: 'knotless-braids-medium',
    serviceName: 'Medium Knotless Braids',
    startTime: new Date(Date.now() + 86400000), // Tomorrow
    endTime: new Date(Date.now() + 86400000 + 6 * 3600000),
    client: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@email.com',
      phone: '07700 900123',
      notes: 'First time client, referred by Instagram',
    },
    extras: [{ extraId: 'hair-provided', name: 'Hair Provided', price: 40 }],
    subtotal: 220,
    extrasTotal: 40,
    depositAmount: 80,
    totalPaid: 80,
    balanceDue: 180,
    paymentReference: 'PAY_abc123',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
    policyAcknowledged: true,
  },
  {
    id: '2',
    serviceId: 'butterfly-locs',
    serviceName: 'Butterfly Locs',
    startTime: new Date(Date.now() + 172800000), // Day after tomorrow
    endTime: new Date(Date.now() + 172800000 + 7 * 3600000),
    client: {
      firstName: 'Michelle',
      lastName: 'Williams',
      email: 'michelle.w@email.com',
      phone: '07700 900456',
    },
    extras: [
      { extraId: 'home-service', name: 'Home Service', price: 50 },
      { extraId: 'takedown', name: 'Takedown Service', price: 30 },
    ],
    subtotal: 260,
    extrasTotal: 80,
    depositAmount: 100,
    totalPaid: 100,
    balanceDue: 240,
    paymentReference: 'PAY_def456',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
    policyAcknowledged: true,
  },
  {
    id: '3',
    serviceId: 'silk-press',
    serviceName: 'Silk Press',
    startTime: new Date(Date.now() + 259200000), // 3 days from now
    endTime: new Date(Date.now() + 259200000 + 2.5 * 3600000),
    client: {
      firstName: 'Amara',
      lastName: 'Okafor',
      email: 'amara.o@email.com',
      phone: '07700 900789',
      notes: 'Regular client',
    },
    extras: [],
    subtotal: 90,
    extrasTotal: 0,
    depositAmount: 40,
    totalPaid: 40,
    balanceDue: 50,
    paymentReference: 'PAY_ghi789',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    createdAt: new Date(Date.now() - 43200000),
    updatedAt: new Date(Date.now() - 43200000),
    policyAcknowledged: true,
  },
];

type ViewMode = 'day' | 'week';

export default function AdminPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Get the start of the week (Monday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentDate);
  
  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  // Filter bookings for current view
  const getBookingsForDate = (date: Date) => {
    return mockBookings.filter(booking => {
      const bookingDate = new Date(booking.startTime);
      return (
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-8 bg-cream">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl text-secondary mb-2">
                Schedule
              </h1>
              <p className="text-charcoal/60">
                View and manage your appointments
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  viewMode === 'day'
                    ? 'bg-primary text-white'
                    : 'text-charcoal hover:bg-cream'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  viewMode === 'week'
                    ? 'bg-primary text-white'
                    : 'text-charcoal hover:bg-cream'
                }`}
              >
                Week
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-4 bg-white border-b border-cream-dark sticky top-[72px] z-30">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('prev')}
                className="p-2 hover:bg-cream rounded transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => navigate('next')}
                className="p-2 hover:bg-cream rounded transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded hover:bg-primary/5 transition-colors"
              >
                Today
              </button>
            </div>

            <h2 className="font-display text-xl text-secondary">
              {viewMode === 'week'
                ? `${weekDays[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${weekDays[6].toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                : formatDate(currentDate)
              }
            </h2>

            <div className="text-sm text-charcoal/60">
              {mockBookings.length} bookings total
            </div>
          </div>
        </div>
      </section>

      {/* Schedule View */}
      <section className="section bg-cream-dark/30 min-h-[60vh]">
        <div className="container">
          {viewMode === 'week' ? (
            // Week View
            <div className="grid grid-cols-7 gap-3">
              {weekDays.map((date) => {
                const dayBookings = getBookingsForDate(date);
                const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });
                const dayNum = date.getDate();

                return (
                  <div
                    key={date.toISOString()}
                    className={`bg-white rounded-lg overflow-hidden ${
                      isToday(date) ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    {/* Day Header */}
                    <div className={`p-3 text-center border-b border-cream-dark ${
                      isToday(date) ? 'bg-primary text-white' : 'bg-cream/50'
                    }`}>
                      <div className="text-xs uppercase tracking-wider opacity-70">
                        {dayName}
                      </div>
                      <div className="text-2xl font-display">
                        {dayNum}
                      </div>
                    </div>

                    {/* Bookings */}
                    <div className="p-2 min-h-[200px] space-y-2">
                      {dayBookings.length > 0 ? (
                        dayBookings.map((booking) => (
                          <motion.button
                            key={booking.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedBooking(booking)}
                            className="w-full text-left p-2 bg-primary/10 rounded border-l-4 border-primary hover:bg-primary/20 transition-colors"
                          >
                            <div className="text-xs text-primary font-medium">
                              {formatTime(
                                `${new Date(booking.startTime).getHours()}:${new Date(booking.startTime).getMinutes().toString().padStart(2, '0')}`
                              )}
                            </div>
                            <div className="text-sm font-medium text-secondary truncate">
                              {booking.serviceName}
                            </div>
                            <div className="text-xs text-charcoal/60 truncate">
                              {booking.client.firstName} {booking.client.lastName}
                            </div>
                          </motion.button>
                        ))
                      ) : (
                        <div className="h-full flex items-center justify-center text-charcoal/30 text-sm">
                          No bookings
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Day View
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="p-4 border-b border-cream-dark bg-cream/30">
                <h3 className="font-display text-xl text-secondary">
                  {formatDate(currentDate)}
                </h3>
              </div>
              <div className="divide-y divide-cream-dark">
                {getBookingsForDate(currentDate).length > 0 ? (
                  getBookingsForDate(currentDate).map((booking) => (
                    <BookingRow
                      key={booking.id}
                      booking={booking}
                      onClick={() => setSelectedBooking(booking)}
                    />
                  ))
                ) : (
                  <div className="p-12 text-center text-charcoal/50">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No bookings for this day</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  );
}

function BookingRow({ booking, onClick }: { booking: Booking; onClick: () => void }) {
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  const service = services.find(s => s.id === booking.serviceId);

  return (
    <div
      onClick={onClick}
      className="p-4 hover:bg-cream/30 cursor-pointer transition-colors"
    >
      <div className="flex items-start gap-4">
        {/* Time */}
        <div className="w-24 flex-shrink-0">
          <div className="text-lg font-display text-primary">
            {formatTime(`${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')}`)}
          </div>
          <div className="text-xs text-charcoal/50">
            to {formatTime(`${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}`)}
          </div>
        </div>

        {/* Service Info */}
        <div className="flex-1">
          <h4 className="font-display text-lg text-secondary">
            {booking.serviceName}
          </h4>
          <div className="flex items-center gap-4 text-sm text-charcoal/60 mt-1">
            <span className="flex items-center gap-1">
              <User size={14} />
              {booking.client.firstName} {booking.client.lastName}
            </span>
            {service && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatDuration(service.durationMinutes)}
              </span>
            )}
          </div>
          {booking.extras.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {booking.extras.map((extra) => (
                <span key={extra.extraId} className="badge badge-accent text-xs">
                  {extra.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Payment Status */}
        <div className="text-right">
          <div className="flex items-center gap-1 text-success text-sm">
            <Check size={14} />
            Deposit Paid
          </div>
          <div className="text-lg font-semibold text-secondary mt-1">
            {formatPrice(booking.totalPaid)}
          </div>
          <div className="text-xs text-charcoal/50">
            Balance: {formatPrice(booking.balanceDue)}
          </div>
        </div>

        {/* View Button */}
        <button className="p-2 hover:bg-cream rounded transition-colors">
          <Eye size={18} className="text-charcoal/50" />
        </button>
      </div>
    </div>
  );
}

function BookingDetailModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-charcoal/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-cream-dark flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl text-secondary">
              {booking.serviceName}
            </h2>
            <p className="text-charcoal/60">
              Booking #{booking.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date & Time */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Calendar size={18} className="text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-secondary">Date & Time</h4>
              <p className="text-charcoal/70">
                {formatDate(startTime)}
                <br />
                {formatTime(`${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')}`)} - {formatTime(`${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}`)}
              </p>
            </div>
          </div>

          {/* Client Details */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-secondary">Client</h4>
              <p className="text-charcoal/70">
                {booking.client.firstName} {booking.client.lastName}
              </p>
              <div className="flex items-center gap-2 mt-1 text-sm text-charcoal/60">
                <Mail size={14} />
                <a href={`mailto:${booking.client.email}`} className="hover:text-primary">
                  {booking.client.email}
                </a>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-charcoal/60">
                <Phone size={14} />
                <a href={`tel:${booking.client.phone}`} className="hover:text-primary">
                  {booking.client.phone}
                </a>
              </div>
              {booking.client.notes && (
                <p className="mt-2 text-sm text-charcoal/60 bg-cream/50 p-2 rounded">
                  <strong>Notes:</strong> {booking.client.notes}
                </p>
              )}
            </div>
          </div>

          {/* Extras */}
          {booking.extras.length > 0 && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={18} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-secondary">Extras</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {booking.extras.map((extra) => (
                    <span key={extra.extraId} className="badge badge-accent">
                      {extra.name} (+{formatPrice(extra.price)})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
              <DollarSign size={18} className="text-success" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-secondary">Payment</h4>
              <div className="mt-2 bg-cream/50 rounded p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Service</span>
                  <span>{formatPrice(booking.subtotal)}</span>
                </div>
                {booking.extrasTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Extras</span>
                    <span>{formatPrice(booking.extrasTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-cream-dark pt-2">
                  <span className="text-charcoal/60">Total</span>
                  <span className="font-semibold">{formatPrice(booking.subtotal + booking.extrasTotal)}</span>
                </div>
                <div className="flex justify-between text-success">
                  <span>Deposit Paid</span>
                  <span className="font-semibold">{formatPrice(booking.totalPaid)}</span>
                </div>
                <div className="flex justify-between text-primary font-semibold">
                  <span>Balance Due</span>
                  <span>{formatPrice(booking.balanceDue)}</span>
                </div>
              </div>
              <p className="text-xs text-charcoal/50 mt-2">
                Ref: {booking.paymentReference}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-cream-dark bg-cream/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${
                booking.bookingStatus === 'confirmed' ? 'bg-success' :
                booking.bookingStatus === 'completed' ? 'bg-charcoal' :
                booking.bookingStatus === 'cancelled' ? 'bg-error' :
                'bg-warning'
              }`} />
              <span className="capitalize text-charcoal/70">{booking.bookingStatus}</span>
            </div>
            <button
              onClick={onClose}
              className="btn btn-primary py-2 px-4 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
