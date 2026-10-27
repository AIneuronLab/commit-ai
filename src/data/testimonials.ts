/**
 * Real client quotes only (with their permission). While this list is empty the "Témoignages" section is hidden.
 * Add entries like:
 *   { quote: { fr: 'Avant, nous cherchions 20 minutes ; maintenant la réponse arrive en quelques secondes.', en: '…' }, name: 'Prénom Nom', role: 'RH, Ashia Group' }
 */
export type Testimonial = { quote: { fr: string; en: string }; name: string; role: string };
export const TESTIMONIALS: Testimonial[] = [];
