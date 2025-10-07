/**
 * Application de génération de QR Code
 * Vanilla JavaScript - Pattern Singleton
 */

const app = {
  // État de l'application
  state: {
    url: "https://alsacreations.fr",
    dotsColor: "#000000",
    backgroundColor: "#ffffff",
    dotsType: "square",
    cornersSquareType: "square",
    size: 400,
    logoImage: null,
  },

  // Instance du QR Code
  qrCode: null,

  // Éléments DOM mis en cache
  dom: {},

  // Timer pour le debounce
  debounceTimer: null,

  /**
   * Initialisation de l'application
   */
  init() {
    this.cacheDOM();
    this.bindEvents();
    this.generate();
  },

  /**
   * Cache les éléments DOM pour éviter les recherches répétées
   */
  cacheDOM() {
    this.dom = {
      url: document.getElementById("url"),
      dotsColor: document.getElementById("dotsColor"),
      backgroundColor: document.getElementById("backgroundColor"),
      dotsType: document.getElementById("dotsType"),
      cornersSquareType: document.getElementById("cornersSquareType"),
      size: document.getElementById("size"),
      sizeOutput: document.getElementById("sizeOutput"),
      qrcode: document.getElementById("qrcode"),
      downloadActions: document.querySelector(".download-actions"),
      contrastWarning: document.getElementById("contrastWarning"),
      urlError: document.getElementById("url-error"),
      qrStatus: document.getElementById("qr-status"),
      logo: document.getElementById("logo"),
      removeLogo: document.getElementById("removeLogo"),
    };
  },

  /**
   * Lie les événements aux éléments
   */
  bindEvents() {
    // Inputs texte et couleurs avec debounce
    this.dom.url.addEventListener("input", (e) => {
      this.updateState("url", e.target.value);
      this.validateURL();
      this.debounceGenerate();
    });

    this.dom.dotsColor.addEventListener("input", (e) => {
      this.updateState("dotsColor", e.target.value);
      this.checkContrast();
      this.debounceGenerate();
    });

    this.dom.backgroundColor.addEventListener("input", (e) => {
      this.updateState("backgroundColor", e.target.value);
      this.checkContrast();
      this.debounceGenerate();
    });

    // Selects - génération immédiate
    this.dom.dotsType.addEventListener("change", (e) => {
      this.updateState("dotsType", e.target.value);
      this.generate();
    });

    this.dom.cornersSquareType.addEventListener("change", (e) => {
      this.updateState("cornersSquareType", e.target.value);
      this.generate();
    });

    // Range - mise à jour de l'output et génération
    this.dom.size.addEventListener("input", (e) => {
      const value = e.target.value;
      this.updateState("size", parseInt(value, 10));
      this.dom.sizeOutput.textContent = `${value}px`;
      this.debounceGenerate();
    });

    // Upload de logo
    this.dom.logo.addEventListener("change", (e) => {
      this.handleLogoUpload(e);
    });

    // Suppression du logo
    this.dom.removeLogo.addEventListener("click", () => {
      this.removeLogo();
    });

    // Validation du formulaire au submit
    document.querySelector(".qr-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.generate();
    });
  },

  /**
   * Met à jour l'état de l'application
   */
  updateState(key, value) {
    this.state[key] = value;
  },

  /**
   * Génère le QR Code avec debounce
   */
  debounceGenerate() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.generate();
    }, 300);
  },

  /**
   * Valide l'URL et affiche les messages d'erreur
   */
  validateURL() {
    const isValid = this.isValidURL(this.state.url);

    if (!isValid && this.state.url.trim() !== "") {
      this.dom.url.setAttribute("aria-invalid", "true");
      this.dom.urlError.hidden = false;
    } else {
      this.dom.url.setAttribute("aria-invalid", "false");
      this.dom.urlError.hidden = true;
    }

    return isValid;
  },

  /**
   * Génère le QR Code
   */
  generate() {
    // Validation de l'URL
    if (!this.validateURL()) {
      return;
    }

    // Nettoyage du conteneur
    this.dom.qrcode.innerHTML = "";

    // Configuration du QR Code
    const config = {
      width: this.state.size,
      height: this.state.size,
      data: this.state.url,
      margin: 10,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        // Niveau de correction d'erreur plus élevé si logo présent
        errorCorrectionLevel: this.state.logoImage ? "H" : "Q",
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 0,
      },
      dotsOptions: {
        color: this.state.dotsColor,
        type: this.state.dotsType,
      },
      backgroundOptions: {
        color: this.state.backgroundColor,
      },
      cornersSquareOptions: {
        color: this.state.dotsColor,
        type: this.state.cornersSquareType,
      },
      cornersDotOptions: {
        color: this.state.dotsColor,
        type: "dot",
      },
    };

    // Ajout du logo si présent
    if (this.state.logoImage) {
      config.image = this.state.logoImage;
      config.imageOptions = {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 5,
        crossOrigin: "anonymous",
      };
    }

    // Création du QR Code
    this.qrCode = new QRCodeStyling(config);
    this.qrCode.append(this.dom.qrcode);

    // Affichage des boutons de téléchargement
    this.dom.downloadActions.hidden = false;

    // Vérification du contraste
    this.checkContrast();

    // Annonce accessible pour les lecteurs d'écran
    this.announceQRCodeGenerated();
  },

  /**
   * Annonce la génération du QR Code pour les lecteurs d'écran
   */
  announceQRCodeGenerated() {
    const size = this.state.size;
    const style =
      this.dom.dotsType.options[this.dom.dotsType.selectedIndex].text;
    this.dom.qrStatus.textContent = `QR Code généré avec succès. Taille : ${size} pixels, style : ${style}. Boutons de téléchargement disponibles.`;
  },

  /**
   * Vérifie le contraste entre les couleurs
   */
  checkContrast() {
    const ratio = this.getContrastRatio(
      this.state.dotsColor,
      this.state.backgroundColor
    );

    if (ratio < 3) {
      this.dom.contrastWarning.hidden = false;
    } else {
      this.dom.contrastWarning.hidden = true;
    }
  },

  /**
   * Calcule le ratio de contraste entre deux couleurs
   * @param {string} color1 - Couleur hex
   * @param {string} color2 - Couleur hex
   * @returns {number} Ratio de contraste
   */
  getContrastRatio(color1, color2) {
    const getLuminance = (hex) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  },

  /**
   * Valide une URL
   * @param {string} string - URL à valider
   * @returns {boolean}
   */
  isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  },

  /**
   * Télécharge le QR Code en SVG
   */
  downloadSVG() {
    if (this.qrCode) {
      this.qrCode.download({
        name: "qrcode",
        extension: "svg",
      });
    }
  },

  /**
   * Télécharge le QR Code en PNG
   */
  downloadPNG() {
    if (this.qrCode) {
      this.qrCode.download({
        name: "qrcode",
        extension: "png",
      });
    }
  },

  /**
   * Gère l'upload du logo
   * @param {Event} event - Événement de changement du fichier
   */
  handleLogoUpload(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    // Vérification du type de fichier
    const validTypes = ["image/png", "image/jpeg", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      alert(
        "Format de fichier non supporté. Veuillez utiliser PNG, JPG ou SVG."
      );
      event.target.value = "";
      return;
    }

    // Vérification de la taille (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert("Le fichier est trop volumineux. Taille maximale : 2MB");
      event.target.value = "";
      return;
    }

    // Lecture du fichier
    const reader = new FileReader();
    reader.onload = (e) => {
      this.state.logoImage = e.target.result;
      this.dom.removeLogo.hidden = false;
      this.generate();
    };
    reader.readAsDataURL(file);
  },

  /**
   * Supprime le logo
   */
  removeLogo() {
    this.state.logoImage = null;
    this.dom.logo.value = "";
    this.dom.removeLogo.hidden = true;
    this.generate();
  },
};

// Initialisation au chargement du DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => app.init());
} else {
  app.init();
}
