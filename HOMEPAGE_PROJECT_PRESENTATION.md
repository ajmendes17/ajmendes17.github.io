# Homepage Project Presentation Refinement

## Status

Planning document only. This file does not authorize or include the presentation redesign itself.

## Objective

Refine the homepage project showcase so the editorial introduction and selected project card perform different jobs. The result should reduce repeated titles and summaries while preserving the existing immersive system aesthetic, carousel behavior, and project detail pages.

The homepage should create interest. The project pages should continue to contain the strongest technical detail, evidence, and personal context.

## Current behavior

The selected project appears twice within the same composition:

1. The left introduction repeats the selected project's title and summary.
2. The large selected card repeats the title and another technical description.

This is visually polished, but both surfaces answer essentially the same question: "What is this project?"

## Proposed content hierarchy

### Editorial introduction: why the project matters

The left introduction should communicate the system's central idea without repeating the project name. It should contain:

- A small label such as `Selected system`.
- A short thematic kicker.
- A concise thesis or problem statement.
- One restrained sentence explaining why the system is interesting.
- The existing case-study link and carousel position.

This surface must not contain detailed metrics, test counts, implementation proof, or the strongest case-study material.

### Selected card: what the project is

The large card should remain the authoritative source for:

- Project name.
- Category.
- Technical one-sentence description.
- Project-specific illustration.
- Compact layer or architecture labels.

The card should continue linking into the full case study, where deeper evidence remains available.

## Draft editorial directions

These are working directions, not final copy.

| Project | Homepage thesis | Supporting direction |
| --- | --- | --- |
| Secure Chat Application | Trust stays at the endpoints. | Present the relay as transport rather than a trusted reader. |
| ClueGame | Rules remain coherent as the state changes. | Emphasize the challenge of keeping movement, cards, and decisions aligned. |
| Call for Fire Trainer | More useful practice between coached sessions. | Emphasize pacing, repetition, and feedback without exposing private details. |
| MarketPulse AI | One dataset, multiple ways to reason about it. | Emphasize model comparison rather than prediction claims. |

## Data and markup changes

1. Add dedicated editorial data attributes to each project slide, for example:
   - `data-carousel-thesis`
   - `data-carousel-context`
2. Replace the introductory title binding with a thesis binding.
3. Keep the project title exclusively inside the selected card and accessible link label.
4. Keep the introduction's live region concise so a carousel change does not announce duplicate content.
5. Preserve the current `aria-current`, `aria-hidden`, and `inert` selection state.

Suggested introduction structure:

```html
<div class="systems-intro-copy" aria-live="polite" aria-atomic="true">
    <span class="systems-kicker" data-carousel-kicker></span>
    <h3 data-carousel-thesis></h3>
    <p data-carousel-context></p>
</div>
```

## JavaScript changes

Update the carousel selection function in `script.js` to read the new thesis and context values from the selected slide. Remove the homepage introduction's dependency on `.project-title` while retaining that title for:

- The selected slide's accessible label.
- The case-study link's accessible name.
- The selected project card.

Do not change drag, swipe, arrow-key, previous/next, or numeric-selector behavior.

## Visual changes

### Desktop

- Preserve the current split composition.
- Let the editorial thesis be shorter than the current project title.
- Keep a clear visual path from thesis to card to case-study link.
- Avoid adding badges, metrics, or a second set of technical tags to the introduction.

### Tablet and mobile

- Stack the introduction above the selected card.
- Keep the introduction short enough to avoid pushing the card below the initial project-section view.
- Preserve 44-pixel minimum control targets.
- Keep all content within a 320-pixel viewport without horizontal overflow.
- Ensure numeric selectors remain legible at 320, 390, and 420 pixels.

## Content boundaries

The homepage may reveal:

- The problem category.
- The central system idea.
- A short technical description.
- A project-specific visual metaphor.

The homepage should not reveal:

- Detailed results or proof.
- Test counts or codebase size.
- Extended implementation decisions.
- The strongest personal or technical story from the case study.
- Private operational information.

## Accessibility requirements

- Only the selected slide may remain available to assistive technology.
- Inactive slides must retain `aria-hidden="true"` and `inert`.
- The selected slide must use `aria-hidden="false"` and must not have `inert`.
- Carousel changes must update the case-study link's accessible name.
- Live announcements should state the new thesis and context once, without repeating the full card.
- All existing keyboard controls must continue to work.
- Reduced-motion behavior must remain unchanged.

## Files expected to change

- `index.html`
  - Add thesis and context data.
  - Update introduction markup.
- `script.js`
  - Bind the selected slide to the new editorial fields.
- `style.css`
  - Refine introduction sizing and responsive spacing only where needed.

Project detail HTML files should not require changes.

## Verification plan

1. Run JavaScript syntax and HTML structure checks.
2. Verify all four projects through previous, next, numeric, drag, swipe, and arrow-key input.
3. Verify selected/inactive accessibility state after every transition.
4. Inspect the project section at 320, 390, 680, 980, 1280, and 1440 pixels.
5. Confirm no horizontal overflow.
6. Confirm the introduction and card no longer repeat the project title.
7. Confirm direct project links and `?project=N#projects` selection still work.
8. Confirm reduced-motion behavior.

## Definition of done

- The introduction explains why the selected project matters.
- The card explains what the project is.
- The project name is not duplicated across both surfaces.
- The homepage remains deliberately high-level.
- The strongest material remains in the case-study pages.
- Desktop and mobile layouts retain the current visual identity.
- Carousel interaction and accessibility checks pass without regression.
