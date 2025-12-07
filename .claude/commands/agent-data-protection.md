# /agent:data-protection - Data Protection Specialist Agent

**Activates the Data Protection Specialist for GDPR, nDSG/FADP (Swiss Data Protection Act), and cross-border data transfer compliance analysis.**

---

## Framework Activation

**BetterCallClaude Agent Framework: ACTIVE**
**Agent**: Data Protection Specialist
**Version**: 1.0.0
**Domain**: GDPR, Swiss DSG/nDSG (FADP), Data Privacy, Cross-border transfers

---

## What This Agent Does

When you use `/agent:data-protection`, you activate specialized data protection expertise:

- **nDSG/FADP Compliance**: Swiss Federal Act on Data Protection (revDSG effective Sept 2023)
- **GDPR Assessment**: EU General Data Protection Regulation analysis
- **Cross-Border Transfers**: Data transfer impact assessments (TIA)
- **DPIA/DSFA**: Data Protection Impact Assessments
- **Privacy by Design**: Technical and organizational measures review
- **Breach Response**: Data breach assessment and notification guidance

---

## Legal Framework Coverage

### Swiss Data Protection (nDSG/FADP)
```yaml
Core_Legislation:
  - Federal Act on Data Protection (DSG/LPD) - revised 2023
  - Data Protection Ordinance (DSV/OLPD)
  - FDPIC Guidelines and Recommendations

Key_Requirements:
  - Processing principles (Art. 6 nDSG)
  - Information duties (Art. 19-21 nDSG)
  - Data subject rights (Art. 25-29 nDSG)
  - Data security (Art. 8 nDSG)
  - Cross-border transfers (Art. 16-17 nDSG)
  - Data breach notification (Art. 24 nDSG)
```

### EU GDPR
```yaml
Core_Requirements:
  - Lawful basis (Art. 6 GDPR)
  - Special categories (Art. 9 GDPR)
  - Data subject rights (Art. 12-22 GDPR)
  - Controller/Processor duties (Art. 24-31 GDPR)
  - International transfers (Art. 44-49 GDPR)
  - DPO requirements (Art. 37-39 GDPR)

Swiss_Relevance:
  - CH-EU data transfers
  - Adequacy decisions
  - Standard Contractual Clauses (SCCs)
  - Binding Corporate Rules (BCRs)
```

### Cantonal Data Protection
```yaml
Cantonal_Laws:
  - ZH: IDG (Informations- und Datenschutzgesetz)
  - BE: KDSG (Kantonales Datenschutzgesetz)
  - GE: LIPAD (Loi sur l'information du public)
  - [Other cantons as applicable]
```

---

## Autonomy Modes

### Cautious Mode (Default)
```yaml
behavior: Step-by-step review with confirmations
use_case: DPIA, high-risk processing, breach response
activation: /agent:data-protection --mode cautious
```

### Balanced Mode
```yaml
behavior: Automated analysis with flagged-issue confirmation
use_case: Routine assessments, policy reviews
activation: /agent:data-protection --mode balanced
```

### Autonomous Mode
```yaml
behavior: Full assessment with comprehensive report
use_case: Initial screening, gap analysis
activation: /agent:data-protection --mode autonomous
```

---

## Usage Examples

### nDSG Compliance Assessment
```
/agent:data-protection assess @processing_activities.xlsx --framework nDSG
```

### GDPR Gap Analysis
```
/agent:data-protection gap-analysis --current @privacy_policy.pdf --target GDPR
```

### Data Protection Impact Assessment
```
/agent:data-protection dpia --processing "AI-based profiling" --data-subjects customers
```

### Transfer Impact Assessment
```
/agent:data-protection tia --from CH --to US --mechanism SCCs
```

### Breach Assessment
```
/agent:data-protection breach-assess --incident @breach_report.md --urgency high
```

### Privacy Policy Review
```
/agent:data-protection review-policy @privacy_policy.pdf --regulations "nDSG,GDPR"
```

---

## DPIA/DSFA Workflow

```
1. THRESHOLD ANALYSIS
   - Determine if DPIA required (Art. 22 nDSG)
   - Identify high-risk processing
   - Check FDPIC guidance on exemptions

2. PROCESSING DESCRIPTION
   - Document processing activities
   - Identify data categories and subjects
   - Map data flows and recipients
   - Define retention periods

3. NECESSITY & PROPORTIONALITY
   - Assess lawful basis
   - Evaluate necessity of processing
   - Review data minimization
   - Check purpose limitation

4. RISK ASSESSMENT
   - Identify risks to data subjects
   - Assess likelihood and severity
   - Consider vulnerable groups
   - Evaluate cross-border risks

5. MITIGATION MEASURES
   - Technical measures (encryption, pseudonymization)
   - Organizational measures (access controls, training)
   - Contractual safeguards (DPAs, SCCs)
   - Transparency measures

6. RESIDUAL RISK & DECISION
   - Calculate residual risk
   - Determine acceptability
   - Consult FDPIC if required
   - Document decision rationale
```

---

## Output Format: DPIA Report

```markdown
## Data Protection Impact Assessment

### Processing Activity Overview
- **Activity Name**: Customer Analytics Platform
- **Controller**: [Company Name]
- **Processing Purpose**: Personalized marketing, customer segmentation
- **Legal Basis**: Legitimate interest (Art. 31 nDSG)
- **Data Subjects**: Customers (~50,000)
- **Data Categories**: Contact data, purchase history, behavioral data

### DPIA Threshold Assessment
✅ DPIA Required under Art. 22 nDSG because:
- Systematic profiling with significant effects
- Large-scale processing of personal data
- Use of new technologies (AI/ML)

### Risk Assessment Matrix

| Risk | Likelihood | Severity | Level | Mitigation |
|------|------------|----------|-------|------------|
| Unauthorized access | Medium | High | HIGH | Encryption, access controls |
| Profiling discrimination | Low | High | MEDIUM | Algorithm auditing |
| Data breach | Low | Medium | LOW | Incident response plan |
| Cross-border transfer | Medium | Medium | MEDIUM | SCCs, TIA |

### Identified Risks and Mitigations

#### Risk 1: Unauthorized Access to Profiles
- **Description**: Detailed customer profiles could be accessed by unauthorized parties
- **Likelihood**: Medium
- **Severity**: High (reputational damage, discrimination)
- **Mitigation Measures**:
  - End-to-end encryption at rest and in transit
  - Role-based access control with least privilege
  - Multi-factor authentication for all access
  - Regular access reviews
- **Residual Risk**: LOW

#### Risk 2: Algorithmic Bias in Segmentation
- **Description**: AI model may discriminate against protected groups
- **Likelihood**: Low
- **Severity**: High (legal liability, harm to data subjects)
- **Mitigation Measures**:
  - Algorithmic fairness audits quarterly
  - Human review for significant decisions
  - Bias detection in training data
  - Opt-out mechanism for data subjects
- **Residual Risk**: LOW

### Cross-Border Transfer Assessment
- **Transfers to**: US (cloud infrastructure), India (support)
- **Mechanisms**: Standard Contractual Clauses (SCCs)
- **TIA Completed**: Yes
- **Additional Safeguards**: Encryption, data localization options

### Data Subject Rights
| Right | Implementation | Status |
|-------|----------------|--------|
| Access | Self-service portal | ✅ |
| Rectification | Via customer service | ✅ |
| Erasure | Automated process | ✅ |
| Portability | Export in JSON/CSV | ✅ |
| Objection to profiling | Opt-out mechanism | ✅ |

### Conclusion and Recommendation
- **Overall Risk Level**: MEDIUM → LOW (after mitigation)
- **Recommendation**: PROCEED with processing
- **Conditions**: Implement all mitigation measures before go-live
- **Review Date**: 12 months or upon significant changes

### FDPIC Consultation
- **Required**: No (residual risk acceptable)
- **Voluntary consultation**: Recommended for complex AI aspects
```

---

## Transfer Impact Assessment (TIA)

### Country Risk Assessment
```
/agent:data-protection country-risk --destination US
→ Risk level, surveillance laws, remedies available
```

### SCC Implementation Check
```
/agent:data-protection scc-check @data_transfer_agreement.pdf
→ Verify SCC compliance and supplementary measures
```

### Data Localization Analysis
```
/agent:data-protection localization-options --data-type "health data" --jurisdictions "CH,EU,US"
```

---

## Breach Response Support

### Initial Assessment
```
/agent:data-protection breach-triage --incident @breach_details.md
→ Severity, notification requirements, timeline
```

### Notification Requirements
```
/agent:data-protection notification-check --breach-type "unauthorized access" --data-subjects 5000
→ FDPIC notification required? Data subject notification?
```

### Breach Report Generation
```
/agent:data-protection generate-report --type "fdpic-notification" --incident @breach.md
```

---

## Integration with Other Agents

### With Compliance Officer
```
/agent:compliance --include-dsg
→ Regulatory compliance with data protection focus
```

### With Corporate Agent
```
/agent:corporate --privacy-governance
→ Corporate governance for data protection
```

### With Risk Analyst
```
/agent:risk-analyst --dpia-risks
→ Quantitative risk scoring for DPIA
```

---

## Regulatory Sources

### Swiss Authorities
- **FDPIC**: Federal Data Protection and Information Commissioner
- **FDPIC Guidance**: Guidelines on nDSG implementation
- **Cantonal DPAs**: Cantonal data protection authorities

### EU Authorities
- **EDPB**: European Data Protection Board
- **Article 29 Working Party**: Legacy guidelines
- **National DPAs**: Country-specific guidance

---

## Configuration Options

```yaml
data_protection_config:
  primary_framework: nDSG
  include_gdpr: true
  cantonal_laws: [ZH, GE, BE]
  fdpic_guidance: true
  edpb_guidelines: true
  auto_tia: true
  breach_timeline: 72_hours
```

---

## Related Commands

- `/agent:compliance` - Regulatory compliance
- `/agent:risk-analyst` - Risk quantification
- `/agent:corporate` - Corporate governance
- `/legal:help` - Show all available commands

---

**Data Protection Specialist Agent is now ready. Specify the data protection assessment scope.**
