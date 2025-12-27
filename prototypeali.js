import React, { useState } from 'react';
import { 
  Wrench, 
  Calendar, 
  LayoutDashboard, 
  Settings, 
  Plus, 
  Clock, 
  User, 
  Search,
  MoreVertical,
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// --- Mock Data (Backend se aisa data aayega) ---
const mockEquipment = [
  { id: 1, name: 'CNC Machine 01', serial: 'CNC-998', dept: 'Production', team: 'Mechanics', status: 'Active', requests: 3 },
  { id: 2, name: 'HP LaserJet Pro', serial: 'PRT-202', dept: 'Office', team: 'IT Support', status: 'Warning', requests: 1 },
  { id: 3, name: 'Forklift Toyota', serial: 'FL-550', dept: 'Logistics', team: 'Mechanics', status: 'Active', requests: 0 },
  { id: 4, name: 'Dell Server Rack', serial: 'SRV-001', dept: 'IT Room', team: 'IT Support', status: 'Broken', requests: 5 },
];

const mockRequests = [
  { id: 101, subject: 'Leaking Oil', equipment: 'CNC Machine 01', type: 'Corrective', team: 'Mechanics', assignee: 'Ramesh', status: 'New', priority: 'High', date: '2025-12-28' },
  { id: 102, subject: 'Routine Checkup', equipment: 'Forklift Toyota', type: 'Preventive', team: 'Mechanics', assignee: 'Suresh', status: 'In Progress', priority: 'Medium', date: '2025-12-29' },
  { id: 103, subject: 'Paper Jam Error', equipment: 'HP LaserJet Pro', type: 'Corrective', team: 'IT Support', assignee: 'Anita', status: 'Repaired', priority: 'Low', date: '2025-12-25' },
  { id: 104, subject: 'Overheating', equipment: 'Dell Server Rack', type: 'Corrective', team: 'IT Support', assignee: 'Unassigned', status: 'New', priority: 'High', date: '2025-12-27' },
];

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }) => (
  <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col p-4 shadow-xl">
    <div className="flex items-center gap-2 mb-10 px-2">
      <div className="bg-blue-500 p-2 rounded-lg">
        <Wrench size={24} className="text-white" />
      </div>
      <h1 className="text-2xl font-bold tracking-wider">GearGuard</h1>
    </div>
    
    <nav className="space-y-2 flex-1">
      {[
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'kanban', icon: Activity, label: 'Maintenance Board' },
        { id: 'equipment', icon: Settings, label: 'Equipment' },
        { id: 'calendar', icon: Calendar, label: 'Calendar' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
            activeTab === item.id 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <item.icon size={20} />
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </nav>

    <div className="mt-auto px-4 py-4 bg-slate-800 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500"></div>
        <div>
          <p className="text-sm font-medium">Technician</p>
          <p className="text-xs text-slate-400">View Profile</p>
        </div>
      </div>
    </div>
  </div>
);

const KanbanCard = ({ req }) => {
  const priorityColor = req.priority === 'High' ? 'text-red-500 bg-red-50' : req.priority === 'Medium' ? 'text-orange-500 bg-orange-50' : 'text-green-500 bg-green-50';
  const typeColor = req.type === 'Corrective' ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600';

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing mb-3 group">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-xs px-2 py-1 rounded-md font-medium ${typeColor}`}>{req.type}</span>
        <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={16} /></button>
      </div>
      <h4 className="font-semibold text-slate-800 mb-1">{req.subject}</h4>
      <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
        <Settings size={12} /> {req.equipment}
      </p>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
            {req.assignee.charAt(0)}
          </div>
          <span className="text-xs text-slate-500">{req.assignee}</span>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColor} flex items-center gap-1`}>
          <Clock size={12} /> {req.date}
        </div>
      </div>
    </div>
  );
};

const KanbanBoard = () => {
  const columns = ['New', 'In Progress', 'Repaired', 'Scrap'];
  
  return (
    <div className="p-8 bg-slate-50 min-h-screen ml-64">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Maintenance Board</h2>
          <p className="text-slate-500">Drag and drop requests to update status</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all">
          <Plus size={18} /> New Request
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 h-[calc(100vh-150px)]">
        {columns.map(col => (
          <div key={col} className="bg-slate-100/50 rounded-2xl p-4 flex flex-col h-full border border-slate-200">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col === 'New' ? 'bg-blue-500' : col === 'In Progress' ? 'bg-orange-500' : col === 'Repaired' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {col}
              </h3>
              <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">
                {mockRequests.filter(r => r.status === col).length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {mockRequests.filter(r => r.status === col).map(req => (
                <KanbanCard key={req.id} req={req} />
              ))}
              {mockRequests.filter(r => r.status === col).length === 0 && (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-400 text-sm">
                  No requests
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EquipmentCard = ({ item }) => (
  <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl opacity-10 rounded-bl-full ${item.status === 'Active' ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'}`}></div>
    
    <div className="flex justify-between items-start mb-4">
      <div className="bg-slate-50 p-3 rounded-lg text-slate-600">
        <Settings size={24} />
      </div>
      {/* Smart Button Logic */}
      <button className="flex flex-col items-center bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg px-3 py-1 transition-colors">
        <span className="text-xl font-bold text-blue-600 leading-none">{item.requests}</span>
        <span className="text-[10px] text-blue-500 font-semibold uppercase tracking-wide">Requests</span>
      </button>
    </div>

    <h3 className="text-lg font-bold text-slate-800 mb-1">{item.name}</h3>
    <p className="text-sm text-slate-500 mb-4">{item.serial}</p>

    <div className="space-y-2 mb-4">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">Department</span>
        <span className="font-medium text-slate-700">{item.dept}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">Team</span>
        <span className="font-medium text-slate-700">{item.team}</span>
      </div>
    </div>

    <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${item.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm font-medium text-slate-600">{item.status}</span>
    </div>
  </div>
);

const EquipmentView = () => (
  <div className="p-8 bg-slate-50 min-h-screen ml-64">
     <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Equipment Assets</h2>
          <p className="text-slate-500">Manage your machinery and warranty details</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input type="text" placeholder="Search assets..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
           </div>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all">
            <Plus size={18} /> Add Equipment
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEquipment.map(item => (
          <EquipmentCard key={item.id} item={item} />
        ))}
      </div>
  </div>
);

// --- Main App Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState('kanban');

  return (
    <div className="font-sans antialiased bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'kanban' && <KanbanBoard />}
      {activeTab === 'equipment' && <EquipmentView />}
      
      {/* Placeholder for other views */}
      {(activeTab === 'dashboard' || activeTab === 'calendar') && (
        <div className="ml-64 p-8 flex items-center justify-center h-screen">
          <div className="text-center">
             <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
               <Clock size={48} className="text-blue-500" />
             </div>
             <h2 className="text-2xl font-bold text-slate-800">Coming Soon</h2>
             <p className="text-slate-500">This feature is under development for the hackathon!</p>
          </div>
        </div>
      )}
    </div>
  );
}