import React, { useEffect, useState } from 'react';
import { RefreshCw, Mail, Calendar, User, Paperclip, Send } from 'lucide-react';
import { apiService } from '../../services/api';

interface SentEmail {
    id: number;
    to: string[];
    subject: string;
    content: string;
    html_content?: string;
    sent_at: string;
    status: string;
    delivery_status: string;
}

export const SentMailView: React.FC = () => {
    const [emails, setEmails] = useState<SentEmail[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadSentEmails();
    }, []);

    const loadSentEmails = async () => {
        setIsLoading(true);
        try {
            const response = await apiService.getSentEmails();
            if (response.success && response.data) {
                console.log('📧 Loaded sent emails:', response.data.emails);
                setEmails(response.data.emails);
            }
        } catch (error) {
            console.error('Failed to fetch sent emails:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTimestamp = (date: string) => {
        const d = new Date(date);
        return d.toLocaleString();
    };

    useEffect(() => {
        console.log(emails, "useEffect")
    }, [emails])

    return (
        <div className="h-full flex bg-gray-50">
            {/* Sent Email List */}
            <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Sent</h2>
                    <button
                        onClick={loadSentEmails}
                        disabled={isLoading}
                        className="text-gray-500 hover:text-blue-500"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                {
                    emails?.length === 0 && <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <Send className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Sent Emails</h3>
                            <p className="text-gray-600">View your sent emails and their status</p>
                        </div>
                    </div>
                }
                <div className="overflow-y-auto flex-1">
                    {emails.map((email) => (
                        <div
                            key={email.id}
                            className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${selectedEmail?.id === email.id ? 'bg-blue-50' : ''}`}
                            onClick={() => setSelectedEmail(email)}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-gray-800 truncate">{email.to.join(', ')}</span>
                                <span className="text-xs text-gray-400">{formatTimestamp(email.sent_at)}</span>
                            </div>
                            <h4 className="text-sm font-semibold text-gray-700 truncate">{email.subject}</h4>
                            <p className="text-xs text-gray-500 truncate">{email.content}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sent Email Detail */}
            <div className="flex-1 bg-white p-6 overflow-y-auto">
                {selectedEmail ? (
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{selectedEmail.subject}</h3>
                        <div className="mb-4 text-sm text-gray-600 space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>To: {selectedEmail.to.join(', ')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatTimestamp(selectedEmail.sent_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>Status: {selectedEmail.status} | Delivery: {selectedEmail.delivery_status}</span>
                            </div>
                        </div>
                        <div className="prose whitespace-pre-wrap text-gray-800">{selectedEmail.content}</div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a sent email to view details
                    </div>
                )}
            </div>
        </div>
    );
};
