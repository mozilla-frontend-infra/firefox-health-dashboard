import CFClient from 'cloudflare';
import dotenv from 'dotenv';
dotenv.config();

const cf = new CFClient({
  email: process.env.CLOUDFLARE_EMAIL,
  key: process.env.CLOUDFLARE_API_KEY,
});

async function purgeCDNCache() {
  const zone = (await cf.browseZones({
    name: process.env.CLOUDFLARE_DOMAIN,
  })).result[0];
  await cf.deleteCache(zone.id, {
    purge_everything: true,
  });
  console.log('[postinstall] CDN zone %s flushed', zone.id);
}

purgeCDNCache();
