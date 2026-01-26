# Vidéo Powalyze Manifeste

Ce fichier est un placeholder pour la vidéo "Powalyze – Le Manifeste.mp4"

## Instructions pour uploader la vidéo:

1. Placez votre fichier vidéo "Powalyze – Le Manifeste.mp4" dans ce répertoire
2. Renommez-le en: `powalyze-manifeste.mp4`
3. La vidéo sera automatiquement utilisée comme background du hero

## Spécifications attendues:

- Format: MP4 (H.264)
- Résolution recommandée: 1920x1080 ou supérieure
- Durée: Variable
- Optimisé pour le web (compression appropriée)
- Autoplay compatible (pas de son requis au démarrage)

## Utilisation actuelle:

La vidéo est référencée dans `app/page.tsx` dans le composant Hero:

```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 h-full w-full object-cover"
  src="/videos/powalyze-manifeste.mp4"
/>
```
