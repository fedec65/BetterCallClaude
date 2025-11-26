"""
Tests for strategist agent data models.

Tests StrategyType, SuccessProbability, RiskAssessment, CostEstimate,
OpponentProfile, and StrategyRecommendation classes.
"""

import pytest

from src.agents.models.shared import Language, RiskLevel
from src.agents.models.strategist import (
    CostEstimate,
    OpponentProfile,
    RiskAssessment,
    StrategyRecommendation,
    StrategyType,
    SuccessProbability,
)


class TestStrategyType:
    """Tests for StrategyType enum."""

    def test_strategy_values(self):
        """Test all strategy type values."""
        assert StrategyType.AGGRESSIVE.value == "aggressive"
        assert StrategyType.DEFENSIVE.value == "defensive"
        assert StrategyType.SETTLEMENT.value == "settlement"
        assert StrategyType.HYBRID.value == "hybrid"

    def test_description_multilingual(self):
        """Test strategy descriptions in multiple languages."""
        aggressive = StrategyType.AGGRESSIVE.description
        assert "de" in aggressive
        assert "fr" in aggressive
        assert "it" in aggressive
        assert "en" in aggressive
        assert "maximal" in aggressive["de"].lower() or "druck" in aggressive["de"].lower()

    def test_requires_checkpoint(self):
        """Test checkpoint requirements."""
        assert StrategyType.AGGRESSIVE.requires_checkpoint
        assert not StrategyType.DEFENSIVE.requires_checkpoint
        assert not StrategyType.SETTLEMENT.requires_checkpoint
        assert not StrategyType.HYBRID.requires_checkpoint


class TestSuccessProbability:
    """Tests for SuccessProbability enum."""

    def test_probability_values(self):
        """Test all probability values."""
        assert SuccessProbability.EXCELLENT.value == "excellent"
        assert SuccessProbability.GOOD.value == "good"
        assert SuccessProbability.MODERATE.value == "moderate"
        assert SuccessProbability.CHALLENGING.value == "challenging"
        assert SuccessProbability.UNLIKELY.value == "unlikely"

    def test_probability_ranges(self):
        """Test probability ranges are correct."""
        assert SuccessProbability.EXCELLENT.probability_range == (0.80, 1.00)
        assert SuccessProbability.GOOD.probability_range == (0.60, 0.80)
        assert SuccessProbability.MODERATE.probability_range == (0.40, 0.60)
        assert SuccessProbability.CHALLENGING.probability_range == (0.20, 0.40)
        assert SuccessProbability.UNLIKELY.probability_range == (0.00, 0.20)

    def test_midpoint_calculation(self):
        """Test midpoint calculation."""
        assert SuccessProbability.EXCELLENT.midpoint == 0.90
        assert SuccessProbability.GOOD.midpoint == 0.70
        assert SuccessProbability.MODERATE.midpoint == 0.50

    def test_from_percentage_decimal(self):
        """Test creating from decimal percentage."""
        assert SuccessProbability.from_percentage(0.85) == SuccessProbability.EXCELLENT
        assert SuccessProbability.from_percentage(0.65) == SuccessProbability.GOOD
        assert SuccessProbability.from_percentage(0.45) == SuccessProbability.MODERATE
        assert SuccessProbability.from_percentage(0.25) == SuccessProbability.CHALLENGING
        assert SuccessProbability.from_percentage(0.10) == SuccessProbability.UNLIKELY

    def test_from_percentage_whole_number(self):
        """Test creating from whole number percentage."""
        assert SuccessProbability.from_percentage(85) == SuccessProbability.EXCELLENT
        assert SuccessProbability.from_percentage(65) == SuccessProbability.GOOD


class TestRiskAssessment:
    """Tests for RiskAssessment dataclass."""

    def test_basic_creation(self):
        """Test basic risk assessment creation."""
        risk = RiskAssessment(
            overall_level=RiskLevel.MEDIUM,
            litigation_risk=RiskLevel.HIGH,
            cost_risk=RiskLevel.MEDIUM,
            reputation_risk=RiskLevel.LOW,
            confidence_score=0.75,
        )
        assert risk.overall_level == RiskLevel.MEDIUM
        assert risk.confidence_score == 0.75

    def test_invalid_confidence_score(self):
        """Test invalid confidence score raises error."""
        with pytest.raises(ValueError):
            RiskAssessment(
                overall_level=RiskLevel.MEDIUM,
                litigation_risk=RiskLevel.MEDIUM,
                cost_risk=RiskLevel.MEDIUM,
                reputation_risk=RiskLevel.MEDIUM,
                confidence_score=1.5,  # Invalid
            )

    def test_requires_checkpoint(self, sample_risk_assessment):
        """Test checkpoint requirement based on risk level."""
        # Medium risk doesn't require checkpoint
        assert not sample_risk_assessment.requires_checkpoint

        high_risk = RiskAssessment(
            overall_level=RiskLevel.HIGH,
            litigation_risk=RiskLevel.HIGH,
            cost_risk=RiskLevel.HIGH,
            reputation_risk=RiskLevel.HIGH,
            confidence_score=0.8,
        )
        assert high_risk.requires_checkpoint

    def test_weighted_score(self, sample_risk_assessment):
        """Test weighted score calculation."""
        score = sample_risk_assessment.weighted_score
        # Should be: litigation (0.5) * 0.5 + cost (0.7) * 0.3 + reputation (0.3) * 0.2
        expected = (0.5 * 0.5) + (0.7 * 0.3) + (0.3 * 0.2)
        assert abs(score - expected) < 0.01

    def test_to_dict(self, sample_risk_assessment):
        """Test serialization to dictionary."""
        data = sample_risk_assessment.to_dict()
        assert "overall_level" in data
        assert "weighted_score" in data
        assert "requires_checkpoint" in data


class TestCostEstimate:
    """Tests for CostEstimate dataclass."""

    def test_basic_creation(self):
        """Test basic cost estimate creation."""
        cost = CostEstimate(
            minimum_chf=10000.0,
            maximum_chf=50000.0,
            most_likely_chf=30000.0,
        )
        assert cost.minimum_chf == 10000.0
        assert cost.maximum_chf == 50000.0

    def test_invalid_cost_range_min_exceeds_likely(self):
        """Test minimum cannot exceed most likely."""
        with pytest.raises(ValueError):
            CostEstimate(
                minimum_chf=50000.0,
                maximum_chf=100000.0,
                most_likely_chf=30000.0,  # Less than minimum
            )

    def test_invalid_cost_range_likely_exceeds_max(self):
        """Test most likely cannot exceed maximum."""
        with pytest.raises(ValueError):
            CostEstimate(
                minimum_chf=10000.0,
                maximum_chf=30000.0,
                most_likely_chf=50000.0,  # Greater than maximum
            )

    def test_cost_range(self, sample_cost_estimate):
        """Test cost range calculation."""
        expected = sample_cost_estimate.maximum_chf - sample_cost_estimate.minimum_chf
        assert sample_cost_estimate.cost_range == expected

    def test_uncertainty_factor(self, sample_cost_estimate):
        """Test uncertainty factor calculation."""
        expected = sample_cost_estimate.cost_range / sample_cost_estimate.most_likely_chf
        assert abs(sample_cost_estimate.uncertainty_factor - expected) < 0.01

    def test_requires_checkpoint_high_cost(self):
        """Test checkpoint requirement for high costs."""
        low_cost = CostEstimate(
            minimum_chf=5000.0,
            maximum_chf=20000.0,
            most_likely_chf=10000.0,
        )
        assert not low_cost.requires_checkpoint

        high_cost = CostEstimate(
            minimum_chf=30000.0,
            maximum_chf=80000.0,
            most_likely_chf=50000.0,
        )
        assert high_cost.requires_checkpoint

    def test_net_cost_if_successful(self, sample_cost_estimate):
        """Test net cost calculation."""
        expected = sample_cost_estimate.most_likely_chf - sample_cost_estimate.recovery_potential
        assert sample_cost_estimate.net_cost_if_successful == expected

    def test_format_display_de(self, sample_cost_estimate):
        """Test German display format."""
        display = sample_cost_estimate.format_display(Language.DE)
        assert "CHF" in display
        assert "wahrscheinlich" in display

    def test_format_display_fr(self, sample_cost_estimate):
        """Test French display format."""
        display = sample_cost_estimate.format_display(Language.FR)
        assert "CHF" in display
        assert "probable" in display

    def test_to_dict(self, sample_cost_estimate):
        """Test serialization to dictionary."""
        data = sample_cost_estimate.to_dict()
        assert "minimum_chf" in data
        assert "cost_range" in data
        assert "net_cost_if_successful" in data


class TestOpponentProfile:
    """Tests for OpponentProfile dataclass."""

    def test_basic_creation(self):
        """Test basic opponent profile creation."""
        opponent = OpponentProfile(name="Test GmbH")
        assert opponent.name == "Test GmbH"
        assert opponent.strengths == []
        assert opponent.weaknesses == []

    def test_full_profile(self, sample_opponent_profile):
        """Test full opponent profile."""
        profile = sample_opponent_profile
        assert profile.name == "ABC GmbH"
        assert profile.financial_capacity == "high"
        assert profile.settlement_tendency == "likely"
        assert len(profile.strengths) > 0
        assert len(profile.weaknesses) > 0

    def test_to_dict(self, sample_opponent_profile):
        """Test serialization to dictionary."""
        data = sample_opponent_profile.to_dict()
        assert "name" in data
        assert "settlement_tendency" in data
        assert "strengths" in data


class TestStrategyRecommendation:
    """Tests for StrategyRecommendation dataclass."""

    def test_basic_creation(self, sample_risk_assessment, sample_cost_estimate):
        """Test basic recommendation creation."""
        rec = StrategyRecommendation(
            strategy_type=StrategyType.DEFENSIVE,
            success_probability=SuccessProbability.MODERATE,
            risk_assessment=sample_risk_assessment,
            cost_estimate=sample_cost_estimate,
        )
        assert rec.strategy_type == StrategyType.DEFENSIVE
        assert rec.timeline_weeks == 0

    def test_full_recommendation(self, sample_strategy_recommendation):
        """Test full strategy recommendation."""
        rec = sample_strategy_recommendation
        assert rec.strategy_type == StrategyType.HYBRID
        assert rec.success_probability == SuccessProbability.GOOD
        assert len(rec.recommended_actions) > 0
        assert len(rec.alternative_strategies) > 0

    def test_requires_checkpoint_aggressive(self, sample_risk_assessment, sample_cost_estimate):
        """Test checkpoint requirement for aggressive strategy."""
        rec = StrategyRecommendation(
            strategy_type=StrategyType.AGGRESSIVE,
            success_probability=SuccessProbability.GOOD,
            risk_assessment=sample_risk_assessment,
            cost_estimate=sample_cost_estimate,
        )
        assert rec.requires_checkpoint

    def test_expected_value_calculation(self, sample_strategy_recommendation):
        """Test expected value calculation."""
        rec = sample_strategy_recommendation
        expected = (
            rec.cost_estimate.recovery_potential * rec.success_probability.midpoint
            - rec.cost_estimate.most_likely_chf
        )
        assert abs(rec.expected_value - expected) < 0.01

    def test_to_dict(self, sample_strategy_recommendation):
        """Test serialization to dictionary."""
        data = sample_strategy_recommendation.to_dict()
        assert "strategy_type" in data
        assert "expected_value" in data
        assert "requires_checkpoint" in data

    def test_get_summary_de(self, sample_strategy_recommendation):
        """Test German summary generation."""
        summary = sample_strategy_recommendation.get_summary(Language.DE)
        assert "Strategieempfehlung" in summary
        assert "Erfolgswahrscheinlichkeit" in summary

    def test_get_summary_fr(self, sample_strategy_recommendation):
        """Test French summary generation."""
        summary = sample_strategy_recommendation.get_summary(Language.FR)
        assert "Recommandation stratégique" in summary
        assert "Probabilité de succès" in summary

    def test_get_summary_it(self, sample_strategy_recommendation):
        """Test Italian summary generation."""
        summary = sample_strategy_recommendation.get_summary(Language.IT)
        assert "Raccomandazione strategica" in summary
        assert "Probabilità di successo" in summary
