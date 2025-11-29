import { Component } from '@theme/component';

class ProductCustomizationComponent extends Component {
  /** @type {number} */
  #basePrice = 0;

  connectedCallback() {
    super.connectedCallback?.();

    const basePriceAttr = this.dataset.baseDesignPrice;
    const parsed = Number.parseFloat(basePriceAttr || '0');
    this.#basePrice = Number.isNaN(parsed) ? 0 : parsed;

    this.addEventListener('change', this.#onChange);
    // Initial calculation in case of pre-selected options
    this.#updateTotal();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.removeEventListener('change', this.#onChange);
  }

  /**
   * @param {Event} event
   */
  #onChange = (event) => {
    const target = /** @type {HTMLInputElement | undefined} */ (event.target);
    if (!target || !target.matches('.product-customization__input')) return;

    // If an item was selected, update sizes
    if (target.dataset.customizationRole === 'item') {
      this.#updateSizesForItem(target);
    }

    this.#updateTotal();
  };

  /**
   * Update size options based on selected item
   * @param {HTMLInputElement} itemInput
   */
  #updateSizesForItem(itemInput) {
    const sizesJson = itemInput.dataset.sizesSupported;
    const sizeGroup = /** @type {HTMLElement | null} */ (this.querySelector('[data-group="size"]'));
    const sizeSelect = /** @type {HTMLSelectElement | null} */ (this.querySelector('[data-size-select]'));

    if (!sizeGroup || !sizeSelect) return;

    // Parse sizes data
    let sizes = [];
    try {
      sizes = sizesJson ? JSON.parse(sizesJson) : [];
    } catch (e) {
      console.error('Failed to parse sizes data:', e);
      sizes = [];
    }

    // Clear existing options (except the placeholder)
    while (sizeSelect.options.length > 1) {
      sizeSelect.remove(1);
    }

    // Reset to placeholder
    sizeSelect.selectedIndex = 0;

    // Hide size group if no sizes available
    if (sizes.length === 0) {
      sizeGroup.hidden = true;
      return;
    }

    // Show size group and populate options
    sizeGroup.hidden = false;

    sizes.forEach((/** @type {{ label: string; price: number }} */ size) => {
      const price = typeof size.price === 'number' ? size.price : Number.parseFloat(String(size.price)) || 0;

      const option = document.createElement('option');
      option.value = size.label;
      option.dataset.price = price.toString();
      option.dataset.customizationRole = 'size';

      // Display text with price if not zero
      if (price !== 0) {
        option.textContent = `${size.label} (+${this.#formatMoney(price)})`;
      } else {
        option.textContent = size.label;
      }

      sizeSelect.appendChild(option);
    });
  }

  #updateTotal() {
    let total = this.#basePrice;
    /** @type {{ base: number; item: number; size: number; font: number; color: number; background: number; extras: number }} */
    const parts = {
      base: this.#basePrice,
      item: 0,
      size: 0,
      font: 0,
      color: 0,
      background: 0,
      extras: 0,
    };

    // Handle radio button/checkbox inputs
    /** @type {NodeListOf<HTMLInputElement>} */
    const inputs = this.querySelectorAll('.product-customization__input');

    inputs.forEach((input) => {
      if (!input.checked) return;
      const priceAttr = input.dataset.price;
      if (!priceAttr) return;
      const price = Number.parseFloat(priceAttr);
      if (!Number.isNaN(price)) {
        total += price;
        const role = input.dataset.customizationRole;
        switch (role) {
          case 'item':
            parts.item += price;
            break;
          case 'font':
            parts.font += price;
            break;
          case 'color':
            parts.color += price;
            break;
          case 'background':
            parts.background += price;
            break;
          case 'extra':
            parts.extras += price;
            break;
          default:
            break;
        }
      }
    });

    // Handle select dropdowns (size)
    /** @type {NodeListOf<HTMLSelectElement>} */
    const selects = this.querySelectorAll('.product-customization__select');

    selects.forEach((select) => {
      const selectedOption = select.options[select.selectedIndex];
      if (!selectedOption || selectedOption.value === '') return;

      const priceAttr = selectedOption.dataset.price;
      if (!priceAttr) return;

      const price = Number.parseFloat(priceAttr);
      if (!Number.isNaN(price)) {
        total += price;
        const role = selectedOption.dataset.customizationRole;
        if (role === 'size') {
          parts.size += price;
        }
      }
    });

    const totalElement = /** @type {HTMLElement | null} */ (
      this.querySelector('[data-customization-total]')
    );
    const finalPriceInput = /** @type {HTMLInputElement | null} */ (
      this.querySelector('[data-customization-final-price-input]')
    );
    const breakdownInput = /** @type {HTMLInputElement | null} */ (
      this.querySelector('[data-customization-breakdown-input]')
    );

    if (finalPriceInput) {
      finalPriceInput.value = total.toString();
    }

    if (breakdownInput) {
      const breakdown = {
        base: parts.base,
        item: parts.item,
        size: parts.size,
        font: parts.font,
        color: parts.color,
        background: parts.background,
        extras: parts.extras,
        total,
      };
      breakdownInput.value = JSON.stringify(breakdown);
    }

    if (totalElement) {
      // We rely on server-rendered money formatting for the base price.
      // For now, display as plain number with currency via data attribute if needed.
      totalElement.textContent = this.#formatMoney(total);
    }
  }

  /**
   * Basic money formatter using shop currency if available.
   * @param {number} amount
   */
  #formatMoney(amount) {
    try {
      const currency = window.Shopify?.currency?.active || 'USD';
      return new Intl.NumberFormat(window.Shopify?.locale || 'en', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (_error) {
      return amount.toFixed(2);
    }
  }
}

if (!customElements.get('product-customization-component')) {
  customElements.define('product-customization-component', ProductCustomizationComponent);
}
