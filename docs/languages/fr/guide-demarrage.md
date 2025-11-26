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

## Nouveautés v1.1.0

### Framework d'Agents
- **ResearcherAgent**: Recherche juridique autonome avec autonomie configurable
- **CaseManager**: Gestion intelligente des cas et analyse des précédents
- **IntegratedResearchSystem**: Orchestration de l'agent, du gestionnaire de cas et de la base de données

### Modes d'Autonomie
- **CAUTIOUS**: Supervision maximale de l'utilisateur (par défaut)
- **BALANCED**: Décisions de routine automatiques
- **AUTONOMOUS**: Interaction minimale pour les recherches complexes

### Infrastructure de Base de Données
- Système de cache basé sur SQLite
- Décisions ATF et tribunaux cantonaux
- Gestion persistante des cas

---

## Configuration Requise

- **Système d'exploitation**: macOS, Linux ou Windows
- **Python**: 3.11 ou supérieur
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

### Étape 2: Configurer l'environnement Python

```bash
# Créer un environnement virtuel
python3 -m venv venv

# Activer (macOS/Linux)
source venv/bin/activate

# Activer (Windows)
.\venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt
```

### Étape 3: Installer les serveurs MCP

```bash
cd mcp-servers

# Serveur Entscheidsuche (ATF et tribunaux cantonaux)
cd entscheidsuche && npm install && npm run build && cd ..

# Serveur Legal Citations
cd legal-citations && npm install && npm run build && cd ..

# Serveur BGE Search
cd bge-search && npm install && npm run build && cd ..
```

### Étape 4: Configurer les clés API

Créez un fichier `.env` à la racine du projet:

```bash
ANTHROPIC_API_KEY=votre_cle_api
TAVILY_API_KEY=votre_cle_tavily  # Optionnel pour la recherche web
```

### Étape 5: Vérifier l'installation

```bash
# Exécuter les tests Python
pytest

# Exécuter les tests du serveur MCP
cd mcp-servers/legal-citations && npm test
```

---

## Commandes

### Commandes de Recherche Juridique

| Commande | Description |
|----------|-------------|
| `/legal:research` | Rechercher dans les sources juridiques suisses |
| `/legal:analyze` | Analyser les arguments juridiques |
| `/legal:compare` | Comparer les précédents |
| `/legal:strategy` | Développer une stratégie de litige |
| `/legal:draft` | Rédiger des documents juridiques |

### Commandes d'Agent

| Commande | Description |
|----------|-------------|
| `/agent:researcher` | Démarrer la recherche juridique autonome |
| `/agent:researcher --mode cautious` | Avec supervision maximale |
| `/agent:researcher --mode balanced` | Avec autonomie équilibrée |
| `/agent:researcher --mode autonomous` | Avec interaction minimale |

### Commandes d'Aide

| Commande | Description |
|----------|-------------|
| `/legal:help` | Afficher l'aide des commandes |
| `/legal:version` | Afficher les informations de version |

---

## Exemples d'Utilisation

### Recherche Juridique

```bash
# Démarrer Claude Code
claude

# Recherche ATF
"Rechercher ATF sur la responsabilité contractuelle art. 97 CO"

# Avec le Framework d'Agent
"/agent:researcher 'Trouver tous les ATF pertinents sur le droit du bail et la protection contre les congés'"
```

### Stratégie de Cas

```bash
"Analyser la stratégie de litige pour une rupture de contrat sous l'art. 97 CO"
```

### Rédaction de Documents

```bash
"Rédiger un contrat de services selon le CO suisse pour le développement logiciel"
```

### Analyse des Précédents

```bash
"/legal:compare 'ATF 123 III 456' 'ATF 130 III 789'"
```

---

## Serveurs MCP

### Serveur Entscheidsuche
Recherche les décisions sur bundesgericht.ch et les tribunaux cantonaux.

### Serveur Legal Citations
Vérifie et formate les citations selon les normes suisses:
- Format ATF (ATF 123 III 456)
- Formats cantonaux (ZH, BE, GE, BS, VD, TI)
- Adaptation multilingue

### Serveur BGE Search
Recherche spécialisée dans les décisions ATF avec:
- Recherche en texte intégral
- Filtrage par domaine juridique
- Restriction de période

---

## Dépannage

### Environnement Python
```bash
# Recréer l'environnement virtuel
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Problèmes de Serveur MCP
```bash
# Réinstaller les modules Node
cd mcp-servers/legal-citations
rm -rf node_modules
npm install
npm run build
```

### Clés API
Assurez-vous que le fichier `.env` est correctement configuré et que les clés sont valides.

---

## Ressources Supplémentaires

- [Documentation en anglais](../../README.md)
- [Architecture des Agents](../../docs/AGENT_ARCHITECTURE.md)
- [Référence des Commandes](../../docs/command-reference.md)
- [Architecture du Cadre](../../../.claude/BETTERASK.md)

---

*BetterCallClaude v1.1.0 - Intelligence Juridique pour les Avocats Suisses*
