"""
Shared pytest fixtures for agent tests.

Provides multilingual test fixtures and common test utilities
for StrategistAgent, DrafterAgent, and Orchestrator testing.
"""

import pytest

from src.agents.base import AutonomyMode, CaseContext
from src.agents.models.drafter import (
    Citation,
    DocumentMetadata,
    DocumentSection,
    DocumentType,
    LegalDocument,
)
from src.agents.models.shared import (
    CaseFacts,
    Jurisdiction,
    Language,
    LegalParty,
    RiskLevel,
)
from src.agents.models.strategist import (
    CostEstimate,
    OpponentProfile,
    RiskAssessment,
    StrategyRecommendation,
    StrategyType,
    SuccessProbability,
)

# =============================================================================
# Language Fixtures
# =============================================================================


@pytest.fixture
def all_languages():
    """Return all supported languages."""
    return [Language.DE, Language.FR, Language.IT, Language.EN]


# =============================================================================
# Case Facts Fixtures (Multilingual)
# =============================================================================


@pytest.fixture
def sample_case_facts_de() -> CaseFacts:
    """Sample case facts in German - contract breach."""
    return CaseFacts(
        summary="Vertragsverletzung gemäss Art. 97 OR durch Nichterfüllung",
        key_events=[
            {"date": "2024-01-15", "event": "Vertragsabschluss zwischen den Parteien"},
            {"date": "2024-02-01", "event": "Fälligkeit der ersten Lieferung"},
            {"date": "2024-03-01", "event": "Mahnung wegen Nichtlieferung"},
            {"date": "2024-03-20", "event": "Fristansetzung mit Ablehnungsandrohung"},
            {"date": "2024-04-01", "event": "Vertragsrücktritt erklärt"},
        ],
        disputed_facts=[
            "Schadenshöhe (CHF 150'000 vs. CHF 80'000)",
            "Kausalität zwischen Nichtlieferung und Folgeschäden",
        ],
        undisputed_facts=[
            "Vertragsexistenz und -inhalt",
            "Nichtzahlung durch Beklagten",
            "Ordnungsgemässe Mahnung erfolgt",
        ],
        evidence_available=[
            "Kaufvertrag vom 15.01.2024",
            "E-Mail-Korrespondenz",
            "Mahnschreiben vom 01.03.2024",
            "Rechnungen und Lieferscheine",
            "Sachverständigengutachten zur Schadenshöhe",
        ],
        legal_questions=[
            "Liegt eine Vertragsverletzung vor?",
            "Ist der geltend gemachte Schaden ersatzfähig?",
            "Wie hoch ist der Schadenersatz?",
        ],
        value_in_dispute=150000.0,
    )


@pytest.fixture
def sample_case_facts_fr() -> CaseFacts:
    """Sample case facts in French - contract breach."""
    return CaseFacts(
        summary="Violation du contrat selon l'art. 97 CO par inexécution",
        key_events=[
            {"date": "2024-01-15", "event": "Conclusion du contrat entre les parties"},
            {"date": "2024-02-01", "event": "Échéance de la première livraison"},
            {"date": "2024-03-01", "event": "Mise en demeure pour non-livraison"},
            {"date": "2024-03-20", "event": "Fixation d'un délai avec menace de résolution"},
            {"date": "2024-04-01", "event": "Déclaration de résolution du contrat"},
        ],
        disputed_facts=[
            "Montant du dommage (CHF 150'000 vs CHF 80'000)",
            "Lien de causalité entre non-livraison et dommages consécutifs",
        ],
        undisputed_facts=[
            "Existence et contenu du contrat",
            "Non-paiement par le défendeur",
            "Mise en demeure effectuée correctement",
        ],
        evidence_available=[
            "Contrat de vente du 15.01.2024",
            "Correspondance par e-mail",
            "Lettre de mise en demeure du 01.03.2024",
            "Factures et bons de livraison",
            "Expertise sur le montant du dommage",
        ],
        legal_questions=[
            "Y a-t-il violation du contrat?",
            "Le dommage invoqué est-il réparable?",
            "Quel est le montant des dommages-intérêts?",
        ],
        value_in_dispute=150000.0,
    )


@pytest.fixture
def sample_case_facts_it() -> CaseFacts:
    """Sample case facts in Italian - contract breach."""
    return CaseFacts(
        summary="Violazione del contratto secondo l'art. 97 CO per inadempimento",
        key_events=[
            {"date": "2024-01-15", "event": "Conclusione del contratto tra le parti"},
            {"date": "2024-02-01", "event": "Scadenza della prima consegna"},
            {"date": "2024-03-01", "event": "Diffida per mancata consegna"},
            {"date": "2024-03-20", "event": "Fissazione del termine con minaccia di risoluzione"},
            {"date": "2024-04-01", "event": "Dichiarazione di risoluzione del contratto"},
        ],
        disputed_facts=[
            "Importo del danno (CHF 150'000 vs CHF 80'000)",
            "Nesso causale tra mancata consegna e danni conseguenti",
        ],
        undisputed_facts=[
            "Esistenza e contenuto del contratto",
            "Mancato pagamento da parte del convenuto",
            "Diffida eseguita correttamente",
        ],
        evidence_available=[
            "Contratto di vendita del 15.01.2024",
            "Corrispondenza e-mail",
            "Lettera di diffida del 01.03.2024",
            "Fatture e bolle di consegna",
            "Perizia sull'importo del danno",
        ],
        legal_questions=[
            "Vi è violazione del contratto?",
            "Il danno invocato è risarcibile?",
            "Qual è l'importo del risarcimento?",
        ],
        value_in_dispute=150000.0,
    )


# =============================================================================
# Strategy Model Fixtures
# =============================================================================


@pytest.fixture
def sample_risk_assessment() -> RiskAssessment:
    """Sample risk assessment for testing."""
    return RiskAssessment(
        overall_level=RiskLevel.MEDIUM,
        litigation_risk=RiskLevel.MEDIUM,
        cost_risk=RiskLevel.HIGH,
        reputation_risk=RiskLevel.LOW,
        factors=[
            "Disputed damage amount creates uncertainty",
            "Opponent has strong legal representation",
            "Court backlog may extend timeline",
        ],
        mitigations=[
            "Strengthen evidence on causation",
            "Consider partial settlement offer",
            "Prepare for extended timeline",
        ],
        confidence_score=0.75,
    )


@pytest.fixture
def sample_cost_estimate() -> CostEstimate:
    """Sample cost estimate for testing."""
    return CostEstimate(
        minimum_chf=15000.0,
        maximum_chf=45000.0,
        most_likely_chf=28000.0,
        breakdown={
            "attorney_fees": 20000.0,
            "court_costs": 5000.0,
            "expert_fees": 3000.0,
        },
        assumptions=[
            "Standard proceedings without appeals",
            "Single expert witness required",
            "No significant discovery disputes",
        ],
        court_costs=5000.0,
        expert_fees=3000.0,
        recovery_potential=10000.0,
    )


@pytest.fixture
def sample_opponent_profile() -> OpponentProfile:
    """Sample opponent profile for testing."""
    return OpponentProfile(
        name="ABC GmbH",
        legal_representation="Müller & Partner Rechtsanwälte",
        litigation_history=[
            "Settled 2 similar cases in 2023",
            "Lost contract dispute in 2022",
        ],
        financial_capacity="high",
        settlement_tendency="likely",
        strengths=[
            "Strong financial resources",
            "Experienced legal team",
        ],
        weaknesses=[
            "History of settling to avoid publicity",
            "Previous adverse judgments",
        ],
        notes="Known to prefer settlement over prolonged litigation",
    )


@pytest.fixture
def sample_strategy_recommendation(
    sample_risk_assessment: RiskAssessment,
    sample_cost_estimate: CostEstimate,
    sample_opponent_profile: OpponentProfile,
) -> StrategyRecommendation:
    """Sample complete strategy recommendation."""
    return StrategyRecommendation(
        strategy_type=StrategyType.HYBRID,
        success_probability=SuccessProbability.GOOD,
        risk_assessment=sample_risk_assessment,
        cost_estimate=sample_cost_estimate,
        recommended_actions=[
            "File statement of claim within 30 days",
            "Simultaneously initiate settlement discussions",
            "Prepare comprehensive evidence documentation",
        ],
        alternative_strategies=[
            {
                "type": "aggressive",
                "description": "Full litigation without settlement attempts",
                "pros": ["Potentially higher recovery"],
                "cons": ["Higher costs", "Longer timeline"],
            },
            {
                "type": "settlement",
                "description": "Direct settlement negotiation",
                "pros": ["Quick resolution", "Lower costs"],
                "cons": ["Potentially lower recovery"],
            },
        ],
        key_arguments=[
            "Clear contractual obligation to deliver",
            "Proper notice and cure period provided",
            "Documented damages with expert support",
        ],
        weak_points=[
            "Causation for consequential damages",
            "Disputed damage quantum",
        ],
        timeline_weeks=24,
        checkpoints=[
            "Initial pleadings filed",
            "Settlement discussions initiated",
            "Evidence exchange complete",
            "Trial preparation",
        ],
        opponent_profile=sample_opponent_profile,
        jurisdiction=Jurisdiction.ZH,
        language=Language.DE,
        confidence_score=0.72,
    )


# =============================================================================
# Document Model Fixtures
# =============================================================================


@pytest.fixture
def sample_document_metadata() -> DocumentMetadata:
    """Sample document metadata for testing."""
    return DocumentMetadata(
        document_type=DocumentType.KLAGESCHRIFT,
        language=Language.DE,
        jurisdiction=Jurisdiction.ZH,
        case_reference="HG240123",
        date_created="2024-05-15",
        author="RA Dr. Hans Muster",
        client_reference="2024-CLIENT-001",
    )


@pytest.fixture
def sample_citation() -> Citation:
    """Sample BGE citation for testing."""
    return Citation(
        citation_text="BGE 123 III 456",
        source_type="bge",
        is_verified=True,
        url="https://www.bger.ch/ext/eurospider/live/de/php/clir/http/index.php?type=highlight_simple_query&page=1&from_date=&to_date=&from_year=1954&to_year=2024&sort=relevance&insertion_date=&from_date_push=&top_subcollection_clir=bge&query_words=123+III+456",
        relevance="Key precedent on contractual liability",
    )


@pytest.fixture
def sample_document_section() -> DocumentSection:
    """Sample document section for testing."""
    return DocumentSection(
        section_type="sachverhalt",
        title="Sachverhalt",
        content="""
A. Parteien und Prozessgeschichte

Die Klägerin, XYZ AG, mit Sitz in Zürich, ist ein Unternehmen im Bereich
der Maschinenbauindustrie. Der Beklagte, ABC GmbH, mit Sitz in Winterthur,
ist ein Zulieferer für Industriekomponenten.

B. Vertragliche Grundlage

Am 15. Januar 2024 schlossen die Parteien einen Kaufvertrag über die
Lieferung von Industriekomponenten im Wert von CHF 200'000.
        """.strip(),
        citations=[],
        footnotes=[],
        order=2,
    )


@pytest.fixture
def sample_legal_document(
    sample_document_metadata: DocumentMetadata,
    sample_document_section: DocumentSection,
    sample_citation: Citation,
) -> LegalDocument:
    """Sample complete legal document."""
    document = LegalDocument(
        metadata=sample_document_metadata,
        sections=[sample_document_section],
        citations_used=[sample_citation],
        parties=[
            LegalParty(
                name="XYZ AG",
                role="plaintiff",
                representation="RA Dr. Hans Muster",
            ),
            LegalParty(
                name="ABC GmbH",
                role="defendant",
                representation="RA Maria Schmidt",
            ),
        ],
    )
    return document


# =============================================================================
# Agent Context Fixtures
# =============================================================================


@pytest.fixture
def sample_case_context() -> CaseContext:
    """Sample case context for agent testing."""
    return CaseContext(
        case_id="CASE-2024-001",
        title="XYZ AG v. ABC GmbH - Vertragsverletzung",
        case_type="litigation",
        jurisdiction_federal=False,
        jurisdiction_cantons=["ZH"],
        languages=["DE"],
        parties=[],
        facts=["Contract breach", "Non-delivery", "Damage claim"],
        legal_issues=["Art. 97 OR", "Schadenersatz", "Vertragsauflösung"],
    )


@pytest.fixture
def autonomy_modes():
    """Return all autonomy modes for parameterized testing."""
    return [AutonomyMode.CAUTIOUS, AutonomyMode.BALANCED, AutonomyMode.AUTONOMOUS]


# =============================================================================
# Utility Functions
# =============================================================================


def assert_valid_recommendation(rec: StrategyRecommendation) -> None:
    """Assert that a strategy recommendation is valid."""
    assert rec.strategy_type is not None
    assert rec.success_probability is not None
    assert rec.risk_assessment is not None
    assert rec.cost_estimate is not None
    assert rec.cost_estimate.minimum_chf <= rec.cost_estimate.most_likely_chf
    assert rec.cost_estimate.most_likely_chf <= rec.cost_estimate.maximum_chf


def assert_valid_document(doc: LegalDocument) -> None:
    """Assert that a legal document is valid."""
    assert doc.metadata is not None
    assert doc.metadata.document_type is not None
    assert doc.metadata.language is not None
    assert doc.metadata.jurisdiction is not None
