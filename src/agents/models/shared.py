"""
Shared Data Models for BetterCallClaude Agent Framework

This module provides foundational enums and dataclasses shared across all agents.
Designed for Swiss legal context with support for DE, FR, IT, EN languages.

Terminology Reference:
    DE: Deutsch (German) - Primary language for Bundesgericht
    FR: Français (French) - Primary language for Tribunal fédéral
    IT: Italiano (Italian) - Primary language for Tribunale federale
    EN: English - International clients and documentation
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional


class Language(Enum):
    """
    Supported languages for Swiss legal intelligence.

    Switzerland's four national languages plus English for international clients.
    Default is German (DE) as the most common language in Swiss legal practice.

    Sprachen / Langues / Lingue:
        DE: Deutsch / Allemand / Tedesco
        FR: Français / Français / Francese
        IT: Italiano / Italien / Italiano
        EN: English (international)
    """

    DE = "de"  # Deutsch / German
    FR = "fr"  # Français / French
    IT = "it"  # Italiano / Italian
    EN = "en"  # English

    @property
    def display_name(self) -> str:
        """Return the display name in the respective language."""
        names = {
            Language.DE: "Deutsch",
            Language.FR: "Français",
            Language.IT: "Italiano",
            Language.EN: "English",
        }
        return names[self]

    @classmethod
    def from_string(cls, value: str) -> "Language":
        """Parse language from string, case-insensitive."""
        normalized = value.lower().strip()
        for lang in cls:
            if lang.value == normalized or lang.display_name.lower() == normalized:
                return lang
        raise ValueError(f"Unknown language: {value}")


class RiskLevel(Enum):
    """
    Risk assessment levels for legal strategy evaluation.

    Used by StrategistAgent for litigation, cost, and reputation risk assessment.

    Risikostufen / Niveaux de risque / Livelli di rischio:
        VERY_LOW: Sehr gering / Très faible / Molto basso
        LOW: Gering / Faible / Basso
        MEDIUM: Mittel / Moyen / Medio
        HIGH: Hoch / Élevé / Alto
        VERY_HIGH: Sehr hoch / Très élevé / Molto alto
    """

    VERY_LOW = "very_low"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    VERY_HIGH = "very_high"

    @property
    def numeric_score(self) -> float:
        """Return numeric score (0.0 to 1.0) for calculations."""
        scores = {
            RiskLevel.VERY_LOW: 0.1,
            RiskLevel.LOW: 0.3,
            RiskLevel.MEDIUM: 0.5,
            RiskLevel.HIGH: 0.7,
            RiskLevel.VERY_HIGH: 0.9,
        }
        return scores[self]

    @property
    def requires_checkpoint(self) -> bool:
        """Determine if this risk level requires a checkpoint in BALANCED mode."""
        return self in (RiskLevel.HIGH, RiskLevel.VERY_HIGH)


class Jurisdiction(Enum):
    """
    Swiss jurisdictions for legal document formatting and court procedures.

    Includes federal level (Bund/Confédération/Confederazione) and major cantons.

    Gerichtsbarkeiten / Juridictions / Giurisdizioni:
        FEDERAL: Bundesgericht / Tribunal fédéral / Tribunale federale
        ZH: Zürich / Zurich / Zurigo
        BE: Bern / Berne / Berna
        GE: Genf / Genève / Ginevra
        BS: Basel-Stadt / Bâle-Ville / Basilea Città
        VD: Waadt / Vaud / Vaud
        TI: Tessin / Tessin / Ticino
    """

    FEDERAL = "federal"
    ZH = "zurich"
    BE = "bern"
    GE = "geneva"
    BS = "basel"
    VD = "vaud"
    TI = "ticino"

    @property
    def primary_language(self) -> Language:
        """Return the primary language for this jurisdiction."""
        lang_map = {
            Jurisdiction.FEDERAL: Language.DE,  # Multi-lingual, default DE
            Jurisdiction.ZH: Language.DE,
            Jurisdiction.BE: Language.DE,  # Bilingual, default DE
            Jurisdiction.GE: Language.FR,
            Jurisdiction.BS: Language.DE,
            Jurisdiction.VD: Language.FR,
            Jurisdiction.TI: Language.IT,
        }
        return lang_map[self]

    @property
    def court_name(self) -> Dict[str, str]:
        """Return court names in multiple languages."""
        names = {
            Jurisdiction.FEDERAL: {
                "de": "Bundesgericht",
                "fr": "Tribunal fédéral",
                "it": "Tribunale federale",
                "en": "Federal Supreme Court",
            },
            Jurisdiction.ZH: {
                "de": "Obergericht des Kantons Zürich",
                "fr": "Tribunal supérieur du canton de Zurich",
                "it": "Tribunale superiore del Canton Zurigo",
                "en": "High Court of the Canton of Zurich",
            },
            Jurisdiction.BE: {
                "de": "Obergericht des Kantons Bern",
                "fr": "Cour suprême du canton de Berne",
                "it": "Tribunale superiore del Canton Berna",
                "en": "High Court of the Canton of Bern",
            },
            Jurisdiction.GE: {
                "de": "Kantonsgericht Genf",
                "fr": "Cour de justice de Genève",
                "it": "Corte di giustizia di Ginevra",
                "en": "Court of Justice of Geneva",
            },
            Jurisdiction.BS: {
                "de": "Appellationsgericht Basel-Stadt",
                "fr": "Cour d'appel de Bâle-Ville",
                "it": "Corte d'appello di Basilea Città",
                "en": "Court of Appeal of Basel-City",
            },
            Jurisdiction.VD: {
                "de": "Kantonsgericht Waadt",
                "fr": "Tribunal cantonal vaudois",
                "it": "Tribunale cantonale vodese",
                "en": "Cantonal Court of Vaud",
            },
            Jurisdiction.TI: {
                "de": "Kantonsgericht Tessin",
                "fr": "Tribunal cantonal du Tessin",
                "it": "Tribunale cantonale del Ticino",
                "en": "Cantonal Court of Ticino",
            },
        }
        return names[self]


@dataclass
class LegalParty:
    """
    Represents a party in legal proceedings.

    Partei / Partie / Parte in legal proceedings with role designation.

    Attributes:
        name: Full legal name of the party
        role: Legal role (plaintiff, defendant, appellant, respondent, etc.)
        representation: Legal representative (lawyer/firm)
        language_preference: Preferred language for communications
        address: Contact address (optional)
        metadata: Additional party information
    """

    name: str
    role: str  # plaintiff, defendant, appellant, respondent, intervenor
    representation: Optional[str] = None
    language_preference: Language = Language.DE
    address: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    @property
    def role_translated(self) -> Dict[str, str]:
        """Return role in multiple languages."""
        role_translations = {
            "plaintiff": {
                "de": "Kläger",
                "fr": "Demandeur",
                "it": "Attore",
                "en": "Plaintiff",
            },
            "defendant": {
                "de": "Beklagter",
                "fr": "Défendeur",
                "it": "Convenuto",
                "en": "Defendant",
            },
            "appellant": {
                "de": "Berufungskläger",
                "fr": "Appelant",
                "it": "Appellante",
                "en": "Appellant",
            },
            "respondent": {
                "de": "Berufungsbeklagter",
                "fr": "Intimé",
                "it": "Appellato",
                "en": "Respondent",
            },
            "intervenor": {
                "de": "Nebenintervenient",
                "fr": "Intervenant",
                "it": "Interveniente",
                "en": "Intervenor",
            },
        }
        return role_translations.get(
            self.role.lower(),
            {"de": self.role, "fr": self.role, "it": self.role, "en": self.role},
        )


@dataclass
class CaseFacts:
    """
    Structured representation of case facts for analysis.

    Sachverhalt / État de fait / Fatti for legal analysis and strategy development.

    Attributes:
        summary: Brief summary of the case (1-3 sentences)
        key_events: Chronological list of key events with dates
        disputed_facts: Facts contested by parties
        undisputed_facts: Facts agreed upon by all parties
        evidence_available: List of available evidence items
        legal_questions: Legal questions to be addressed
        value_in_dispute: Amount in dispute (CHF)
        created_at: Timestamp of fact compilation
    """

    summary: str
    key_events: List[Dict[str, Any]] = field(default_factory=list)
    disputed_facts: List[str] = field(default_factory=list)
    undisputed_facts: List[str] = field(default_factory=list)
    evidence_available: List[str] = field(default_factory=list)
    legal_questions: List[str] = field(default_factory=list)
    value_in_dispute: Optional[float] = None  # CHF
    created_at: datetime = field(default_factory=datetime.utcnow)

    def to_dict(self) -> Dict[str, Any]:
        """Serialize case facts to dictionary."""
        return {
            "summary": self.summary,
            "key_events": self.key_events,
            "disputed_facts": self.disputed_facts,
            "undisputed_facts": self.undisputed_facts,
            "evidence_available": self.evidence_available,
            "legal_questions": self.legal_questions,
            "value_in_dispute": self.value_in_dispute,
            "created_at": self.created_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "CaseFacts":
        """Create CaseFacts from dictionary."""
        created_at = data.get("created_at")
        if isinstance(created_at, str):
            created_at = datetime.fromisoformat(created_at)
        elif created_at is None:
            created_at = datetime.utcnow()

        return cls(
            summary=data.get("summary", ""),
            key_events=data.get("key_events", []),
            disputed_facts=data.get("disputed_facts", []),
            undisputed_facts=data.get("undisputed_facts", []),
            evidence_available=data.get("evidence_available", []),
            legal_questions=data.get("legal_questions", []),
            value_in_dispute=data.get("value_in_dispute"),
            created_at=created_at,
        )

    @property
    def fact_count(self) -> int:
        """Return total count of disputed and undisputed facts."""
        return len(self.disputed_facts) + len(self.undisputed_facts)

    @property
    def has_sufficient_evidence(self) -> bool:
        """Check if evidence appears sufficient for the claims."""
        # Heuristic: at least one evidence item per disputed fact
        return len(self.evidence_available) >= len(self.disputed_facts)
