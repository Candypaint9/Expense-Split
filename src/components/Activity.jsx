import React from 'react';

// Dummy activity data (structured)
const activities = [
  { id: 1, date: '2025-05-17', type: 'owe', amount: '$20', person: 'John Doe', activity: 'dinner' },
  { id: 2, date: '2025-05-17', type: 'lent', amount: '$50', person: 'Jane Smith', activity: 'groceries' },
  { id: 3, date: '2025-05-16', type: 'lent', amount: '$100', person: 'Bob Brown', activity: 'loan' },
  { id: 4, date: '2025-05-16', type: 'owe', amount: '$35', person: 'Alice Johnson', activity: 'concert tickets' },
  { id: 5, date: '2025-05-15', type: 'owe', amount: '$75', person: 'Charlie Lee', activity: 'gas' },
];

// Format date to readable form
const formatDate = dateStr => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

export default function ActivityPage() {
  // Sort activities by date descending
  const sorted = [...activities].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Group by date
  const grouped = sorted.reduce((acc, act) => {
    if (!acc[act.date]) acc[act.date] = [];
    acc[act.date].push(act);
    return acc;
  }, {});

  // Dates sorted descending
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  // Styles
  const colors = {
    owe: '#dc3545',   // red for owe
    lent: '#3ac162',  // green for lent
  };
  const styles = {
    page: {
      padding: '20px',
      width: '100%',
      boxSizing: 'border-box',
      background: '#f5f5f5',
    },
    groupCard: {
      background: '#fff',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    dateHeader: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#3ac162',
      marginBottom: '10px',
    },
    list: { listStyle: 'none', padding: 0, margin: 0 },
    item: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 10px',
      marginBottom: '10px',
      background: '#fafafa',
      borderRadius: '4px',
    },
    text: { fontSize: '1rem', color: '#333', margin: '0 6px' },
    action: type => ({ color: colors[type], fontWeight: 600, margin: '0 6px' }),
    amount: { margin: '0 6px', fontWeight: 500 },
    person: { margin: '0 6px', fontWeight: 500 },
    activity: { margin: '0 6px', fontWeight: 400, color: '#555' },
  };

  return (
    <div style={styles.page}>
      {sortedDates.map((date, idx) => (
        <div
          key={date}
          style={{
            ...styles.groupCard,
            marginTop: idx === 0 ? '50px' : '20px'
          }}
        >
          <div style={styles.dateHeader}>{formatDate(date)}</div>
          <ul style={styles.list}>
            {grouped[date].map(item => (
              <li key={item.id} style={styles.item}>
                <span style={styles.text}>You</span>
                <span style={styles.action(item.type)}>
                  {item.type === 'lent' ? 'lent' : 'owe'}
                </span>
                <span style={styles.person}>{item.person}</span>
                <span style={styles.amount}>{item.amount}</span>
                <span style={styles.text}>for</span>
                <span style={styles.activity}>{item.activity}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}