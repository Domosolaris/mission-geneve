# Mission Genève

Application web installable (PWA) d'un coach d'entraînement vers le marathon de Genève.

- `index.html` : l'application, générée chaque matin par le coach.
- `data/etat.enc` : l'état du jour, **chiffré en AES-256-GCM**. La clé n'est jamais publiée : elle est remise au téléphone par un QR code d'installation.
- `retours/` : ressentis envoyés depuis le téléphone, chiffrés avec la même clé.

Sans la clé, ces fichiers sont illisibles.
