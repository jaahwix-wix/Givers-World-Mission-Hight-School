/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Navigation, 
  Bus,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { SCHOOL_INFO } from '../../../initialData';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Admission Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSent(true);
  };

  return (
    <div className="space-y-12 pb-10" id="website-contact-page">
      {/* Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold">
            Contact & Location Center
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Connect With Our Campus in Kambia 1
          </h1>
          <p className="text-base text-slate-300 leading-relaxed font-normal">
            Whether inquiring about pupil admission, college diploma matriculation, verification of examination records, or school bus stops, we are here to assist you.
          </p>
        </div>
      </section>

      {/* Campus Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900">Campus Address</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Givers World Mission Diplomats Academy & College</strong><br />
            Kambia 1, Northern Province,<br />
            Sierra Leone, West Africa
          </p>
          <p className="text-[11px] text-slate-400">
            Landmark: Near Kambia 1 Central Corridor & Administrative Ward
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900">Phone & SMS Inquiries</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Registrar & Bursary:</strong> {SCHOOL_INFO.phone}<br />
            <strong>Admissions Desk:</strong> +232 76 554 100<br />
            <strong>College Division:</strong> +232 78 889 012
          </p>
          <p className="text-[11px] text-slate-400">
            SMS assistance available 24/7 on Orange, Africell, and QCell
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900">Operational Hours</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Monday – Friday:</strong> 7:30 AM – 4:30 PM<br />
            <strong>Saturday (College Lectures):</strong> 8:30 AM – 3:00 PM<br />
            <strong>Sunday:</strong> Closed for Christian Worship
          </p>
          <p className="text-[11px] text-slate-400">
            Emergency inquiries can be directed to the Principal's office
          </p>
        </div>
      </section>

      {/* Interactive Contact Form + Map/Directions Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h3 className="text-xl font-black text-slate-900 mb-1">
            Send an Official Message to Campus Administration
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Your inquiry will be logged in the management desk and replied to promptly.
          </p>

          {sent ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-black text-emerald-950">
                Message Successfully Sent!
              </h4>
              <p className="text-xs text-slate-600">
                Thank you, <strong>{name}</strong>. The Kambia 1 admissions desk will respond via phone call or SMS at <strong>{phone}</strong> shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setMessage('');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Sesay"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number (SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 076 000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Admission Inquiry">Student / Pupil Admission</option>
                  <option value="College Programs">College Division Diplomas</option>
                  <option value="Tuition Fees">Tuition Fees & Installments</option>
                  <option value="School Bus Routes">School Bus Route Request</option>
                  <option value="Exam Center Records">WAEC / NPSE / BECE Record Verification</option>
                  <option value="General Inquiry">General School Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message Details
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your questions or notes here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Transmit Message to Kambia 1 Desk</span>
              </button>
            </form>
          )}
        </section>

        {/* Directions & Bus Stops */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Navigation className="w-5 h-5" />
              </span>
              <h3 className="text-base font-black text-slate-900">
                Getting to Campus in Kambia 1
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kambia 1 is the vibrant administrative and commercial heart of Kambia District, Northern Province, Sierra Leone.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>From Freetown / Port Loko:</strong> Take the main northern highway directly into Kambia 1. Our campus gates are situated within a 3-minute drive from the main roundabout.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Bus className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>School Bus Pick-up Points:</strong> Morning buses run starting at 6:45 AM from Kambia 2, customs border route, and major community junctions.
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 font-medium">
              Visitors are requested to check in with campus security at the main gate upon arrival.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
