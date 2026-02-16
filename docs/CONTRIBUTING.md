# Contributing

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/open-purchase.git
   ```

3. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. Make changes and test:
   ```bash
   npm install
   npm run dev
   ```

5. Commit your changes:
   ```bash
   git commit -m "Add amazing feature"
   ```

6. Push to GitHub:
   ```bash
   git push origin feature/amazing-feature
   ```

7. Create a Pull Request

## Code Style

- Use TypeScript
- Follow ESLint rules
- Use functional components with hooks
- Add Chinese translations for new text

## Testing

```bash
npm run test
```

## Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

## Project Structure

```
src/
├── app/           # Next.js App Router
├── components/     # Reusable UI
├── lib/           # Utilities & configs
└── styles/        # Global styles
```

## Adding New Pages

1. Create page in `src/app/(dashboard)/`
2. Add navigation in `layout.tsx`
3. Add translations in `src/lib/i18n/translations.ts`
4. Update `docs/FEATURES.md`
