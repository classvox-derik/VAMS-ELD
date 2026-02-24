"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !message.trim()) {
      toast.error("Please fill in all fields before sending.");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to send message.");
      }

      setSent(true);
      toast.success("Message sent successfully!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  }

  function handleReset() {
    setFirstName("");
    setLastName("");
    setMessage("");
    setSent(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="scaffold-heading">Message the ELD Teacher</h1>
        <p className="scaffold-description mt-1">
          Send a message directly to your ELD teacher.
        </p>
      </div>

      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4" />
              Send a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">
                    Message Sent!
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your message has been delivered to the ELD teacher.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      placeholder="e.g. Maria"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isSending}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      placeholder="e.g. Garcia"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isSending}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSending}
                    rows={6}
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-muted-foreground">
                    Your message will be sent to{" "}
                    <span className="font-medium">dvandiest@brightstarschools.org</span>
                  </p>
                  <Button type="submit" disabled={isSending} className="gap-2">
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
