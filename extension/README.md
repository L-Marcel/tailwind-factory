> __`Warning`__: it is important that you put the semicolon at the end of the function!

# Color tokens
- `entity.factory.style`: __#91c26e__
- `entity.factory.symbol`: __#abb3c0__
- `entity.factory.style.internal.class`: __#d7c075__
- `entity.factory.style.html.tag`: __#da6f77__
- `entity.factory.style.pseudo`: __#ba7de6__ / italic
- `entity.factory.style.rule`: __#c16bff__ / italic / bold
- `entity.factory.style.internal.id`: __#7d8be6__
- `entity.factory.style.number`: __#efba89__
- `entity.factory.style.unit`: __#eda460__ / italic

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
export const NewComponent = Parent.extends(ParentComponent, `
  
`, {
  variants: {},
  defaultVariants: {}
});
```