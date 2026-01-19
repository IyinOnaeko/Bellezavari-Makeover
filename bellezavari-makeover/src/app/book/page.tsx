'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Clock, 
  Calendar,
  MapPin,
  User,
  CreditCard,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { services, globalExtras, getServiceById } from '@/data/services';
import { settings } from '@/data/settings';
import { Service, ServiceExtra, ClientDetails, Booking } from '@/types';
import { 
  formatPrice, 
  formatDuration, 
  formatTime, 
  formatDate,
  isValidEmail,
  isValidPhone,
  getMinBookingDate,
  getMaxBookingDate,
} from '@/lib/utils';
import { 
  getAvailableTimeSlots, 
  createDateTime, 
  calculateEndTime 
} from '@/lib/availability';

type BookingStep = 'service' | 'date' | 'time' | 'extras' | 'details' | 'review';

const steps: { key: BookingStep; label: string; icon: React.ElementType }[] = [
  { key: 'service', label: 'Service', icon: Sparkles },
  { key: 'date', label: 'Date', icon: Calendar },
  { key: 'time', label: 'Time', icon: Clock },
  { key: 'extras', label: 'Extras', icon: MapPin },
  { key: 'details', label: 'Details', icon: User },
  { key: 'review', label: 'Review', icon: CreditCard },
];

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Booking state
  const [currentStep, setCurrentStep] = useState<BookingStep>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<ServiceExtra[]>([]);
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [policyAcknowledged, setPolicyAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock bookings for availability (in production, fetch from Firestore)
  const [existingBookings] = useState<Booking[]>([]);

  // Pre-select service from URL param
  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (serviceId) {
      const service = getServiceById(serviceId);
      if (service) {
        setSelectedService(service);
        setCurrentStep('date');
      }
    }
  }, [searchParams]);

  // Calculate totals
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const servicePrice = selectedService?.price || 0;
  const depositAmount = selectedService?.depositAmount || 0;
  const totalPrice = servicePrice + extrasTotal;
  const balanceDue = totalPrice - depositAmount;

  // Get available time slots
  const availableTimeSlots = selectedService && selectedDate
    ? getAvailableTimeSlots(selectedService, selectedDate, existingBookings)
    : [];

  // Navigation
  const stepIndex = steps.findIndex(s => s.key === currentStep);
  
  const canGoNext = () => {
    switch (currentStep) {
      case 'service': return !!selectedService;
      case 'date': return !!selectedDate;
      case 'time': return !!selectedTime;
      case 'extras': return true; // Extras are optional
      case 'details': return validateDetails();
      case 'review': return policyAcknowledged;
      default: return false;
    }
  };

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    
    if (!clientDetails.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!clientDetails.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!clientDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(clientDetails.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!clientDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(clientDetails.phone)) {
      newErrors.phone = 'Please enter a valid Canadian phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToStep = (step: BookingStep) => {
    const targetIndex = steps.findIndex(s => s.key === step);
    if (targetIndex <= stepIndex) {
      setCurrentStep(step);
    }
  };

  const goNext = () => {
    if (!canGoNext()) return;
    
    if (currentStep === 'details' && !validateDetails()) return;
    
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key);
    }
  };

  const goBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const handleSubmit = async () => {
    if (!policyAcknowledged || !selectedService || !selectedDate || !selectedTime) return;
    
    setIsSubmitting(true);
    
    try {
      // In production, this would:
      // 1. Create a pending booking in Firestore
      // 2. Initialize Paystack payment
      // 3. Redirect to Paystack checkout
      
      // For now, simulate payment flow
      const bookingData = {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        startTime: createDateTime(selectedDate, selectedTime),
        endTime: createDateTime(selectedDate, calculateEndTime(selectedTime, selectedService.durationMinutes)),
        client: clientDetails,
        extras: selectedExtras.map(e => ({ extraId: e.id, name: e.name, price: e.price })),
        subtotal: servicePrice,
        extrasTotal,
        depositAmount,
        totalPaid: depositAmount,
        balanceDue,
        policyAcknowledged: true,
      };

      console.log('Booking data:', bookingData);
      
      // Redirect to payment (mock for now)
      alert('In production, this would redirect to Paystack checkout.\n\nBooking Details:\n' + 
        `Service: ${selectedService.name}\n` +
        `Date: ${formatDate(selectedDate)}\n` +
        `Time: ${formatTime(selectedTime)}\n` +
        `Deposit: ${formatPrice(depositAmount)}`
      );
      
      // router.push('/book/success?ref=xxx');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExtra = (extra: ServiceExtra) => {
    setSelectedExtras(prev => 
      prev.some(e => e.id === extra.id)
        ? prev.filter(e => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-8 bg-cream">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl text-secondary mb-4">
              Book Your <span className="italic text-primary">Appointment</span>
            </h1>
            <p className="text-charcoal/70">
              Secure your booking with a deposit. Select your service and preferred time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-6 bg-cream border-b border-cream-dark sticky top-[72px] z-30">
        <div className="container">
          <div className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const isActive = step.key === currentStep;
              const isCompleted = index < stepIndex;
              const Icon = step.icon;

              return (
                <button
                  key={step.key}
                  onClick={() => goToStep(step.key)}
                  disabled={index > stepIndex}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white'
                      : isCompleted
                      ? 'bg-primary/10 text-primary cursor-pointer'
                      : 'bg-cream-dark text-charcoal/40 cursor-not-allowed'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    isActive ? 'bg-white/20' : isCompleted ? 'bg-primary text-white' : 'bg-charcoal/10'
                  }`}>
                    {isCompleted ? <Check size={12} /> : <Icon size={12} />}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-white min-h-[60vh]">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {/* Step 1: Service Selection */}
              {currentStep === 'service' && (
                <StepContent key="service">
                  <h2 className="font-display text-2xl text-secondary mb-6">
                    Select Your Service
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.filter(s => s.isActive).map((service) => (
                      <ServiceOption
                        key={service.id}
                        service={service}
                        isSelected={selectedService?.id === service.id}
                        onSelect={() => setSelectedService(service)}
                      />
                    ))}
                  </div>
                </StepContent>
              )}

              {/* Step 2: Date Selection */}
              {currentStep === 'date' && (
                <StepContent key="date">
                  <h2 className="font-display text-2xl text-secondary mb-2">
                    Choose Your Date
                  </h2>
                  <p className="text-charcoal/60 mb-6">
                    Select a date for your {selectedService?.name} appointment.
                  </p>
                  <DatePicker
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    minDate={getMinBookingDate()}
                    maxDate={getMaxBookingDate()}
                  />
                </StepContent>
              )}

              {/* Step 3: Time Selection */}
              {currentStep === 'time' && (
                <StepContent key="time">
                  <h2 className="font-display text-2xl text-secondary mb-2">
                    Select Your Time
                  </h2>
                  <p className="text-charcoal/60 mb-6">
                    Available times for {selectedDate && formatDate(selectedDate)}
                  </p>
                  
                  {selectedService && (
                    <div className="bg-cream/50 p-4 rounded mb-6">
                      <div className="flex items-start gap-2 text-sm">
                        <AlertCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-secondary">Duration:</strong>{' '}
                          {formatDuration(selectedService.durationMinutes)}
                          <br />
                          <span className="text-charcoal/60">
                            Your appointment will end at the calculated time based on service duration.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {availableTimeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => slot.isAvailable && setSelectedTime(slot.time)}
                          disabled={!slot.isAvailable}
                          className={`p-4 rounded border-2 transition-all ${
                            selectedTime === slot.time
                              ? 'border-primary bg-primary/5 text-primary'
                              : slot.isAvailable
                              ? 'border-cream-dark hover:border-primary/50 text-charcoal'
                              : 'border-cream-dark bg-cream-dark/50 text-charcoal/30 cursor-not-allowed'
                          }`}
                        >
                          <span className="font-medium">{formatTime(slot.time)}</span>
                          {!slot.isAvailable && slot.reason && (
                            <span className="block text-xs mt-1">{slot.reason}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-charcoal/60">
                        No available times for this date. Please select another date.
                      </p>
                    </div>
                  )}
                </StepContent>
              )}

              {/* Step 4: Extras */}
              {currentStep === 'extras' && (
                <StepContent key="extras">
                  <h2 className="font-display text-2xl text-secondary mb-2">
                    Add Extras <span className="text-charcoal/40 text-lg">(Optional)</span>
                  </h2>
                  <p className="text-charcoal/60 mb-6">
                    Enhance your appointment with these add-on services.
                  </p>
                  
                  <div className="space-y-3">
                    {globalExtras.map((extra) => (
                      <ExtraOption
                        key={extra.id}
                        extra={extra}
                        isSelected={selectedExtras.some(e => e.id === extra.id)}
                        onToggle={() => toggleExtra(extra)}
                      />
                    ))}
                  </div>
                </StepContent>
              )}

              {/* Step 5: Client Details */}
              {currentStep === 'details' && (
                <StepContent key="details">
                  <h2 className="font-display text-2xl text-secondary mb-6">
                    Your Details
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">First Name *</label>
                      <input
                        type="text"
                        className={`input ${errors.firstName ? 'border-error' : ''}`}
                        value={clientDetails.firstName}
                        onChange={(e) => setClientDetails(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && <p className="text-error text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label className="label">Last Name *</label>
                      <input
                        type="text"
                        className={`input ${errors.lastName ? 'border-error' : ''}`}
                        value={clientDetails.lastName}
                        onChange={(e) => setClientDetails(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && <p className="text-error text-sm mt-1">{errors.lastName}</p>}
                    </div>
                    
                    <div>
                      <label className="label">Email *</label>
                      <input
                        type="email"
                        className={`input ${errors.email ? 'border-error' : ''}`}
                        value={clientDetails.email}
                        onChange={(e) => setClientDetails(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="label">Phone Number *</label>
                      <input
                        type="tel"
                        className={`input ${errors.phone ? 'border-error' : ''}`}
                        value={clientDetails.phone}
                        onChange={(e) => setClientDetails(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(416) 555-1234"
                      />
                      {errors.phone && <p className="text-error text-sm mt-1">{errors.phone}</p>}
                      <p className="text-xs text-charcoal/50 mt-1">Canadian phone number</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="label">Additional Notes (Optional)</label>
                      <textarea
                        className="input min-h-[100px]"
                        value={clientDetails.notes}
                        onChange={(e) => setClientDetails(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any special requests or information we should know?"
                      />
                    </div>
                  </div>
                </StepContent>
              )}

              {/* Step 6: Review */}
              {currentStep === 'review' && selectedService && selectedDate && selectedTime && (
                <StepContent key="review">
                  <h2 className="font-display text-2xl text-secondary mb-6">
                    Review Your Booking
                  </h2>
                  
                  <div className="bg-cream rounded-lg p-6 mb-6">
                    {/* Service */}
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-cream-dark">
                      <div>
                        <h3 className="font-display text-xl text-secondary">{selectedService.name}</h3>
                        <p className="text-charcoal/60 text-sm">{formatDuration(selectedService.durationMinutes)}</p>
                      </div>
                      <span className="font-semibold text-primary">{formatPrice(servicePrice)}</span>
                    </div>

                    {/* Date & Time */}
                    <div className="mb-4 pb-4 border-b border-cream-dark">
                      <div className="flex items-center gap-3 text-charcoal">
                        <Calendar size={18} className="text-primary" />
                        <span>{formatDate(selectedDate)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-charcoal mt-2">
                        <Clock size={18} className="text-primary" />
                        <span>
                          {formatTime(selectedTime)} - {formatTime(calculateEndTime(selectedTime, selectedService.durationMinutes))}
                        </span>
                      </div>
                    </div>

                    {/* Extras */}
                    {selectedExtras.length > 0 && (
                      <div className="mb-4 pb-4 border-b border-cream-dark">
                        <h4 className="text-sm font-medium text-charcoal mb-2">Extras</h4>
                        {selectedExtras.map((extra) => (
                          <div key={extra.id} className="flex justify-between text-sm text-charcoal/70">
                            <span>{extra.name}</span>
                            <span>{formatPrice(extra.price)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Client Details */}
                    <div className="mb-4 pb-4 border-b border-cream-dark">
                      <h4 className="text-sm font-medium text-charcoal mb-2">Your Details</h4>
                      <p className="text-sm text-charcoal/70">
                        {clientDetails.firstName} {clientDetails.lastName}<br />
                        {clientDetails.email}<br />
                        {clientDetails.phone}
                      </p>
                    </div>

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal/70">Subtotal</span>
                        <span>{formatPrice(servicePrice)}</span>
                      </div>
                      {extrasTotal > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-charcoal/70">Extras</span>
                          <span>{formatPrice(extrasTotal)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal/70">Total</span>
                        <span className="font-semibold">{formatPrice(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-cream-dark">
                        <span className="font-medium text-secondary">Deposit Due Now</span>
                        <span className="text-xl font-display text-primary">{formatPrice(depositAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-charcoal/60">
                        <span>Balance due at appointment</span>
                        <span>{formatPrice(balanceDue)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Policy Acknowledgment */}
                  <div className="bg-error/5 border border-error/20 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-secondary mb-1">Important: Non-Refundable Deposit</h4>
                        <p className="text-sm text-charcoal/70 mb-3">
                          Your deposit of <strong>{formatPrice(depositAmount)}</strong> is{' '}
                          <strong>non-refundable</strong>. By proceeding with payment, you acknowledge 
                          and accept our cancellation and deposit policies.
                        </p>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={policyAcknowledged}
                            onChange={(e) => setPolicyAcknowledged(e.target.checked)}
                            className="mt-1 w-4 h-4 accent-primary"
                          />
                          <span className="text-sm text-charcoal">
                            I understand and accept that my deposit is non-refundable and I have read the{' '}
                            <a href="/policies" target="_blank" className="text-primary underline">
                              booking policies
                            </a>.
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </StepContent>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-8 border-t border-cream-dark">
              <button
                onClick={goBack}
                disabled={stepIndex === 0}
                className={`btn btn-ghost ${stepIndex === 0 ? 'invisible' : ''}`}
              >
                <ArrowLeft size={18} />
                Back
              </button>

              {currentStep === 'review' ? (
                <button
                  onClick={handleSubmit}
                  disabled={!policyAcknowledged || isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Processing...' : `Pay Deposit ${formatPrice(depositAmount)}`}
                  {!isSubmitting && <CreditCard size={18} />}
                </button>
              ) : (
                <button
                  onClick={goNext}
                  disabled={!canGoNext()}
                  className="btn btn-primary"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Sub-components
function StepContent({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function ServiceOption({ 
  service, 
  isSelected, 
  onSelect 
}: { 
  service: Service; 
  isSelected: boolean; 
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`text-left p-4 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-cream-dark hover:border-primary/50'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-display text-lg text-secondary">{service.name}</h3>
        {isSelected && (
          <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Check size={14} className="text-white" />
          </span>
        )}
      </div>
      <p className="text-charcoal/60 text-sm mb-3 line-clamp-2">{service.description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-primary font-semibold">{formatPrice(service.price)}</span>
        <span className="text-charcoal/60 flex items-center gap-1">
          <Clock size={14} />
          {formatDuration(service.durationMinutes)}
        </span>
      </div>
    </button>
  );
}

function DatePicker({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
}: {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  minDate: Date;
  maxDate: Date;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    const dayOfWeek = date.getDay();
    const workingDay = settings.workingHours.find(wh => wh.dayOfWeek === dayOfWeek);
    
    // Check if it's a working day
    if (!workingDay || !workingDay.isOpen) return true;
    
    // Check if it's within allowed range
    if (date < minDate || date > maxDate) return true;
    
    // Check if it's an off day
    const dateStr = date.toISOString().split('T')[0];
    if (settings.offDays.includes(dateStr)) return true;
    
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-md mx-auto">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-2 hover:bg-cream rounded"
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="font-display text-xl text-secondary">{monthName}</h3>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-2 hover:bg-cream rounded"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-charcoal/60 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <div key={index} className="aspect-square">
            {date ? (
              <button
                onClick={() => !isDateDisabled(date) && onSelectDate(date)}
                disabled={isDateDisabled(date)}
                className={`w-full h-full rounded flex items-center justify-center text-sm transition-all ${
                  isDateSelected(date)
                    ? 'bg-primary text-white'
                    : isDateDisabled(date)
                    ? 'text-charcoal/20 cursor-not-allowed'
                    : 'hover:bg-primary/10 text-charcoal'
                }`}
              >
                {date.getDate()}
              </button>
            ) : (
              <div />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExtraOption({
  extra,
  isSelected,
  onToggle,
}: {
  extra: ServiceExtra;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-cream-dark hover:border-primary/50'
      }`}
    >
      <div className="flex items-center gap-4">
        <span className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
          isSelected ? 'bg-primary border-primary' : 'border-charcoal/30'
        }`}>
          {isSelected && <Check size={14} className="text-white" />}
        </span>
        <div>
          <h4 className="font-medium text-secondary">{extra.name}</h4>
          {extra.description && (
            <p className="text-sm text-charcoal/60">{extra.description}</p>
          )}
        </div>
      </div>
      <span className="font-semibold text-primary">+{formatPrice(extra.price)}</span>
    </button>
  );
}

// Main export with Suspense boundary
export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
