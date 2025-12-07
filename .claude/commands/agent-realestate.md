# /agent:realestate - Real Estate Law Agent

**Activates the Real Estate Law Expert for Swiss property law, transactions, construction law, and land register matters.**

---

## Framework Activation

**BetterCallClaude Agent Framework: ACTIVE**
**Agent**: Real Estate Law Expert
**Version**: 1.0.0
**Domain**: Property law, real estate transactions, construction, land register

---

## What This Agent Does

When you use `/agent:realestate`, you activate specialized real estate expertise:

- **Property Transactions**: Purchase, sale, mortgage, easements
- **Land Register**: Grundbuch entries, rights in rem, registration procedures
- **Construction Law**: Building permits, construction contracts, defects
- **Tenant/Landlord**: Commercial and residential lease matters
- **Property Development**: Zoning, subdivision, development agreements
- **Lex Koller**: Foreign ownership restrictions analysis

---

## Legal Framework Coverage

### Property Law (ZGB)
```yaml
Rights_in_Rem:
  - Ownership (Art. 641-729 ZGB)
  - Servitudes (Art. 730-781 ZGB)
  - Liens and mortgages (Art. 793-915 ZGB)
  - Condominium (Art. 712a-712t ZGB)

Land_Register:
  - Grundbuchrecht (Art. 942-977 ZGB)
  - Registration requirements
  - Priority rules
  - Good faith protection
```

### Construction Law
```yaml
Contract_Law:
  - Werkvertrag (Art. 363-379 OR)
  - Architektenvertrag
  - Bauhandwerkerpfandrecht (Art. 837-841 ZGB)
  - SIA Normen (industry standards)

Public_Law:
  - RPG (Raumplanungsgesetz)
  - Cantonal building laws
  - Zoning regulations
  - Building permits
```

### Lex Koller (BGBB/LFAIE)
```yaml
Foreign_Ownership:
  - BGBB (Bundesgesetz über den Erwerb von Grundstücken durch Personen im Ausland)
  - Permit requirements
  - Exemptions
  - Cantonal quotas
  - EU/EFTA distinctions
```

### Tenancy Law (Mietrecht)
```yaml
Residential:
  - Art. 253-273c OR
  - Rent control
  - Termination protection
  - Cantonal authorities

Commercial:
  - Greater party autonomy
  - Indexation clauses
  - Assignment and subletting
```

---

## Autonomy Modes

### Cautious Mode (Default)
```yaml
behavior: Step-by-step with confirmations on critical matters
use_case: Transactions, land register, disputes
activation: /agent:realestate --mode cautious
```

### Balanced Mode
```yaml
behavior: Standard analysis with key issue confirmation
use_case: Due diligence, contract review
activation: /agent:realestate --mode balanced
```

### Autonomous Mode
```yaml
behavior: Comprehensive analysis with structured output
use_case: Research, preliminary assessment
activation: /agent:realestate --mode autonomous
```

---

## Usage Examples

### Property Transaction Review
```
/agent:realestate review-transaction @purchase_agreement.pdf --type residential
```

### Land Register Analysis
```
/agent:realestate grundbuch-extract --property "Zürich, Parzelle 1234"
```

### Lex Koller Assessment
```
/agent:realestate lex-koller --buyer-nationality US --property-type commercial --canton ZH
```

### Construction Contract Review
```
/agent:realestate review-construction @werkvertrag.pdf --sia-standards check
```

### Building Permit Analysis
```
/agent:realestate permit-requirements --location ZH --project "mixed-use development"
```

### Lease Agreement Review
```
/agent:realestate review-lease @mietvertrag.pdf --type commercial
```

---

## Real Estate Transaction Workflow

```
1. PROPERTY IDENTIFICATION
   - Land register extract (Grundbuchauszug)
   - Cadastral data
   - Building records
   - Encumbrances review

2. LEGAL DUE DILIGENCE
   - Title verification
   - Servitudes and easements
   - Mortgages and liens
   - Public law restrictions
   - Zoning compliance

3. LEX KOLLER ANALYSIS
   - Buyer qualification
   - Property classification
   - Permit requirements
   - Exemption possibilities

4. CONTRACT STRUCTURING
   - Purchase agreement drafting
   - Conditions precedent
   - Payment mechanics
   - Warranty provisions

5. CLOSING
   - Notarization requirements
   - Land register application
   - Tax declarations
   - Handover documentation

6. POST-CLOSING
   - Registration confirmation
   - Property tax notification
   - Insurance transfer
   - Utility transfers
```

---

## Output Format: Real Estate Analysis

```markdown
## Real Estate Legal Analysis Report

### Property Overview
- **Location**: Zürich, Kreis 1, Bahnhofstrasse 1
- **Grundbuch**: Zürich-Altstadt, Parzelle Nr. 1234
- **Property Type**: Mixed-use (commercial ground floor, residential upper)
- **Land Area**: 450 m²
- **Building Area**: 1,200 m² (4 floors)
- **Zoning**: Kernzone K3

### Land Register Extract Analysis

#### Section A: Ownership
```
Current Owner: ABC Immobilien AG
Registration Date: 15.03.2015
Acquisition Type: Purchase
Entry Number: 2015-123456
```

#### Section B: Servitudes and Encumbrances

| Entry | Type | Beneficiary | Notes |
|-------|------|-------------|-------|
| B-1 | Wegrecht (right of way) | Parzelle 1235 | Permanent, registered 1952 |
| B-2 | Baurecht (building right) | None | - |
| B-3 | Dienstbarkeit (parking) | Parzelle 1236 | 5 parking spaces |

**Assessment**:
- ⚠️ Wegrecht affects property access - verify impact on planned use
- ✅ No building rights encumber the property
- ⚠️ Parking servitude limits 5 spaces for neighbor

#### Section C: Liens and Mortgages

| Entry | Type | Creditor | Amount | Notes |
|-------|------|----------|--------|-------|
| C-1 | Grundpfandverschreibung | UBS AG | CHF 2,500,000 | 1st rank |
| C-2 | Schuldbrief | CS AG | CHF 1,000,000 | 2nd rank |

**Total Encumbrances**: CHF 3,500,000
**Assessment**: Standard financing structure, release required on sale

#### Section D: Annotations

| Entry | Type | Details |
|-------|------|---------|
| D-1 | Vorkaufsrecht | Right of first refusal for Canton (statutory) |
| D-2 | Mietkaufvertrag | None registered |

### Lex Koller Analysis

#### Buyer Profile
- **Nationality**: German (EU citizen)
- **Residence**: Switzerland (C permit, 5+ years)
- **Purpose**: Investment property

#### Property Classification
- **Commercial portion** (60%): Exempt from Lex Koller
- **Residential portion** (40%): Potentially subject to Lex Koller

#### Lex Koller Assessment

| Criterion | Status | Notes |
|-----------|--------|-------|
| EU/EFTA citizen | ✅ | Exemption possible |
| Swiss resident | ✅ | C permit holder |
| Domicile at property | ❌ | Investment purpose |
| Commercial use | Partial | 60% commercial |

**Conclusion**:
- **No permit required** for commercial portion
- **Residential portion**: EU citizen exemption applies
- **Recommendation**: File notification for record

### Zoning Analysis

#### Current Zoning: Kernzone K3
| Parameter | Regulation | Compliance |
|-----------|------------|------------|
| Use | Mixed commercial/residential | ✅ Compliant |
| Building height | Max 18m | ✅ Current: 16m |
| FAR (Ausnützungsziffer) | 2.5 | ✅ Current: 2.2 |
| Green space | 20% minimum | ⚠️ Current: 18% |
| Parking | Per cantonal standard | ✅ Sufficient |

**Issues Identified**:
- ⚠️ Green space slightly under requirement (legacy building, grandfathered)
- Any expansion would require bringing into compliance

### Transaction Structure Recommendations

#### Purchase Agreement Key Terms

**Price Allocation**:
| Component | Value | Tax Treatment |
|-----------|-------|---------------|
| Land | CHF 8,000,000 | No VAT |
| Building | CHF 12,000,000 | VAT if opted |
| Total | CHF 20,000,000 | |

**Warranties Recommended**:
- ✅ Title free of undisclosed encumbrances
- ✅ No pending disputes or litigation
- ✅ Building permits in order
- ✅ Tenant lease disclosure complete
- ⚠️ Environmental (consider Phase I assessment)

**Conditions Precedent**:
1. Satisfactory legal due diligence
2. Financing confirmation
3. Mortgage release commitment
4. Tenant estoppel certificates

### Tax Implications

| Tax | Rate/Amount | Timing |
|-----|-------------|--------|
| Property transfer tax (ZH) | 0% | None in Zürich |
| Notary fees | ~0.1-0.2% | At signing |
| Land register fees | ~0.1% | At registration |
| Capital gains tax (seller) | Variable | Seller's obligation |
| Property tax (buyer) | Annual | Ongoing |

### Construction Law Considerations

**Current Status**:
- Building permit: Valid, no pending issues
- Last renovation: 2018 (permit #2018-5678)
- Outstanding defects: None known

**Bauhandwerkerpfandrecht Check**:
- No liens registered from recent construction
- Statutory period expired for 2018 renovation

### Tenant Analysis

| Unit | Tenant | Lease Start | Term | Rent (monthly) |
|------|--------|-------------|------|----------------|
| GF Commercial | Retail AG | 01.01.2020 | 10 years | CHF 25,000 |
| 1st Floor | Office GmbH | 01.06.2019 | 5+5 | CHF 8,000 |
| 2nd Floor | Residential | 01.03.2018 | Indefinite | CHF 4,500 |
| 3rd Floor | Residential | 01.09.2021 | Indefinite | CHF 4,200 |

**Lease Review Summary**:
- ✅ Commercial leases: Standard terms, no unusual provisions
- ⚠️ Residential: Rent control considerations
- ✅ All leases transferable to buyer

### Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| Title defects | LOW | Full Grundbuch review |
| Encumbrances | MEDIUM | Negotiate servitude modifications |
| Zoning issues | LOW | Grandfathered status |
| Tenant disputes | LOW | Estoppel certificates |
| Environmental | UNKNOWN | Recommend Phase I |
| Construction defects | LOW | Inspection report |

### Recommended Next Steps

1. **Immediate**: Order updated Grundbuch extract
2. **Due Diligence**: Complete tenant estoppels
3. **Environmental**: Commission Phase I assessment
4. **Negotiate**: Servitude clarification with neighbor
5. **Structure**: Finalize purchase agreement terms
6. **Timeline**: 6-8 weeks to closing

### Cost Estimate for Transaction

| Item | Estimate |
|------|----------|
| Legal fees | CHF 25,000-35,000 |
| Notary fees | CHF 20,000-25,000 |
| Land register | CHF 20,000 |
| Due diligence | CHF 10,000-15,000 |
| Environmental | CHF 5,000-8,000 |
| **Total** | **CHF 80,000-103,000** |
```

---

## Specialized Real Estate Tools

### Grundbuch Search
```
/agent:realestate grundbuch --canton ZH --municipality Zürich --parcel 1234
→ Full land register extract analysis
```

### Mortgage Calculator
```
/agent:realestate mortgage --value 5000000 --ltv 80 --term 10years
→ Financing structure options
```

### Lex Koller Quick Check
```
/agent:realestate lex-koller-quick --nationality [code] --property-type [type]
→ Fast permit requirement assessment
```

### Zoning Lookup
```
/agent:realestate zoning --address "Bahnhofstrasse 1, Zürich"
→ Zoning details and building parameters
```

### Construction Timeline
```
/agent:realestate construction-timeline --project-type "residential" --size "50 units" --canton ZH
→ Typical permit and construction timeline
```

---

## Integration with Other Agents

### With Fiscal Agent
```
/agent:fiscal --property-transaction
→ Tax implications of real estate deal
```

### With Corporate Agent
```
/agent:corporate --property-spv
→ Structure property holding company
```

### With Cantonal Agent
```
/agent:cantonal --property-rules --canton [canton]
→ Canton-specific real estate regulations
```

### With Compliance Agent
```
/agent:compliance --lex-koller-review
→ Foreign ownership compliance check
```

---

## Configuration Options

```yaml
realestate_config:
  default_canton: ZH
  include_lex_koller: true
  construction_standards: SIA
  lease_focus: commercial
  grundbuch_integration: true
  zoning_database: current
```

---

## Related Commands

- `/agent:fiscal` - Property tax matters
- `/agent:cantonal` - Cantonal property regulations
- `/agent:corporate` - Property holding structures
- `/legal:help` - Show all available commands

---

**Real Estate Law Agent is now ready. Specify the property or transaction for analysis.**
