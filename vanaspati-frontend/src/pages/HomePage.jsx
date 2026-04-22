import HeroSection from '../components/home/HeroSection';
import StatCounters from '../components/home/StatCounters';
import HerbOfDay from '../components/home/HerbOfDay';
import AilmentPills from '../components/home/AilmentPills';
import BodyMap from '../components/home/BodyMap';
import SeasonalPreview from '../components/home/SeasonalPreview';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <main>
        <StatCounters />
        <AilmentPills />
        <BodyMap />
        <HerbOfDay />
        <SeasonalPreview />
      </main>
    </>
  );
}
