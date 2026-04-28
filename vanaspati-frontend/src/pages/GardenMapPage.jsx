import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import GardenSVGMap from '../components/garden/GardenSVGMap';
import ZonePanel from '../components/garden/ZonePanel';
import {
  assignPlantToZone,
  createGardenZone,
  deleteGardenZone,
  fetchGardenZones,
  fetchZonePlants,
  removePlantFromZone,
} from '../api/garden';
import { searchPlants } from '../api/plants';
import styles from './GardenMapPage.module.css';

export default function GardenMapPage() {
  const queryClient = useQueryClient();
  const token = window.localStorage.getItem('vanaspati_token');
  const [activeZoneId, setActiveZoneId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newZone, setNewZone] = useState({
    zoneName: '',
    description: '',
    colorHex: '#4A8C5C',
    iconEmoji: 'ZG',
  });

  const { data: zones = [] } = useQuery({
    queryKey: ['garden-zones'],
    queryFn: fetchGardenZones,
  });

  const activeZone = useMemo(
    () => zones.find((zone) => zone.id === activeZoneId) || null,
    [zones, activeZoneId]
  );

  const { data: zonePlantsData } = useQuery({
    queryKey: ['garden-zone-plants', activeZoneId],
    queryFn: () => fetchZonePlants(activeZoneId),
    enabled: Boolean(activeZoneId),
  });

  const { data: plantSearchResults = [] } = useQuery({
    queryKey: ['garden-plant-search', searchTerm],
    queryFn: () => searchPlants(searchTerm),
    enabled: Boolean(searchTerm && searchTerm.length > 1),
  });

  const createZoneMutation = useMutation({
    mutationFn: createGardenZone,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['garden-zones'] });
      setNewZone({ zoneName: '', description: '', colorHex: '#4A8C5C', iconEmoji: 'ZG' });
      setActiveZoneId(created.id);
    },
  });

  const deleteZoneMutation = useMutation({
    mutationFn: deleteGardenZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garden-zones'] });
      setActiveZoneId(null);
    },
  });

  const assignPlantMutation = useMutation({
    mutationFn: ({ zoneId, plantId }) => assignPlantToZone(zoneId, plantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garden-zone-plants', activeZoneId] });
      queryClient.invalidateQueries({ queryKey: ['garden-zones'] });
      setSearchTerm('');
    },
  });

  const removePlantMutation = useMutation({
    mutationFn: ({ zoneId, plantId }) => removePlantFromZone(zoneId, plantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garden-zone-plants', activeZoneId] });
      queryClient.invalidateQueries({ queryKey: ['garden-zones'] });
    },
  });

  return (
    <main className={styles.root}>
      <section className={styles.topBar}>
        <span className={styles.topText}>Welcome to the Vanaspati Garden — Click a zone to explore plants</span>
        {token
          ? <span className={styles.hint}>You can create personal zones and assign plants.</span>
          : <a href="/login" className={styles.hintLink}>Sign in to create your own zones →</a>
        }
      </section>

      <div className={styles.layout}>
        <div className={styles.mapWrap}>
          <GardenSVGMap
            zones={zones}
            activeZone={activeZone}
            onZoneClick={(zone) => setActiveZoneId(zone.id)}
          />
        </div>

        {/* Right panel: shows zone detail when a zone is selected, else shows create form */}
        <aside className={styles.createPanel}>
          {activeZone ? (
            <ZonePanel
              zone={activeZone}
              plants={zonePlantsData?.plants || []}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              plantSearchResults={plantSearchResults}
              onAddPlant={(plantId) => assignPlantMutation.mutate({ zoneId: activeZoneId, plantId })}
              onRemovePlant={(plantId) => removePlantMutation.mutate({ zoneId: activeZoneId, plantId })}
              onDeleteZone={() => deleteZoneMutation.mutate(activeZoneId)}
              canManage={Boolean(token && activeZone?.userOwned)}
              pending={
                assignPlantMutation.isPending ||
                removePlantMutation.isPending ||
                deleteZoneMutation.isPending
              }
              onClose={() => setActiveZoneId(null)}
            />
          ) : (
            <>
              <h3>Create Personal Zone</h3>
              {!token ? (
                <p className={styles.message}>
                  <a href="/login" className={styles.signInLink}>Sign in</a> to create and edit personal garden zones.
                </p>
              ) : null}
              <input
                placeholder="Zone name"
                value={newZone.zoneName}
                onChange={(e) => setNewZone((prev) => ({ ...prev, zoneName: e.target.value }))}
                disabled={!token}
              />
              <textarea
                rows={3}
                placeholder="Short description"
                value={newZone.description}
                onChange={(e) => setNewZone((prev) => ({ ...prev, description: e.target.value }))}
                disabled={!token}
              />
              <div className={styles.row}>
                <input
                  placeholder="#4A8C5C"
                  value={newZone.colorHex}
                  onChange={(e) => setNewZone((prev) => ({ ...prev, colorHex: e.target.value }))}
                  disabled={!token}
                />
                <input
                  placeholder="Icon"
                  value={newZone.iconEmoji}
                  onChange={(e) => setNewZone((prev) => ({ ...prev, iconEmoji: e.target.value }))}
                  disabled={!token}
                />
              </div>
              <button
                type="button"
                className={styles.primaryBtn}
                disabled={!token || !newZone.zoneName.trim() || createZoneMutation.isPending}
                onClick={() => createZoneMutation.mutate(newZone)}
              >
                {createZoneMutation.isPending ? 'Creating...' : 'Create Zone'}
              </button>
              {createZoneMutation.error ? <p className={styles.error}>Unable to create zone.</p> : null}
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
