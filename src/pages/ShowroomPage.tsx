import React, { useState } from 'react';
import { MapPin, Clock, Phone, Mail, Award, CheckCircle, Calendar, Sparkles } from 'lucide-react';

interface ShowroomPageProps {
  onNavigate: (route: string) => void;
}

export const ShowroomPage: React.FC<ShowroomPageProps> = ({ onNavigate }) => {
  const [appointmentName, setAppointmentName] = useState('');
  const [appointmentPhone, setAppointmentPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('2026-10-15');
  const [appointmentTime, setAppointmentTime] = useState('14:00');
  const [interest, setInterest] = useState('audio');
  const [isBooked, setIsBooked] = useState(false);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentName.trim() || !appointmentPhone.trim()) return;
    setIsBooked(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
            Flagship Experience Center
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            The NovaPlug Accra Showroom
          </h1>
          <p className="text-sm sm:text-base text-white/60 leading-relaxed">
            Touch titanium hinges, test active noise cancellation in our acoustic silence chamber, and benchmark 140W GaN power delivery at One Airport Square.
          </p>
        </div>

        {/* Showroom Visual & Key Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-10">
          <div className="lg:col-span-7 relative aspect-[16/9] rounded-xl overflow-hidden bg-black">
            <img
              src="/src/assets/images/novaplug_campaign_hero_1791033727128.jpg"
              alt="NovaPlug Accra Showroom Experience"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <span className="font-mono text-xs text-amber-400 font-semibold bg-black/60 px-3 py-1 rounded backdrop-blur-md">
                One Airport Square · Ground Floor Suite 104
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-white">Location & Hours</h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-semibold block">Address</span>
                    <span className="text-white/60">
                      One Airport Square, Ground Floor Suite 104, Airport City, Accra, Ghana
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-semibold block">Opening Hours</span>
                    <span className="text-white/60 block">Monday – Saturday: 9:00 AM – 7:30 PM</span>
                    <span className="text-white/60 block">Sunday: 12:00 PM – 6:00 PM</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-semibold block">Concierge Desk</span>
                    <span className="text-white/60 font-mono">+233 (0) 30 298 4410</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
              <span className="font-semibold text-white block">Immediate Showroom Pickup:</span>
              <p className="text-white/50 leading-relaxed">
                Order online and choose "Showroom Pickup" at checkout to collect your sealed hardware within 2 hours.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Dedicated Experience Stations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#11131a] border border-white/5 space-y-3">
            <span className="font-mono text-xs text-amber-400 font-semibold block">STATION 01</span>
            <h4 className="text-base font-bold text-white">Acoustic Master Chamber</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Test NovaPulse Pro and NovaBuds Ultra against simulated traffic, jet aircraft cabin noise, and office chatter.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#11131a] border border-white/5 space-y-3">
            <span className="font-mono text-xs text-amber-400 font-semibold block">STATION 02</span>
            <h4 className="text-base font-bold text-white">140W GaN Charging Bench</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Bring your own MacBook Pro, iPad, or cinema camera to measure real-time wattage draw and thermal behavior.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#11131a] border border-white/5 space-y-3">
            <span className="font-mono text-xs text-amber-400 font-semibold block">STATION 03</span>
            <h4 className="text-base font-bold text-white">24-Month Warranty Lab</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Direct diagnostic center with genuine replacement units ready on-site for registered passport owners.
            </p>
          </div>
        </div>

        {/* Appointment Booking Form */}
        <div className="bg-[#11131a] border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-display font-bold text-white">Book a VIP Listening Session</h3>
            <p className="text-xs text-white/50">
              Enjoy a dedicated 30-minute private audio and hardware consultation with our technical specialists.
            </p>
          </div>

          {isBooked ? (
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Appointment Confirmed!</h4>
              <p className="text-xs text-white/70">
                We have reserved your session at One Airport Square on {appointmentDate} at {appointmentTime}. An SMS notification has been dispatched to {appointmentPhone}.
              </p>
              <button
                onClick={() => setIsBooked(false)}
                className="mt-2 text-xs text-amber-400 underline font-medium"
              >
                Schedule Another Visit
              </button>
            </div>
          ) : (
            <form onSubmit={handleBook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/60">Full Name *</label>
                  <input
                    type="text"
                    value={appointmentName}
                    onChange={(e) => setAppointmentName(e.target.value)}
                    placeholder="e.g. Ama Darko"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/60">Phone Number *</label>
                  <input
                    type="tel"
                    value={appointmentPhone}
                    onChange={(e) => setAppointmentPhone(e.target.value)}
                    placeholder="024 123 4567"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/60">Preferred Date</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/60">Preferred Time</label>
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="10:00" className="bg-[#11131a]">10:00 AM</option>
                    <option value="12:00" className="bg-[#11131a]">12:00 PM</option>
                    <option value="14:00" className="bg-[#11131a]">02:00 PM</option>
                    <option value="16:00" className="bg-[#11131a]">04:00 PM</option>
                    <option value="18:00" className="bg-[#11131a]">06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/60">Primary Hardware Interest</label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="audio" className="bg-[#11131a]">NovaPulse Pro ANC Headphones</option>
                  <option value="power" className="bg-[#11131a]">NovaCharge GaN Power Station</option>
                  <option value="creator" className="bg-[#11131a]">NovaAir Studio Wireless Mics</option>
                  <option value="passport" className="bg-[#11131a]">Warranty Passport Registration & Service</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-lg cursor-pointer"
              >
                Confirm VIP Appointment
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
