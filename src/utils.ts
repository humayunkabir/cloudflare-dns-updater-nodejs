import axios from 'axios';
import { env } from 'bun';

let dnsRecord: DNSRecord;

const email = env.AUTH_EMAIL!;
const domain = env.DOMAIN!;
const zoneId = env.ZONE_ID!;
const token = env.API_TOKEN!;
const comment = 'Domain verification record';

export function initDNSUpdater() {
  axios
    .get<Ip>('https://api.ipify.org?format=json', {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(async ({ data: { ip } }) => {
      dnsRecord = dnsRecord
        ? dnsRecord
        : await getDNSRecord({
            zoneId: env.ZONE_ID!,
            token: env.API_TOKEN!,
            domain: env.DOMAIN!,
          });

      return {
        ip,
        dnsRecordContent: dnsRecord.content,
        dnsRecordId: dnsRecord.id,
      };
    })
    .then(async ({ ip, dnsRecordId, dnsRecordContent }) => {
      if (ip !== dnsRecordContent) {
        const { result } = await updateDNS({
          ip,
          email,
          zoneId,
          dnsRecordId,
          domain,
          comment,
          token,
        });

        console.log(
          `IP has been updated from ${dnsRecordContent} to ${result.content} successfully for ${result.name}!`
        );

        dnsRecord = result;
      } else {
        console.log(`IP hasn't changed! Current IP is: ${ip}`);
      }
    })
    .catch(console.error);
}

export async function updateDNS({
  ip,
  email,
  zoneId,
  dnsRecordId,
  domain,
  comment,
  token,
}: UpdateDNSPayload) {
  console.log('Invoked: updateDNS', {
    ip,
    email,
    zoneId,
    dnsRecordId,
    domain,
    comment,
    token,
  });

  const options = {
    method: 'PUT',
    url: `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${dnsRecordId}`,
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Email': email,
      Authorization: `Bearer ${token}`,
    },
    data: {
      comment,
      name: domain,
      proxied: true,
      settings: {},
      tags: [],
      ttl: 3600,
      content: ip,
      type: 'A',
    },
  };

  return axios
    .request<ResponseCloudflare<DNSRecord>>(options)
    .then(({ data }) => data);
}

export async function getDNSRecord({
  zoneId,
  token,
  domain,
}: GetDNSRecordsPayload) {
  console.log('Invoked: getDNSRecord', {
    zoneId,
    token,
    domain,
  });

  const options = {
    method: 'GET',
    url: `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios
    .request<ResponseCloudflare<Array<DNSRecord>>>(options)
    .then(({ data }) => data);

  const dsnRecord = response.result.find(({ name }) => name === domain);

  if (dsnRecord) {
    return dsnRecord;
  }

  throw new Error('DNS Record not found!');
}
