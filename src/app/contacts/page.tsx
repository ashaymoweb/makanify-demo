"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { ApiError, createContact, getContacts } from "@/lib/api";
import type { Contact, ContactGender } from "@/lib/types";

function formatPhone(phone?: Contact["phone"]) {
  if (!phone?.length) return "—";
  const primary = phone.find((p) => p.isPrimary) ?? phone[0];
  return `+${primary.countryCode} ${primary.number}`;
}

function formatName(contact: Contact) {
  return [contact.firstName, contact.lastName].filter(Boolean).join(" ");
}

function formatCell(value?: string) {
  return value?.trim() || "—";
}

function AddContactModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [workPhoneNumber, setWorkPhoneNumber] = useState("");
  const [gender, setGender] = useState<ContactGender>("Male");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPinCode("");
      setAddressLine1("");
      setAddressLine2("");
      setCompanyName("");
      setWorkEmail("");
      setWorkPhoneNumber("");
      setGender("Male");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Enter a valid 10-digit phone number.");
      setLoading(false);
      return;
    }

    try {
      await createContact({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        email: email.trim() || undefined,
        phone: [{ countryCode: 91, number: Number(digits), isPrimary: true }],
        pinCode: Number(pinCode),
        gender,
        addressLine1: addressLine1.trim() || undefined,
        addressLine2: addressLine2.trim() || undefined,
        companyName: companyName.trim() || undefined,
        workEmail: workEmail.trim() || undefined,
        workPhoneNumber: workPhoneNumber.trim() || undefined,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create contact.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Add Contact</h2>
        <p className="mt-1 text-sm text-muted">
          Creates a contact via POST /contact
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">First name *</label>
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Last name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Phone (10 digits) *</label>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">PIN code *</label>
            <input
              required
              maxLength={6}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
              placeholder="380001"
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Gender</legend>
            <div className="flex flex-wrap gap-4">
              {(["Male", "Female", "Other"] as const).map((value) => (
                <label
                  key={value}
                  htmlFor={`contact-gender-${value.toLowerCase()}`}
                  className="inline-flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    id={`contact-gender-${value.toLowerCase()}`}
                    type="radio"
                    name="contact-gender"
                    value={value}
                    checked={gender === value}
                    onChange={() => setGender(value)}
                    className="h-4 w-4 accent-brand"
                  />
                  {value}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-1">
            <label className="text-sm font-medium">Address line 1</label>
            <textarea
              rows={2}
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="Street, building, area"
              className="w-full resize-none rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Address line 2</label>
            <textarea
              rows={2}
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Landmark, suite, floor (optional)"
              className="w-full resize-none rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Company name</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Realty"
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Work email</label>
              <input
                type="email"
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                placeholder="work@company.com"
                className="w-full rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Work phone number</label>
              <input
                value={workPhoneNumber}
                onChange={(e) => setWorkPhoneNumber(e.target.value)}
                placeholder="9876543210"
                className="w-full rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-background"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
            >
              {loading ? "Saving…" : "Save Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ContactsContent() {
  const { user, logout } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getContacts({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
      });
      setContacts(data.results);
      setTotalPages(data.totalPages);
      setTotalResults(data.totalResults);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load contacts.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Logo size={40} />
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted sm:inline">
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={logout}
              className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-background"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[90rem] px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Contacts</h1>
            <p className="text-sm text-muted">
              {totalResults} contact{totalResults !== 1 ? "s" : ""} from the API
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="search"
              placeholder="Search contacts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm sm:w-64"
            />
            <button
              onClick={() => setShowAdd(true)}
              className="shrink-0 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
            >
              Add Contact
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={loadContacts}
                className="mt-4 text-sm text-brand hover:underline"
              >
                Retry
              </button>
            </div>
          ) : contacts.length === 0 ? (
            <p className="px-6 py-12 text-center text-muted">No contacts found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-background text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Gender</th>
                    <th className="px-4 py-3 font-medium">Address line 1</th>
                    <th className="px-4 py-3 font-medium">Address line 2</th>
                    <th className="px-4 py-3 font-medium">Company</th>
                    <th className="px-4 py-3 font-medium">Work email</th>
                    <th className="px-4 py-3 font-medium">Work phone</th>
                    <th className="px-4 py-3 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="border-b border-border last:border-0 hover:bg-background/60"
                    >
                      <td className="px-4 py-3 font-medium">{formatName(contact)}</td>
                      <td className="px-4 py-3 text-muted">{formatCell(contact.email)}</td>
                      <td className="px-4 py-3 text-muted">{formatPhone(contact.phone)}</td>
                      <td className="px-4 py-3 text-muted">{formatCell(contact.gender)}</td>
                      <td className="max-w-[12rem] px-4 py-3 text-muted">
                        <span className="line-clamp-2">{formatCell(contact.addressLine1)}</span>
                      </td>
                      <td className="max-w-[12rem] px-4 py-3 text-muted">
                        <span className="line-clamp-2">{formatCell(contact.addressLine2)}</span>
                      </td>
                      <td className="px-4 py-3 text-muted">{formatCell(contact.companyName)}</td>
                      <td className="px-4 py-3 text-muted">{formatCell(contact.workEmail)}</td>
                      <td className="px-4 py-3 text-muted">
                        {formatCell(contact.workPhoneNumber)}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {contact.updatedAt
                          ? new Date(contact.updatedAt).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-muted">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <AddContactModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={loadContacts}
      />
    </div>
  );
}

export default function ContactsPage() {
  return (
    <AuthGuard>
      <ContactsContent />
    </AuthGuard>
  );
}
