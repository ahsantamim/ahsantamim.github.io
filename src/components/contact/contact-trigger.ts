/** Dispatched on window when the contact modal should open. */
export const CONTACT_EVENT = "contact:open";

/** Any link to the contact section, or any element marked `data-contact`, opens the modal instead. */
export const CONTACT_TRIGGER = 'a[href$="#contact"], [data-contact]';

export function openContact() {
  window.dispatchEvent(new Event(CONTACT_EVENT));
}
