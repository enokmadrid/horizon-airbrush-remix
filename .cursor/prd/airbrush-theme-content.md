# Airbrush Shopify Theme – Content + Data Model

## Overview
- Designs are Products.
- No Shopify variants.
- Customization uses metaobjects + product metafields.
- Theme JS calculates final price on the client.

## Collections

### Design Category Collections
- Birthday
- Graduation
- Bachelor(ette)
- Couples
- Sceneries
- RIP
- Dance / Cheer
- Music / Band
- Sports
- Animals
- Video Games
- Kids Cartoons
- Culture / Flags
- Name Designs
- 80s & 90s Hip Hop
- Floral & Nature
- Fantasy & Mythical
- Skull & Horror
- Graffiti Lettering
- Cars and Lowriders

### Item Collections
- T-Shirts
- Hoodies
- Onesies
- Hats
- Beanies
- Tote Bags
- Shoes
- Canvas

## Metaobjects

### Item
- `item_name` (string)
- `base_price` (decimal)
- `preview_image` (file)
- `sizes_supported` (list<SizeOption>)
- `description` (string)

### SizeOption
- `size_label` (string)
- `additional_price` (decimal)

### FontStyle
- `name` (string)
- `price` (decimal)
- `preview_image` (file)
- `description` (string)

### ColorOption
- `name` (string)
- `price` (decimal)
- `preview_swatch` (file)

### BackgroundPattern
- `name` (string)
- `price` (decimal)
- `preview_image` (file)

### Extra
- `name` (string)
- `price` (decimal)
- `preview_icon` (file)
- `description` (string)

## Product Metafields (namespace: `customization`)

All on the Product object:

- `customization.items` → list<Item>
- `customization.font_styles` → list<FontStyle>
- `customization.color_options` → list<ColorOption>
- `customization.art_sizes` → list<SizeOption>
- `customization.background_patterns` → list<BackgroundPattern>
- `customization.extras` → list<Extra>
- `customization.base_design_price` → decimal (base art price)

## Frontend Price Builder Requirements

- Start from `base_design_price`.
- Add selected `item.base_price`.
- Add selected `size.additional_price` (if any).
- Add selected `font_style.price`.
- Add selected `color_option.price`.
- Add selected `background_pattern.price`.
- Add sum of `extras[*].price`.
- Update UI in real time.
- On “Add to cart”, send:
  - Selected item name
  - Selected size
  - Selected font style
  - Selected colors
  - Selected background pattern
  - Selected extras
  - Final computed price
  - Price breakdown (optional)
  as line item properties.