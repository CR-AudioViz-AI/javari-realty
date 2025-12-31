'use client';

import React, { useState, useEffect } from 'react';
import { MaintenanceTask } from '@/types/homeowner';

const MAINTENANCE_CATEGORIES = [
  { id: 'hvac', label: 'HVAC', icon: '❄️', tasks: ['Change air filter', 'Clean condenser coils', 'Check refrigerant', 'Service AC unit'] },
  { id: 'plumbing', label: 'Plumbing', icon: '🚿', tasks: ['Check for leaks', 'Flush water heater', 'Clean drains', 'Inspect hoses'] },
  { id: 'electrical', label: 'Electrical', icon: '⚡', tasks: ['Test GFCI outlets', 'Check smoke detectors', 'Replace batteries', 'Inspect wiring'] },
  { id: 'exterior', label: 'Exterior', icon: '🏠', tasks: ['Clean gutters', 'Power wash', 'Inspect roof', 'Check foundation'] },
  { id: 'landscaping', label: 'Landscaping', icon: '🌳', tasks: ['Mow lawn', 'Trim hedges', 'Fertilize', 'Irrigation check'] },
  { id: 'pool', label: 'Pool/Spa', icon: '🏊', tasks: ['Check chemicals', 'Clean filter', 'Skim debris', 'Service pump'] },
  { id: 'pest', label: 'Pest Control', icon: '🐜', tasks: ['Quarterly treatment', 'Termite inspection', 'Rodent check'] },
  { id: 'safety', label: 'Safety', icon: '🔐', tasks: ['Test alarms', 'Check fire extinguisher', 'Update security code'] },
  { id: 'appliances', label: 'Appliances', icon: '🔌', tasks: ['Clean refrigerator coils', 'Clean dishwasher', 'Clean dryer vent'] },
  { id: 'seasonal', label: 'Seasonal', icon: '🍂', tasks: ['Winterize pipes', 'Hurricane prep', 'Spring cleaning'] },
];

const DEFAULT_TASKS: Partial<MaintenanceTask>[] = [
  { title: 'Change HVAC air filter', category: 'hvac', frequency: 'monthly', priority: 'high' },
  { title: 'Test smoke detectors', category: 'electrical', frequency: 'monthly', priority: 'high' },
  { title: 'Clean gutters', category: 'exterior', frequency: 'quarterly', priority: 'medium' },
  { title: 'Flush water heater', category: 'plumbing', frequency: 'annual', priority: 'medium' },
  { title: 'Service AC unit', category: 'hvac', frequency: 'annual', priority: 'high' },
  { title: 'Clean dryer vent', category: 'appliances', frequency: 'annual', priority: 'high' },
  { title: 'Inspect roof', category: 'exterior', frequency: 'annual', priority: 'medium' },
  { title: 'Pest control treatment', category: 'pest', frequency: 'quarterly', priority: 'medium' },
  { title: 'Check pool chemicals', category: 'pool', frequency: 'weekly', priority: 'medium' },
  { title: 'Hurricane prep check', category: 'seasonal', frequency: 'annual', priority: 'high' },
];

export default function MaintenancePage() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'overdue' | 'due_soon' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'hvac',
    frequency: 'monthly' as const,
    priority: 'medium' as const,
    next_due: '',
    notes: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetch('/api/homeowner/maintenance');
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.next_due) {
      alert('Please fill in task title and next due date');
      return;
    }

    try {
      const response = await fetch('/api/homeowner/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        await loadTasks();
        setShowAddModal(false);
        setNewTask({
          title: '',
          category: 'hvac',
          frequency: 'monthly',
          priority: 'medium',
          next_due: '',
          notes: '',
        });
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const markComplete = async (task: MaintenanceTask) => {
    try {
      await fetch(`/api/homeowner/maintenance/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id }),
      });
      await loadTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await fetch(`/api/homeowner/maintenance?id=${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const setupDefaultTasks = async () => {
    if (!confirm('Add recommended maintenance tasks to your schedule?')) return;
    try {
      for (const task of DEFAULT_TASKS) {
        const nextDue = new Date();
        if (task.frequency === 'weekly') nextDue.setDate(nextDue.getDate() + 7);
        else if (task.frequency === 'monthly') nextDue.setMonth(nextDue.getMonth() + 1);
        else if (task.frequency === 'quarterly') nextDue.setMonth(nextDue.getMonth() + 3);
        else nextDue.setFullYear(nextDue.getFullYear() + 1);

        await fetch('/api/homeowner/maintenance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...task,
            next_due: nextDue.toISOString().split('T')[0],
          }),
        });
      }
      await loadTasks();
    } catch (error) {
      console.error('Error setting up tasks:', error);
    }
  };

  const getTaskStatus = (task: MaintenanceTask) => {
    const due = new Date(task.next_due);
    const now = new Date();
    const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (task.status === 'completed') return { status: 'completed', color: 'bg-gray-100 text-gray-500', label: 'Completed' };
    if (daysUntil < 0) return { status: 'overdue', color: 'bg-red-100 text-red-700', label: `${Math.abs(daysUntil)} days overdue` };
    if (daysUntil <= 7) return { status: 'due_soon', color: 'bg-yellow-100 text-yellow-700', label: `Due in ${daysUntil} days` };
    return { status: 'upcoming', color: 'bg-green-100 text-green-700', label: `Due ${due.toLocaleDateString()}` };
  };

  const filteredTasks = tasks.filter(task => {
    const status = getTaskStatus(task).status;
    if (filter === 'all') return status !== 'completed';
    if (filter === 'overdue') return status === 'overdue';
    if (filter === 'due_soon') return status === 'due_soon' || status === 'overdue';
    if (filter === 'completed') return status === 'completed';
    return true;
  });

  const stats = {
    overdue: tasks.filter(t => getTaskStatus(t).status === 'overdue').length,
    dueSoon: tasks.filter(t => getTaskStatus(t).status === 'due_soon').length,
    upcoming: tasks.filter(t => getTaskStatus(t).status === 'upcoming').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🔧 Maintenance Schedule</h1>
            <p className="text-gray-600">Keep your home in top shape</p>
          </div>
          <div className="flex gap-2">
            {tasks.length === 0 && (
              <button
                onClick={setupDefaultTasks}
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
              >
                + Add Recommended Tasks
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              + Add Task
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-xl cursor-pointer transition-all ${filter === 'overdue' ? 'bg-red-600 text-white' : 'bg-white shadow-sm hover:shadow'}`}
               onClick={() => setFilter(filter === 'overdue' ? 'all' : 'overdue')}>
            <p className={filter === 'overdue' ? 'text-red-100' : 'text-gray-500'}>Overdue</p>
            <p className="text-2xl font-bold">{stats.overdue}</p>
          </div>
          <div className={`p-4 rounded-xl cursor-pointer transition-all ${filter === 'due_soon' ? 'bg-yellow-600 text-white' : 'bg-white shadow-sm hover:shadow'}`}
               onClick={() => setFilter(filter === 'due_soon' ? 'all' : 'due_soon')}>
            <p className={filter === 'due_soon' ? 'text-yellow-100' : 'text-gray-500'}>Due This Week</p>
            <p className="text-2xl font-bold">{stats.dueSoon}</p>
          </div>
          <div className={`p-4 rounded-xl cursor-pointer transition-all ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white shadow-sm hover:shadow'}`}
               onClick={() => setFilter('all')}>
            <p className={filter === 'all' ? 'text-indigo-100' : 'text-gray-500'}>Upcoming</p>
            <p className="text-2xl font-bold">{stats.upcoming}</p>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-4xl mb-4">🔧</p>
            <p className="text-gray-600">No maintenance tasks. Add your first task or use our recommended schedule!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const statusInfo = getTaskStatus(task);
              const category = MAINTENANCE_CATEGORIES.find(c => c.id === task.category);
              
              return (
                <div key={task.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                  <button
                    onClick={() => markComplete(task)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.status === 'completed' 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {task.status === 'completed' && '✓'}
                  </button>
                  
                  <span className="text-2xl">{category?.icon || '🔧'}</span>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{category?.label}</span>
                      <span>•</span>
                      <span className="capitalize">{task.frequency}</span>
                      {task.priority === 'high' && <span className="text-red-500">• High Priority</span>}
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Task Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Add Maintenance Task</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Task Title *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., Change HVAC filter"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      {MAINTENANCE_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Frequency</label>
                    <select
                      value={newTask.frequency}
                      onChange={(e) => setNewTask({ ...newTask, frequency: e.target.value as any })}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="one_time">One Time</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="semi_annual">Semi-Annual</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Next Due Date *</label>
                    <input
                      type="date"
                      value={newTask.next_due}
                      onChange={(e) => setNewTask({ ...newTask, next_due: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                  <textarea
                    value={newTask.notes}
                    onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
