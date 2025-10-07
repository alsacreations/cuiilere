# 🥄 Cuillère

Générateur de QR Codes personnalisés, accessible, léger et 100% front-end.

## ✨ Qu'est‑ce que Cuillère ?

Cuillère est une petite application web (HTML/CSS/JS vanilla) permettant de générer rapidement des QR Codes stylés à partir d'une URL : choix des couleurs, formes des points et des coins, taille, ajout d'un logo central, téléchargement en **PNG** ou **SVG**.

Aucune donnée n'est envoyée côté serveur : tout se passe dans votre navigateur.

## 🚀 Fonctionnalités principales

- Génération instantanée pendant la saisie de l'URL
- Personnalisation : couleur des points, couleur de fond, formes (points, carrés, arrondis, élégants…)
- Coins stylisés (carrés, arrondis, points)
- Taille réglable (200px à 800px)
- Import d'un logo (PNG, JPG, SVG, ≤ 2 Mo)
- Téléchargement en SVG (vectoriel) ou PNG
- Vérification automatique du contraste pour la scannabilité
- Annonces accessibles (ARIA live) + gestion des messages d'erreur
- Architecture CSS moderne avec cascade layers + design tokens
- 0 dépendance build / 0 backend

## 🧩 Stack & dépendances

- HTML sémantique + ARIA
- CSS : `@layer`, design tokens (`theme-tokens.css`), variables de couleur et typographie responsives
- JavaScript : Vanilla (pattern Singleton) dans `assets/js/app.js`
- Lib externe : [`qr-code-styling@1.6.0`](https://github.com/kozakdenys/qr-code-styling)

## 📦 Installation locale

1. Cloner le dépôt :

```bash
git clone https://github.com/alsacreations/cuiilere.git
cd cuiilere
```

1. Ouvrir `index.html` dans votre navigateur (double‑clic ou via une extension de serveur statique). Exemple avec un petit serveur Python :

```bash
python3 -m http.server 8000
```

1. Aller sur <http://localhost:8000>

> Aucun build, aucune compilation : prêt à l'emploi.

## 🕹️ Utilisation

1. Saisissez l'URL de destination (validation automatique)
2. Ajustez couleurs & styles
3. (Optionnel) Ajoutez un logo — privilégiez un logo simple et contrasté
4. Téléchargez votre QR Code en SVG (qualité infinie) ou en PNG

Le niveau de correction d'erreur est automatiquement augmenté (H) lorsqu'un logo est présent pour préserver la lisibilité.

## 🎨 Personnalisation avancée (CSS)

Le projet expose des design tokens dans `assets/css/theme-tokens.css` et des variables primitives dans `theme.css`. Vous pouvez :

- Forcer un thème clair/sombre via l'attribut `data-theme="light|dark"` sur `:root`
- Ajouter de nouveaux styles de layout dans `layouts.css`
- Étendre la palette en ajoutant des variables `--color-*` puis les réutiliser dans les tokens (`--primary`, `--surface`, etc.)

### Exemple : changer la couleur d'accent

```css
:root {
  --primary: var(--color-green-500);
}
```

### Structure des layers CSS

1. `reset.css`
2. `theme.css` (couleurs de base)
3. `theme-tokens.css` (tokens dérivés)
4. `layouts.css` / `natives.css`
5. `styles.css` (styles applicatifs)

## ♿ Accessibilité

- Champs correctement labellisés
- Indication des erreurs (ARIA + `aria-invalid`)
- Annonce live lors de la génération du QR Code (`role="status"`)
- Avertissement de contraste lorsque le ratio < 3:1 (rappel : viser ≥ 4.5 idéalement)

## 📐 Qualité des QR Codes

Pour un QR Code fiable :

- Maintenir un ratio de contraste élevé (points foncés / fond clair)
- Éviter des logos trop denses couvrant > 40% de la surface
- Tester le scan sur plusieurs appareils / luminosités

## 🛡️ Sécurité & confidentialité

Les URLs restent locales : aucune collecte. Les fichiers logo ne quittent pas votre machine.

## 🔧 Limites actuelles

- Un seul logo centré (pas de redimensionnement manuel)
- Pas de génération batch
- Pas de stockage des configurations (pas encore de localStorage)

## 🗺️ Roadmap (suggestions)

- [ ] Mode sombre explicite via bouton toggle
- [ ] Export PDF
- [ ] Sauvegarde / chargement de presets
- [ ] Génération de QR Codes multiples (CSV)
- [ ] Ajout d'un test de lisibilité plus strict (ratio ≥ 4.5 + simulation inversion)
- [ ] Option niveaux d'erreur personnalisés (L/M/Q/H)

## 🤝 Contribution

Les contributions sont bienvenues : corrections, idées, améliorations accessibilité. Ouvrez une issue ou une PR.

### Recommandations

- Garder le style vanilla (pas de framework JS)
- Minimiser les dépendances
- Respecter la structure des layers CSS
- Vérifier l'accessibilité (labels, focus, contraste)

## 📄 Licence

Code sous licence MIT © 2025 Alsacreations — voir `LICENSE`.

## 🙋 FAQ rapide

| Question                                   | Réponse                                                        |
| ------------------------------------------ | -------------------------------------------------------------- |
| Pourquoi le contraste est signalé ?        | Pour garantir la scannabilité fiable.                          |
| Le QR Code ne scanne pas avec un logo      | Essayez d'augmenter le contraste ou réduire la taille du logo. |
| Puis-je héberger l'appli ?                 | Oui, c'est purement statique (GitHub Pages, Netlify, etc.).    |
| Peut-on ajouter du texte sous le QR Code ? | Pas encore, PR bienvenue.                                      |

## 🧪 Tests rapides de validation (manuels)

- Saisir URL invalide -> message d'erreur
- Changer taille -> output mis à jour
- Logo > 2 Mo -> alerte rejet
- Couleurs faibles contraste -> avertissement visible

---

Bonnes créations ✨
