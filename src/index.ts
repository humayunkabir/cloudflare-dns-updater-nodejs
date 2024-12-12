import axios from 'axios';
import Bun from 'bun';
import { getDNSRecord, updateDNS } from './utils';

let dnsRecord: DNSRecord | undefined;

axios
  .get<Ip>('https://api.ipify.org?format=json', {
    headers: { 'Content-Type': 'application/json' },
  })
  .then(async ({ data: { ip } }) => {
    const email = Bun.env.AUTH_EMAIL!;
    const domain = Bun.env.DOMAIN!;
    const zoneId = Bun.env.ZONE_ID!;
    const token = Bun.env.API_TOKEN!;
    const comment = 'Domain verification record';

    try {
      if (!dnsRecord) {
        dnsRecord = await getDNSRecord({
          zoneId: Bun.env.ZONE_ID!,
          token: Bun.env.API_TOKEN!,
          domain: Bun.env.DOMAIN!,
        });
      }

      if (dnsRecord) {
        if (ip !== dnsRecord.content) {
          const response = await updateDNS({
            ip,
            email,
            zoneId,
            dnsRecordId: dnsRecord.id,
            domain,
            comment,
            token,
          });

          console.log(
            `IP has been updated from ${dnsRecord.content} to ${response.result.content} successfully for ${response.result.name}!`
          );

          dnsRecord = response.result;
        } else {
          console.log("IP hasn't changed!");
        }
      } else {
        console.error('DNS Record not found!');
      }
    } catch (error) {
      console.error(error);
    }
  })
  .catch(console.error);
