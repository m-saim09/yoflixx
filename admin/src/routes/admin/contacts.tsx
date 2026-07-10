import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Inbox, MessageCircle, CheckCheck, Mail, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell, Badge, Card, StatCard } from "@/components/admin/Shell";
import { apiRequest } from "@/lib/api";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "New" | "Read" | "Replied";
  createdAt: string;
};

type ContactsResponse = {
  data: {
    contacts: Contact[];
    total: number;
  };
};

export const Route = createFileRoute("/admin/contacts")({
  head: () => ({
    meta: [
      { title: "Contacts — Yoflix Admin" },
      { name: "description", content: "Manage incoming contact messages and conversations." },
    ],
  }),
  component: ContactsPage,
});

const statusTone: Record<Contact["status"], "primary" | "success" | "neutral"> = {
  New: "primary",
  Read: "neutral",
  Replied: "success",
};

function ContactsPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin/contacts"],
    queryFn: () => apiRequest<ContactsResponse>("/contacts"),
  });

  const contacts = data?.data.contacts ?? [];

  useEffect(() => {
    if (!selectedId && contacts.length) {
      setSelectedId(contacts[0]._id);
    }
  }, [contacts, selectedId]);

  const selected = contacts.find((contact) => contact._id === selectedId) ?? null;
  const filteredContacts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return contacts;
    return contacts.filter((contact) =>
      [contact.name, contact.email, contact.phone, contact.message].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }, [contacts, search]);

  const updateContact = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Contact["status"] }) =>
      apiRequest(`/contacts/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      toast.success("Contact status updated.");
      queryClient.invalidateQueries({ queryKey: ["admin/contacts"] });
    },
    onError: () => {
      toast.error("Unable to update contact status.");
    },
  });

  const deleteContact = useMutation({
    mutationFn: (id: string) => apiRequest(`/contacts/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      setSelectedId(null);
      toast.success("Contact deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin/contacts"] });
    },
    onError: () => {
      toast.error("Unable to delete contact.");
    },
  });

  const markStatus = (status: Contact["status"]) => {
    if (selected) {
      updateContact.mutate({ id: selected._id, status });
    }
  };

  const sendReply = () => {
    if (!selected || !reply.trim()) return;
    const mailto = `mailto:${selected.email}?subject=${encodeURIComponent("Re: Your Yoflix inquiry")}&body=${encodeURIComponent(reply.trim())}`;
    toast.success("Opening your mail app to send the reply.");
    window.location.href = mailto;
    updateContact.mutate({ id: selected._id, status: "Replied" });
    setReply("");
  };

  const unread = contacts.filter((contact) => contact.status === "New").length;
  const replied = contacts.filter((contact) => contact.status === "Replied").length;

  return (
    <AdminShell title="Contacts" description="Inbox of all contact messages.">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Messages"
          value={String(contacts.length)}
          icon={Inbox}
          accent="primary"
        />
        <StatCard label="Unread" value={String(unread)} icon={Mail} accent="warning" />
        <StatCard label="Replied" value={String(replied)} icon={CheckCheck} accent="success" />
        <StatCard label="Avg. Reply Time" value="Manual" icon={MessageCircle} accent="primary" />
      </div>

      <Card className="mt-4 p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] min-h-[560px]">
          <div className="border-r border-border">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">Inbox</div>
                  <div className="text-xs text-muted-foreground">
                    {filteredContacts.length} messages
                  </div>
                </div>
                <div className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                  {unread} unread
                </div>
              </div>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email or message"
                className="mt-4 w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="divide-y divide-border max-h-[520px] overflow-y-auto">
              {isLoading && (
                <div className="p-4 text-sm text-muted-foreground">Loading contacts...</div>
              )}
              {isError && (
                <div className="p-4 text-sm text-destructive">
                  {error instanceof Error ? error.message : "Unable to load contacts."}
                </div>
              )}
              {!isLoading && !isError && filteredContacts.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">No contacts found.</div>
              )}
              {filteredContacts.map((contact) => (
                <button
                  key={contact._id}
                  onClick={() => {
                    setSelectedId(contact._id);
                    if (contact.status === "New")
                      updateContact.mutate({ id: contact._id, status: "Read" });
                  }}
                  className={`w-full text-left p-4 transition-colors ${selected?._id === contact._id ? "bg-primary-soft" : "hover:bg-secondary/40"}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary text-xs font-semibold">
                      {contact.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-sm truncate">{contact.name}</div>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate">{contact.email}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                        <span>{contact.phone}</span>
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground line-clamp-2">
                        {contact.message}
                      </div>
                      <div className="mt-3">
                        <Badge tone={statusTone[contact.status]}>{contact.status}</Badge>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            {selected ? (
              <>
                <div className="p-5 border-b border-border flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{selected.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {selected.email} · {selected.phone}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={statusTone[selected.status]}>{selected.status}</Badge>
                    <button
                      onClick={() => deleteContact.mutate(selected._id)}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-border hover:bg-secondary"
                      aria-label="Delete contact"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-background/60">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-card border border-border p-4">
                    <p className="whitespace-pre-wrap text-sm">{selected.message}</p>
                    <div className="text-[10px] text-muted-foreground mt-2">
                      {new Date(selected.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-border bg-card">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {(["New", "Read", "Replied"] as const).map((nextStatus) => (
                      <button
                        key={nextStatus}
                        onClick={() => markStatus(nextStatus)}
                        className="rounded-xl border border-border px-3 py-2 text-xs font-medium hover:bg-secondary"
                      >
                        Mark {nextStatus}
                      </button>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-3">
                    <textarea
                      value={reply}
                      onChange={(event) => setReply(event.target.value)}
                      placeholder="Write a reply..."
                      className="w-full bg-transparent text-sm outline-none resize-none h-16"
                    />
                    <div className="flex items-center justify-end mt-2">
                      <button
                        onClick={sendReply}
                        disabled={!reply.trim()}
                        className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-60"
                      >
                        <Send className="h-4 w-4" /> Send
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid flex-1 place-items-center p-8 text-center text-sm text-muted-foreground">
                Select a contact to read and respond.
              </div>
            )}
          </div>
        </div>
      </Card>
    </AdminShell>
  );
}
