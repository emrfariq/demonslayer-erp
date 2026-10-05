# 🎨 Demon Slayer ERP: Design Implementation Guide

## 1. Theme Configuration
*AI Instruction: Read `demon_slayer_design_system.md` provided by the user. Integrate those hex codes into `tailwind.config.ts`.*

### Tailwind Config Example (Draft)
```javascript
theme: {
  extend: {
    colors: {
      ds: {
        green: '#2C5D3F', // Ichimatsu Green
        black: '#1A1A1A', // Charcoal Black
        burgundy: '#8A2C31', // Kamado Burgundy
        water: '#2A75D3', // Water Breathing (Primary CTA)
        fire: '#E25B45', // Hinokami Red (Warning)
        pink: '#F4A7B9', // Asanoha Pink
        thunder: '#F4C23D', // Thunder Yellow (Highlights/Payroll)
        muzan: '#0B0B0B', // Muzan Black (Dark Mode Bg)
        plum: '#3E1F47', // Kibutsuji Plum (Dark Mode Cards)
        blood: '#8A0303', // Demon Blood (Danger/Delete)
      }
    }
  }
}
```

## 2. Component Styling Rules
*   **Primary Buttons (Save, Dispatch, Hire):** Use `bg-ds-water` with white text. Hover effect should slightly brighten the color.
*   **Warning Buttons (Injured, High Threat):** Use `bg-ds-fire`.
*   **Danger/Destructive Buttons (Delete, KIA):** Use `bg-ds-blood`.
*   **Typography:** Import a Google Font like `Noto Serif JP` or `Cinzel` for Module Titles (to mimic Taisho Roman era), and use `Inter` or `Geist` for table data (readability).

## 3. Dark Mode / Light Mode Mapping
*   **Light Mode (Corps Day Mode):** Background `#F5F5F5` (Cloud White). Cards `#FFFFFF`. Text `#1A1A1A`.
*   **Dark Mode (Muzan Night Mode):** Background `#0B0B0B` (Muzan Black). Cards `#3E1F47` (Kibutsuji Plum). Text `#E8DCC8` (Pale Skin).