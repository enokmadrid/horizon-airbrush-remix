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


## Data Model v1 (Implemented in Shopify)

### Metaobjects

#### Item
type: `item`
description: `Represents a physical item that can be airbrushed.`

Fields:
- `item_name` (Shopify field: Item Name, string)
- `price` (decimal) – base price for this item
- `preview_image` (image file)
- `sizes_supported` (list<Size Option>)
- `description` (multi-line text)

Examples:
- T-Shirt
- Hoodie
- Snapback Hat
- Trucker Hat
- Beanie
- Onesie
- Tote Bag
- Shoes
- Canvas

#### Size Option
type: `size_option`
description: `Represents a size and its price adjustment.`

Fields:
- `size_label` (Shopify field: Size Label, string)
- `additional_price` (Shopify field: Additional Price, decimal)

Examples:
- S → +0
- M → +0
- L → +2
- XL → +4
- 2XL → +6

#### Font Style
type: `font_style`
description: `Represents a lettering style with its own pricing.`

Fields:
- `font_name` (Shopify field: Font Name, string)
- `price` (decimal)
- `preview_image` (image file)
- `description` (multi-line text)

Examples:
- Script
- Print
- Graffiti
- Old English

### Product metafields (namespace: `custom`)

Attached to **Product**:

- `custom.items`
  - Type: list<Item>
  - Used to show available items (T-shirt, Hoodie, etc.) for this design.

- `custom.font_styles`
  - Type: list<FontStyle>
  - Used to show available font styles for this design.

> Future metafields to add later:
> - `custom.color_options` → list<ColorOption>
> - `custom.background_patterns` → list<BackgroundPattern>
> - `custom.extras` → list<Extra>
> - `custom.base_design_price` → decimal

### Frontend behavior v1

For the Name Design product page:

1. Read `product.metafields.custom.items`  
   - Render each Item with name, price, preview image.
2. When an Item is selected:
   - Show its `sizes_supported` (SizeOption metaobjects).
3. Read `product.metafields.custom.font_styles`  
   - Render each FontStyle with preview image, name, and price.
4. Price calculation:
   - `total = base_design_price (theme setting or product price)
            + selected_item.price
            + selected_size.additional_price
            + selected_font_style.price`
5. On Add to Cart:
   - Send selected Item, Size, Font Style, and computed price as line item properties.