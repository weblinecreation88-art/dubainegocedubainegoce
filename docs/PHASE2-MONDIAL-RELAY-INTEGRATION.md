# 🌍 Phase 2: Mondial Relay International Integration Guide

## Status: FOUNDATIONS COMPLETE ✅

### What's Ready
- ✅ International pricing functions (`getMondialRelayInternationalCost`)
- ✅ Pickup point fetcher with mock API (`getMondialRelayPickupPoints`)
- ✅ Country selector component (`CountryShippingSelector`)
- ✅ Supported countries: BE, NL, DE, LU
- ✅ Pricing by weight for each country

### Implementation Checklist

#### Phase 2A: Simple MVP (Quick Win - 2-3h)
- [ ] Add `CountryShippingSelector` to `/src/app/cart/page.tsx`
- [ ] Store selected country in cart state
- [ ] Display dynamic shipping costs based on country
- [ ] Update cart page to show international rates

#### Phase 2B: Full Integration (Production - 4-5h)
- [ ] Modify Stripe checkout session to include `country` in metadata
- [ ] Update webhook to calculate correct shipping cost by country
- [ ] Add country field to order document in Firestore
- [ ] Update success page to show selected relay pickup point
- [ ] Integrate real Mondial Relay API (replace mock)
- [ ] Add relay selection UI before checkout
- [ ] Store selected relay info in order

#### Phase 2C: Advanced Features (Nice-to-have - 3-4h)
- [ ] Real Mondial Relay API integration with authentication
- [ ] Relay point map visualization
- [ ] Relay hours/services availability
- [ ] International Colissimo support (DE, NL, BE, LU)
- [ ] Multi-language support for relay selection

---

## Quick Integration (Phase 2A)

### 1. Add to Cart Page
```tsx
// src/app/cart/page.tsx
import { CountryShippingSelector } from '@/components/country-shipping-selector';
import type { SupportedCountry } from '@/lib/mondial-relay';

export default function CartPage() {
  // ... existing code ...
  const [selectedCountry, setSelectedCountry] = useState<SupportedCountry>('FR');

  return (
    <>
      {/* ... existing cart items ... */}

      <CountryShippingSelector
        totalWeight={totalWeight}
        selectedCountry={selectedCountry}
        selectedShipping={selectedShippingId}
        onCountryChange={setSelectedCountry}
        onShippingChange={setSelectedShippingId}
      />
    </>
  );
}
```

### 2. Update Shipping Calculation
```tsx
// Update dynamicShippingMethods to use country
const dynamicShippingMethods = useMemo((): ShippingMethod[] => {
  return shippingMethods.map(method => {
    if (selectedCountry === 'FR') {
      // France pricing
      if (method.id === 'colissimo') {
        return { ...method, cost: getColissimoCost(totalWeight) };
      }
      if (method.id === 'mondial-relay') {
        return { ...method, cost: getMondialRelayCost(totalWeight) };
      }
    } else {
      // International pricing (Mondial Relay only)
      if (method.id === 'mondial-relay') {
        return {
          ...method,
          id: 'mondial-relay-intl',
          cost: getMondialRelayInternationalCost(selectedCountry, totalWeight)
        };
      }
    }
    return { ...method, cost: 0 };
  });
}, [totalWeight, selectedCountry]);
```

---

## Full Integration (Phase 2B)

### 1. Modify Stripe Checkout Session
```typescript
// src/app/actions.ts - Update createCheckoutSession function

const checkoutSession = {
  // ... existing fields ...
  metadata: {
    userId,
    shippingMethod: selectedShippingMethod,
    shippingCountry: selectedCountry,  // ADD THIS
    relayId: selectedRelayId           // ADD THIS (if selected)
  }
};
```

### 2. Update Webhook Handler
```typescript
// src/app/api/stripe/webhook/route.ts

const cartLineItems = session.line_items?.data || [];
const metadata = session.metadata || {};
const shippingCountry = metadata.shippingCountry || 'FR';

// Calculate correct shipping cost
let shippingCost = 0;
if (shippingCountry === 'FR') {
  shippingCost = getMondialRelayCost(totalWeight); // or getColissimoCost
} else {
  shippingCost = getMondialRelayInternationalCost(
    shippingCountry as SupportedCountry,
    totalWeight
  );
}
```

### 3. Store in Firestore Order
```typescript
// Update order document structure
const order = {
  // ... existing fields ...
  shippingCountry: metadata.shippingCountry,
  selectedRelayId: metadata.relayId,
  selectedRelayName: relayInfo?.name,
  selectedRelayAddress: relayInfo?.address
};
```

---

## API Integration

### Mondial Relay API Credentials
To use the real API, get credentials from:
- **Contact**: api@mondialrelay.com
- **Docs**: https://api.mondialrelay.com/docs

### Environment Variables Required
```env
# .env.local
MONDIAL_RELAY_API_KEY=your_api_key
MONDIAL_RELAY_ACCESS_ID=your_access_id
```

### Real API Call Example
```typescript
// src/lib/mondial-relay.ts - Replace mock implementation

export async function getMondialRelayPickupPoints(
  countryCode: string,
  postalCode: string
): Promise<MondialRelayPickupPoint[]> {
  const response = await fetch('https://api.mondialrelay.com/v1/shipment/estimation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MONDIAL_RELAY_API_KEY}`
    },
    body: JSON.stringify({
      country_code: countryCode,
      postal_code: postalCode,
      weight_grams: 1000
    })
  });

  if (!response.ok) throw new Error('Mondial Relay API error');
  const data = await response.json();
  return data.pickup_points;
}
```

---

## File Structure

**Files Created:**
- ✅ `src/lib/mondial-relay.ts` - Helper functions & API
- ✅ `src/lib/data.ts` - International pricing functions
- ✅ `src/components/country-shipping-selector.tsx` - UI Component
- 📋 `docs/PHASE2-MONDIAL-RELAY-INTEGRATION.md` - This guide

**Files to Modify:**
- `src/app/cart/page.tsx` - Add country selector
- `src/app/actions.ts` - Pass country to Stripe
- `src/app/api/stripe/webhook/route.ts` - Calculate international costs
- `src/app/checkout/success/page.tsx` - Show relay info
- `next.config.mjs` - Add Mondial Relay API domain to allowed hosts

---

## Testing

### Manual Testing Flow
1. Go to `/cart`
2. Select a non-France country (BE, NL, DE, LU)
3. Verify Mondial Relay is only option
4. Check shipping cost matches pricing table
5. Proceed to checkout (will currently use France pricing - expected)

### Unit Tests to Add
```typescript
// tests/mundial-relay.test.ts
describe('getMondialRelayInternationalCost', () => {
  it('should return correct cost for Belgium', () => {
    const cost = getMondialRelayInternationalCost('BE', 750);
    expect(cost).toBe(6.50);
  });
});
```

---

## Pricing Reference

### Belgium (BE)
| Weight | Cost |
|--------|------|
| ≤250g | €5.50 |
| ≤500g | €5.50 |
| ≤750g | €6.50 |
| ≤1000g | €6.50 |
| ≤2000g | €8.00 |

### Netherlands (NL)
| Weight | Cost |
|--------|------|
| ≤250g | €5.90 |
| ≤500g | €5.90 |
| ≤750g | €6.90 |
| ≤1000g | €6.90 |
| ≤2000g | €8.50 |

### Germany (DE)
| Weight | Cost |
|--------|------|
| ≤250g | €6.50 |
| ≤500g | €6.50 |
| ≤750g | €7.50 |
| ≤1000g | €7.50 |
| ≤2000g | €9.00 |

### Luxembourg (LU)
| Weight | Cost |
|--------|------|
| ≤250g | €5.00 |
| ≤500g | €5.00 |
| ≤750g | €6.00 |
| ≤1000g | €6.00 |
| ≤2000g | €7.50 |

---

## Next Steps

**Immediate (This Session):**
1. ✅ Create pricing functions
2. ✅ Create helper API
3. ✅ Create UI component
4. (Optional) Add to cart page

**Short Term (Next Session):**
1. Integrate component into cart
2. Modify Stripe metadata handling
3. Update webhook calculations
4. Test end-to-end

**Medium Term (Week 2-3):**
1. Get Mondial Relay API credentials
2. Replace mock with real API
3. Add relay selection UI
4. Full production testing

**Long Term (Month 2):**
1. Expand to more countries
2. Add international Colissimo
3. Relay point mapping
4. Multi-language support

---

## Support & References

- **Mondial Relay Docs**: https://api.mondialrelay.com/docs
- **Stripe Metadata**: https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-metadata
- **Next.js Environment Variables**: https://nextjs.org/docs/basic-features/environment-variables

---

*Last Updated: 2026-03-08*
*Status: Ready for MVP Integration*
