"""
Tests for drafter agent data models.

Tests DocumentType, DocumentSectionType, DocumentMetadata, DocumentSection,
Citation, and LegalDocument classes.
"""


from src.agents.models.drafter import (
    Citation,
    DocumentMetadata,
    DocumentSection,
    DocumentSectionType,
    DocumentType,
    LegalDocument,
)
from src.agents.models.shared import Jurisdiction, Language


class TestDocumentType:
    """Tests for DocumentType enum."""

    def test_document_type_values(self):
        """Test all document type values."""
        assert DocumentType.KLAGESCHRIFT.value == "klageschrift"
        assert DocumentType.KLAGEANTWORT.value == "klageantwort"
        assert DocumentType.RECHTSGUTACHTEN.value == "rechtsgutachten"
        assert DocumentType.VERTRAG.value == "vertrag"
        assert DocumentType.MAHNUNG.value == "mahnung"

    def test_display_name_multilingual(self):
        """Test display names in multiple languages."""
        names = DocumentType.KLAGESCHRIFT.display_name
        assert names["de"] == "Klageschrift"
        assert names["fr"] == "Demande"
        assert names["it"] == "Petizione"
        assert names["en"] == "Statement of Claim"

    def test_category_submission(self):
        """Test submission category documents."""
        assert DocumentType.KLAGESCHRIFT.category == "submission"
        assert DocumentType.KLAGEANTWORT.category == "submission"
        assert DocumentType.REPLIK.category == "submission"
        assert DocumentType.BERUFUNG.category == "submission"

    def test_category_opinion(self):
        """Test opinion category documents."""
        assert DocumentType.RECHTSGUTACHTEN.category == "opinion"
        assert DocumentType.MEMORANDUM.category == "opinion"
        assert DocumentType.KURZGUTACHTEN.category == "opinion"

    def test_category_contract(self):
        """Test contract category documents."""
        assert DocumentType.VERTRAG.category == "contract"
        assert DocumentType.KAUFVERTRAG.category == "contract"
        assert DocumentType.MIETVERTRAG.category == "contract"

    def test_category_correspondence(self):
        """Test correspondence category documents."""
        assert DocumentType.MAHNUNG.category == "correspondence"
        assert DocumentType.KUENDIGUNG.category == "correspondence"

    def test_requires_court(self):
        """Test court requirement."""
        assert DocumentType.KLAGESCHRIFT.requires_court
        assert DocumentType.BERUFUNG.requires_court
        assert not DocumentType.RECHTSGUTACHTEN.requires_court
        assert not DocumentType.VERTRAG.requires_court
        assert not DocumentType.MAHNUNG.requires_court


class TestDocumentSectionType:
    """Tests for DocumentSectionType enum."""

    def test_section_type_values(self):
        """Test all section type values."""
        assert DocumentSectionType.RUBRUM.value == "rubrum"
        assert DocumentSectionType.SACHVERHALT.value == "sachverhalt"
        assert DocumentSectionType.RECHTLICHES.value == "rechtliches"
        assert DocumentSectionType.PRAEAMBEL.value == "praeambel"

    def test_display_name_multilingual(self):
        """Test display names in multiple languages."""
        names = DocumentSectionType.SACHVERHALT.display_name
        assert names["de"] == "Sachverhalt"
        assert names["fr"] == "État de fait"
        assert names["it"] == "Fatti"
        assert names["en"] == "Statement of Facts"

        names_legal = DocumentSectionType.RECHTLICHES.display_name
        assert names_legal["de"] == "Rechtliches"
        assert names_legal["fr"] == "En droit"
        assert names_legal["it"] == "In diritto"


class TestDocumentMetadata:
    """Tests for DocumentMetadata dataclass."""

    def test_basic_creation(self):
        """Test basic metadata creation."""
        meta = DocumentMetadata(
            document_type=DocumentType.MEMORANDUM,
            language=Language.DE,
            jurisdiction=Jurisdiction.FEDERAL,
        )
        assert meta.document_type == DocumentType.MEMORANDUM
        assert meta.language == Language.DE
        assert meta.version == "1.0"

    def test_court_auto_population(self):
        """Test automatic court name population for submissions."""
        meta = DocumentMetadata(
            document_type=DocumentType.KLAGESCHRIFT,
            language=Language.DE,
            jurisdiction=Jurisdiction.ZH,
        )
        assert meta.court is not None
        assert "Zürich" in meta.court or "Zurich" in meta.court

    def test_no_court_for_opinion(self):
        """Test no court for non-submission documents."""
        meta = DocumentMetadata(
            document_type=DocumentType.RECHTSGUTACHTEN,
            language=Language.DE,
            jurisdiction=Jurisdiction.FEDERAL,
        )
        # Opinion documents don't auto-populate court
        assert meta.court is None  # None for non-submission documents

    def test_to_dict(self, sample_document_metadata):
        """Test serialization to dictionary."""
        data = sample_document_metadata.to_dict()
        assert "document_type" in data
        assert "language" in data
        assert "jurisdiction" in data
        assert "version" in data


class TestCitation:
    """Tests for Citation dataclass."""

    def test_basic_creation(self):
        """Test basic citation creation."""
        citation = Citation(citation_text="BGE 123 III 456")
        assert citation.citation_text == "BGE 123 III 456"
        assert citation.source_type == "unknown"
        assert not citation.is_verified

    def test_verified_citation(self, sample_citation):
        """Test verified citation with all fields."""
        citation = sample_citation
        assert citation.source_type == "bge"
        assert citation.is_verified
        assert citation.url is not None

    def test_to_dict(self, sample_citation):
        """Test serialization to dictionary."""
        data = sample_citation.to_dict()
        assert "citation_text" in data
        assert "source_type" in data
        assert "is_verified" in data
        assert "url" in data


class TestDocumentSection:
    """Tests for DocumentSection dataclass."""

    def test_basic_creation(self):
        """Test basic section creation."""
        section = DocumentSection(
            section_type="sachverhalt",
            title="Sachverhalt",
            content="Test content here.",
        )
        assert section.section_type == "sachverhalt"
        assert section.title == "Sachverhalt"
        assert section.order == 0

    def test_word_count(self):
        """Test word count calculation."""
        section = DocumentSection(
            section_type="test",
            title="Test",
            content="One two three four five.",
        )
        assert section.word_count == 5

    def test_word_count_with_subsections(self):
        """Test word count including subsections."""
        subsection = DocumentSection(
            section_type="sub",
            title="Sub",
            content="Six seven eight.",
        )
        section = DocumentSection(
            section_type="main",
            title="Main",
            content="One two three.",
            subsections=[subsection],
        )
        assert section.word_count == 6  # 3 + 3

    def test_citation_count(self, sample_citation):
        """Test citation count."""
        section = DocumentSection(
            section_type="test",
            title="Test",
            content="Test content.",
            citations=[sample_citation],
        )
        assert section.citation_count == 1

    def test_to_dict(self, sample_document_section):
        """Test serialization to dictionary."""
        data = sample_document_section.to_dict()
        assert "section_type" in data
        assert "title" in data
        assert "content" in data
        assert "word_count" in data


class TestLegalDocument:
    """Tests for LegalDocument dataclass."""

    def test_basic_creation(self, sample_document_metadata):
        """Test basic document creation."""
        doc = LegalDocument(metadata=sample_document_metadata)
        assert doc.metadata.document_type == DocumentType.KLAGESCHRIFT
        assert doc.sections == []
        assert doc.word_count == 0

    def test_auto_word_count(self, sample_document_metadata, sample_document_section):
        """Test automatic word count calculation."""
        doc = LegalDocument(
            metadata=sample_document_metadata,
            sections=[sample_document_section],
        )
        assert doc.word_count > 0

    def test_auto_page_estimate(self, sample_document_metadata):
        """Test automatic page estimate calculation."""
        section = DocumentSection(
            section_type="test",
            title="Test",
            content=" ".join(["word"] * 600),  # 600 words
        )
        doc = LegalDocument(
            metadata=sample_document_metadata,
            sections=[section],
        )
        assert doc.page_estimate == 2  # 600 / 300 = 2 pages

    def test_requires_checkpoint_short(self, sample_document_metadata):
        """Test short document doesn't require checkpoint."""
        doc = LegalDocument(
            metadata=sample_document_metadata,
            word_count=1000,
        )
        assert not doc.requires_checkpoint

    def test_requires_checkpoint_long(self, sample_document_metadata):
        """Test long document requires checkpoint."""
        doc = LegalDocument(
            metadata=sample_document_metadata,
            word_count=6000,
        )
        assert doc.requires_checkpoint

    def test_unverified_citations(self, sample_document_metadata):
        """Test unverified citations list."""
        verified = Citation(citation_text="BGE 123 III 456", is_verified=True)
        unverified = Citation(citation_text="BGE 789 III 012", is_verified=False)

        doc = LegalDocument(
            metadata=sample_document_metadata,
            citations_used=[verified, unverified],
        )
        assert len(doc.unverified_citations) == 1
        assert doc.has_unverified_citations

    def test_get_section(self, sample_legal_document):
        """Test getting section by type."""
        doc = sample_legal_document
        section = doc.get_section("sachverhalt")
        assert section is not None
        assert section.section_type == "sachverhalt"

        missing = doc.get_section("nonexistent")
        assert missing is None

    def test_add_section(self, sample_document_metadata):
        """Test adding section to document."""
        doc = LegalDocument(metadata=sample_document_metadata)
        section = DocumentSection(
            section_type="test",
            title="Test",
            content="Test content here.",
        )
        doc.add_section(section)
        assert len(doc.sections) == 1
        assert doc.sections[0].order == 0

    def test_render_full_text(self, sample_legal_document):
        """Test rendering full document text."""
        doc = sample_legal_document
        text = doc.render_full_text()
        assert "Sachverhalt" in text
        assert doc.full_text != ""

    def test_to_dict(self, sample_legal_document):
        """Test serialization to dictionary."""
        data = sample_legal_document.to_dict()
        assert "metadata" in data
        assert "sections" in data
        assert "word_count" in data
        assert "requires_checkpoint" in data

    def test_get_summary_de(self, sample_legal_document):
        """Test German summary generation."""
        summary = sample_legal_document.get_summary(Language.DE)
        assert "Dokument" in summary
        assert "Sprache" in summary

    def test_get_summary_fr(self, sample_legal_document):
        """Test French summary generation."""
        summary = sample_legal_document.get_summary(Language.FR)
        assert "Document" in summary
        assert "Langue" in summary

    def test_parties(self, sample_legal_document):
        """Test document parties."""
        doc = sample_legal_document
        assert len(doc.parties) == 2
        assert doc.parties[0].role == "plaintiff"
        assert doc.parties[1].role == "defendant"
