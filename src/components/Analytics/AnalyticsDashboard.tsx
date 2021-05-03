import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Board } from '../../types';
import './AnalyticsDashboard.css';

interface AnalyticsDashboardProps {
  board: Board;
  onClose: () => void;
}

const PRIORITY_COLORS = {
  high: '#de350b',
  medium: '#ff8b00',
  low: '#36b37e',
};

const LABEL_COLORS = ['#0052cc', '#de350b', '#6554c0', '#00b8d9', '#8993a4'];

function AnalyticsDashboard({ board, onClose }: AnalyticsDashboardProps) {
  const cards = Object.values(board.cards);
  const columns = board.columnIds.map(id => board.columns[id]).filter(Boolean);

  // Cards per column
  const columnData = columns.map(col => ({
    name: col.title,
    cards: col.cardIds.length,
  }));

  // Priority distribution
  const priorityCounts = cards.reduce(
    (acc, card) => {
      acc[card.priority] = (acc[card.priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const priorityData = Object.entries(priorityCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Label distribution
  const labelCounts = cards.reduce(
    (acc, card) => {
      card.labels.forEach(label => {
        acc[label] = (acc[label] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );
  const labelData = Object.entries(labelCounts).map(([name, value]) => ({ name, value }));

  // Completion rate (cards in last column = Done)
  const lastColumn = columns[columns.length - 1];
  const doneCount = lastColumn?.cardIds.length ?? 0;
  const totalCards = cards.length;
  const completionRate = totalCards > 0 ? Math.round((doneCount / totalCards) * 100) : 0;

  // Mock activity data for line chart (last 7 days)
  const activityData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    cards: Math.floor(Math.random() * 8) + 1,
  }));

  return (
    <div className="modal-overlay analytics-overlay" onClick={onClose}>
      <div className="analytics-modal" onClick={e => e.stopPropagation()}>
        <div className="analytics-header">
          <h2>Board Analytics: {board.title}</h2>
          <button className="analytics-close" onClick={onClose}>×</button>
        </div>

        {/* KPI cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-value">{totalCards}</span>
            <span className="kpi-label">Total Cards</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-value">{columns.length}</span>
            <span className="kpi-label">Columns</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-value">{completionRate}%</span>
            <span className="kpi-label">Completion Rate</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-value">{board.memberIds.length}</span>
            <span className="kpi-label">Members</span>
          </div>
        </div>

        <div className="charts-grid">
          {/* Cards per column */}
          <div className="chart-card">
            <h3>Cards per Column</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={columnData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="cards" fill="#0052cc" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Priority distribution */}
          <div className="chart-card">
            <h3>Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {priorityData.map(entry => (
                    <Cell
                      key={entry.name}
                      fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS] || '#ccc'}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Activity over time */}
          <div className="chart-card">
            <h3>Activity (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cards"
                  stroke="#0052cc"
                  strokeWidth={2}
                  dot={{ fill: '#0052cc' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Label distribution */}
          {labelData.length > 0 && (
            <div className="chart-card">
              <h3>Labels</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={labelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {labelData.map((_, index) => (
                      <Cell key={index} fill={LABEL_COLORS[index % LABEL_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
