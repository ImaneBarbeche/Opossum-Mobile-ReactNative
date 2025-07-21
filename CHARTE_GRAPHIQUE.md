# 🎨 Charte Graphique - Opossum Mobile

## 📱 Vue d'ensemble
Application mobile pour objets perdus/trouvés avec une interface moderne et intuitive, utilisant un design system cohérent.

---

## 🎨 Palette de Couleurs

### Couleurs Principales
```css
/* Vert principal - Couleur de marque */
--primary-green: #A8D5A8;
--primary-green-dark: #85C485;
--primary-green-light: #C8E6C8;

/* Couleurs neutres */
--white: #FFFFFF;
--light-gray: #F5F5F5;
--medium-gray: #E0E0E0;
--dark-gray: #666666;
--black: #000000;

/* Couleurs d'action */
--success: #4CAF50;
--warning: #FF9800;
--error: #F44336;
--info: #2196F3;
```

### Couleurs d'États
```css
/* Navigation active */
--nav-active: #A8D5A8;
--nav-inactive: #999999;

/* Boutons */
--button-primary: #A8D5A8;
--button-secondary: #FFFFFF;
--button-text-primary: #FFFFFF;
--button-text-secondary: #A8D5A8;
```

---

## 📝 Typographie

### Hiérarchie des Titres
```css
/* H1 - Titre principal */
font-family: 'Roboto', sans-serif;
font-size: 24px;
font-weight: 700;
color: #000000;

/* H2 - Sous-titres */
font-family: 'Roboto', sans-serif;
font-size: 20px;
font-weight: 600;
color: #000000;

/* H3 - Titres de sections */
font-family: 'Roboto', sans-serif;
font-size: 18px;
font-weight: 500;
color: #000000;

/* Body - Texte courant */
font-family: 'Roboto', sans-serif;
font-size: 16px;
font-weight: 400;
color: #000000;
line-height: 1.5;

/* Caption - Texte secondaire */
font-family: 'Roboto', sans-serif;
font-size: 14px;
font-weight: 400;
color: #666666;

/* Button Text */
font-family: 'Roboto', sans-serif;
font-size: 16px;
font-weight: 500;
```

---

## 🔲 Composants UI

### Boutons

#### Bouton Principal
```css
background-color: #A8D5A8;
color: #FFFFFF;
border-radius: 8px;
padding: 12px 24px;
font-weight: 500;
border: none;
```

#### Bouton Secondaire
```css
background-color: #FFFFFF;
color: #A8D5A8;
border: 2px solid #A8D5A8;
border-radius: 8px;
padding: 12px 24px;
font-weight: 500;
```

#### Bouton d'Action Flottant (FAB)
```css
background-color: #A8D5A8;
color: #FFFFFF;
border-radius: 28px;
width: 56px;
height: 56px;
shadow: 0 4px 8px rgba(0,0,0,0.2);
```

### Cartes d'Annonces
```css
background-color: #FFFFFF;
border-radius: 12px;
padding: 16px;
margin: 8px 0;
shadow: 0 2px 4px rgba(0,0,0,0.1);
border: 1px solid #E0E0E0;
```

### Champs de Saisie
```css
background-color: #FFFFFF;
border: 1px solid #E0E0E0;
border-radius: 8px;
padding: 12px 16px;
font-size: 16px;
color: #000000;

/* Focus */
border-color: #A8D5A8;
outline: none;
```

---

## 📐 Espacements & Grille

### Système d'Espacement (en pixels)
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-xxl: 48px;
```

### Marges Standards
- **Marges écran** : 16px
- **Espacement entre composants** : 16px
- **Espacement interne cartes** : 16px
- **Espacement entre éléments** : 8px

---

## 🖼️ Images & Icônes

### Images d'Objets
```css
border-radius: 8px;
aspect-ratio: 16:9;
object-fit: cover;
```

### Icônes
- **Taille standard** : 24px x 24px
- **Couleur principale** : #A8D5A8
- **Couleur inactive** : #999999
- **Style** : Outline (trait fin)

### Avatar Utilisateur
```css
border-radius: 50%;
width: 40px;
height: 40px;
border: 2px solid #E0E0E0;
```

---

## 🧭 Navigation

### Tab Bar (Navigation Principale)
```css
background-color: #FFFFFF;
height: 60px;
border-top: 1px solid #E0E0E0;
shadow: 0 -2px 4px rgba(0,0,0,0.1);

/* Icônes actives */
color: #A8D5A8;
font-weight: 600;

/* Icônes inactives */
color: #999999;
font-weight: 400;
```

### Header
```css
background-color: #A8D5A8;
color: #FFFFFF;
height: 56px;
padding: 0 16px;
font-size: 20px;
font-weight: 600;
```

---

## 🎭 États des Composants

### Loading States
```css
/* Shimmer effect */
background: linear-gradient(90deg, #F0F0F0 25%, #E0E0E0 50%, #F0F0F0 75%);
animation: shimmer 1.5s infinite;
```

### États Hover/Press
```css
/* Bouton principal pressed */
background-color: #85C485;

/* Carte pressed */
transform: scale(0.98);
shadow: 0 1px 2px rgba(0,0,0,0.1);
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile** : 375px - 414px (iPhone)
- **Tablet** : 768px - 1024px (iPad)

### Adaptations
- **Marges mobiles** : 16px
- **Marges tablettes** : 24px
- **Grille cartes** : 1 colonne mobile, 2 colonnes tablette

---

## ✨ Animations & Transitions

### Transitions Standards
```css
transition: all 0.2s ease-in-out;
```

### Animations Spécifiques
- **Changement d'écran** : Slide horizontal (300ms)
- **Apparition modale** : Fade + Scale (250ms)
- **Boutons** : Scale on press (100ms)
- **Loading** : Rotation continue (1s)

---

## 🎯 Accessibilité

### Contraste
- **Texte principal** : Ratio 4.5:1 minimum
- **Texte secondaire** : Ratio 3:1 minimum
- **Éléments interactifs** : Taille minimum 44px

### Navigation
- **Support lecteur d'écran** : Tous les éléments étiquetés
- **Navigation clavier** : Focus visible sur tous les éléments
- **Zones de touch** : Minimum 44px x 44px

---

## 📦 Assets à Créer

### Icônes Nécessaires
- [ ] Home (maison)
- [ ] Search (loupe)
- [ ] Add (plus)
- [ ] Profile (utilisateur)
- [ ] Messages (chat)
- [ ] Camera (appareil photo)
- [ ] Location (pin GPS)
- [ ] Heart (favoris)
- [ ] Filter (filtre)
- [ ] Back (flèche retour)

### Images
- [ ] Logo Opossum
- [ ] Placeholder objets
- [ ] Images onboarding
- [ ] Illustrations vides (empty states)

---

## 🚀 Implémentation React Native

### Configuration des couleurs (colors.ts)
```typescript
export const colors = {
  primary: '#A8D5A8',
  primaryDark: '#85C485',
  primaryLight: '#C8E6C8',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#E0E0E0',
  darkGray: '#666666',
  black: '#000000',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3'
};
```

### Styles globaux
```typescript
export const globalStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
};
```

Cette charte graphique est maintenant prête à être implémentée dans votre projet Opossum Mobile ! 🎨✨
