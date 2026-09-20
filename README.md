# CampusPulse

A simple GCP powered campus event handling and maintenance platform.

---

## Event Inquiry UI

A minimal, dark-themed event inquiry form. Built with vanilla HTML, CSS, and JavaScript — no dependencies.

### Design

- **Background** — layered `repeating-linear-gradient` producing a crisp square grid with 45° diagonal hatching
- **Palette** — monochromatic dark (`#0a0a0a` base, `#e5e5e5` text)
- **Typography** — [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (UI) + [Space Mono](https://fonts.google.com/specimen/Space+Mono) (labels, code)
- **Geometry** — hard corners, dashed rules, corner bracket marks, indexed field labels

### Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and form markup |
| `style.css` | All styling — design tokens, layout, states, animations |
| `main.js` | Client-side validation, tooltip logic, success modal |

### Form Fields

| # | Field | Validation |
|---|---|---|
| 01 | Username | Required · 3–32 chars · `[a-zA-Z0-9_.\-]` only |
| 02 | Email Address | Required · valid email format |
| 03 | Inquiry Type | Required · one of six categories |
| 04 | Description | Required · 20–1000 characters |

### Validation Behaviour

- **On blur** — validates the field when focus leaves it
- **On input** — re-validates live once a field already has an error
- **On submit** — validates all fields; scrolls to and focuses the first invalid one
- **Tooltip popup** — a floating error bubble appears above below each invalid input for ~3 s
- **Inline error** — a persistent label beneath the field
- **Success modal** — shown on valid submission; dismissed via button, backdrop click, or `Escape`

### Running Locally

Open `index.html` directly in any modern browser. No build step required.

```
file:///path/to/CampusPulse/index.html
```

The form `action` points to `http://localhost:8080/v1/fetch` — update this to your GCP endpoint before deployment.
