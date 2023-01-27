# Snippets

`tfi`: Import Tailwind Factory and create a new factory component
```tsx
import { tf } from "tailwind-factory";

export const Container = tf("div", `
  
`, {
  variants: {},
  defaultVariants: {}
});
```

`tfc`: Create a new factory component
```tsx
export const NewComponent = tf("div", `
  
`, {
  variants: {},
  defaultVariants: {}
});
```

`tfe`: Create a new extended factory component
```tsx
export const NewComponent = Parent.extends(ParentComponent`
  
`, {
  variants: {},
  defaultVariants: {}
});
```