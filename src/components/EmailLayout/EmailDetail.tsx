import React from "react";
import type { Email } from "./EmailLayout";

interface EmailDetailProps {
  email: Email | null;
}

const EmailDetail: React.FC<EmailDetailProps> = ({ email }) => {
  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 px-4">
        Select an email to view
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto">
      <h1 className="text-2xl font-semibold mb-2">{email.subject}</h1>
      <p className="text-gray-600 mb-4">From: {email.sender}</p>
      <p className="whitespace-pre-wrap">{email.body}</p>
    </div>
  );
};

export default EmailDetail;
