# StallPlus Style Guide

Rules for tone, voice, grammar, and brand language across the StallPlus site, news feed, sales copy, and any draft or prompt tied to this project. The goal: clear, human writing that does not read as AI-generated, with StallPlus-specific terminology and claims applied consistently.

---

## Brand Voice

StallPlus speaks to facilities teams, procurement buyers, and individual customers who care about restroom privacy and personal item protection. The voice is practical, direct, and grounded in real facility problems.

**Lead with the facility outcome.**
State what the buyer gets before how the product works. Example: "Close stall gaps without replacing the stall system" before "Industrial-grade PVC guard."

**Confident, not alarmist.**
Privacy and safety matter, but copy should not use fear, panic, or sensational crime framing to sell. Dignity and practical upgrades carry the message.

**Specific to commercial restrooms.**
Name stall gaps, sightlines, phones on floors, shift-change traffic, and procurement details. Avoid generic "better experience" language without a concrete referent.

**Made for buyers who spec and install.**
Facilities teams need fast installation, bulk formats, and clear RFP paths. Individual buyers need portability and simple use cases. Write to the buyer type in context.

**Warm where warranted, never performative.**
Restroom privacy touches dignity. Treat that seriously without melodrama or corporate sentiment.

---

## Brand Name and Contact

| Use | Not |
|-----|-----|
| StallPlus | Stall Plus, Stallplus, STALLPLUS |
| StallPlus+ | Stall Plus+, StallPlus Plus |
| StallPlus-Go | StallPlus Go, Stall Plus Go |
| StallStash | Stall Stash |
| WallStash | Wall Stash |
| StallCaddy | Stall Caddy |

**Contact (site standard):**
- Email: info@stallplus.com
- Phone: (314) 451-2200
- Website: stallplus.com

**Trust line:** Made in the USA

**Founding context:** Commercial restroom upgrades since 2019

---

## Product Language

Organize copy around the buyer's problem, not the product catalog.

### Product names and roles

| Product | Category | One-line role |
|---------|----------|---------------|
| StallPlus+ Privacy Gap Guard | Privacy | Permanent PVC guard for door and corner gaps in commercial stalls |
| StallStash Restroom Organizer | Item protection | Stall-attached protector for phones, purses, wallets, keys, bags |
| WallStash Wall-Attached Protector | Item protection | Wall-mounted shelf for shared restrooms with limited hooks or counters |
| StallCaddy Urinal-Attached Protector | Item protection | Urinal-area protector for personal items during use |
| StallPlus-Go Portable Blocker | Portable | Rollout strap that hooks over standard partitions and blocks the stall gap from inside |

### Preferred terms

- **Privacy gap guard** (not "privacy shield" or "privacy panel" unless quoting a spec)
- **Stall gap** / **door and corner gaps** / **line of sight** / **exposed sightlines**
- **Item protector** / **personal item protection** (not "storage solution")
- **Commercial restroom** / **public restroom** / **high-traffic restroom**
- **Without renovation work** / **without remodel scope** / **no cutting or measuring required** (where accurate for the product)
- **Facilities team** / **facility buyer** / **procurement**

### Product filter labels (site)

- All
- Privacy
- Item protection
- Portable

### Tag patterns (product cards)

Use "Best for [context]" tags:
- Best for facility-wide privacy
- Best inside stalls
- Best on restroom walls
- Best near urinals
- Best for personal use

---

## Buyer Types and Audiences

Write to the buyer in context. Default site CTAs assume a facility or procurement path unless the section targets individuals.

| Buyer type | Primary need | Typical CTA |
|------------|--------------|-------------|
| Facility buyer | Bulk privacy and item protection across buildings | Get pricing, Get a Quote, Start an RFP |
| Distributor | Product line clarity and procurement readiness | Get pricing, Send request |
| Individual buyer | Portable or single-unit privacy | Shop products, Buy now |

**Facility verticals (case studies):**
Office buildings, Healthcare, Schools, Warehouses, Restaurants, Airports, Stadiums

Each vertical case study follows three bullets:
1. **Why it matters:** stakes for that facility type
2. **What it solves:** which StallPlus products address the problem
3. **If left unresolved:** downstream cost (complaints, reviews, HR friction, retention, etc.)

---

## Messaging Pillars

Every piece of StallPlus copy should connect to one or more of these:

1. **Close visible stall gaps** without replacing the stall system
2. **Protect phones, bags, and personal items** off floors and questionable surfaces
3. **Install fast** with no remodel scope
4. **Scale from one building to a national rollout**
5. **Improve dignity and privacy** in spaces tied to basic comfort

### Claims we make

- StallPlus+ blocks the line of sight through door and corner gaps
- Products install with included hardware; no cutting or measuring required (StallPlus+)
- Made in the USA
- Fits common commercial restroom needs: privacy, item protection, maintenance access, quick installation
- 4-pack commercial format available (StallPlus+)

### Claims we do not make

- Guaranteed prevention of voyeurism, peeping, or hidden camera recording
- Surveillance detection or camera blocking
- Complete privacy in every stall configuration (state what the product covers: door and corner gaps, portable blocker from inside)
- Fear-based guarantees ("never worry again," "total protection," "100% safe")

**Rule:** Hidden camera and safety news should be framed as **additional privacy protection**, not guaranteed prevention. Use news angles carefully; do not exploit crime headlines for hard sells.

---

## News and Content Framing

The "Why StallPlus?" news section maps privacy-related headlines to restroom upgrade demand. A daily GitHub Actions job fetches articles, scores them, and writes `data/why-stallplus-news.json`.

### Confidence thresholds

| Score | Bucket | Site visibility |
|-------|--------|-----------------|
| >= 70 and category gate passed | `articles` | Published on site |
| 40-69, or >= 70 with failed gate | `pendingReview` | Internal review only |
| < 40, exclusion match, or no category | Rejected | Discarded |

Crime and voyeurism stories require restroom context (`bathroom`, `restroom`, `stall`, etc.) to auto-publish. Home peeping, film reviews, and voyeurism without restroom terms are excluded.

### Category gates (auto-publish)

| Category | Gate |
|----------|------|
| Bathroom peeping, hidden cameras, women's safety | At least one restroom-context term |
| Workplace privacy | `office restroom`, `workplace privacy`, or restroom + workplace terms |
| Viral stall gaps | Stall-gap-specific terms (not generic `bathroom` alone) |

### Category hooks

| Category | Hook |
|----------|------|
| Bathroom peeping / voyeurism | Turns stall gaps from an inconvenience into an immediate privacy concern |
| Dorm bathroom privacy | Connects shared bathrooms with portable privacy for students and parents |
| Hidden cameras in public spaces | Frames StallPlus as additional privacy protection without overclaiming surveillance prevention |
| Return-to-office workplace privacy | Gives facilities and HR teams a practical employee-experience improvement |
| Viral stall-gap discourse | Uses high-awareness stall-gap discourse to make the problem instantly recognizable |
| Women's safety stories | Centers dignity, comfort, and peace of mind without panic-based messaging |
| Broader privacy culture | Supports thought leadership around privacy norms in public and shared spaces |

Published angles use category-specific copy. Pending items get a shorter internal note for reviewers.

**Statistic (site):** 100k+ voyeurism / peeping incidents in U.S. bathrooms every year. Use with care; cite when possible and do not turn the stat into alarmist copy.

---

## Site Copy Patterns

### Eyebrows

Short labels above headings. Lowercase feel, sentence case. Examples:
- Commercial restroom upgrades since 2019
- One restroom line, clear buying paths
- Product lineup
- Procurement ready

### Headlines

State the outcome or buyer job. Examples:
- Privacy guards and item protectors for high-traffic restrooms.
- Choose by the job the restroom needs to do.
- Products organized around the buyer's problem.
- For one building, a campus, or a national rollout.

### Hero and section body copy

One or two sentences. Name the audience (facilities teams, travelers, students) and the concrete problem (stall gaps, phones and bags, renovation-free install).

### CTAs

| Label | Use when |
|-------|----------|
| Shop products | General product discovery |
| Start an RFP | Procurement / multi-site buyers |
| Get pricing | Nav and pricing intent |
| Get a Quote | Case study conversion |
| Buy now | Product card purchase intent |
| Send request | Contact form submit |

### Form placeholder example

`42 stalls across 3 office buildings, privacy guards plus item protectors.`

RFP copy should ask for: restroom count, stall count, facility type, target timeline.

### Install flow (four steps)

1. Find the gap
2. Position the guard
3. Secure it
4. Improve privacy

Keep steps imperative and short.

---

## Punctuation

**No em dashes (—). Ever.**
Use periods, commas, semicolons, colons, or parentheses instead.

**No en dashes (–). Ever.**
Use hyphens for ranges and compound words only.

Use hyphens for true compound terms: data-driven, 25-year-old, hand-curated. Never as a stylistic pause.

Use the simplest punctuation that works:
- Comma for a pause within a sentence.
- Period for a new thought.
- Semicolon for closely related sentences.
- Colon before a definition or list.
- Parentheses for genuine asides.

---

## Voice

**Lead with the point.**
State the conclusion first. Do not build up to it.

**Active voice.**
Prefer "The facilities team closes stall gaps in an afternoon." Avoid "Stall gaps can be closed by the facilities team."

**No contrastive pairings.** Avoid:
- "It's not X, it's Y."
- "This isn't X. It's Y."
- "Not just X, but Y."

Write Y directly.

**No rhetorical negation.**
Do not define things by what they are not. State what they are.

**No flowery openers.** Cut:
- "Imagine a world where..."
- "In today's fast-paced..."
- "The truth is..."
- "At the end of the day..."
- "It goes without saying..."

Start with the point.

**Be concise.**
Remove filler, throat-clearing, unnecessary adjectives, and hedging unless uncertainty is real. Two clear sentences beat one long sentence.

**No "I" statements as sentence openers** unless the subject is genuinely personal. Leads should focus on the topic, not the writer.

---

## Tone

- Confident, not boastful.
- Direct, not blunt.
- Specific, not abstract.
- Warm where warranted, but never performative.
- No exclamation points in professional writing unless quoting someone or writing marketing copy where they are expected.

---

## Structure

- **Clarity over cleverness.** The reader should understand the sentence on first pass.
- **Specificity over abstraction.** Use concrete nouns and verbs.
- **Substance over style.** Every sentence should contribute information, meaning, or momentum.
- **Confidence over qualification.** When something is known, state it plainly.
- **Facts over speculation.** Do not present assumptions as truth.

---

## Vague Pronoun and Demonstrative References

Never open a sentence with "This," "It," or "That" as a standalone subject. These words defer meaning instead of delivering it. Replace them with what they actually describe.

**The rule:** If "this," "it," or "that" refers to something, name the thing.

**Examples:**

| Cut | Write instead |
|-----|--------------|
| "This is a major opportunity." | "The partnership is a major opportunity." |
| "This shows that demand is growing." | "The data shows demand is growing." |
| "It is important to act quickly." | "Acting quickly reduces risk." |
| "That is what makes this unique." | "The direct retailer access is what makes it unique." |
| "This enables better outcomes." | "The integration enables better outcomes." |
| "It can be difficult to..." | "Tracking leads across platforms is difficult." |

The same rule applies mid-sentence. "This approach," "this process," "this tool," and similar constructions are often acceptable when the referent is named. Bare "this," "it," and "that" with no noun following are almost never acceptable.

**Why it matters:** Vague references force the reader to do the work of connecting meaning. They also signal that the writer has not fully committed to a specific claim. Name the thing.

---

## Adverb Intensifiers

Cut adverbs that modify adjectives or verbs before a main clause. They add emphasis that the sentence should earn through specificity, not through amplification.

**Cut on sight:**
- very, extremely, incredibly, truly, genuinely, deeply, highly, really, so, quite, absolutely, utterly, particularly, especially, certainly, remarkably

**Examples:**

| Cut | Write instead |
|-----|--------------|
| "We're genuinely excited to announce..." | "We're announcing..." |
| "This is extremely important." | "This matters because..." |
| "We're very happy to share..." | "Here's what we're sharing." |
| "I'm truly grateful for..." | "Thank you for..." |
| "This is incredibly powerful." | State what it does. |

If the intensity is real, show it through detail, not through an adverb. "Excited" does not become more convincing with "genuinely" in front of it. It becomes less convincing.

---

## Words and Phrases to Avoid

These appear frequently in AI-generated text. Cut them on sight.

| Cut this | Because |
|----------|---------|
| Dive into / Delve into | Overused filler |
| Unlock | Marketing cliché |
| Harness | Abstract and vague |
| Seamless | Means nothing |
| Powerful | Needs evidence, not assertion |
| Leverage (as a verb) | Almost always replaceable with "use" |
| It's important to note | Throat-clearing |
| In today's world / landscape | Empty opener |
| Whether you're X or Y | Overused framing device |
| Not only X, but Y | Contrastive pairing |
| Robust | Overused and vague |
| Cutting-edge | Cliché |
| Game-changer | Cliché |
| Moving the needle | Cliché |
| At the end of the day | Filler |
| Innovative | Vague; show the innovation instead |
| Transformative | Same as above |
| Exciting | Show why it is exciting |
| Ensure | Usually replaceable with "make sure" or restructuring |
| Utilize | Use "use" |

**StallPlus-specific additions:**

| Cut this | Write instead |
|----------|---------------|
| Revolutionary restroom solution | Name the product and what it does |
| Total privacy / complete protection | State what gaps or items the product covers |
| Never worry about [crime type] again | Practical privacy upgrade language |
| State-of-the-art | Industrial-grade PVC, 4-pack commercial format, etc. |
| Solution (standalone) | Product, guard, protector, upgrade |

---

## Platitudes and Filler Phrases

Cut any sentence or phrase that could appear in any piece of writing about any topic. If it conveys no specific meaning, it has no place in the copy.

**The test:** Remove the sentence. If the paragraph loses no information or meaning, the sentence should not exist.

**Common offenders:**

- "At the end of the day, what matters is..."
- "We're all in this together."
- "People are our greatest asset."
- "This is a journey, not a destination."
- "We're committed to making a difference."
- "Together, we can achieve great things."
- "The only constant is change."
- "Now more than ever..."
- "In a world where..."
- "That's what it's all about."
- "We're passionate about what we do."
- "Our mission is to make the world a better place."
- "This is just the beginning."
- "The rest is history."
- "Time will tell."
- "Actions speak louder than words."
- "When all is said and done..."
- "It's a win-win."
- "Move the needle."
- "Circle back."
- "Think outside the box."
- "Low-hanging fruit."
- "Shoot for the stars."
- "Rise to the occasion."
- "Hit the ground running."
- "Take it to the next level."

This list is illustrative, not exhaustive. The rule is the test above, not the list. If a phrase could be cut from a CEO letter, a nonprofit annual report, a LinkedIn post, or a brand manifesto without anyone noticing, it is a platitude. Cut it.

---

## Dropped Subjects

Never drop the subject of a sentence. Every sentence needs a subject.

**Cut:**
- "Wanted to introduce you to..."
- "Thought this might be useful."
- "Happy to jump on a call."
- "Excited to share..."
- "Reaching out because..."

**Write instead:**
- "I'm introducing you to..."
- "This might be useful because..."
- "I'm available to talk."

Dropped subjects read as either careless or performatively casual. Write the full sentence.

---

## Filler Transition Words

Cut words inserted for rhythm or softening that add no information.

**Cut on sight:**
- actually ("We actually went to school together" → "We went to school together")
- basically
- honestly
- literally
- just ("I just wanted to..." → "I wanted to...")
- kind of / sort of
- a bit / a little
- you know
- I mean
- really (as a softener, not a factual qualifier)
- so (as a sentence opener with no referent)

These words dilute the sentence. If the statement is true, state it without hedging the truth.

---

## Hedged Asks and Undercut Recommendations

Do not preemptively dismiss or soften a request before making it. State the ask directly.

**Cut:**
- "Even if you don't have time right now..."
- "No worries if this isn't relevant..."
- "I know you're busy, but..."
- "This may or may not be useful..."
- "Feel free to ignore this if..."
- "I don't want to take up too much of your time, but..."

These phrases signal low confidence and prime the reader to decline. If the request is worth making, make it without apology. If it is not worth making, do not make it.

---

## Hollow Closing Statements

Do not close with a sentence whose only function is to say the conversation could continue. Either close on the last substantive point or make the next step specific.

**Cut:**
- "I think you'd both enjoy the conversation."
- "Would love to connect sometime."
- "Let me know if you have any questions."
- "Happy to chat more about this."
- "Looking forward to hearing your thoughts."
- "Feel free to reach out anytime."
- "Hope this helps."
- "Let's keep the conversation going."

**Write instead:** A specific next step, a specific question, or nothing. "Send stall count and facility type for a quote by Thursday" is a close. "Let me know if you have any questions" is not.

---

## Lead with the Strongest Signal

When introducing a person, product, company, or idea, open with the most credible or specific detail. Do not bury it after a list of generic attributes.

**Cut:**
- Leading with a service list, job title, or category before the proof.
- Soft context before the credential.

**Examples:**

| Cut | Write instead |
|-----|--------------|
| "He does design, copywriting, and content. He's interning at Homage." | "He's interning at Homage's creative team and has worked on projects with Sherwin-Williams." |
| "She has a background in PR and comms. She's worked with a lot of brands." | "She's built and advised brands across PR and comms for [X] years." |
| "We offer a range of services including strategy, research, and execution." | "We ran [specific project] for [client] and cut their onboarding time by 40%." |

**StallPlus examples:**

| Cut | Write instead |
|-----|--------------|
| "We sell privacy products for restrooms." | "StallPlus+ closes door and corner gaps in commercial stalls without replacing the partition system." |
| "Our products improve the restroom experience." | "Facilities teams install StallPlus+ in four steps: find the gap, position the guard, secure it, move to the next stall." |

The specific detail does more work than any amount of category description. Lead with it.

---

## Vague Time Qualifiers

Cut phrases that gesture at time without saying anything specific. They pad sentences and signal imprecision.

**Cut on sight:**
- "these days"
- "lately"
- "nowadays"
- "in recent years"
- "more and more"
- "increasingly"
- "as of late"
- "at this point in time"
- "in today's environment"
- "recently" (unless a specific timeframe follows)

**Examples:**

| Cut | Write instead |
|-----|--------------|
| "where companies are looking for creative support these days" | name the actual trend or cut the claim |
| "more and more brands are investing in content" | cite a specific figure or cut |
| "things have changed a lot recently" | name what changed |

If the timeframe matters, name it. If it does not, cut the qualifier entirely.

---

## Structural Patterns to Avoid

- Paragraphs that repeatedly follow the same sentence-length rhythm.
- Three-item lists in every paragraph.
- Rhetorical questions used as transitions ("So what does this mean?").
- Opening with a definition ("Webster's defines X as...").
- Closing with a forward-looking flourish ("As we look to the future...").
- Restating the intro in the conclusion word for word.

---

## Editing Checklist

Before finalizing any StallPlus copy, ask:

1. Can any sentence be shorter?
2. Can any adjective or adverb be removed without losing meaning?
3. Does the first sentence start as close to the point as possible?
4. Is anything defined by what it is not?
5. Is there a contrastive pairing?
6. Is there an em dash or en dash?
7. Does any sentence start with "I" when it doesn't need to?
8. Are there any words from the avoidance list?
9. Does the paragraph rhythm vary, or does it feel templated?
10. Does any sentence open with a bare "this," "it," or "that" with no noun following?
11. Are there any dropped subjects?
12. Are there filler words (actually, just, honestly, basically, kind of)?
13. Is any ask hedged or pre-dismissed before it is made?
14. Does the closing name a specific next step, or is it a hollow pleasantry?
15. Does the opening lead with the most specific, credible detail available?
16. Are there any vague time qualifiers (these days, lately, recently, increasingly)?
17. Would a human expert naturally write it this way?

**StallPlus-specific checks:**

18. Are product names spelled correctly (StallPlus+, StallPlus-Go, StallStash, WallStash, StallCaddy)?
19. Does the copy overclaim on safety, surveillance, or crime prevention?
20. Is the buyer type clear (facility, distributor, individual)?
21. Does news or social proof framing stay dignified and practical?
22. Are facility outcomes named (stall count, install time, complaint reduction) where relevant?

If the answer to any of these flags an issue, revise before publishing.
