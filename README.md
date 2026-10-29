# PhonePe Shop — Electronics & Beauty Marketplace

**PRD | Author:** Harshvardhan Munda | **Version:** Draft v1 | **Date:** 28 October 2026

## 1. Executive Summary
PhonePe Shop is a proposed in-app marketplace for Electronics and Beauty & Personal Care, leveraging PhonePe's payments ecosystem to simplify product discovery, comparison, and checkout.

- **Electronics:** EMI, higher-value transactions, warranty add-ons.
- **Beauty:** Repeat purchases, subscriptions, and advertising.

**Hypothesis:** Trusted payments, competitive offers, and verified sellers can differentiate PhonePe in e-commerce.

## Prompt Engineering

Query filtering and category planning use a four-step prompt chain (full prompts in [`docs/PROMPTS.md`](./docs/PROMPTS.md)).

| Step | Prompt | Technique | Output |
|---|---|---|---|
| 1 | Intent classifier | Role + 9-intent taxonomy, few-shot, reason-first, JSON | Intent + confidence per query |
| 2 | Reviewer | Self-criticism | Corrected labels + error patterns |
| 3 | Goods-fit | Decomposition + tree-of-thought | Sellable? Category + subcategory |
| 4 | Category plan | Skeleton-of-thought | Scored P0/P1/P2 category plan |

**Design choices**
- Reasoning is produced before the label, which reduces keyword-only errors.
- Queries run in batches of 25 with a strict JSON schema.
- Error patterns from step 2 feed back into the step 1 rules, then the batch is re-run.

**Evaluation:** 50 random queries labelled manually, then compared across versions.

| Version | Method | Agreement with manual labels |
|---|---|---|
| v0 | Keyword rules (Excel baseline) | _TBD_ |
| v1 | Few-shot classifier | _TBD_ |
| v2 | Classifier + self-critique | _TBD_ |

> **Note:** the goods-intent count (114 of 798) in the Excel model comes from keyword rules. LLM labels vary between runs and are validated against the manual sample above.

## 2. Problem & Opportunity
Google Trends India analysis identified 114 goods-related queries among 798 unique queries (14%).

| Category | Queries |
|---|---:|
| Electronics | 18 |
| Beauty | 15 |
| Home & Kitchen | 21 |

Home & Kitchen is deferred to Phase 2. Search interest indicates potential demand but does not prove purchase intent.

## 3. Goals & Scope

**Goals**
- Validate in-app shopping adoption.
- Test UPI offers and eligible EMI options.
- Validate marketplace unit economics.
- Measure Beauty repeat purchases.

**Phase 1 Categories**
- Electronics: Smartphones, headphones, fitness trackers, student laptops.
- Beauty: Skincare, makeup, hair care, men's grooming.

**Out of Scope:** Fashion, Grocery, Home & Kitchen, travel, services, and PhonePe-owned inventory.

## 4. Target Users

| Persona | Need |
|---|---|
| Gadget buyers | Compare products and explore EMI |
| Beauty shoppers | Authentic products and repeat-purchase convenience |
| Existing PhonePe users | Convenient shopping and familiar checkout |

## 5. User Journey

End-to-End Flow

```text
PhonePe Home
     |
     v
Shop Entry Point
     |
     v
Shop Homepage
     |
     +----------------------+
     |                      |
     v                      v
  Search               Category Browse
     |                      |
     +----------+-----------+
                |
                v
         Product Results
                |
                v
         Product Details
                |
                v
       Compare / View Offers
                |
                v
              Cart
                |
                v
            Checkout
                |
                v
      UPI / Eligible EMI Options
                |
                v
          Order Placed
                |
                v
          Order Tracking
                |
                v
    Delivered / Cancelled / Returned
                |
                v
       Repeat Purchase Opportunity

`PhonePe Home → Shop → Search/Browse → Product Details → Compare → Cart → UPI/EMI Checkout → Order Tracking → Returns/Repeat Purchase`
```

## 6. Functional Requirements

**P0 — Launch**
- Shop homepage, search, filters, and sorting.
- Product details, reviews, offers, and verified sellers.
- Comparison of up to three products.
- Cart, addresses, and UPI checkout.
- Eligible EMI options.
- Order tracking, cancellation, and returns.
- Analytics instrumentation.

**P1 — Future**
- Wishlist and price alerts.
- Warranty and insurance add-ons.
- Beauty subscriptions through supported UPI Autopay flows.
- Sponsored listings and product recommendations.
- Beauty authenticity assurance.

## 7. Monetization

- Marketplace commissions.
- Financing partnerships.
- Warranty and insurance revenue share.
- Sponsored listings and brand advertising.
- Beauty subscriptions.

**Contribution Margin = Marketplace Revenue − Variable Operating Costs**

## 8. Success Metrics

| Metric | Purpose |
|---|---|
| Search-to-product-view CTR | Discovery |
| Add-to-cart and paid conversion | Funnel performance |
| GMV and take rate | Marketplace performance |
| Contribution margin per order | Profitability |
| EMI attachment rate | Electronics adoption |
| 30-day repeat rate | Beauty retention |
| Returns and cancellations | Customer experience |
| Seller onboarding and availability | Supply health |

**Core Events:** `search`, `product_view`, `compare`, `add_to_cart`, `emi_selected`, `order_placed`, `return_requested`.

## 9. Risks & Mitigation

- **Counterfeits:** Verify sellers and monitor authenticity.
- **Price competition:** Differentiate through payment offers and convenience.
- **Supply shortages:** Validate sellers before launch.
- **High returns:** Establish category-specific thresholds.
- **Regulatory risks:** Conduct legal and compliance reviews.
- **Weak demand:** Validate through a controlled pilot.

## 10. Assumptions to Validate

- Users will purchase products within PhonePe.
- UPI offers and EMI improve conversion.
- Sellers accept viable commission rates.
- Logistics partners can meet service expectations.
- Beauty generates repeat purchases.
- Marketplace economics are sustainable.

## 11. Rollout Plan

| Phase | Duration | Activities |
|---|---|---|
| Discovery | 2 weeks | User/seller research and success thresholds |
| Pilot | 4–6 weeks | Limited launch with P0 features |
| Review | 1 week | Evaluate conversion, returns, and economics |
| Expansion | Following quarter | Introduce P1 features if validated |

## 12. Dependencies
Seller onboarding, catalogue management, logistics, returns, lending partners, payments, legal, customer support, and analytics.

## 13. Open Questions
1. What commission rates are viable?
2. Direct seller onboarding or an existing commerce network?
3. Who owns returns and customer support?
4. Which cohort should receive the pilot?
5. What thresholds trigger a stop or scale decision?

## 14. Conclusion
PhonePe Shop tests whether payments-led convenience, trusted sellers, and category-specific monetization can establish a viable commerce experience.

**Success Principle:** Scale only when pilot data validates customer demand, operational reliability, and sustainable unit economics.
