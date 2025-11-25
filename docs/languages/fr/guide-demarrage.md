# Guide de Démarrage - BetterCallClaude

**Intelligence Juridique pour les Avocats Suisses**

---

## Aperçu

BetterCallClaude est un cadre d'intelligence juridique complet qui offre aux avocats suisses:

- **80% d'économie de temps** sur l'analyse des précédents et la recherche juridique
- **25% d'amélioration de la qualité** grâce à une vérification systématique
- **Expertise multi-juridictionnelle** en droit fédéral et cantonal (ZH, BE, GE, BS, VD, TI)
- **Précision multilingue** en terminologie juridique (DE, FR, IT, EN)

---

## Configuration Requise

- **Système d'exploitation**: macOS, Linux ou Windows
- **Node.js**: v18.0.0 ou supérieur
- **npm**: v8.0.0 ou supérieur
- **Claude Code**: Dernière version

---

## Installation

### Étape 1: Cloner le dépôt

```bash
git clone https://github.com/fedec65/bettercallclaude.git
cd bettercallclaude
```

### Étape 2: Installer les dépendances

```bash
npm install
```

### Étape 3: Configurer les serveurs MCP

```bash
cd mcp-servers
npm install
npm run build
```

### Étape 4: Configurer les clés API

Créez un fichier `.env` à la racine du projet:

```bash
ANTHROPIC_API_KEY=votre_cle_api
TAVILY_API_KEY=votre_cle_tavily  # Optionnel
```

---

## Premiers Pas

### Recherche Juridique

```bash
# Démarrer Claude Code
claude

# Dans Claude Code, demandez:
"Rechercher ATF sur la responsabilité contractuelle art. 97 CO"
```

### Stratégie de Cas

```bash
"Analyser la stratégie de litige pour une rupture de contrat sous l'art. 97 CO"
```

### Rédaction de Documents

```bash
"Rédiger un contrat de services selon le CO suisse pour le développement logiciel"
```

---

## Commandes

- `/legal:research` - Rechercher dans les sources juridiques suisses
- `/legal:help` - Afficher l'aide des commandes
- `/agent:researcher` - Recherche juridique autonome

---

## Ressources Supplémentaires

- [Documentation en anglais](../../getting-started.md)
- [Tutoriels de workflow](../../workflows/)
- [Architecture du cadre](../../../.claude/BETTERASK.md)

---

*BetterCallClaude v1.0.0 - Intelligence Juridique pour les Avocats Suisses*
