import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getPlant } from '../api/plants';
import ImageGallery from '../components/detail/ImageGallery';
import OriginMap from '../components/detail/OriginMap';
import AyushTabs from '../components/detail/AyushTabs';
import CultivationCards from '../components/detail/CultivationCards';
import RecipeCard from '../components/detail/RecipeCard';
import PrecautionBox from '../components/detail/PrecautionBox';
import { parseListField } from '../utils/plantData';
import { shouldShowMedicinalUses } from '../utils/plantDetailSections';
import styles from './PlantDetailPage.module.css';

export default function PlantDetailPage() {
  const { id } = useParams();
  const { data: plant, isLoading } = useQuery({ queryKey: ['plant', id], queryFn: () => getPlant(id), enabled: Boolean(id) });

  if (isLoading) {
    return (
      <main style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh',gap:'16px',flexDirection:'column'}}>
        <div style={{width:'48px',height:'48px',border:'3px solid rgba(74,140,92,0.2)',borderTopColor:'#4a8c5c',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
        <p style={{fontFamily:"'Cormorant Garamond', serif",fontSize:'1.4rem',color:'#2c5f3f',margin:0}}>Loading plant details…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </main>
    );
  }


  const galleryImages = parseListField(plant?.galleryImages);
  const bodyParts = parseListField(plant?.bodyParts);
  const partsUsed = parseListField(plant?.partsUsed);
  const hasVisuals = galleryImages.length > 0 || Boolean(plant?.mainImageUrl);
  const hasPrecautions = Boolean(plant?.precautions || plant?.contraindications);
  const hasMedicinalUses = shouldShowMedicinalUses(partsUsed, bodyParts, plant);

  const recipeCards = [
    {
      title: `${plant?.commonName || 'Plant'} Daily Infusion`,
      forAilment: bodyParts[0] || 'General wellness',
      prepMinutes: 12,
      level: 'Beginner',
      steps: [
        `Use a cleaned portion of ${partsUsed[0] || 'the recommended part'} and add warm water.`,
        'Steep gently for 8 to 10 minutes without vigorous boiling.',
        'Strain and consume in small portions while monitoring tolerance.',
      ],
    },
    {
      title: `${plant?.commonName || 'Plant'} Support Decoction`,
      forAilment: bodyParts[1] || bodyParts[0] || 'Seasonal support',
      prepMinutes: 18,
      level: 'Intermediate',
      steps: [
        `Combine ${partsUsed[1] || partsUsed[0] || 'usable plant material'} with water in a clean vessel.`,
        'Simmer on low heat until reduced to approximately two-thirds volume.',
        'Cool to warm temperature and take only in practitioner-advised quantity.',
      ],
    },
  ];

  return (
    <main className={styles.layout}>
      <article className={styles.content}>
        <section id="overview">
          <h1>{plant?.commonName || 'Plant Detail'}</h1>
          <p>{plant?.scientificName}</p>
          <p className={styles.muted}>{plant?.description || 'No detailed description is currently available for this record.'}</p>
          <ImageGallery mainImageUrl={plant?.mainImageUrl} galleryImages={galleryImages} commonName={plant?.commonName} />
          <OriginMap nativeRegion={plant?.nativeRegion} nativeLat={plant?.nativeLat} nativeLng={plant?.nativeLng} />
        </section>

        {plant?.morphology ? (
          <section id="botanical-description">
            <h2>Botanical Description</h2>
            <p>{plant.morphology}</p>
          </section>
        ) : null}

        {hasMedicinalUses ? (
          <section id="medicinal-uses">
            <h2>Medicinal Uses</h2>
            <p><strong>Parts Used:</strong> {partsUsed.length ? partsUsed.join(', ') : plant?.partsUsed || 'Not specified'}</p>
            <p><strong>Target Body Systems:</strong></p>
            {bodyParts.length ? (
              <div className={styles.chipRow}>
                {bodyParts.map((item) => (
                  <span key={item} className={styles.chip}>
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p>{plant?.bodyParts || 'No mapped systems available.'}</p>
            )}
          </section>
        ) : null}
        <section id="ayush-applications"><h2>AYUSH Applications</h2><AyushTabs plant={plant} /></section>
        <section id="cultivation-guide"><h2>Cultivation Guide</h2><CultivationCards plant={plant} /></section>
        {plant?.activeCompounds ? (
          <section id="phytochemistry"><h2>Phytochemistry</h2><p>{plant.activeCompounds}</p></section>
        ) : null}
        {plant?.identifyingFeatures ? (
          <section id="research-studies">
            <h2>Research & Studies</h2>
            <p>{plant.identifyingFeatures}</p>
          </section>
        ) : null}
        <section id="traditional-recipes">
          <h2>Traditional Preparation Notes</h2>
          {recipeCards.map((recipe) => (
            <RecipeCard
              key={recipe.title}
              title={recipe.title}
              forAilment={recipe.forAilment}
              prepMinutes={recipe.prepMinutes}
              level={recipe.level}
              steps={recipe.steps}
            />
          ))}
        </section>
        {hasPrecautions ? (
          <section id="precautions"><h2>Precautions</h2><PrecautionBox text={[plant?.precautions, plant?.contraindications].filter(Boolean).join(' ')} /></section>
        ) : null}
      </article>
    </main>
  );
}
