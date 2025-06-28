import React, { useState } from "react";
import EmailDetail from "./EmailDetail";
import EmailList from "./EmailList";
import Header from "./Header/Header";

export interface Email {
  id: number;
  subject: string;
  sender: string;
  body: string;
}

const dummyEmails: Email[] = [
  {
    id: 1,
    subject: "Welcome to Outlook Clone",
    sender: "admin@example.com",
    body: "Thanks for signing up! Here's how to get started...",
  },
  {
    id: 2,
    subject: "Meeting Reminder",
    sender: "boss@example.com",
    body: "Don't forget our meeting at 3 PM.",
  },
  {
    id: 3,
    subject: "Your Invoice",
    sender: "billing@example.com",
    body: "Attached is your invoice for the month of June.",
  },
];

const EmailLayout: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  return (
    <div className="flex flex-col " style={{ height: "calc(100vh - 80px)" }}>
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <EmailList emails={dummyEmails} onSelect={setSelectedEmail} />
        <EmailDetail email={selectedEmail} />
      </div>
    </div>
  );
};

export default EmailLayout;
