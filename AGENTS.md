# 🤖 AI Agent Guidelines for Apna Khata

Welcome, fellow agent. To maintain the high standards of this project, please adhere to these core principles and structural rules.

## 🏗️ Technical Stack
- **Framework**: Next.js 16 (App Router)
- **State Management**: React Hook Form + Zod
- **Styling**: Tailwind CSS 4 + Vanilla CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🎨 Design Rules (Crucial!)
1.  **Sapphire Aesthetic**: Follow the patterns in `design.md`. Use deep navies (`bg-[#030711]`), sapphire glows, and glassmorphism (`backdrop-blur`).
2.  **Visual Premiumness**: Avoid default colors. Use smooth gradients, rich HSL palettes, and subtle micro-animations.
3.  **Consistency**: Use our predefined design tokens. Don't use ad-hoc utility classes if a component pattern already exists.

## 📁 File Structure Conventions
- **`src/app`**: Standard App Router structure.
- **`src/components/ui`**: Base UI components (Radix + Custom).
- **`src/components/features`**: Complex, logic-heavy components specific to a domain (e.g., `LedgerEntryForm`).
- **`src/services`**: API interaction layer.
- **`src/context`**: Global state (Auth, Currency).

## 🛠️ Code Quality
- **Type Safety**: Never use `any` unless absolutely necessary (and documented). Ensure all forms are strictly typed with Zod schemas from `src/lib/validations.ts`.
- **Error Handling**: Use the `GlobalErrorBoundary` and `ErrorState` components. Ensure toast notifications are descriptive.
- **Clean Code**: Delete unused imports and scripts immediately. Keep components focused and reusable.

## 🚦 Interaction Rules
- Always verify pathing before making changes.
- Check `design.md` before adding new UI elements to ensure they fit the "Sapphire" theme.
- When fixing issues, look for centralized logic first (e.g., `src/lib/utils.ts` or `validations.ts`).
