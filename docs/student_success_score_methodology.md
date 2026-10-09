# CampusPulse: Student Success Score & Decision Intelligence Methodology

**Document Version:** 1.0  
**Target Architecture:** KPMG Smart Campus Analytics Challenge / Enterprise Higher-Education  
**System Parity:** Implemented concurrently in PostgreSQL (`public.recompute_student_success_scores`) and TypeScript (`lib/analytics/engine.ts`).

---

## 1. Core Philosophy: From Dashboards to Decision Intelligence
Traditional academic dashboards report isolated descriptive metrics (e.g., raw marks or single-point attendance). **CampusPulse** converts fragmented multi-source telemetry into an **explainable, actionable composite metric (0–100)** called the **Student Success Score ($S$)**. 

Every composite score is:
1. **Fully Decomposable:** Traceable to 7 normalized indicator pillars.
2. **Explainable:** Quantified against section benchmarks via a Waterfall delta chart ("Why this score?").
3. **Actionable:** Directly paired with a transparent logistic early-warning risk probability and prescriptive intervention protocols.

---

## 2. Mathematical Formulation & Weighting Schema

The total score $S \in [0, 100]$ is computed as:
$$S = \sum_{k=1}^{7} w_k \cdot \phi_k(x_k)$$
where $w_k$ denotes the tunable weight stored in `public.score_weights_config` ($\sum w_k = 100$) and $\phi_k(x_k) \in [0, 1]$ represents the dimension normalization function.

```
+------------------------------------------------------------------------------------------------+
|  Dimension      | Weight (wk) | Input Metrics                       | Normalization Formula    |
+-----------------+-------------+-------------------------------------+--------------------------+
| 1. Academic     | 30 pts      | CGPA, CIE F1/F2, Backlogs           | 0.50*(CGPA/10)           |
|                 |             |                                     | + 0.35*(avg(F1,F2)/10)   |
|                 |             |                                     | + 0.15*max(0, 1-0.20*BL) |
+-----------------+-------------+-------------------------------------+--------------------------+
| 2. Attendance   | 20 pts      | Biometric & Class Logs              | (floor(Att_pct/10)/10)   |
|                 |             | (Hard flag if Att < 75%)            |                          |
+-----------------+-------------+-------------------------------------+--------------------------+
| 3. LMS          | 10 pts      | 30-day Logins, Assignment Completion| 0.40*min(1, Logins/30)   |
|                 |             |                                     | + 0.60*(Done/Total)      |
+-----------------+-------------+-------------------------------------+--------------------------+
| 4. Engagement   | 10 pts      | Events, Clubs, Hackathons, Certs    | min(1, Raw_Pts / 15.0)   |
|                 |             | (Weights: 1x, 1.5x, 3x, 2.5x)       |                          |
+-----------------+-------------+-------------------------------------+--------------------------+
| 5. Placement    | 15 pts      | Aptitude, Coding, Mock Interview    | (Apt + Code + Mock)/300  |
+-----------------+-------------+-------------------------------------+--------------------------+
| 6. Skills       | 10 pts      | Comm, Coding, Leadership, Sports    | (Comm+Code+Lead+Sprt)/40 |
+-----------------+-------------+-------------------------------------+--------------------------+
| 7. Feedback     |  5 pts      | Faculty/Advisor Rating (1 to 5)     | Rating / 5.0             |
+------------------------------------------------------------------------------------------------+
```

### Key Nuances
* **Attendance Scaling:** Follows the discrete institutional threshold rule *"every 10% = 1 point"* ($\lfloor\text{Att}\%/10\rfloor$). For example, **74% attendance yields $\lfloor 7.4 \rfloor = 7$ points out of 10**, normalized to $0.70$, giving $14.0$ points out of $20.0$. An attendance below $75\%$ additionally triggers an immediate **hard warning flag**.
* **Backlog Decay:** Academic integrity accounts for active backlogs with a linear $-20\%$ decay per pending subject over the $15\%$ backlog baseline. A student with $\ge 5$ backlogs forfeits this component entirely.

---

## 3. Missing Data Imputation & Confidence Flagging
When optional fields (such as mock interview scores or technical skills) are missing from external ERP dumps:
1. The missing dimension is imputed using the **Section Median** ($\tilde{x}_{\text{sec}}$) rather than a global arbitrary constant.
2. The student profile is tagged with `low_data_confidence = true`. This surfaces an amber diagnostic badge in faculty portals encouraging advisor data enrichment.

---

## 4. Transparent Early-Warning Risk Modeling

Risk is evaluated through two deterministic guardrails and a continuous **Logistic Risk Model**:

### Deterministic Risk Triggers
* **Academic Risk:** Triggered if $\text{Score}_{\text{academic}} < 0.50 \cdot w_{\text{academic}}$ **OR** $\text{Backlogs} \ge 2$ **OR** $\text{Attendance} < 75\%$.
* **Placement Risk:** Triggered if $\text{Score}_{\text{placement}} < 0.50 \cdot w_{\text{placement}}$ **OR** ($\text{Coding} < 40$ and $\text{CGPA} \ge 7.0$).

### Logistic Probability Formulation
To calculate the overall risk probability $P_{\text{risk}} \in [0.00, 1.00]$ without black-box opaqueness, we model the deficit vectors:
$$\text{logit} = \beta_0 + \beta_1 d_{\text{att}} + \beta_2 d_{\text{acad}} + \beta_3 d_{\text{backlog}} + \beta_4 d_{\text{place}} + \beta_5 d_{\text{lms}}$$
where:
* $\beta_0 = -3.20$ (baseline well-calibrated prior for an active college student)
* $\beta_1 = 4.00, \quad \beta_2 = 2.80, \quad \beta_3 = 3.60, \quad \beta_4 = 2.10, \quad \beta_5 = 1.20$
* $P_{\text{risk}} = \frac{1}{1 + e^{-\text{logit}}}$

#### Risk Categorization Tiers
* **Low Risk:** $P < 0.35$ (Normal academic trajectory)
* **Medium Risk:** $0.35 \le P < 0.70$ (Requires departmental monitoring; e.g. **MD SAHIL** at $P = 0.38$)
* **High Risk:** $0.70 \le P < 0.85$ (Early intervention needed)
* **Critical Risk:** $P \ge 0.85$ (Escalated formal intervention; e.g. **SAGAR** at $P = 0.99$)

---

## 5. Explainability Engine: The "Why This Score" Waterfall
To ensure zero AI opacity, the engine compares each student's component points against their section's empirical average:
$$\Delta_k = \text{Score}_k - \overline{\text{Benchmark}}_k$$

The engine extracts the **Top 3 Positive Drivers** ($+\Delta$) and **Top 3 Negative Drags** ($-\Delta$) and synthesizes plain-English explanations:
* *Example (MD SAHIL):* `"Attendance 74% is below the mandatory 75% threshold (-1.8 pts vs section)"`
* *Example (SAGAR):* `"5 active backlogs causing critical academic penalty (-7.8 pts vs section)"`

In the UI, this renders as an interactive horizontal **Waterfall Bar** that instantly isolates why a student is underperforming.

---

## 6. Behavioral Student Segmentation & Prescriptive Interventions

Students are partitioned into 5 strategic operational cohorts, each coupled with a targeted workflow:

| Segment Name | Algorithmic Definition | Prescriptive Faculty Intervention |
| :--- | :--- | :--- |
| **1. High Academics / Low Placement Readiness** | $\text{CGPA} \ge 7.5$ and $\text{Placement}_{\text{avg}} < 55$ | Assign to 4-week coding marathon & 1-on-1 mock interview boot camp |
| **2. Consistent Achievers** | $\text{CGPA} \ge 7.5$, $\text{Att} \ge 75\%$, $0$ backlogs, Low Risk | Nominate for research fellowships, leadership roles, and tier-1 product hackathons |
| **3. Disengaged but Capable** | $\text{CGPA} \ge 6.5$, ($\text{Att} < 75\%$ or $\text{LMS} < 50\%$), $\text{Coding} \ge 60$ | Schedule immediate mentor counselling to address absenteeism root cause |
| **4. Academically At-Risk** | $\text{Backlogs} \ge 2$ or $\text{CGPA} < 6.0$ or $\text{Acad} < 15$ | Enroll in Saturday remedial clinics; mandatory guardian conference |
| **5. Skill-Strong, Marks-Weak** | $\text{CGPA} < 7.0$ and ($\text{Coding} \ge 7.5$ or $\text{Hackathons} \ge 2$) | Provide exam writing workshops and continuous internal evaluation concept tutoring |

---

## 7. Execution Architecture & Event-Driven Recomputation
* **PostgreSQL:** Automatically triggers `recompute_student_success_scores()` whenever `academic_marks`, `attendance`, or `placement_readiness` rows are inserted, updated, or removed.
* **TypeScript Engine:** Allows client-side and mock-mode simulations (`DATA_MODE=mock`), enabling instant interactive recalculation when users adjust scenario sliders in the browser without database latency.
