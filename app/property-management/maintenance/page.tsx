// CR REALTOR PLATFORM - MAINTENANCE REQUESTS PAGE
// Created: December 3, 2025

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Plus,
  Search,
  AlertTriangle,
  Clock,
  CheckCircle,
  Calendar,
  User,
  MapPin,
  Eye,
  Edit,
  Phone
} from 'lucide-react';

const mockRequests = [
  {
    id: '1',
    title: 'Water leak in bathroom',
    description: 'Faucet is dripping constantly and water pressure is low',
    category: 'plumbing',
    priority: 'emergency',
    status: 'in_progress',
    tenant: 'John Smith',
    unit: 'Unit 204',
    property: 'Sunset Apartments',
    created: '2025-01-03T10:30:00',
    scheduled: '2025-01-03T14:00:00',
    assignedTo: 'ABC Plumbing',
  },
  {
    id: '2',
    title: 'HVAC not cooling properly',
    description: 'AC unit making strange noise and not cooling effectively',
    category: 'hvac',
    priority: 'high',
    status: 'scheduled',
    tenant: 'Sarah Johnson',
    unit: 'Unit 305',
    property: 'Sunset Apartments',
    created: '2025-01-02T15:45:00',
    scheduled: '2025-01-04T09:00:00',
    assignedTo: 'Cool Air Services',
  },
  {
    id: '3',
    title: 'Garage door not closing',
    description: 'Garage door stops halfway when closing',
    category: 'structural',
    priority: 'medium',
    status: 'submitted',
    tenant: 'Michael Brown',
    unit: 'Unit 112',
    property: 'Oakwood Townhomes',
    created: '2025-01-03T08:00:00',
    scheduled: null,
    assignedTo: null,
  },
  {
    id: '4',
    title: 'Light fixture replacement',
    description: 'Kitchen ceiling light stopped working',
    category: 'electrical',
    priority: 'low',
    status: 'completed',
    tenant: 'Emily Davis',
    unit: 'Unit 418',
    property: 'Sunset Apartments',
    created: '2024-12-28T11:00:00',
    scheduled: '2024-12-30T10:00:00',
    assignedTo: 'Bright Electric',
    completedDate: '2024-12-30T12:30:00',
  },
  {
    id: '5',
    title: 'Dishwasher not draining',
    description: 'Water pools at the bottom after cycle',
    category: 'appliance',
    priority: 'medium',
    status: 'pending_parts',
    tenant: 'Robert Wilson',
    unit: 'Unit 201',
    property: 'Riverside Duplexes',
    created: '2025-01-01T09:30:00',
    scheduled: null,
    assignedTo: 'Appliance Pros',
  },
];

const priorityConfig: Record<string, { color: string; bgColor: string; label: string }> = {
  emergency: { color: 'text-red-700', bgColor: 'bg-red-100', label: 'Emergency' },
  urgent: { color: 'text-orange-700', bgColor: 'bg-orange-100', label: 'Urgent' },
  high: { color: 'text-yellow-700', bgColor: 'bg-yellow-100', label: 'High' },
  medium: { color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'Medium' },
  low: { color: 'text-gray-700', bgColor: 'bg-gray-100', label: 'Low' },
};

const statusConfig: Record<string, { color: string; bgColor: string; label: string }> = {
  submitted: { color: 'text-gray-700', bgColor: 'bg-gray-100', label: 'Submitted' },
  acknowledged: { color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'Acknowledged' },
  scheduled: { color: 'text-purple-700', bgColor: 'bg-purple-100', label: 'Scheduled' },
  in_progress: { color: 'text-yellow-700', bgColor: 'bg-yellow-100', label: 'In Progress' },
  pending_parts: { color: 'text-orange-700', bgColor: 'bg-orange-100', label: 'Pending Parts' },
  completed: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Completed' },
  cancelled: { color: 'text-red-700', bgColor: 'bg-red-100', label: 'Cancelled' },
};

const categoryIcons: Record<string, string> = {
  plumbing: '🔧',
  electrical: '⚡',
  hvac: '❄️',
  appliance: '🔌',
  structural: '🏠',
  pest: '🐛',
  landscaping: '🌳',
  other: '📝',
};

export default function MaintenancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredRequests = mockRequests.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false;
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const emergencyCount = mockRequests.filter(r => r.priority === 'emergency' && r.status !== 'completed').length;
  const openCount = mockRequests.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-500">Track and manage work orders</p>
        </div>
        <Link
          href="/property-management/maintenance/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          New Request
        </Link>
      </div>

      {/* Emergency Alert */}
      {emergencyCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">
                {emergencyCount} emergency request{emergencyCount > 1 ? 's' : ''} require immediate attention
              </p>
              <p className="text-sm text-red-700">Address these issues as soon as possible</p>
            </div>
            <Link
              href="/property-management/maintenance?priority=emergency"
              className="ml-auto px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
            >
              View
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Open Requests</p>
          <p className="text-2xl font-bold text-gray-900">{openCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Emergency</p>
          <p className="text-2xl font-bold text-red-600">{emergencyCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600">
            {mockRequests.filter(r => r.status === 'in_progress').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Completed (30d)</p>
          <p className="text-2xl font-bold text-green-600">
            {mockRequests.filter(r => r.status === 'completed').length}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="pending_parts">Pending Parts</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Priority</option>
          <option value="emergency">Emergency</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const priority = priorityConfig[request.priority];
          const status = statusConfig[request.status];
          
          return (
            <div key={request.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{categoryIcons[request.category] || '📝'}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{request.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priority.bgColor} ${priority.color}`}>
                        {priority.label}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.bgColor} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {request.unit} • {request.property}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {request.tenant}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(request.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </span>
                      {request.scheduled && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <Calendar className="w-4 h-4" />
                          Scheduled: {new Date(request.scheduled).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </span>
                      )}
                      {request.assignedTo && (
                        <span className="flex items-center gap-1 text-purple-600">
                          <Wrench className="w-4 h-4" />
                          {request.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/property-management/maintenance/${request.id}`} className="p-2 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </Link>
                  <Link href={`/property-management/maintenance/${request.id}/edit`} className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-4 h-4 text-gray-500" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance requests found</h3>
          <p className="text-gray-500 mb-4">All caught up! No open requests matching your filters.</p>
        </div>
      )}
    </div>
  );
}
