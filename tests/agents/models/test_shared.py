"""
Tests for shared agent data models.

Tests Language, RiskLevel, Jurisdiction, LegalParty, and CaseFacts classes.
"""

import pytest
from datetime import datetime

from src.agents.models.shared import (
    Language,
    RiskLevel,
    Jurisdiction,
    LegalParty,
    CaseFacts,
)


class TestLanguage:
    """Tests for Language enum."""

    def test_language_values(self):
        """Test all language values are accessible."""
        assert Language.DE.value == "de"
        assert Language.FR.value == "fr"
        assert Language.IT.value == "it"
        assert Language.EN.value == "en"

    def test_display_names(self):
        """Test display names for each language."""
        assert Language.DE.display_name == "Deutsch"
        assert Language.FR.display_name == "Français"
        assert Language.IT.display_name == "Italiano"
        assert Language.EN.display_name == "English"

    def test_from_string_lowercase(self):
        """Test parsing from lowercase string."""
        assert Language.from_string("de") == Language.DE
        assert Language.from_string("fr") == Language.FR
        assert Language.from_string("it") == Language.IT
        assert Language.from_string("en") == Language.EN

    def test_from_string_display_name(self):
        """Test parsing from display name."""
        assert Language.from_string("Deutsch") == Language.DE
        assert Language.from_string("français") == Language.FR

    def test_from_string_invalid(self):
        """Test parsing invalid string raises error."""
        with pytest.raises(ValueError):
            Language.from_string("invalid")


class TestRiskLevel:
    """Tests for RiskLevel enum."""

    def test_risk_level_values(self):
        """Test all risk level values."""
        assert RiskLevel.VERY_LOW.value == "very_low"
        assert RiskLevel.LOW.value == "low"
        assert RiskLevel.MEDIUM.value == "medium"
        assert RiskLevel.HIGH.value == "high"
        assert RiskLevel.VERY_HIGH.value == "very_high"

    def test_numeric_scores(self):
        """Test numeric scores are in correct range."""
        assert RiskLevel.VERY_LOW.numeric_score == 0.1
        assert RiskLevel.LOW.numeric_score == 0.3
        assert RiskLevel.MEDIUM.numeric_score == 0.5
        assert RiskLevel.HIGH.numeric_score == 0.7
        assert RiskLevel.VERY_HIGH.numeric_score == 0.9

    def test_requires_checkpoint(self):
        """Test checkpoint requirements."""
        assert not RiskLevel.VERY_LOW.requires_checkpoint
        assert not RiskLevel.LOW.requires_checkpoint
        assert not RiskLevel.MEDIUM.requires_checkpoint
        assert RiskLevel.HIGH.requires_checkpoint
        assert RiskLevel.VERY_HIGH.requires_checkpoint


class TestJurisdiction:
    """Tests for Jurisdiction enum."""

    def test_jurisdiction_values(self):
        """Test all jurisdiction values."""
        assert Jurisdiction.FEDERAL.value == "federal"
        assert Jurisdiction.ZH.value == "zurich"
        assert Jurisdiction.GE.value == "geneva"
        assert Jurisdiction.TI.value == "ticino"

    def test_primary_language(self):
        """Test primary language for each jurisdiction."""
        assert Jurisdiction.FEDERAL.primary_language == Language.DE
        assert Jurisdiction.ZH.primary_language == Language.DE
        assert Jurisdiction.GE.primary_language == Language.FR
        assert Jurisdiction.VD.primary_language == Language.FR
        assert Jurisdiction.TI.primary_language == Language.IT

    def test_court_name_multilingual(self):
        """Test court names in multiple languages."""
        federal_names = Jurisdiction.FEDERAL.court_name
        assert "Bundesgericht" in federal_names["de"]
        assert "Tribunal fédéral" in federal_names["fr"]
        assert "Tribunale federale" in federal_names["it"]


class TestLegalParty:
    """Tests for LegalParty dataclass."""

    def test_basic_creation(self):
        """Test basic party creation."""
        party = LegalParty(
            name="Test AG",
            role="plaintiff",
        )
        assert party.name == "Test AG"
        assert party.role == "plaintiff"
        assert party.language_preference == Language.DE  # default

    def test_with_representation(self):
        """Test party with legal representation."""
        party = LegalParty(
            name="Test AG",
            role="plaintiff",
            representation="RA Dr. Test",
            language_preference=Language.FR,
        )
        assert party.representation == "RA Dr. Test"
        assert party.language_preference == Language.FR

    def test_role_translated(self):
        """Test role translation."""
        party = LegalParty(name="Test", role="plaintiff")
        translations = party.role_translated
        assert translations["de"] == "Kläger"
        assert translations["fr"] == "Demandeur"
        assert translations["it"] == "Attore"

    def test_unknown_role_translation(self):
        """Test unknown role returns original."""
        party = LegalParty(name="Test", role="custom_role")
        translations = party.role_translated
        assert translations["de"] == "custom_role"


class TestCaseFacts:
    """Tests for CaseFacts dataclass."""

    def test_basic_creation(self):
        """Test basic case facts creation."""
        facts = CaseFacts(summary="Test case summary")
        assert facts.summary == "Test case summary"
        assert facts.key_events == []
        assert facts.disputed_facts == []
        assert facts.created_at is not None

    def test_full_creation(self, sample_case_facts_de):
        """Test full case facts creation."""
        facts = sample_case_facts_de
        assert "Art. 97 OR" in facts.summary
        assert len(facts.key_events) > 0
        assert len(facts.disputed_facts) > 0
        assert facts.value_in_dispute == 150000.0

    def test_to_dict(self, sample_case_facts_de):
        """Test serialization to dictionary."""
        facts = sample_case_facts_de
        data = facts.to_dict()
        assert "summary" in data
        assert "key_events" in data
        assert "value_in_dispute" in data
        assert data["value_in_dispute"] == 150000.0

    def test_from_dict(self, sample_case_facts_de):
        """Test deserialization from dictionary."""
        original = sample_case_facts_de
        data = original.to_dict()
        restored = CaseFacts.from_dict(data)
        assert restored.summary == original.summary
        assert restored.value_in_dispute == original.value_in_dispute

    def test_fact_count(self, sample_case_facts_de):
        """Test fact count calculation."""
        facts = sample_case_facts_de
        assert facts.fact_count == len(facts.disputed_facts) + len(facts.undisputed_facts)

    def test_has_sufficient_evidence(self):
        """Test evidence sufficiency check."""
        facts_sufficient = CaseFacts(
            summary="Test",
            disputed_facts=["Fact 1", "Fact 2"],
            evidence_available=["Evidence 1", "Evidence 2", "Evidence 3"],
        )
        assert facts_sufficient.has_sufficient_evidence

        facts_insufficient = CaseFacts(
            summary="Test",
            disputed_facts=["Fact 1", "Fact 2", "Fact 3"],
            evidence_available=["Evidence 1"],
        )
        assert not facts_insufficient.has_sufficient_evidence


class TestMultilingualCaseFacts:
    """Tests for multilingual case facts fixtures."""

    def test_german_case_facts(self, sample_case_facts_de):
        """Test German case facts."""
        facts = sample_case_facts_de
        assert "Vertragsverletzung" in facts.summary
        assert "Art. 97 OR" in facts.summary

    def test_french_case_facts(self, sample_case_facts_fr):
        """Test French case facts."""
        facts = sample_case_facts_fr
        assert "Violation du contrat" in facts.summary
        assert "art. 97 CO" in facts.summary

    def test_italian_case_facts(self, sample_case_facts_it):
        """Test Italian case facts."""
        facts = sample_case_facts_it
        assert "Violazione del contratto" in facts.summary
        assert "art. 97 CO" in facts.summary

    def test_all_have_same_structure(
        self, sample_case_facts_de, sample_case_facts_fr, sample_case_facts_it
    ):
        """Test all language versions have same structure."""
        for facts in [sample_case_facts_de, sample_case_facts_fr, sample_case_facts_it]:
            assert facts.value_in_dispute == 150000.0
            assert len(facts.key_events) == 5
            assert len(facts.disputed_facts) == 2
            assert len(facts.undisputed_facts) == 3
