# SweetTrack Color Palette

## 🎨 Design System

### Primary Colors (Brand)

- **Rosa Framboesa**: `#E94F7A` - Usado para botões principais, destaques e elementos de marca
- **Marrom Suave**: `#7B4B32` - Conexão com confeitaria, usado para acentos terrosos

### Secondary Colors (UI Support)

- **Creme Claro**: `#FFF3E6` - Background principal, transmite aconchego
- **Lilás Pastel**: `#C7A4F5` - Elementos modernos, hovers e acentos tech

### Neutral Colors (UX/UI)

- **Cinza Claro**: `#F4F4F5` - Borders, inputs, elementos sutis
- **Cinza Médio**: `#9CA3AF` - Textos secundários
- **Preto Suave**: `#1F2937` - Textos principais

## 🛠️ Usage Examples

### CSS Variables

```css
:root {
  --primary: 340 71% 61%; /* Rosa framboesa */
  --secondary: 270 78% 82%; /* Lilás pastel */
  --background: 30 100% 95%; /* Creme claro */
  --foreground: 210 10% 15%; /* Preto suave */
  --accent: 270 78% 82%; /* Lilás para hovers */
  --muted: 210 5% 96%; /* Cinza claro */
}
```

### Tailwind Classes

```jsx
// Botões principais
<Button className="bg-primary hover:bg-primary/90">

// Backgrounds
<div className="bg-background text-foreground">

// Acentos e hovers
<Card className="hover:bg-accent/10">

// Cores customizadas
<div className="bg-sweettrack-cream text-sweettrack-black-soft">
```

## 🎯 Design Goals

- **Doçura**: Rosa framboesa e creme criam sensação acolhedora
- **Confiança**: Marrom e tons neutros transmitem estabilidade
- **Modernidade**: Lilás pastel adiciona toque tech e jovialidade

## 📱 Implementation

A paleta está implementada através de:

1. CSS custom properties em `src/index.css`
2. Tailwind config com cores customizadas
3. Dark mode adaptations
4. Semantic color tokens para consistência
