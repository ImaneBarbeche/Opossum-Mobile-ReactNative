# Projet Opossum Mobile - React Native

Application mobile pour objets perdus/trouvés développée avec Expo et React Native.

## 🎨 Design System

Cette application suit une charte graphique cohérente basée sur les maquettes Canva. Consultez le fichier [`CHARTE_GRAPHIQUE.md`](./opossum-mobile/CHARTE_GRAPHIQUE.md) pour tous les détails du design system.

### Couleurs principales
- **Vert principal** : `#A8D5A8` (couleur de marque)
- **Vert foncé** : `#85C485` (états hover/active)
- **Vert clair** : `#C8E6C8` (arrière-plans)

### Structure des écrans
L'application comprend :
- **Accueil** : Navigation principale vers "Objet perdu" et "Objet trouvé"
- **Listes** : Affichage des annonces avec filtres
- **Formulaires** : Création d'annonces avec photo et géolocalisation
- **Détails** : Vue complète d'une annonce avec possibilité de contact
- **Messages** : Chat entre utilisateurs
- **Profil** : Gestion du compte utilisateur

## 📁 Structure du projet

```
opossum-mobile/
├── src/
│   ├── components/     # Composants réutilisables
│   ├── screens/        # Écrans de l'application
│   ├── navigation/     # Configuration de navigation
│   ├── services/       # Services API
│   ├── models/         # Types TypeScript
│   ├── config/         # Configuration (couleurs, styles)
│   ├── context/        # Contextes React
│   ├── hooks/          # Hooks personnalisés
│   └── utils/          # Utilitaires
├── assets/             # Images et icônes
└── CHARTE_GRAPHIQUE.md # Documentation du design system
```

## 🚀 Développement

### Installation
```bash
cd opossum-mobile
npm install
```

### Lancement
```bash
npm start
```

## 📋 Tickets de développement

Consultez le fichier [`tickets_opossum_mobile_reactnative.csv`](./tickets_opossum_mobile_reactnative.csv) pour le planning détaillé de développement.
