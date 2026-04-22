import { useState } from 'react';
import styles from './AyushTabs.module.css';

const systems = ['AYURVEDA', 'UNANI', 'SIDDHA', 'HOMEOPATHY'];

const systemFocus = {
  AYURVEDA: 'Constitution-oriented usage with rasa, virya, and vipaka interpretation.',
  UNANI: 'Temperament and humoral balance perspective for formulation choices.',
  SIDDHA: 'Elemental balance and traditional compound usage perspective.',
  HOMEOPATHY: 'Symptom similarity and individualized response perspective.',
};

function summarizePlantForSystem(plant, system) {
  const getPropString = (prop) => (Array.isArray(prop) ? prop.join(', ') : String(prop || '')).trim();

  const parts = getPropString(plant?.partsUsed);
  const body = getPropString(plant?.bodyParts);
  const rasa = getPropString(plant?.rasa);
  const virya = getPropString(plant?.virya);
  const vipaka = getPropString(plant?.vipaka);

  const lines = [systemFocus[system]];
  if (parts) lines.push(`Typically used parts: ${parts}.`);
  if (body) lines.push(`Commonly discussed body systems: ${body}.`);

  if (system === 'AYURVEDA') {
    const profile = [rasa && `Rasa: ${rasa}`, virya && `Virya: ${virya}`, vipaka && `Vipaka: ${vipaka}`]
      .filter(Boolean)
      .join(' | ');
    if (profile) lines.push(`Classical profile: ${profile}.`);
  }

  return lines.join(' ');
}

export default function AyushTabs({ plant }) {
  const [active, setActive] = useState('AYURVEDA');

  return (
    <div className={styles.wrap}>
      <div className={styles.tabRow}>
        {systems.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setActive(s)}
            className={`${styles.tabBtn} ${active === s ? styles.active : ''}`}
          >
            {s}
          </button>
        ))}
      </div>
      <p className={styles.note}>{summarizePlantForSystem(plant, active)}</p>
    </div>
  );
}
