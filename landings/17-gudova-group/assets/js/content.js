/**
 * GUDOVA GROUP — centralized reference data.
 * Source of truth for the WhatsApp fallback message builder. The visible
 * page markup (services, projects, prices) is authored statically in
 * index.html (reliable render, no FOUC, crawlable) — only the one fact
 * JS actually reads (the WhatsApp number) lives here, so there is a
 * single place to update it instead of two copies drifting apart.
 */
window.GUDOVA_CONTENT = {
  contacts: {
    phone: '+79896650707',
    phoneDisplay: '+7 989 665-07-07',
    whatsapp: '79896650707',
    email: 'gudbuilding@gmail.com',
    address: 'РД, г. Махачкала, ул. Радищева, 4'
  }
};
