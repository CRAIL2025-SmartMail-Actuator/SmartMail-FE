import React from "react";
import type { Email } from "./EmailLayout";

interface EmailListProps {
  emails: Email[];
  onSelect: (email: Email) => void;
}

const EmailList: React.FC<EmailListProps> = ({ emails, onSelect }) => {
  return (
    <div className="w-full md:w-1/3 border-b md:border-r md:border-b-0 border-gray-300 overflow-y-auto max-h-[50vh] md:max-h-full">
      <h2 className="text-lg font-semibold p-4 bg-gray-100 border-b">Inbox</h2>
      <ul>
        {emails.map((email) => (
          <li
            key={email.id}
            onClick={() => onSelect(email)}
            className="cursor-pointer px-4 py-3 hover:bg-blue-100 border-b"
          >
            <div className="font-medium">{email.subject}</div>
            <div className="text-sm text-gray-600">{email.sender}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailList;
