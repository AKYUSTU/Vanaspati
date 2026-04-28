import styles from './SeasonalCalendarPage.module.css';
import { useState } from 'react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Static schedule for all 40 DB plants with accurate seasonal data
const schedule = [
  { name: 'Tulsi',          note: 'Sacred basil, warm-season herb. Pinch regularly for bushier growth.', bestMonths: [0,1,2,8,9] },
  { name: 'Ashwagandha',    note: 'Prefers dry, cool planting. Long tap root — avoid waterlogging.', bestMonths: [0,1,2,8,9,10] },
  { name: 'Turmeric',       note: 'Plant rhizomes at start of monsoon. Harvest after 8–10 months.', bestMonths: [3,4,5,6,7] },
  { name: 'Neem',           note: 'Hardy tropical tree. Plant after rain settles in warm weather.', bestMonths: [0,1,2,3,9,10,11] },
  { name: 'Brahmi',         note: 'Loves damp soil and partial shade. Great for pots near water.', bestMonths: [2,3,4,5,6,7] },
  { name: 'Amla',           note: 'Tropical fruit tree. Plant in monsoon; harvest Oct–Feb.', bestMonths: [1,2,3,8,9,10] },
  { name: 'Shatavari',      note: 'Climbing vine for warm-humid months. Needs support structure.', bestMonths: [0,1,2,8,9,10] },
  { name: 'Giloy',          note: 'Vigorous climber — grow on trees or trellises year-round.', bestMonths: [2,3,4,5,8,9] },
  { name: 'Moringa',        note: 'Fast-growing tree. Prune hard in winter for tender new leaves.', bestMonths: [0,1,2,3,10,11] },
  { name: 'Manjistha',      note: 'Climbing herb for warm monsoon months. Shade-tolerant.', bestMonths: [3,4,5,6,7,8] },
  { name: 'Haritaki',       note: 'Deciduous tree. Best planted in monsoon, fruits in winter.', bestMonths: [0,1,9,10,11] },
  { name: 'Mulethi',        note: 'Licorice root — prefers cool dry season. Harvest after 3 years.', bestMonths: [8,9,10,11] },
  { name: 'Gotu Kola',      note: 'Aquatic herb. Needs consistent moisture and shade.', bestMonths: [2,3,4,5,8,9] },
  { name: 'Punarnava',      note: 'Sprawling herb — emerges strongly after monsoon rains.', bestMonths: [5,6,7,8] },
  { name: 'Vidanga',        note: 'Climbing shrub. Berries harvested in cool dry months.', bestMonths: [0,1,2,9,10,11] },
  { name: 'Ajwain',         note: 'Cool season herb. Sow seeds in Sep–Oct for winter harvest.', bestMonths: [8,9,10,11] },
  { name: 'Kalonji',        note: 'Winter annual. Sow Oct–Nov; harvest seeds in Feb–Mar.', bestMonths: [9,10,11,0,1] },
  { name: 'Arjun',          note: 'Large riparian tree. Bark harvested in summer months.', bestMonths: [5,6,7,8,9] },
  { name: 'Senna',          note: 'Drought-tolerant shrub. Grows well in warm dry months.', bestMonths: [0,1,2,3,10,11] },
  { name: 'Atees',          note: 'High altitude alpine herb. Short summer growing season.', bestMonths: [4,5,6,7] },
  { name: 'Nilavembu',      note: 'Monsoon herb — blooms prolifically in rainy season.', bestMonths: [5,6,7,8,9] },
  { name: 'Keezhanelli',    note: 'Warm-wet season herb found in garden beds and waste ground.', bestMonths: [5,6,7,8] },
  { name: 'Thoothuvalai',   note: 'Thorny climber — grows in warm coastal regions year-round.', bestMonths: [3,4,5,6,7,8] },
  { name: 'Kokilaksha',     note: 'Wetland herb — thrives in waterlogged spots during monsoon.', bestMonths: [5,6,7,8] },
  { name: 'Vembu Siddha',   note: 'Neem variant used in Siddha. Best in warm tropical seasons.', bestMonths: [0,1,2,3,10,11] },
  { name: 'Arnica Montana',  note: 'Alpine meadow plant. Blooms in European summer months.', bestMonths: [4,5,6,7] },
  { name: 'Belladonna',     note: 'Shade-loving woodland plant. Spring to summer growing season.', bestMonths: [2,3,4,5,6] },
  { name: 'Calendula',      note: 'Cool season annual. Sow in autumn for winter-spring bloom.', bestMonths: [8,9,10,11,0,1] },
  { name: 'Hypericum',      note: "St. John's Wort — summer bloomer, harvested when in full flower.", bestMonths: [4,5,6,7] },
  { name: 'Pulsatilla',     note: 'Early spring alpine flower. Very short growing window.', bestMonths: [1,2,3,4] },
  { name: 'Shankhpushpi',   note: 'Low sprawling herb — best in cool dry winter months.', bestMonths: [0,1,2,10,11] },
  { name: 'Vacha',          note: 'Wetland/water herb — grows best in monsoon and post-monsoon.', bestMonths: [5,6,7,8,9] },
  { name: 'Jatamansi',      note: 'Himalayan alpine herb. Grows in cool-moist mountain conditions.', bestMonths: [4,5,6,7] },
  { name: 'Kapikacchu',     note: 'Tropical vine — vigorous monsoon grower with furry pods.', bestMonths: [4,5,6,7,8] },
  { name: 'Bhringraj',      note: 'Wet-season herb. Prefers humid soil near streams or ponds.', bestMonths: [2,3,4,5,6,7] },
  { name: 'Peppermint',     note: 'Cool season mint. Spreads rapidly — grow in contained pots.', bestMonths: [2,3,4,5,8,9] },
  { name: 'Cardamom',       note: 'Shade-loving tropical plant. Thrives in humid monsoon forests.', bestMonths: [4,5,6,7,8] },
  { name: 'Cinnamon',       note: 'Tropical tree bark — harvested from young shoots year-round.', bestMonths: [0,1,2,3,9,10,11] },
  { name: 'Clove',          note: 'Tropical evergreen — flowers and buds harvested Oct–Jan.', bestMonths: [9,10,11,0] },
  { name: 'Fennel',         note: 'Cool season herb. Sow in autumn; harvest seeds in spring.', bestMonths: [8,9,10,11,0] },
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
  const [search, setSearch] = useState('');

  const currentMonthPlants = schedule.filter(p => p.bestMonths.includes(selectedMonth));

  const filtered = search.trim()
    ? schedule.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : schedule;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Seasonal guide</p>
        <h1>Seasonal Plant Calendar</h1>
        <p className={styles.lead}>
          Track when all 40 medicinal plants thrive — filter by month to plan your garden and harvests.
        </p>
      </section>

      {/* Month at a glance */}
      <section className={styles.glanceBox}>
        <h2 className={styles.glanceTitle}>
          🌿 Best plants for <strong>{months[selectedMonth]}</strong>
          <span className={styles.glanceCount}>{currentMonthPlants.length} plants</span>
        </h2>
        <div className={styles.glancePills}>
          {currentMonthPlants.map(p => (
            <span key={p.name} className={styles.glancePill}>{p.name}</span>
          ))}
        </div>
      </section>

      <MonthSelector selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />

      {/* Search */}
      <div className={styles.searchRow}>
        <input
          type="search"
          placeholder="Search plant name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
          aria-label="Search plants in calendar"
        />
        {search && (
          <button className={styles.clearBtn} onClick={() => setSearch('')} type="button">✕ Clear</button>
        )}
      </div>

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
            {filtered.map((entry) => (
              <tr key={entry.name} className={entry.bestMonths.includes(selectedMonth) ? styles.highlightedRow : ''}>
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
        <p><strong>Disclaimer:</strong> The seasonal planting calendar and herbal information provided are for educational purposes only. Always consult a qualified healthcare provider or Ayurvedic practitioner before using any plant for medicinal purposes.</p>
      </section>
    </main>
  );
}
