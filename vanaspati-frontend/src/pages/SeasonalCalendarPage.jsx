import styles from './SeasonalCalendarPage.module.css';
import { useState } from 'react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const schedule = [
  {
    name: 'Tulsi',
    note: 'Warm days, regular pinching, and light watering keep the plant compact.',
    bestMonths: [0, 1, 2, 8, 9]
  },
  {
    name: 'Neem',
    note: 'A hardy tree that prefers warm establishment periods and spacious roots.',
    bestMonths: [0, 1, 2, 3, 9, 10, 11]
  },
  {
    name: 'Turmeric',
    note: 'Golden rhizome known for its anti-inflammatory properties and warming kitchen preparations.',
    bestMonths: [3, 4, 5, 6, 7]
  },
  {
    name: 'Ginger',
    note: 'Spicy rhizome used across cuisines and comfort preparations for digestion and immunity.',
    bestMonths: [3, 4, 5, 6, 7]
  },
  {
    name: 'Ashwagandha',
    note: 'Grounding root herb long associated with steady vitality, stress relief and energy.',
    bestMonths: [0, 1, 2, 8, 9, 10]
  },
  {
    name: 'Brahmi',
    note: 'A creeping herb favored in memory and focus traditions across Ayurvedic practice.',
    bestMonths: [2, 3, 4, 5, 6, 7]
  },
  {
    name: 'Amla',
    note: 'Performs well in cooler planting windows and benefits from deep soil.',
    bestMonths: [1, 2, 3, 8, 9, 10]
  },
  {
    name: 'Guduchi',
    note: 'Climbing vine traditionally valued as a balancing, restorative and immunity-boosting plant.',
    bestMonths: [2, 3, 4, 5, 8, 9]
  },
  {
    name: 'Bhringraj',
    note: 'Thrives in humid weather with partial shade and even irrigation.',
    bestMonths: [2, 3, 4, 5, 6, 7]
  },
  {
    name: 'Licorice',
    note: 'Sweet root used in soothing preparations, herbal blends and respiratory support.',
    bestMonths: [8, 9, 10, 11]
  },
  {
    name: 'Aloe Vera',
    note: 'Succulent plant well-regarded for its cooling, soothing gel and digestive health applications.',
    bestMonths: [2, 3, 4, 5, 6, 7, 8]
  },
  {
    name: 'Shatavari',
    note: 'Cooling root known as a premier rejuvenating herb for women’s health in Ayurveda.',
    bestMonths: [0, 1, 2, 8, 9, 10]
  },
  {
    name: 'Arjuna',
    note: 'Tree bark traditionally associated with cardiovascular wellness and emotional balance.',
    bestMonths: [5, 6, 7, 8, 9]
  },
  {
    name: 'Gotu Kola',
    note: 'Small aquatic herb reputed to support mental clarity, healing, and skin vitality.',
    bestMonths: [2, 3, 4, 5, 8, 9]
  },
  {
    name: 'Haritaki',
    note: 'Considered the king of medicines in Tibet, a cornerstone of Triphala for digestive cleansing.',
    bestMonths: [0, 1, 9, 10, 11]
  }
];

function MonthSelector({ selectedMonth, onSelectMonth }) {
  return (
    <section className={styles.monthSelector} aria-label="Select calendar month">
      {months.map((month, index) => (
        <button
          key={month}
          type="button"
          onClick={() => onSelectMonth(index)}
          className={`${styles.monthButton} ${selectedMonth === index ? styles.monthButtonActive : ''}`}
          aria-pressed={selectedMonth === index}
        >
          {month}
        </button>
      ))}
    </section>
  );
}

export default function SeasonalCalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Seasonal guide</p>
        <h1>Seasonal Plant Calendar</h1>
        <p className={styles.lead}>Use this as a practical planning view for sowing, transplanting, and care cycles across the year.</p>
      </section>

      <MonthSelector selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />

      <section className={styles.tableWrap} aria-label="Seasonal planting calendar">
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Plant</th>
              {months.map((month, index) => (
                <th key={month} className={selectedMonth === index ? styles.activeMonthHeader : ''}>{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.map((entry) => (
              <tr key={entry.name}>
                <th scope="row">
                  <span>{entry.name}</span>
                  <small>{entry.note}</small>
                </th>
                {months.map((month, index) => (
                  <td key={`${entry.name}-${month}`} className={selectedMonth === index ? styles.activeMonthColumn : ''}>
                    <span className={entry.bestMonths.includes(index) ? styles.activeDot : styles.inactiveDot} aria-hidden="true" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.legend} aria-label="Calendar legend">
        <div><span className={styles.activeDot} aria-hidden="true" /> Better planting/care window</div>
        <div><span className={styles.inactiveDot} aria-hidden="true" /> General maintenance only</div>
      </section>

      <section className={styles.disclaimer} aria-label="Medical Disclaimer">
        <p><strong>Disclaimer:</strong> The seasonal planting calendar and herbal information provided are for educational purposes only. Always consult a qualified healthcare provider or Ayurvedic practitioner before using any plant for medicinal purposes. Do not use this as a substitute for professional medical advice.</p>
      </section>
    </main>
  );
}
