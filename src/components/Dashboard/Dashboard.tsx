import React, { useEffect } from 'react';
import { Layout } from '../Layout/Layout';
import { useApp } from '../../contexts/AppContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import {
  Mail,
  FileText,
  Settings,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Bot,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Layers } from 'lucide-react';
export const Dashboard: React.FC = () => {
  const {
    emails,
    categories,
    documents,
    logs,
    loading,
    error,
    loadPageData,
    refreshData
  } = useApp();

  // Load dashboard data when component mounts
  useEffect(() => {
    console.log('📊 Dashboard mounted - loading page data');
    loadPageData('dashboard');
  }, []);

  const { user } = useAuth()

  const navigate = useNavigate();

  const stats = [
    {
      name: 'Total Emails',
      value: emails.length,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Mail,
      color: 'bg-blue-500',
      comingsoon: false,
    },
    {
      name: 'Categories',
      value: categories.length,
      change: '+2',
      changeType: 'positive' as const,
      icon: Settings,
      color: 'bg-purple-500',
      comingsoon: false,
    },
    {
      name: 'Documents',
      value: documents.length,
      change: '0',
      changeType: 'neutral' as const,
      icon: FileText,
      color: 'bg-green-500',
      comingsoon: false,
    },
    {
      name: 'Success Rate',
      value: '85%',
      change: '+5%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'bg-orange-500',
      comingsoon: true
    },
  ];

  const recentEmails = emails.slice(0, 3);
  const recentLogs = logs.slice(0, 3);

  const isLoading = loading.emails || loading.categories || loading.documents || loading.logs;
  const hasError = error.emails || error.categories || error.documents || error.logs;

  if (isLoading && emails.length === 0 && categories.length === 0) {
    return (
      <Layout title="Dashboard" subtitle="Monitor your email automation performance">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading dashboard data..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard" subtitle="Monitor your email automation performance">
      <div className="space-y-4 sm:space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => loadPageData('dashboard')}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Dashboard</span>
          </button>
        </div>

        {/* Error Messages */}
        {hasError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="text-sm font-medium text-red-800">API Errors Detected</h3>
            </div>
            <div className="text-sm text-red-700 space-y-1">
              {error.emails && <p>• Emails: {error.emails}</p>}
              {error.categories && <p>• Categories: {error.categories}</p>}
              {error.documents && <p>• Documents: {error.documents}</p>}
              {error.logs && <p>• Logs: {error.logs}</p>}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {user && <div
            key={user.domain}
            className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${'bg-purple-500'} p-2 sm:p-3 rounded-lg flex-shrink-0`}>
                <Layers className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Domain
                </p>
                <div className="flex items-center">
                  <p className="text-lg sm:text-2xl font-semibold text-[#2563eb]">
                    {user.domain}
                  </p>
                </div>
              </div>
            </div>
          </div>}
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              {stat.comingsoon && (
                <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm uppercase">
                  Coming Soon
                </div>
              )}
              <div className="flex items-center">
                <div className={`${stat.color} p-2 sm:p-3 rounded-lg flex-shrink-0`}>
                  <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    {stat.name}
                  </p>
                  <div className="flex items-center">
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    <span
                      className={`ml-1 sm:ml-2 text-xs font-medium px-1 sm:px-2 py-1 rounded-full ${stat.changeType === "positive"
                        ? "bg-green-100 text-green-800"
                        : stat.changeType === "negative"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Emails */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Emails</h3>
                <div className="flex items-center space-x-2">
                  {loading.emails && <LoadingSpinner size="sm" />}
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {error.emails ? (
                <ErrorMessage
                  message={error.emails}
                  onRetry={() => loadPageData('dashboard')}
                />
              ) : recentEmails.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {recentEmails.map((email) => (
                    <div key={email.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-full flex-shrink-0 ${email.status === 'sent' ? 'bg-green-100' :
                        email.status === 'pending' ? 'bg-yellow-100' :
                          email.status === 'failed' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                        {email.status === 'sent' ? <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" /> :
                          email.status === 'pending' ? <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" /> :
                            email.status === 'failed' ? <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" /> :
                              <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {email.subject}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          From: {email.from}
                        </p>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-xs text-gray-400">
                            {email.timestamp}
                          </span>
                          <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {email.category || 'Uncategorized'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Mail className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base">No emails loaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Activity Logs</h3>
                <div className="flex items-center space-x-2">
                  {loading.logs && <LoadingSpinner size="sm" />}
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {error.logs ? (
                <ErrorMessage
                  message={error.logs}
                  onRetry={() => loadPageData('dashboard')}
                />
              ) : recentLogs.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-full flex-shrink-0 ${log.type === 'sent' ? 'bg-green-100' :
                        log.type === 'failed' ? 'bg-red-100' :
                          log.type === 'pending' ? 'bg-yellow-100' :
                            'bg-blue-100'
                        }`}>
                        {log.type === 'sent' ? <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" /> :
                          log.type === 'failed' ? <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" /> :
                            log.type === 'pending' ? <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" /> :
                              <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {log.action}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {log.email} - {log.subject}
                        </p>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-xs text-gray-400">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {Math.round(log.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='d-flex justify-center items-center w-[full]'>
                  <div className="text-center py-6 sm:py-8">
                    <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm sm:text-base">No logs loaded</p>
                  </div><div className="text-center bg-yellow-100 text-yellow-800 text-[16px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm uppercase">
                    Coming Soon
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <button
              onClick={() => {
                loadPageData('configuration');
                navigate('/configuration');
              }}
              disabled={loading.categories}
              className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group text-left disabled:opacity-50"
            >
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-900 text-sm sm:text-base">Manage Categories</p>
              <p className="text-xs sm:text-sm text-gray-500">Configure email categories</p>
            </button>
            <button
              onClick={() => {
                loadPageData('upload')
                navigate('/upload');
              }}
              disabled={loading.documents}
              className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group text-left disabled:opacity-50"
            >
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-900 text-sm sm:text-base">Upload Documents</p>
              <p className="text-xs sm:text-sm text-gray-500">Add company knowledge base</p>
            </button>
            <button
              onClick={() => {
                loadPageData('mailbox')
                navigate('/mailbox');
              }}
              disabled={loading.emails}
              className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group text-left sm:col-span-2 lg:col-span-1 disabled:opacity-50"
            >
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-900 text-sm sm:text-base">Check Mailbox</p>
              <p className="text-xs sm:text-sm text-gray-500">View and manage emails</p>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};