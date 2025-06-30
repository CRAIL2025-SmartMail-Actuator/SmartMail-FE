import React, { useState, useEffect, useMemo } from 'react';
import {
  Mail,
  Search,
  Filter,
  RefreshCw,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreHorizontal,
  Paperclip,
  Flag,
  Clock,
  Send,
  Edit,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Tag,
  Menu,
  X
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useApp } from '../../contexts/AppContext';

interface EmailMessage {
  id: number;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
  htmlBody?: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  priority: 'high' | 'normal' | 'low';
  category?: string;
  thread: EmailMessage[];
  labels: string[];
  replied?: boolean;
}

interface AIResponse {
  email_body: string;
  confidence: number;
  category: string;
  tone: string;
  reasoning: string;
  subject: string;
}

interface InboxViewProps {
  emailConfig: { email: string; appPassword: string };
}

const REASONING_MAP: { min: number; max: number; reasoning: string }[] = [
  {
    min: 9,
    max: 10,
    reasoning: "High confidence due to clear context. Used professional tone to match customer service standards.",
  },
  {
    min: 7,
    max: 8.9,
    reasoning: "Fairly confident based on identifiable intent and structured language. Responded with relevant tone and clarity.",
  },
  {
    min: 5,
    max: 6.9,
    reasoning: "Moderate confidence. Some ambiguity in request, but tone and subject are inferred with reasonable accuracy.",
  },
  {
    min: 3,
    max: 4.9,
    reasoning: "Low confidence. Email content has vague or incomplete context, making accurate tone and category inference difficult.",
  },
  {
    min: 0,
    max: 2.9,
    reasoning: "Very low confidence. Email is unstructured or lacks clear intent, reducing reliability of AI analysis.",
  }
];

const getReasoningByConfidence = (confidence: number): string => {
  const match = REASONING_MAP.find(({ min, max }) => confidence >= min && confidence <= max);
  return match?.reasoning || "Unable to determine confidence due to missing or invalid input.";
};


export const InboxView: React.FC<InboxViewProps> = ({ emailConfig }) => {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'unread' | 'starred' | 'important'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showEmailList, setShowEmailList] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const { categories } = useApp()
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const showGenerate = useMemo(() => {
    if (!selectedEmail) return false;
    if (selectedEmail.replied) return false; // Don't show if email has already been replied to
    if (selectedEmail.category && (selectedEmail.category.toLowerCase().replace(/ /g, "-") === "customer-support" || selectedEmail.category.toLowerCase().replace(/ /g, "-") === "support")) {
      return true;
    }
    return false
  }, [selectedEmail, categories])

  // Load emails from API
  useEffect(() => {
    loadEmails();
  }, [emailConfig.email]);

  const loadEmails = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getEmails({
        filter: filterBy === 'all' ? undefined : filterBy,
        search: searchQuery || undefined,
        limit: 50
      });

      if (response.success && response.data) {
        // Transform API response to match our interface
        const transformedEmails: EmailMessage[] = response.data.emails.map(email => ({
          id: email.id,
          from: email.from,
          fromName: email.from.split('@')[0], // Extract name from email
          to: email.to,
          subject: email.subject,
          body: email.body,
          timestamp: email.timestamp,
          isRead: email.is_read,
          isStarred: false, // Default value
          hasAttachments: false, // Default value
          priority: email.priority,
          category: email.category,
          thread: [],
          labels: email.category ? [email.category] : [],
          replied: email.replied || false // Use API's replied status
        }));

        setEmails(transformedEmails);
      } else {
        console.error('Failed to load emails:', response.error);
      }
    } catch (error) {
      console.error('Error loading emails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (email: EmailMessage) => {
    setIsGeneratingAI(true);
    setShowAIPanel(true);

    try {
      const response = await apiService.generateAIResponse(email.id, {
        tone: 'professional',
        length: 'medium',
        include_signature: true
      });

      if (response.success && response.data) {
        console.log('AI response generated:', response.data);
        const aiResponseData: AIResponse = {
          email_body: response.data.email_body,
          confidence: response.data.confidence_score,
          category: selectedEmail?.category || 'General',
          tone: response.data.tone || 'Professional',
          reasoning: getReasoningByConfidence(response.data.confidence_score),
          subject: response.data.subject || email.subject
        };

        setAiResponse(aiResponseData);
        setReplyText(aiResponseData.email_body);
      } else {
        console.error('Failed to generate AI response:', response.error);
        // Fallback to mock response for demo
        generateMockAIResponse(email);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      // Fallback to mock response for demo
      generateMockAIResponse(email);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateMockAIResponse = (email: EmailMessage) => {
    // Mock AI response for demo purposes
    let mockResponse: AIResponse;

    if (email.subject.toLowerCase().includes('payment') || email.subject.toLowerCase().includes('invoice')) {
      mockResponse = {
        suggestion: `Dear ${email.fromName},\n\nThank you for reaching out regarding the payment processing issue with invoice #INV-2024-001.\n\nI understand the urgency of this matter and I'm here to help resolve it quickly. Error code 4001 typically indicates a temporary gateway issue. I've escalated this to our payment processing team and they're investigating immediately.\n\nIn the meantime, I've also sent you an alternative payment link that should work around this issue. You should receive it within the next 10 minutes.\n\nI'll keep you updated on the progress and ensure this is resolved today. Please don't hesitate to reach out if you have any questions.\n\nBest regards,\n[Your Name]\nCustomer Success Team`,
        confidence: 0.92,
        category: 'Customer Support',
        tone: 'Professional & Urgent',
        reasoning: 'High confidence due to clear payment issue context. Used urgent but professional tone to match the customer\'s concern level.',
        responseId: 'mock_response_' + Date.now()
      };
    } else if (email.subject.toLowerCase().includes('partnership')) {
      mockResponse = {
        suggestion: `Hi ${email.fromName},\n\nThank you for reaching out about the partnership opportunity. AI-powered customer service solutions are definitely an area of interest for us.\n\nI'd be happy to schedule a call next week to explore potential synergies between our companies. Could you share a bit more about your specific AI capabilities and what type of partnership structure you have in mind?\n\nI'm available Tuesday through Thursday next week, preferably in the afternoon. Please let me know what works best for your schedule.\n\nLooking forward to our conversation.\n\nBest regards,\n[Your Name]\nBusiness Development`,
        confidence: 0.87,
        category: 'Business Development',
        tone: 'Professional & Interested',
        reasoning: 'Good confidence for partnership inquiry. Balanced professional tone showing interest while requesting more details.',
        responseId: 'mock_response_' + Date.now()
      };
    } else {
      mockResponse = {
        suggestion: `Dear ${email.fromName},\n\nThank you for your email. I've received your message and will review it carefully.\n\nI'll get back to you within 24 hours with a detailed response. If this is urgent, please don't hesitate to call our support line.\n\nBest regards,\n[Your Name]`,
        confidence: 0.75,
        category: 'General',
        tone: 'Professional',
        reasoning: 'Moderate confidence for general inquiry. Standard professional response acknowledging the email.',
        responseId: 'mock_response_' + Date.now()
      };
    }

    setAiResponse(mockResponse);
    setReplyText(mockResponse.suggestion);
  };

  const handleSendReply = async () => {
    if (!selectedEmail || !replyText.trim()) return;

    setIsSendingReply(true);
    try {
      const response = await apiService.sendReply(selectedEmail.id, replyText, aiResponse?.subject || selectedEmail.subject, { to: selectedEmail.from });

      if (response.success) {
        console.log('Reply sent successfully:', response.data);
        // Reset the reply panel
        setReplyText('');
        setAiResponse(null);
        setShowAIPanel(false);
        // Refresh emails to show updated status
        loadEmails();
      } else {
        console.error('Failed to send reply:', response.error);
        alert('Failed to send reply. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleEmailAction = async (emailId: string, action: 'read' | 'star' | 'archive' | 'delete') => {
    try {
      let response;
      switch (action) {
        case 'read':
          response = await apiService.markEmailAsRead(emailId, true);
          break;
        case 'star':
          response = await apiService.starEmail(emailId, true);
          break;
        case 'archive':
          response = await apiService.archiveEmail(emailId);
          break;
        case 'delete':
          response = await apiService.deleteEmail(emailId);
          break;
      }

      if (response?.success) {
        // Refresh emails to show updated status
        loadEmails();
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterBy === 'all' ||
      (filterBy === 'unread' && !email.isRead) ||
      (filterBy === 'starred' && email.isStarred) ||
      (filterBy === 'important' && email.priority === 'high');

    return matchesSearch && matchesFilter;
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Flag className="h-4 w-4 text-red-500" />;
      case 'low': return <Flag className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const formatTimestamp = (date: string) => {
    const now = new Date();
    const newdate = new Date(date)
    const diffInHours = (now.getTime() - newdate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return newdate.toLocaleDateString();
    }
  };

  const handleEmailSelect = (email: EmailMessage) => {
    setSelectedEmail(email);
    setAiResponse(null);
    setReplyText('');
    setShowAIPanel(false);
    if (isMobile) {
      setShowEmailList(false);
    }
    // Mark as read when selected
    if (!email.isRead) {
      handleEmailAction(email.id, 'read');
    }
  };

  const handleBackToList = () => {
    setShowEmailList(true);
    setSelectedEmail(null);
    setShowAIPanel(false);
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Email List Panel */}
      <div className={`${isMobile
        ? showEmailList ? 'w-full' : 'hidden'
        : showAIPanel ? 'w-1/4' : 'w-1/3'
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        {/* Search and Filter Header */}
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                placeholder="Search emails..."
              />
            </div>
            <button
              onClick={loadEmails}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto">
            {['all', 'unread', 'starred', 'important'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterBy(filter as any)}
                className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${filterBy === filter
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => handleEmailSelect(email)}
                  className={`p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedEmail?.id === email.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    } ${!email.isRead ? 'bg-blue-25' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold flex-shrink-0">
                        {email.fromName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${!email.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {email.fromName}
                        </p>
                        <p className="text-xs text-gray-500 truncate hidden sm:block">{email.from}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                      {email.isStarred && <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />}
                      {getPriorityIcon(email.priority)}
                      <span className="text-xs text-gray-400">{formatTimestamp(email.timestamp)}</span>
                    </div>
                  </div>

                  <h4 className={`text-sm mb-1 truncate ${!email.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                    {email.subject}
                  </h4>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                    {email.body}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {email.hasAttachments && (
                        <Paperclip className="h-3 w-3 text-gray-400" />
                      )}
                      {(
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full hidden sm:inline">
                          {email.category ?? 'Uncategorized'}
                        </span>
                      )}
                    </div>
                    {!email.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Email Detail and Reply Panel */}
      <div className={`${isMobile
        ? showEmailList ? 'hidden' : 'w-full'
        : showAIPanel ? 'lg:w-3/4' : 'flex-1'
        } flex flex-col`}>
        {selectedEmail ? (
          <>
            {/* Email Header */}
            <div className="bg-white border-b border-gray-200 p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {isMobile && (
                    <button
                      onClick={handleBackToList}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  )}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 truncate">{selectedEmail.subject}</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{selectedEmail.fromName} {selectedEmail.from}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{selectedEmail.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleEmailAction(selectedEmail.id, 'star')}
                    className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    <Star className={`h-4 w-4 sm:h-5 sm:w-5 ${selectedEmail.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleEmailAction(selectedEmail.id, 'archive')}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Archive className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={() => handleEmailAction(selectedEmail.id, 'delete')}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>

              {/* Labels */}
              {selectedEmail.labels.length > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <div className="flex space-x-1 overflow-x-auto">
                    {selectedEmail.labels.map((label) => (
                      <span key={label} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {showGenerate && <button
                  onClick={() => generateAIResponse(selectedEmail)}
                  disabled={isGeneratingAI}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isGeneratingAI ? 'Generating...' : 'Generate AI Reply'}</span>
                </button>}
                <div className="flex space-x-2">
                  <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex-1 sm:flex-none">
                    <Reply className="h-4 w-4" />
                    <span>Reply</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex-1 sm:flex-none">
                    <Forward className="h-4 w-4" />
                    <span>Forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Email Content */}
            <div className="flex-1 flex flex-col lg:flex-row">
              {/* Email Body */}
              <div className={`${showAIPanel && !isMobile ? 'lg:w-1/2' : 'w-full'} bg-white p-4 sm:p-6 overflow-y-auto transition-all duration-300`}>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm sm:text-base">
                    {selectedEmail.body}
                  </div>
                </div>
              </div>

              {/* AI Reply Panel */}
              {showAIPanel && (
                <div className={`${isMobile ? 'w-full border-t' : 'lg:w-1/2 border-l'} border-gray-200 bg-gray-50 flex flex-col`}>
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 flex items-center text-sm sm:text-base">
                        <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                        AI-Generated Reply
                      </h3>
                      <button
                        onClick={() => setShowAIPanel(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {isMobile ? <X className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                      </button>
                    </div>
                    {aiResponse && (
                      <div className="mt-2 text-sm text-gray-600">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${aiResponse.confidence >= 9 ? 'bg-green-100 text-green-800' :
                            aiResponse.confidence >= 7 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {Math.round(aiResponse.confidence * 10)}% confidence
                          </span>
                          <span className="text-xs text-gray-500">{aiResponse.tone}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {isGeneratingAI ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                          <p className="text-gray-600 text-sm">Analyzing email and generating response...</p>
                        </div>
                      </div>
                    ) : aiResponse ? (
                      <>
                        {/* AI Reasoning */}
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">AI Analysis</h4>
                          <p className="text-xs text-gray-600">{aiResponse.reasoning}</p>
                        </div>
                        {/* Email Subject */}
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Reply Subject</h4>
                          <p className="text-xs text-gray-600">{aiResponse.subject}</p>
                        </div>
                        {/* Reply Editor */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">Reply Draft</span>
                            <button
                              onClick={() => setReplyText(aiResponse.email_body)}
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              Reset to AI suggestion
                            </button>
                          </div>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full h-48 sm:h-64 p-3 border-0 resize-none focus:ring-0 focus:outline-none text-sm"
                            placeholder="Edit your reply here..."
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                          <button
                            onClick={handleSendReply}
                            disabled={isSendingReply || !replyText.trim()}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm"
                          >
                            {isSendingReply ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                <span>Send Reply</span>
                              </>
                            )}
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center p-4">
              <Mail className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Select an email</h3>
              <p className="text-sm sm:text-base text-gray-600">Choose an email from the inbox to view details and generate AI responses</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};