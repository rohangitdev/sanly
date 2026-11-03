# Dynamic Wish Engine — remote catalogue

The app works offline using its bundled wishes. A remotely hosted catalogue is optional.

## Configuration

Set `EXPO_PUBLIC_SANLY_WISH_CATALOGUE_URL` to an HTTPS URL returning a JSON array, then create a new Expo build (or update the app configuration through an appropriate release). The URL is public; do not embed service-role keys or secrets.

Example:

```json
[
  {
    "id": "birthday-marathi-warm-001",
    "language": "Marathi",
    "occasion": "Birthday",
    "style": "Warm",
    "text": "{name}, वाढदिवसाच्या खूप शुभेच्छा! आजचा दिवस आनंदात जावो. 🎂"
  },
  {
    "id": "birthday-english-funny-001",
    "language": "English",
    "occasion": "Birthday",
    "style": "Funny",
    "text": "Happy birthday, {name}! May your cake be bigger than your to-do list! 🎉"
  }
]
```

The app substitutes `{name}` locally. Do not put personal names, contact lists, or private information in the remote JSON.

## Delivery and safety

- The client fetches only over HTTPS, with a seven-second timeout.
- The downloaded JSON must contain valid wishes with unique IDs and a limited response size.
- The client caches valid content locally for seven days.
- If the request fails, the cached catalogue is used; bundled wishes always remain available.
- New remote wishes are matched by exact language, occasion and style.
- Keep stable IDs for unchanged wishes. Use new IDs when text changes significantly.
- Review each language with a native speaker before publishing.
- This does **not** configure or deploy a hosting endpoint. Until the URL is configured, only bundled wishes are used.

## Future improvements

Before a production launch, add a remote catalogue schema version, publishing/rollback workflow, and a quality-review checklist for each supported language. For stronger content integrity, consider signed manifests or a trusted controlled hosting domain.
